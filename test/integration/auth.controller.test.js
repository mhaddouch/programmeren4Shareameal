process.env.DB_DATABASE = process.env.DB_DATABASE || 'share-a-meal'

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../index');
const assert = require('assert');
const pool = require("../../src/database/dbconnection");
const index = require("../../index");
const { logger } = require('../../src/config/config');
const jwt = require("jsonwebtoken");
require('dotenv').config()
let database = [];
chai.should();
chai.use(chaiHttp);

let validToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImlhdCI6MTY1Njg0NzE3NSwiZXhwIjoxNjU3ODgzOTc1fQ.61H7DsY8KVpizqLdlda1yf93TjiqYHKVrt69v96HYUY";
const invalidToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIyNywiaWF0IjoxNjUyNzg3NzA4LCJleHAiOjE2NTM4MjQ1MDh9.NAW7Ol_7WrEdPYH1B7-6mKFsGGpX3xPwEQBctIKlPvU";
  const CLEAR_DB = "DELETE  FROM `user` WHERE emailAdress = 'test@avans.nl' OR emailAdress = 'ng@avans.nl';";
const ADD_USER =
  "INSERT INTO `user`" +
  "(`firstName`, `lastName`, `street`, `city`, `password`, `emailAdress`, `phoneNumber`,`roles` )" +
  "VALUES ('Removable', 'man', 'behind', 'you', 'D389!!ach', 'test@avans.nl', '05322222222', 'editor');  ";

describe("Authentication /auth/login", () => {
  describe("TC-101 Login", () => {
    beforeEach((done) => {
      logger.debug("beforeEach called");
      pool.query(CLEAR_DB, function (error, results, fields) {
        if (error) throw error;
        logger.debug("beforeEach done");
        pool.query(ADD_USER, function (error, results, fields) {
          if (error) throw error;
          else {
            mealId = results.insertId;
            logger.warn("real mealid: " + mealId);
          }
          done();
          logger.debug("beforeEach done");
        });
      });
    });

    it("101-1 Missing required field", (done) => {
      chai
        .request(index)
        .post("/api/auth/login")
        .send({
          emailAdress: "ng@avans.nl",
        })
        .end((req, res) => {
          res.should.be.an("object");
          let { status, message } = res.body;
          status.should.equals(200);
          message.should.be.a("string");
          done();
        });
    });
    it("101-2 Invalid emailAddress", (done) => {
      chai
        .request(index)
        .post("/api/auth/login")
        .send({
          emailAdress: 1,
          password: "vik",
        })
        .end((req, res) => {
          res.should.be.an("object");
          let { status, message } = res.body;
          status.should.equals(200);
          message.should.be.a("string");
          done();
        });
    });
    it("101-3 Invalid password", (done) => {
      chai
        .request(index)
        .post("/api/auth/login")
        .send({
          emailAdress: "ng@avans.nl",
          password: 1,
        })
        .end((req, res) => {
          res.should.be.an("object");
          let { status, message } = res.body;
          status.should.equals(200);
          message.should.be.a("string");
          done();
        });
    });
    it("101-4 User does not exist", (done) => {
      chai
        .request(index)
        .post("/api/auth/login")
        .send({
          emailAdress: "ng@avans.nl",
          password: "D1mwwVhTT22!",
        })
        .end((req, res) => {
          res.should.be.an("object");
          let { status, message } = res.body;

          status.should.equals(200);
          message.should.be.a("string");
          done();
        });
    });
    it("101-5 User succesfully logged in", (done) => {
      chai
        .request(index)
        .post("/api/auth/login")
        .send({
          emailAdress: "test@avans.nl",
          password: "D389!!ach",
        })
        .end((req, res) => {
          res.should.be.an("object");
          let { status, result } = res.body;

          logger.warn(result);
          status.should.equals(200);
          done();
        });
    });
  });
});