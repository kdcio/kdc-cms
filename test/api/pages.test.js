const request = require("supertest");
const expect = require("chai").expect;
const clearTable = require("../helper");

const req = request("http://localhost:1001");
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
      .post("/api/page-definition")
      .send(homePageDef)
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(201, {
        id: homePage.id
      });
  });

  describe("POST /api/pages", function() {
    it("should create", function(done) {
      req
        .post("/api/pages")
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

  describe("GET /api/pages/" + homePage.id, function() {
    it("should get", function(done) {
      req
        .get("/api/pages/" + homePage.id)
        .expect("Content-Type", /json/)
        .expect(200)
        .end(function(err, res) {
          if (err) throw err;
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

  describe("GET /api/pages", function() {
    it("should list", function(done) {
      req
        .get("/api/pages")
        .expect("Content-Type", /json/)
        .expect(200)
        .end(function(err, res) {
          if (err) throw err;
          const { body } = res;
          expect(body.length).to.equal(1);
          done();
        });
    });
  });

  describe("PUT /api/pages/" + homePage.id, function() {
    it("it should update", function(done) {
      req
        .put("/api/pages/" + homePage.id)
        .send({ intro: "Yes I'm updated!" })
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(204, done);
    });
  });

  describe("GET /api/pages/" + homePage.id, function() {
    it("should update intro", function(done) {
      req
        .get("/api/pages/" + homePage.id)
        .expect("Content-Type", /json/)
        .expect(200)
        .end(function(err, res) {
          if (err) throw err;
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

  describe("DELETE /api/pages/" + homePage.id, function() {
    it("should delete", function(done) {
      req
        .delete("/api/pages/" + homePage.id)
        .expect("Content-Type", /json/)
        .expect(204, done);
    });
  });

  this.afterAll(async function() {
    await clearTable("page");
    await clearTable("page#data");
  });
});
