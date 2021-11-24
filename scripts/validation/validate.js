import fsApi from 'fs';
import path from 'path';

import Ajv from 'ajv';
import chai from 'chai';
import jsonSourceMap from 'json-source-map';

import fetch, { launchHeadlessBrowser, stopHeadlessBrowser } from '../../src/archivist/fetcher/index.js';
import filter from '../../src/archivist/filter/index.js';
import * as services from '../../src/archivist/services/index.js';

import serviceHistorySchema from './service.history.schema.js';
import serviceSchema from './service.schema.js';

const fs = fsApi.promises;

const { expect } = chai;

const MIN_DOC_LENGTH = 100;

const args = process.argv.slice(2); // Keep only args that are after the script filename

let schemaOnly = false;

if (args.includes('--schema-only')) {
  schemaOnly = true;
  args.splice(args.indexOf('--schema-only'), 1);
}

const modifiedOnly = args.includes('--modified-only');
let servicesToValidate = args;

(async () => {
  const SERVICE_DECLARATIONS_PATH = services.getServicesDeclarationsPath();
  const serviceDeclarations = await services.loadWithHistory();

  if (modifiedOnly) {
    servicesToValidate = await services.getIdsOfModified();
  } else if (!servicesToValidate.length) {
    servicesToValidate = Object.keys(serviceDeclarations);
  }

  describe('Services validation', async function () {
    this.timeout(30000);

    servicesToValidate.forEach(serviceId => {
      const service = serviceDeclarations[serviceId];

      if (!service) {
        process.exitCode = 1;
        throw new Error(`Could not find any service with id "${serviceId}"`);
      }

      before(launchHeadlessBrowser);

      after(stopHeadlessBrowser);

      describe(serviceId, async () => {
        it('has a valid declaration', async () => {
          const declaration = JSON.parse(await fs.readFile(path.join(SERVICE_DECLARATIONS_PATH, `${serviceId}.json`)));

          assertValid(serviceSchema, declaration);
        });

        if (service.hasHistory()) {
          it('has a valid history declaration', async () => {
            const declarationHistory = JSON.parse(await fs.readFile(path.join(
              SERVICE_DECLARATIONS_PATH,
              `${serviceId}.history.json`,
            )));

            assertValid(serviceHistorySchema, declarationHistory);
          });
        }

        if (!schemaOnly) {
          service.getDocumentTypes().forEach(type => {
            describe(type, () => {
              let content;
              let filteredContent;
              let mimeType;

              it('has fetchable URL', async () => {
                const { location, executeClientScripts } = service.getDocumentDeclaration(type);
                const document = await fetch({
                  url: location,
                  executeClientScripts,
                  cssSelectors: service.getDocumentDeclaration(type).getCssSelectors(),
                });

                content = document.content;
                mimeType = document.mimeType;
              });

              // do not use arrow function to avoid binding to `this` and to allow `this.skip` to work
              it('has a selector that matches an element in the web page', async function () { // eslint-disable-line func-names
                if (!content) {
                  console.log('      (Tests skipped as url is not fetchable)');
                  this.skip();
                }

                filteredContent = await filter({
                  content,
                  documentDeclaration: service.getDocumentDeclaration(type),
                  mimeType,
                });

                expect(filteredContent).to.not.be.empty;
              });

              // do not use arrow function to avoid binding to `this` and to allow `this.skip` to work
              it(`has a resulting filtered content with at least ${MIN_DOC_LENGTH}`, async function () { // eslint-disable-line func-names
                if (!content) {
                  console.log('      (Tests skipped as url is not fetchable)');
                  this.skip();
                }

                if (!filteredContent) {
                  console.log('      (Tests skipped as content cannot be filtered)');
                  this.skip();
                }

                expect(filteredContent.length).to.be.greaterThan(MIN_DOC_LENGTH);
              });

              context('When fetched and filtered twice in a row', () => {
                // do not use arrow function to avoid binding to `this` and to allow `this.skip` to work
                it('has consistent filtered content', async function () { // eslint-disable-line func-names
                  if (!content) {
                    console.log('      (Tests skipped as url is not fetchable)');
                    this.skip();
                  }

                  if (!filteredContent) {
                    console.log('      (Tests skipped as content cannot be filtered)');
                    this.skip();
                  }

                  const {
                    location,
                    executeClientScripts,
                  } = service.getDocumentDeclaration(type);
                  const document = await fetch({
                    url: location,
                    executeClientScripts,
                    cssSelectors: service.getDocumentDeclaration(type).getCssSelectors(),
                  });
                  const secondFilteredContent = await filter({
                    content: document.content,
                    documentDeclaration: service.getDocumentDeclaration(type),
                    mimeType: document.mimeType,
                  });

                  expect(secondFilteredContent).to.equal(filteredContent);
                });
              });
            });
          });
        }
      });
    });
  });

  run();
})();

const validator = new Ajv({
  allErrors: true,
  jsonPointers: true,
});

function assertValid(schema, subject) {
  const valid = validator.validate(schema, subject);

  if (!valid) {
    const errorPointers = new Set();
    let errorMessage = '';
    const sourceMap = jsonSourceMap.stringify(subject, null, 2);
    const jsonLines = sourceMap.json.split('\n');

    validator.errors.forEach(error => {
      errorMessage += `\n\n${validator.errorsText([error])}`;
      const errorPointer = sourceMap.pointers[error.dataPath];

      if (errorPointer) {
        errorMessage += `\n> ${jsonLines
          .slice(errorPointer.value.line, errorPointer.valueEnd.line)
          .join('\n> ')}`;
        errorPointers.add(errorPointer);
      } else {
        errorMessage += ' (in entire file)\n';
      }
    });

    errorMessage += `\n\n${errorPointers.size} features have errors in total`;

    throw new Error(errorMessage);
  }
}
