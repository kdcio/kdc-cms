const request = require("supertest");
const expect = require("chai").expect;
const clearTable = require("../helper");

const req = request("http://localhost:1001");
const homePage = {
  name: "Home Page",
  id: "home",
  title: "text",
  intro: "long-text"
};

describe("Page Definition", function() {
  this.beforeAll(async function() {
    await clearTable("page");
  });

  describe("POST /api/page-definition", function() {
    it("it should create", function(done) {
      req
        .post("/api/page-definition")
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

  describe("GET /api/page-definition/" + homePage.id, function() {
    it("responds with json", function(done) {
      req
        .get("/api/page-definition/" + homePage.id)
        .expect("Content-Type", /json/)
        .expect(200)
        .end(function(err, res) {
          if (err) throw err;
          const { body } = res;
          expect(body.pk).to.equal(homePage.id);
          expect(body.sk).to.equal("page");
          expect(body.gs1pk).to.equal("page");
          expect(body.gs1sk).to.equal(homePage.name);
          expect(body.title).to.equal("text");
          expect(body.intro).to.equal("long-text");
          done();
        });
    });
  });

  describe("GET /api/page-definition", function() {
    it("responds with json", function(done) {
      req
        .get("/api/page-definition")
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

  describe("PUT /api/page-definition/" + homePage.id, function() {
    it("it should update", function(done) {
      req
        .put("/api/page-definition/" + homePage.id)
        .send({ intro: "text" })
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(204, done);
    });
  });

  describe("GET /api/page-definition/" + homePage.id, function() {
    it("should update intro", function(done) {
      req
        .get("/api/page-definition/" + homePage.id)
        .expect("Content-Type", /json/)
        .expect(200)
        .end(function(err, res) {
          if (err) throw err;
          const { body } = res;
          expect(body.pk).to.equal(homePage.id);
          expect(body.sk).to.equal("page");
          expect(body.gs1pk).to.equal("page");
          expect(body.gs1sk).to.equal(homePage.name);
          expect(body.title).to.equal("text");
          expect(body.intro).to.equal("text");
          done();
        });
    });
  });

  describe("DELETE /api/page-definition/" + homePage.id, function() {
    it("should delete", function(done) {
      req
        .delete("/api/page-definition/" + homePage.id)
        .expect("Content-Type", /json/)
        .expect(204, done);
    });
  });

  this.afterAll(async function() {
    await clearTable("page");
  });
});
