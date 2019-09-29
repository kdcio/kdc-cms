const request = require("supertest");
const expect = require("chai").expect;
const { app, clearTable } = require("./helper");

const req = request(app);
const homePage = {
  id: "home",
  title: "My Company",
  intro: "Your wish is my command"
};

const homePageDef = {
  name: "Home Page",
  id: "home",
  title: "text",
  intro: "long-text"
};

describe("Pages", function() {
  this.beforeAll(async function() {
    await clearTable("page");
    await clearTable("page#data");
    // create page definition
    await req
      .post("/page-definition")
      .send(homePageDef)
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(201, {
        id: homePage.id
      });
  });

  describe("POST /pages", function() {
    it("should create", function(done) {
      req
        .post("/pages")
        .send(homePage)
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(
          201,
          {
            id: homePage.id
          },
          done
        );
    });
  });

  describe("GET /pages/" + homePage.id, function() {
    it("should get", function(done) {
      req
        .get("/pages/" + homePage.id)
        .expect("Content-Type", /json/)
        .expect(200)
        .end(function(err, res) {
          expect(err).to.be.null;
          const { body } = res;
          expect(body.pk).to.equal(homePage.id);
          expect(body.sk).to.equal("page#data");
          expect(body.gs1pk).to.equal("page#data");
          expect(body.gs1sk).to.equal(homePageDef.name);
          expect(body.title).to.equal(homePage.title);
          expect(body.intro).to.equal(homePage.intro);
          done();
        });
    });
  });

  describe("GET /pages", function() {
    it("should list", function(done) {
      req
        .get("/pages")
        .expect("Content-Type", /json/)
        .expect(200)
        .end(function(err, res) {
          expect(err).to.be.null;
          const { body } = res;
          expect(body.length).to.equal(1);
          done();
        });
    });
  });

  describe("PUT /pages/" + homePage.id, function() {
    it("it should update", function(done) {
      req
        .put("/pages/" + homePage.id)
        .send({ intro: "Yes I'm updated!" })
        .set("Accept", "application/json")
        .expect(204, done);
    });
  });

  describe("GET /pages/" + homePage.id, function() {
    it("should update intro", function(done) {
      req
        .get("/pages/" + homePage.id)
        .expect("Content-Type", /json/)
        .expect(200)
        .end(function(err, res) {
          expect(err).to.be.null;
          const { body } = res;
          expect(body.pk).to.equal(homePage.id);
          expect(body.sk).to.equal("page#data");
          expect(body.gs1pk).to.equal("page#data");
          expect(body.gs1sk).to.equal(homePageDef.name);
          expect(body.title).to.equal(homePage.title);
          expect(body.intro).to.equal("Yes I'm updated!");
          done();
        });
    });
  });

  describe("DELETE /pages/" + homePage.id, function() {
    it("should delete", function(done) {
      req.delete("/pages/" + homePage.id).expect(204, done);
    });
  });

  this.afterAll(async function() {
    await clearTable("page");
    await clearTable("page#data");
  });
});
