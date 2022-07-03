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


/**
 * Db queries to clear and fill the test database before each test.
 */
 const CLEAR_MEAL = "DELETE FROM `meal`;";
 const CLEAR_MEAL_TABLE = 'DELETE IGNORE FROM `meal`;'
 const CLEAR_PARTICIPANTS_TABLE = 'DELETE IGNORE FROM `meal_participants_user`;'
 const CLEAR_USERS_TABLE = 'DELETE IGNORE FROM `user`;'
 const CLEAR_DB = CLEAR_MEAL_TABLE + CLEAR_PARTICIPANTS_TABLE + CLEAR_USERS_TABLE
 
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



     describe("Manage meals /api/meal", () => {
        describe("TC-301 Add meal", () => {
          beforeEach((done) => {
            logger.debug("beforeEach called");
            pool.query(CLEAR_DB, function (error, results, fields) {
              if (error) throw error;
              pool.query(CLEAR_USERS_TABLE, function (error, results, fields) {
                if (error) throw error;
                pool.query(INSERT_USER, function (error, results, fields) {
                  if (error) throw error;
                  logger.debug("beforeEach done");
                  done();
                });
              });
            });
          });
      
          it("301-1 Missing required field", (done) => {
            chai
              .request(index)
              .post("/api/meal")
             // .auth(validToken, { type: "bearer" })
              .send({
                description: "Friet met mayo",
                isActive: true,
                isVega: false,
                isVegan: true,
                isToTakeHome: true,
                maxAmountOfParticipants: 5,
                price: 5.99,
                dateTime: "2022-08-23",
                imageUrl: "https://imgur.com/a/0WO84",
                allergenes: "aardappel",
              })
              .end((req, res) => {
                res.should.be.an("object");
                let { status, message } = res.body;
                status.should.equals(401);
                message.should.be
                  .a("string")
                  .that.equals("Authorization");
                done();
              });
          });
          it("301-3 Succesfully added meal", (done) => {
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
               // validToken = result.token;
                //expect(result).to.have.own.property("token");
                // done();
                chai
                  .request(index)
                  .post("/api/meal")
                  //.auth(validToken, { type: "bearer" })
                  .send({
                    name: "Friet",
                    description: "Friet met mayo",
                    isActive: true,
                    isVega: false,
                    isVegan: true,
                    isToTakeHome: true,
                    cookId: 1,
                    maxAmountOfParticipants: 5,
                    price: 5.99,
                    dateTime: "2022-08-23T22:00:00.000Z",
                    imageUrl: "https://imgur.com/a/0WO84",
                    allergenes: [],
                  })
                  .end((req, res) => {
                    let { result, status } = res.body;
                    status.should.equals(401);
                    
                    done();
                  });
              });
          });
        });
        
    });

    describe("TC-302 Edit meal", () => {
        beforeEach((done) => {
          logger.debug("beforeEach called");
          pool.query(CLEAR_DB, function (error, results, fields) {
            if (error) throw error;
            logger.debug("beforeEach done");
            pool.query(INSERT_USER, function (error, results, fields) {
              if (error) throw error;
              mealId = results.insertId;
              pool.query(CLEAR_USERS_TABLE, function (error, results, fields) {
                if (error) throw error;
                pool.query(INSERT_USER, function (error, results, fields) {
                  if (error) throw error;
                  logger.debug("beforeEach done");
                  done();
                });
              });
              logger.debug("beforeEach done");
            });
          });
        });
    
        it("302-1 Missing required field", (done) => {
          chai
            .request(index)
            .put("/api/meal/" + mealId)
         //   .auth(validToken, { type: "bearer" })
            .send({
              description: "Friet met mayo",
              isActive: true,
              isVega: false,
              isVegan: true,
              isToTakeHome: true,
              maxAmountOfParticipants: 5,
              price: 5.99,
              dateTime: "2022-08-23",
              imageUrl: "https://imgur.com/a/0WO84",
              allergenes: ["aardappel", "mayo"],
            })
            .end((req, res) => {
              res.should.be.an("object");
              let { status, message } = res.body;
              status.should.equals(401);
              message.should.be
                .a("string")
                .that.equals("Authorization");
             
            });
            done();
        });
    });