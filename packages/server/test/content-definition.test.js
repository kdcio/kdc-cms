/* eslint-disable func-names */
const request = require('supertest');
const { expect } = require('chai');
const { app, clearTable, admin } = require('./helper');

const req = request(app);
const blogs = {
  name: 'Blogs',
  type: 'blogs',
  date: 'text',
  title: 'text',
  author: 'text',
  body: 'long-text',
  slug: 'text',
  'sort-key': 'date'
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
            type: blogs.type
          },
          done
        );
    });
  });

  describe(`GET /content-definition/:type`, function() {
    it('should get', function(done) {
      req
        .get(`/content-definition/${blogs.type}`)
        .set('Authorization', `Bearer ${this.token}`)
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res) {
          expect(err).to.be.equal(null);
          const { body } = res;
          expect(body.pk).to.equal(blogs.type);
          expect(body.sk).to.equal('content');
          expect(body.gs1pk).to.equal('content');
          expect(body.gs1sk).to.equal(blogs.name);
          expect(body.date).to.equal('text');
          expect(body.title).to.equal('text');
          expect(body.body).to.equal('long-text');
          expect(body.author).to.equal('text');
          expect(body.slug).to.equal('text');
          expect(body['sort-key']).to.equal('date');
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

  describe(`PUT /content-definition/:type`, function() {
    it('it should update', function(done) {
      req
        .put(`/content-definition/${blogs.type}`)
        .set('Authorization', `Bearer ${this.token}`)
        .send({ body: 'text' })
        .set('Accept', 'application/json')
        .expect(204, done);
    });
  });

  describe(`GET /content-definition/:type`, function() {
    it('should update body', function(done) {
      req
        .get(`/content-definition/${blogs.type}`)
        .set('Authorization', `Bearer ${this.token}`)
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res) {
          expect(err).to.be.equal(null);
          const { body } = res;
          expect(body.pk).to.equal(blogs.type);
          expect(body.sk).to.equal('content');
          expect(body.gs1pk).to.equal('content');
          expect(body.gs1sk).to.equal(blogs.name);
          expect(body.date).to.equal('text');
          expect(body.title).to.equal('text');
          expect(body.body).to.equal('text');
          expect(body.author).to.equal('text');
          expect(body.slug).to.equal('text');
          expect(body['sort-key']).to.equal('date');
          done();
        });
    });
  });

  describe(`DELETE /content-definition/:type`, function() {
    it('should delete', function(done) {
      req
        .delete(`/content-definition/${blogs.type}`)
        .set('Authorization', `Bearer ${this.token}`)
        .expect(204, done);
    });
  });

  after(async function() {
    await clearTable('content');
  });
});
