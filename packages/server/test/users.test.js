/* eslint-disable func-names */
const request = require('supertest');
const faker = require('faker');
const { expect } = require('chai');
const { app, clearTable, admin } = require('./helper');

const req = request(app);
const user = {
  email: faker.internet.email(),
  name: faker.name.findName(),
  password: faker.internet.password(),
  role: 'editor'
};

describe('Users', function() {
  before(async function() {
    const { token } = await admin;
    this.token = token;
  });

  describe('POST /users', function() {
    it('should create', function(done) {
      req
        .post('/users')
        .send(user)
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${this.token}`)
        .expect('Content-Type', /json/)
        .expect(
          201,
          {
            email: user.email
          },
          done
        );
    });
  });

  describe(`GET /users/:email`, function() {
    it('should get', function(done) {
      req
        .get(`/users/${user.email}`)
        .set('Authorization', `Bearer ${this.token}`)
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res) {
          expect(err).to.be.equal(null);
          const { body } = res;
          expect(body.pk).to.equal(user.email);
          expect(body.sk).to.equal('user');
          expect(body.gs1pk).to.equal('user');
          expect(body.gs1sk).to.equal(user.name);
          expect(body.role).to.equal('editor');
          done();
        });
    });
    it('should NOT get without Bearer', function(done) {
      req.get(`/users/${user.email}`).expect(401, done);
    });
    it('should NOT get with invalid Bearer', function(done) {
      req
        .get(`/users/${user.email}`)
        .set('Authorization', `Bearer invalid token`)
        .expect(401, done);
    });
  });

  describe('POST /users/authenticate', function() {
    it('should authenticate', function(done) {
      req
        .post('/users/authenticate')
        .send(user)
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${this.token}`)
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res) {
          expect(err).to.be.equal(null);
          const { body } = res;
          expect(body.email).to.equal(user.email);
          expect(body.token).to.not.be.equal(undefined);
          done();
        });
    });
    it('should NOT authenticate', function(done) {
      req
        .post('/users/authenticate')
        .send({ email: user.email, password: faker.internet.password() })
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${this.token}`)
        .expect('Content-Type', /json/)
        .expect(401, done);
    });
  });

  describe('GET /users', function() {
    it('should list', function(done) {
      req
        .get('/users')
        .set('Authorization', `Bearer ${this.token}`)
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res) {
          expect(err).to.be.equal(null);
          const { body } = res;
          expect(body.length).to.equal(2);
          done();
        });
    });
  });

  describe(`PUT /users/:email`, function() {
    it('it should update', function(done) {
      req
        .put(`/users/${user.email}`)
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${this.token}`)
        .send({ role: 'admin' })
        .expect(204, done);
    });
  });

  describe(`GET /users/:email`, function() {
    it('should update intro', function(done) {
      req
        .get(`/users/${user.email}`)
        .set('Authorization', `Bearer ${this.token}`)
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res) {
          expect(err).to.be.equal(null);
          const { body } = res;
          expect(body.pk).to.equal(user.email);
          expect(body.sk).to.equal('user');
          expect(body.gs1pk).to.equal('user');
          expect(body.gs1sk).to.equal(user.name);
          expect(body.role).to.equal('admin');
          done();
        });
    });
  });

  describe(`PUT /users/:email/changePassword`, function() {
    it('should not change password', function(done) {
      req
        .put(`/users/${user.email}/changePassword`)
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${this.token}`)
        .send({
          oldPassword: faker.internet.password(),
          newPassword: faker.internet.password()
        })
        .expect(401, done);
    });
    it('should change password', function(done) {
      req
        .put(`/users/${user.email}/changePassword`)
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${this.token}`)
        .send({
          oldPassword: user.password,
          newPassword: faker.internet.password()
        })
        .expect(204, done);
    });
  });

  describe(`DELETE /users/:email`, function() {
    it('should delete', function(done) {
      req
        .delete(`/users/${user.email}`)
        .set('Authorization', `Bearer ${this.token}`)
        .expect(204, done);
    });
  });

  after(async function() {
    await clearTable('user');
  });
});
