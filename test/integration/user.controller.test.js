process.env.DB_DATABASE = process.env.DB_DATABASE || 'share-a-meal'

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../index');
const assert = require('assert');
const pool = require("../../src/database/dbconnection");
const index = require("../../index");
const { logger } = require('../../src/config/config');
require('dotenv').config()
let database = [];
chai.should();
chai.use(chaiHttp);


/**
 * Db queries to clear and fill the test database before each test.
 */
const CLEAR_MEAL = "DELETE FROM `meal`;";
const CLEAR_MEAL_TABLE = 'DELETE IGNORE FROM `meal`;'
const CLEAR_PARTICIPANTS_TABLE = 'DELETE IGNORE FROM `meal_participants_user`;'
const CLEAR_USERS_TABLE = 'DELETE IGNORE FROM `user`;'
const CLEAR_DB = CLEAR_MEAL_TABLE + CLEAR_PARTICIPANTS_TABLE + CLEAR_USERS_TABLE
let validToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImlhdCI6MTY1Njg0NzE3NSwiZXhwIjoxNjU3ODgzOTc1fQ.61H7DsY8KVpizqLdlda1yf93TjiqYHKVrt69v96HYUY";
const invalidToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIyNywiaWF0IjoxNjUyNzg3NzA4LCJleHAiOjE2NTM4MjQ1MDh9.NAW7Ol_7WrEdPYH1B7-6mKFsGGpX3xPwEQBctIKlPvU";

/**
 * Voeg een user toe aan de database. Deze user heeft id 1.
 * Deze id kun je als foreign key gebruiken in de andere queries, bv insert meal.
 */
const INSERT_USER =
  'INSERT INTO `user` (`id`, `firstName`, `lastName`, `emailAdress`, `password`, `street`, `city` ) VALUES' +
  '(1, "first", "last", "name@server.nl", "secret", "street", "city");'

const INSERT_USER2 =
  'INSERT INTO `user` (`id`, `firstName`, `lastName`, `emailAdress`, `password`, `street`, `city` ) VALUES' +
  '(2, "first", "last", "poop@server.nl", "secret", "street", "city");'


// dit is zoals hoofdstukken van boeken
describe('Manage users', () => {
  describe("TC-201 Register as new user", () => {
    beforeEach((done) => {
      logger.debug("beforeEach called");
      pool.query(CLEAR_MEAL, function (error, results, fields) {
        if (error) throw error;
        logger.debug("beforeEach done");
        pool.query(CLEAR_DB, function (error, results, fields) {
          if (error) throw error;
          pool.query(ADD_USER, function (error, results, fields) {
            if (error) throw error;
            else {
              userId = results.insertId;
              logger.warn("real userId: " + userId);
            }
            done();
            logger.debug("beforeEach done");
          });
        });
      });
    });
  });

  it(' Testcase 201-1 When a required input is missing, a valide error should be returned', (done) => {
    chai
      .request(server)
      .post("/api/user")
      .send({
        lastName: "G",
        isActive: 1,
        street: "a",
        city: "b",
        roles: "editor",
        emailAdress: "ng@avans.nl",
        password: "D1mWW22!",
        phoneNumber: "0651234567",
      })
      .end((req, res) => {
        res.should.be.an("object");
        let { status, message } = res.body;
        status.should.equals(400);
        message.should.be
          .a("string")
          .that.equals("firstName must be a string");
        done();
      });
  });


  it('Testcase 201-2 When emailaddress is invalid, a valide error should be returned ', (done) => {
    chai
      .request(server)
      .post('/api/user')
      .send({


        firstName: "fefefefe",
        lastName: "G",
        isActive: 1,
        street: "a",
        city: "b",
        roles: "editor",
        password: "D1mWW22!",
        phoneNumber: "0651234567",
      })
      .end((err, res) => {
        res.should.be.an('object')
        let { status, message } = res.body;
        status.should.be.equals(400);
        message.should.be.an('string').that.equals('emailAdress must be a string');
      });
    done();
  });
  it('Testcase 201-3 When password is invalid, a valide error should be returned ', (done) => {
    chai
      .request(server)
      .post('/api/user')
      .send({

        firstName: "fefefefe",
        lastName: "G",
        isActive: 1,
        street: "a",
        city: "b",
        roles: "editor",
        emailAdress: "ngavans.nl",
        password: 132133,
        phoneNumber: "0651234567",
      })
      .end((err, res) => {
        res.should.be.an('object')
        let { status, message } = res.body;
        status.should.be.equals(400);
        message.should.be.an('string').that.equals('password must be a string');
      });
    done();
  });
  it("Testcase 201-4 User already exists", (done) => {
    chai
      .request(index)
      .post("/api/user")
      .send({
        firstName: "N",
        lastName: "G",
        isActive: 1,
        roles: "editor",
        street: "a",
        city: "b",
        emailAdress: "name@server.nl",
        password: "D1mwwVhTT22!",
        phoneNumber: "0651234567",
      })
      .end((req, res) => {
        res.should.be.an("object");
        let { status, message } = res.body;
        status.should.equals(409);
        message.should.be.a("string").that.equals("Email not unique");

      });
    done();
  });

  it('Testcase 201-5 should successfully register a new user', (done) => {
    chai
      .request(server)
      .post('/api/user')
      .send({
        firstName: 'Madara',
        lastName: 'Fransoir',
        street: 'unique 61',
        city: 'unique',
        isActive: 1,
        emailAdress: 'unique@example.com',
        phoneNumber: '0647113041',
        password: 'unique',
        roles: '',
      })
      .end((err, res) => {
        res.should.be.an('object');
        let { status, result } = res.body;
        status.should.be.equal(200);
        result.firstName.should.equal('Madara');

      });
    done();
  });



});

describe("TC-202 Overview of all users", () => {
  beforeEach((done) => {

    pool.query(CLEAR_MEAL, function (error, results, fields) {
      if (error) throw error;
      logger.debug("beforeEach done");
      pool.query(CLEAR_DB, function (error, results, fields) {
        if (error) throw error;
        pool.query(INSERT_USER, function (error, results, fields) {
          if (error) throw error;
          else {
            userId = results.insertId;
            logger.warn("real userId: " + userId);
          }
          done();
          logger.debug("beforeEach done");
        });
      });
    });
  });

  it("202-2 Show 2 users", (done) => {
    pool.query(INSERT_USER2, function (error, results, fields) {
      if (error) throw error;
      else {
        userId = results.insertId;
        logger.warn("real userId: " + userId);
      }

      logger.debug("beforeEach done");
    });
    chai
      .request(index)
      .get("/api/user")
      .end((req, res) => {
        let { status, result } = res.body;
        logger.warn(result);
        status.should.equals(200);
        result.should.be.an("array");
        done();
      });
  });

  it("202-3 Show users with searchterm on non-existent name", (done) => {
    pool.query(INSERT_USER2, function (error, results, fields) {
      if (error) throw error;
      else {
        userId = results.insertId;
        logger.warn("real userId: " + userId);
      }

      logger.debug("beforeEach done");
    });
    chai
      .request(index)
      .get("/api/user?firstname=naam")
      .end((req, res) => {
        let { status, result } = res.body;
        status.should.equals(200);
        result.should.be.an("array");
        done();
      });
  });
  it("202-4 Show users with searchterm isActive = false", (done) => {
    pool.query(INSERT_USER2, function (error, results, fields) {
      if (error) throw error;
      else {
        userId = results.insertId;
        logger.warn("real userId: " + userId);
      }

      logger.debug("beforeEach done");
    });
    chai
      .request(index)
      .get("/api/user?isActive=false")
      .end((req, res) => {
        let { status, result } = res.body;
        status.should.equals(200);
        result.should.be.an("array");
        logger.debug(result);
        done();
      });
  });
  describe("TC-203 Request userprofile", () => {
    let userToken;
    beforeEach((done) => {
      logger.debug("beforeEach called");
      pool.query(CLEAR_MEAL, function (error, results, fields) {
        if (error) throw error;
        logger.debug("beforeEach done");
        pool.query(CLEAR_DB, function (error, results, fields) {
          if (error) throw error;
          pool.query(INSERT_USER, function (error, results, fields) {
            if (error) throw error;
            done();

          });
        });
      });
    });
    it("203-1 Invalid token", (done) => {
      chai
        .request(index)
        .get("/api/user/profile")
        .auth(invalidToken, { type: "bearer" })
        .end((req, res) => {
          let { status, message, error } = res.body;
          logger.warn(error);
          status.should.equals(401);
          message.should.be.a("string").that.equals("error");
          done();
        });
    });

    it("203-2 Valid token and user exists", (done) => {
      chai
        .request(index)
        .get("/api/user/profile")
        .auth(validToken, { type: "bearer" })
        .end((req, res) => {
          let { status, result } = res.body;
          status.should.equals(401);
          done();
        });
    });
  });
  describe("TC-204 User details", () => {
    beforeEach((done) => {
      logger.debug("beforeEach called");
      pool.query(CLEAR_MEAL, function (error, results, fields) {
        if (error) throw error;
        logger.debug("beforeEach done");
        pool.query(CLEAR_DB, function (error, results, fields) {
          if (error) throw error;
          pool.query(INSERT_USER, function (error, results, fields) {
            if (error) throw error;
            else {
              userId = results.insertId;
              logger.warn("real userId: " + userId);
            }
            done();
            logger.debug("beforeEach done");
          });
        });
      });
    });
    it("204-1 Invalid token", (done) => {
      chai
        .request(index)
        .get("/api/user/2")
        .auth(invalidToken, { type: "bearer" })
        .end((req, res) => {
          let { status, message } = res.body;
          status.should.equals(401);
          message.should.be.a("string").that.equals("error");
          done();
        });
    });

    it("204-2 User-ID does not exist", (done) => {
      chai
        .request(index)
        .get("/api/user/800")
        .auth(validToken, { type: "bearer" })
        .end((req, res) => {
          let { status, message } = res.body;
          status.should.equals(404);
          message.should.be.a("string").that.equals("User does not exist");
          done();
        });
    });

    it("204-3 User-ID exists", (done) => {
      chai
        .request(index)
        .get("/api/user/" + userId)
        .auth(validToken, { type: "bearer" })
        .end((req, res) => {
          let { status, result } = res.body;
          status.should.equals(200);
          done();
        });
    });
  });
  it("206-1 User does not exist ", (done) => {
    chai
      .request(index)
      .delete("/api/user/" + 99999)
      .auth(validToken, { type: "bearer" })
      .end((req, res) => {
        let { message, status } = res.body;
        status.should.equals(200);
        message.should.be.a("string").that.equals("Unauthorized");
        done();
      });
  });
  it("206-2 Not logged in ", (done) => {
    chai
      .request(index)
      .delete("/api/user/4")

      .end((req, res) => {
        let { error, status } = res.body;
        status.should.equals(401);
        error.should.be
          .a("string")
          .that.equals("Authorization header missing!");
        done();
      });
  });
  it("206-3 User does not own data ", (done) => {
    chai
      .request(index)
      .delete("/api/user/" + userId)
      .auth("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTY1Njg0ODAwNywiZXhwIjoxNjU3ODg0ODA3fQ.lMHgieQgXN6HWqmJPoau7auhG8gfCylyfOzq-6hJdRE", { type: "bearer" })
      .end((req, res) => {
        let { status,message} = res.body;
        status.should.equals(200);
        message.should.be.a("string").that.equals("Unauthorized");
        done();
      });
  });
    it("206-4 Succesfully deleted user ", (done) => {
      chai
        .request(index)
        .delete("/api/user/"+userId+"?test=true")
        .auth(validToken, { type: "bearer" })
        .end((req, res) => {
          let { message, status } = res.body;
          logger.warn(res.body);
          status.should.equals(200)
          // message.should.be
          //   .a("string")
          //   .that.equals("Unauthorized");
          done();
        });
    });

});
