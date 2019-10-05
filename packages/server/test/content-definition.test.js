/* eslint-disable func-names */
const request = require('supertest');
const { expect } = require('chai');
const { app, clearTable, admin } = require('./helper');

const req = request(app);
const blogs = {
  name: 'Blogs',
  id: 'blogs',
  fieldCount: 3,
  fields: [
    {
      name: 'title',
      type: 'text'
    },
    {
      name: 'date',
      type: 'text'
    },
    {
      name: 'body',
      type: 'long-text'
    }
  ],
  slug: 'text',
  sortKey: 'date'
};

describe('Content Definition', function() {
  before(async function() {
    await clearTable('content');
    const { token } = await admin;
    this.token = token;
  });

  describe('POST /content-definition', function() {
    it('it should create', function(done) {
      req
        .post('/content-definition')
        .send(blogs)
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${this.token}`)
        .expect('Content-Type', /json/)
        .expect(
          201,
          {
            id: blogs.id
          },
          done
        );
    });
  });

  describe(`GET /content-definition/:id`, function() {
    it('should get', function(done) {
      req
        .get(`/content-definition/${blogs.id}`)
        .set('Authorization', `Bearer ${this.token}`)
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res) {
          expect(err).to.be.equal(null);
          const { body } = res;
          expect(body.pk).to.equal(undefined);
          expect(body.id).to.equal(blogs.id);
          expect(body.sk).to.equal(undefined);
          expect(body.gs1pk).to.equal(undefined);
          expect(body.name).to.equal(blogs.name);
          expect(body.fields[0].name).to.equal('title');
          expect(body.fields[0].type).to.equal('text');
          expect(body.fields[1].name).to.equal('date');
          expect(body.fields[1].type).to.equal('text');
          expect(body.fields[2].name).to.equal('body');
          expect(body.fields[2].type).to.equal('long-text');
          expect(body.sortKey).to.equal('date');
          expect(body.fieldCount).to.equal(3);
          done();
        });
    });
  });

  describe('GET /content-definition', function() {
    it('should list', function(done) {
      req
        .get('/content-definition')
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

  describe(`PUT /content-definition/:id`, function() {
    it('it should update', function(done) {
      req
        .put(`/content-definition/${blogs.id}`)
        .set('Authorization', `Bearer ${this.token}`)
        .send({ sortKey: 'title' })
        .set('Accept', 'application/json')
        .expect(204, done);
    });
  });

  describe(`GET /content-definition/:id`, function() {
    it('should update body', function(done) {
      req
        .get(`/content-definition/${blogs.id}`)
        .set('Authorization', `Bearer ${this.token}`)
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res) {
          expect(err).to.be.equal(null);
          const { body } = res;
          expect(body.pk).to.equal(undefined);
          expect(body.id).to.equal(blogs.id);
          expect(body.sk).to.equal(undefined);
          expect(body.gs1pk).to.equal(undefined);
          expect(body.name).to.equal(blogs.name);
          expect(body.fields[0].name).to.equal('title');
          expect(body.fields[0].type).to.equal('text');
          expect(body.fields[1].name).to.equal('date');
          expect(body.fields[1].type).to.equal('text');
          expect(body.fields[2].name).to.equal('body');
          expect(body.fields[2].type).to.equal('long-text');
          expect(body.sortKey).to.equal('title');
          done();
        });
    });
  });

  describe(`DELETE /content-definition/:id`, function() {
    it('should delete', function(done) {
      req
        .delete(`/content-definition/${blogs.id}`)
        .set('Authorization', `Bearer ${this.token}`)
        .expect(204, done);
    });
  });

  after(async function() {
    await clearTable('content');
  });
});
