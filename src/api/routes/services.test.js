import { expect } from 'chai';
import config from 'config';
import request from 'supertest';

import app from '../server.js';

const basePath = config.get('api.basePath');

describe('Services API', () => {
  describe('GET /services', () => {
    let response;

    before(async () => {
      response = await request(app).get(`${basePath}/v1/services`);
    });

    it('responds with 200 status code', () => {
      expect(response.status).to.equal(200);
    });

    it('responds with Content-Type application/json', () => {
      expect(response.type).to.equal('application/json');
    });

    it('returns an array of services', () => {
      expect(response.body).to.be.an('array');
    });

    it('each service should have an id', () => {
      response.body.forEach(service => {
        expect(service).to.have.property('id');
      });
    });

    it('each service should have a name', () => {
      response.body.forEach(service => {
        expect(service).to.have.property('name');
      });
    });
  });

  describe('GET /services/:serviceId', () => {
    let response;

    before(async () => {
      response = await request(app).get(`${basePath}/v1/services/service_A`);
    });

    it('responds with 200 status code', () => {
      expect(response.status).to.equal(200);
    });

    it('responds with Content-Type application/json', () => {
      expect(response.type).to.equal('application/json');
    });

    it('returns a service object with id', () => {
      expect(response.body).to.have.property('id');
    });

    it('returns a service object with name', () => {
      expect(response.body).to.have.property('name');
    });

    it('returns a service object with filters', () => {
      expect(response.body).to.have.property('filters');
    });

    it('returns a service object with an array of terms', () => {
      expect(response.body).to.have.property('terms').that.is.an('array');
    });

    it('each terms should have a type property', () => {
      response.body.terms.forEach(terms => {
        expect(terms).to.have.property('type');
      });
    });

    it('each terms should have an array of source documents', () => {
      response.body.terms.forEach(terms => {
        expect(terms).to.have.property('sourceDocuments').that.is.an('array');
      });
    });

    it('each source documents should have a location', () => {
      response.body.terms.forEach(terms => {
        terms.sourceDocuments.forEach(sourceDocument => {
          expect(sourceDocument).to.have.property('location');
        });
      });
    });

    context('When no matching service is found', () => {
      before(async () => {
        response = await request(app).get(`${basePath}/v1/inexistantService`);
      });

      it('responds with 404 status code', () => {
        expect(response.status).to.equal(404);
      });
    });
  });
});
