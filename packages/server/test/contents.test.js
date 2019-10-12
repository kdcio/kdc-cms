/* eslint-disable func-names */
const request = require('supertest');
const { expect } = require('chai');
const { app, clearDb, admin } = require('./helper');

const req = request(app);
const blog = {
  Date: new Date().toJSON().slice(0, 10),
  Name: 'My First Post',
  Body:
    'Aute consequat aute aliquip proident sint pariatur mollit adipisicing aliquip eiusmod commodo nulla amet. Laborum occaecat excepteur cillum consectetur et dolore elit exercitation officia enim id anim consectetur ipsum. Do consectetur proident amet reprehenderit sint qui eu. Deserunt ipsum consectetur deserunt sunt non. Laborum commodo ullamco proident commodo amet.',
  Slug: 'my-first-post'
};

const blogDef = {
  name: 'Blogs',
  id: 'blogs',
  fieldCount: 4,
  fields: [
    {
      name: 'Name',
      type: 'text'
    },
    {
      name: 'Slug',
      type: 'text'
    },
    {
      name: 'Date',
      type: 'text'
    },
    {
      name: 'Body',
      type: 'long-text'
    }
  ],
  sortKey: 'Date'
};

describe('Contents', function() {
  before(async function() {
    await clearDb('content');
    await clearDb(`content#${blogDef.id}`);
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
        id: blogDef.id
      });
  });

  describe(`POST /contents/:id`, function() {
    it('it should create', function(done) {
      req
        .post(`/contents/${blogDef.id}`)
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${this.token}`)
        .send(blog)
        .expect('Content-Type', /json/)
        .expect(
          201,
          {
            Slug: blog.Slug
          },
          done
        );
    });
  });

  describe(`GET /contents/:id/:slug`, function() {
    it('should get', function(done) {
      req
        .get(`/contents/${blogDef.id}/${blog.Slug}`)
        .set('Authorization', `Bearer ${this.token}`)
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res) {
          expect(err).to.be.equal(null);
          const { body } = res;
          expect(body.pk).to.equal(undefined);
          expect(body.sk).to.equal(undefined);
          expect(body.gs1pk).to.equal(undefined);
          expect(body.gs1sk).to.equal(undefined);
          expect(body.Name).to.equal(blog.Name);
          expect(body.Slug).to.equal(blog.Slug);
          expect(body.Date).to.equal(blog.Date);
          expect(body.Body).to.equal(blog.Body);
          expect(body.createdAt).to.be.above(0);
          blog.createdAt = body.createdAt;
          done();
        });
    });
  });

  describe(`GET /contents/:id`, function() {
    it('should list', function(done) {
      req
        .get(`/contents/${blogDef.id}`)
        .set('Authorization', `Bearer ${this.token}`)
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res) {
          expect(err).to.be.equal(null);
          const { body } = res;
          expect(body.length).to.equal(1);
          expect(body[0].Name).to.equal(blog.Name);
          expect(body[0].Slug).to.equal(blog.Slug);
          expect(body[0].Date).to.equal(blog.Date);
          expect(body[0].Body).to.equal(undefined);
          expect(body[0].createdAt).to.equal(blog.createdAt);
          done();
        });
    });
  });

  describe(`PUT /contents/:id/:slug`, function() {
    it('it should update', function(done) {
      req
        .put(`/contents/${blogDef.id}/${blog.Slug}`)
        .set('Authorization', `Bearer ${this.token}`)
        .send({ title: 'My Updated Post', Body: 'Updated body' })
        .set('Accept', 'application/json')
        .expect(204, done);
    });

    it('should get update date', function(done) {
      req
        .get(`/contents/${blogDef.id}/${blog.Slug}`)
        .set('Authorization', `Bearer ${this.token}`)
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res) {
          expect(err).to.be.equal(null);
          const { body } = res;
          expect(body.pk).to.equal(undefined);
          expect(body.sk).to.equal(undefined);
          expect(body.gs1pk).to.equal(undefined);
          expect(body.gs1sk).to.equal(undefined);
          expect(body.Name).to.equal(blog.Name);
          expect(body.Slug).to.equal(blog.Slug);
          expect(body.Date).to.equal(blog.Date);
          expect(body.title).to.equal(undefined);
          expect(body.Body).to.equal('Updated body');
          expect(body.createdAt).to.equal(blog.createdAt);
          expect(body.updatedAt).to.be.above(0);
          done();
        });
    });

    it('it should delete old document and create a new one', function(done) {
      req
        .put(`/contents/${blogDef.id}/${blog.Slug}`)
        .set('Authorization', `Bearer ${this.token}`)
        .send({ Name: 'My Updated Post', Slug: 'my-updated-post' })
        .set('Accept', 'application/json')
        .expect(204, done);
    });

    it('should NOT get old slug', function(done) {
      req
        .get(`/contents/${blogDef.id}/${blog.Slug}`)
        .set('Authorization', `Bearer ${this.token}`)
        .expect('Content-Type', /json/)
        .expect(404, done);
    });

    it('should get new document', function(done) {
      req
        .get(`/contents/${blogDef.id}/my-updated-post`)
        .set('Authorization', `Bearer ${this.token}`)
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res) {
          expect(err).to.be.equal(null);
          const { body } = res;
          expect(body.pk).to.equal(undefined);
          expect(body.sk).to.equal(undefined);
          expect(body.gs1pk).to.equal(undefined);
          expect(body.gs1sk).to.equal(undefined);
          expect(body.Name).to.equal('My Updated Post');
          expect(body.Slug).to.equal('my-updated-post');
          expect(body.Date).to.equal(blog.Date);
          expect(body.Body).to.equal('Updated body');
          expect(body.createdAt).to.equal(blog.createdAt);
          expect(body.updatedAt).to.be.above(0);
          done();
        });
    });
  });

  describe(`DELETE /contents/:id/:slug`, function() {
    it('should delete', function(done) {
      req
        .delete(`/contents/${blogDef.id}/my-updated-post`)
        .set('Authorization', `Bearer ${this.token}`)
        .expect(204, done);
    });
  });

  after(async function() {
    await clearDb('content');
    await clearDb(`content#${blogDef.id}`);
  });
});
