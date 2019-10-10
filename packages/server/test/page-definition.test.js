/* eslint-disable func-names */
const request = require('supertest');
const { expect } = require('chai');
const { app, clearDb, admin } = require('./helper');

const req = request(app);
const homePage = {
  name: 'Home Page',
  id: 'home',
  fieldCount: 2,
  fields: [
    {
      name: 'title',
      type: 'text'
    },
    {
      name: 'intro',
      type: 'long-text'
    }
  ]
};

describe('Page Definition', function() {
  before(async function() {
    await clearDb('page');
    const { token } = await admin;
    this.token = token;
  });

  describe('POST /page-definition', function() {
    it('should create', function(done) {
      req
        .post('/page-definition')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${this.token}`)
        .send(homePage)
        .expect('Content-Type', /json/)
        .expect(
          201,
          {
            id: homePage.id
          },
          done
        );
    });
    it('should also create page#data', function(done) {
      req
        .get(`/pages/${homePage.id}`)
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${this.token}`)
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res) {
          expect(err).to.be.equal(null);
          const { body } = res;
          expect(body.pk).to.equal(undefined);
          expect(body.id).to.equal(homePage.id);
          expect(body.sk).to.equal(undefined);
          expect(body.gs1pk).to.equal(undefined);
          expect(body.name).to.equal(homePage.name);
          expect(body.fields[0].name).to.equal('title');
          expect(body.fields[0].type).to.equal('text');
          expect(body.fields[1].name).to.equal('intro');
          expect(body.fields[1].type).to.equal('long-text');
          done();
        });
    });
  });

  describe(`GET /page-definition/:id`, function() {
    it('should get', function(done) {
      req
        .get(`/page-definition/${homePage.id}`)
        .set('Authorization', `Bearer ${this.token}`)
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res) {
          expect(err).to.be.equal(null);
          const { body } = res;
          expect(body.pk).to.equal(undefined);
          expect(body.id).to.equal(homePage.id);
          expect(body.sk).to.equal(undefined);
          expect(body.gs1pk).to.equal(undefined);
          expect(body.name).to.equal(homePage.name);
          expect(body.fieldCount).to.equal(2);
          expect(body.fields[0].name).to.equal('title');
          expect(body.fields[0].type).to.equal('text');
          expect(body.fields[1].name).to.equal('intro');
          expect(body.fields[1].type).to.equal('long-text');
          done();
        });
    });
  });

  describe('GET /page-definition', function() {
    it('should list', function(done) {
      req
        .get('/page-definition')
        .set('Authorization', `Bearer ${this.token}`)
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res) {
          expect(err).to.be.equal(null);
          const { body } = res;
          expect(body.length).to.equal(1);
          expect(body[0].id).to.equal(homePage.id);
          expect(body[0].sk).to.equal(undefined);
          expect(body[0].gs1pk).to.equal(undefined);
          expect(body[0].name).to.equal(homePage.name);
          expect(body[0].title).to.equal(undefined);
          expect(body[0].intro).to.equal(undefined);
          done();
        });
    });
  });

  describe(`PUT /page-definition/:id`, function() {
    it('it should update', function(done) {
      req
        .put(`/page-definition/${homePage.id}`)
        .set('Authorization', `Bearer ${this.token}`)
        .set('Accept', 'application/json')
        .send({ name: 'New home page' })
        .expect(204, done);
    });
  });

  describe(`GET /page-definition/:id`, function() {
    it('should update name', function(done) {
      req
        .get(`/page-definition/${homePage.id}`)
        .set('Authorization', `Bearer ${this.token}`)
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res) {
          expect(err).to.be.equal(null);
          const { body } = res;
          expect(body.pk).to.equal(undefined);
          expect(body.id).to.equal(homePage.id);
          expect(body.sk).to.equal(undefined);
          expect(body.gs1pk).to.equal(undefined);
          expect(body.name).to.equal('New home page');
          expect(body.fieldCount).to.equal(2);
          expect(body.fields[0].name).to.equal('title');
          expect(body.fields[0].type).to.equal('text');
          expect(body.fields[1].name).to.equal('intro');
          expect(body.fields[1].type).to.equal('long-text');
          done();
        });
    });
  });

  describe(`DELETE /page-definition/:id`, function() {
    it('should delete', function(done) {
      req
        .delete(`/page-definition/${homePage.id}`)
        .set('Authorization', `Bearer ${this.token}`)
        .expect(204, done);
    });
  });

  after(async function() {
    await clearDb('page');
  });
});
