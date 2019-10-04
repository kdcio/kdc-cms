/* eslint-disable func-names */
const request = require('supertest');
const { expect } = require('chai');
const { app, clearTable, admin } = require('./helper');

const req = request(app);
const homePage = {
  id: 'home',
  title: 'My Company',
  intro: 'Your wish is my command',
  summary: 'this should not be added'
};

const homePageDef = {
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

describe('Pages', function() {
  before(async function() {
    await clearTable('page');
    await clearTable('page#data');
    const { token } = await admin;
    this.token = token;
    // create page definition
    await req
      .post('/page-definition')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${this.token}`)
      .send(homePageDef)
      .expect('Content-Type', /json/)
      .expect(201, {
        id: homePage.id
      });
  });

  describe('POST /pages', function() {
    it('should create', function(done) {
      req
        .post('/pages')
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
  });

  describe(`GET /pages/:id`, function() {
    it('should get', function(done) {
      req
        .get(`/pages/${homePage.id}`)
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
          expect(body.gs1sk).to.equal(undefined);
          expect(body.title).to.equal(homePage.title);
          expect(body.intro).to.equal(homePage.intro);
          expect(body.summary).to.equal(undefined);
          done();
        });
    });
  });

  describe('GET /pages', function() {
    it('should list', function(done) {
      req
        .get('/pages')
        .set('Authorization', `Bearer ${this.token}`)
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res) {
          expect(err).to.be.equal(null);
          const { body } = res;
          expect(body.length).to.equal(1);
          done();
        });
    });
  });

  describe(`PUT /pages/:id`, function() {
    it('it should update', function(done) {
      req
        .put(`/pages/${homePage.id}`)
        .set('Authorization', `Bearer ${this.token}`)
        .send({ intro: "Yes I'm updated!" })
        .set('Accept', 'application/json')
        .expect(204, done);
    });
  });

  describe(`GET /pages/:id`, function() {
    it('should update intro', function(done) {
      req
        .get(`/pages/${homePage.id}`)
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
          expect(body.gs1sk).to.equal(undefined);
          expect(body.title).to.equal(homePage.title);
          expect(body.intro).to.equal("Yes I'm updated!");
          expect(body.summary).to.equal(undefined);
          done();
        });
    });
  });

  describe(`DELETE /pages/:id`, function() {
    it('should delete', function(done) {
      req
        .delete(`/pages/${homePage.id}`)
        .set('Authorization', `Bearer ${this.token}`)
        .expect(204, done);
    });
  });

  after(async function() {
    await clearTable('page');
    await clearTable('page#data');
  });
});
