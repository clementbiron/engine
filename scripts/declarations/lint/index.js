import path from 'path';
import { fileURLToPath } from 'url';

import config from 'config';
import { ESLint } from 'eslint';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const declarationsPath = config.get('services.declarationsPath');
const instancePath = path.resolve(declarationsPath, '../');
const ESLINT_CONFIG_PATH = path.join(__dirname, '../../../.eslintrc.yaml');

const lintDeclarations = async ({ services }) => {
  console.log(`Linting declaration files in ${instancePath}`);
  const servicesToValidate = services || ['*'];

  for (const service of servicesToValidate) {
    /* eslint-disable no-await-in-loop */
    const lintResults = await new ESLint({ overrideConfigFile: ESLINT_CONFIG_PATH, fix: true })
      .lintFiles(path.join(declarationsPath, `${service}.*`));

    await ESLint.outputFixes(lintResults);
    console.log(lintResults.map(lintResult => `${path.basename(lintResult.filePath)} linted`).join('\n'));
    /* eslint-enable no-await-in-loop */
  }
};

export default lintDeclarations;
