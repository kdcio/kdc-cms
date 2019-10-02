/* eslint-disable func-names */
const request = require('supertest');
const { expect } = require('chai');
const { app, clearTable, admin } = require('./helper');

const req = request(app);
const blog = {
  type: 'blogs',
  date: new Date().toJSON().slice(0, 10),
  title: 'My First Post',
  author: 'Ian Dela Cruz',
  body:
    'Aute consequat aute aliquip proident sint pariatur mollit adipisicing aliquip eiusmod commodo nulla amet. Laborum occaecat excepteur cillum consectetur et dolore elit exercitation officia enim id anim consectetur ipsum. Do consectetur proident amet reprehenderit sint qui eu. Deserunt ipsum consectetur deserunt sunt non. Laborum commodo ullamco proident commodo amet.',
  slug: 'my-first-post'
};

const blogDef = {
  name: 'Blogs',
  type: 'blogs',
  date: 'text',
  title: 'text',
  author: 'text',
  body: 'long-text',
  slug: 'text',
  'sort-key': 'date'
};

describe('Contents', function() {
  before(async function() {
    await clearTable('content');
    await clearTable(`content#${blogDef.type}`);
    const { token } = await admin;
    this.token = token;
    // create content definition
    await req
      .post('/content-definition')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${this.token}`)
      .send(blogDef)
      .expect('Content-Type', /json/)
      .expect(201, {
        type: blogDef.type
      });
  });

  describe(`POST /contents/:type`, function() {
    it('it should create', function(done) {
      req
        .post(`/contents/${blogDef.type}`)
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${this.token}`)
        .send(blog)
        .expect('Content-Type', /json/)
        .expect(
          201,
          {
            slug: blog.slug
          },
          done
        );
    });
  });

  describe(`GET /contents/:type/:slug`, function() {
    it('should get', function(done) {
      req
        .get(`/contents/${blogDef.type}/${blog.slug}`)
        .set('Authorization', `Bearer ${this.token}`)
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res) {
          expect(err).to.be.equal(null);
          const { body } = res;
          expect(body.pk).to.equal(blog.slug);
          expect(body.sk).to.equal(`content#${blogDef.type}`);
          expect(body.gs1pk).to.equal(`content#${blogDef.type}`);
          expect(body.gs1sk).to.equal(blog.date);
          expect(body.title).to.equal(blog.title);
          expect(body.body).to.equal(blog.body);
          expect(body.author).to.equal(blog.author);
          expect(body.createdAt).to.be.above(0);
          done();
        });
    });
  });

  describe(`GET /contents/:type`, function() {
    it('should list', function(done) {
      req
        .get(`/contents/${blogDef.type}`)
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

  describe(`PUT /contents/:type/:slug`, function() {
    it('it should update', function(done) {
      req
        .put(`/contents/${blogDef.type}/${blog.slug}`)
        .set('Authorization', `Bearer ${this.token}`)
        .send({ title: 'My Updated Post', author: 'Happy Dela Cruz' })
        .set('Accept', 'application/json')
        .expect(204, done);
    });
  });

  describe(`GET /contents/:type/:slug`, function() {
    it('should update body', function(done) {
      req
        .get(`/contents/${blogDef.type}/${blog.slug}`)
        .set('Authorization', `Bearer ${this.token}`)
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res) {
          expect(err).to.be.equal(null);
          const { body } = res;
          expect(body.pk).to.equal(blog.slug);
          expect(body.sk).to.equal(`content#${blogDef.type}`);
          expect(body.gs1pk).to.equal(`content#${blogDef.type}`);
          expect(body.gs1sk).to.equal(blog.date);
          expect(body.title).to.equal('My Updated Post');
          expect(body.body).to.equal(blog.body);
          expect(body.author).to.equal('Happy Dela Cruz');
          expect(body.createdAt).to.be.above(0);
          expect(body.updatedAt).to.be.above(0);
          done();
        });
    });
  });

  describe(`DELETE /contents/:type/:slug`, function() {
    it('should delete', function(done) {
      req
        .delete(`/contents/${blogDef.type}/${blog.slug}`)
        .set('Authorization', `Bearer ${this.token}`)
        .expect(204, done);
    });
  });

  after(async function() {
    await clearTable('content');
    await clearTable(`content#${blogDef.type}`);
  });
});
