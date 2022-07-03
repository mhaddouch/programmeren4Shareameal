process.env.DB_DATABASE = process.env.DB_DATABASE || 'share-a-meal'
process.env.LOGLEVEL = 'warn'

const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('../../index')
const assert = require('assert')
require('dotenv').config()
const logger = require('../config/config').logger

chai.should()
chai.use(chaiHttp)

const dbconnection = require('../database/dbconnection');





let controller = {
    // validateUser:(req,res,next)=>{
    //   let user = req.body;
    //   let { firstName, lastName, street, city, isActive, emailAdress, phoneNumber, password } = user;
    //   try {
    //       assert(typeof firstName === 'string', 'firstName must be a string');
    //       assert(typeof lastName === 'string', 'lastName must be a string');
    //       assert(typeof street === 'string', 'street must be a string');
    //       assert(typeof city === 'string', 'city must be a string');
    //       assert(typeof isActive === 'number', 'IsActive must be a number');
    //       assert(typeof emailAdress === 'string', 'emailAddress must be a string');
    //       assert(typeof password === 'string', 'password must be a string');
    //     } catch (err) {
    //       const error={
    //         status: 400,
    //         message: err.message,
    //       }
    //         next(error);
    //     }
    // },

    validateUser:(req,res,next)=>{
      let user = req.body;
      let {firstName,lastName,emailAdress,password} = user;

      try {
          assert(typeof firstName === 'string','firstName must be a string');
          assert(typeof lastName === 'string','lastName must be a string');
          assert(typeof emailAdress === 'string','emailAdress must be a string');
          assert(typeof password === 'string','password must be a string');
          next();
      } catch (err) {
        const error={
          status: 400,
          message:err.message,
        }
          next(error);
      }
  },

    addUser:(req,res,next)=>{

      let user = req.body;
      logger.debug(`getAll aangeroepen. req.userId = ${req.userId}`)
 
          
        dbconnection.getConnection(function(err, connection) {
          if (err){
            next(err)
          }  // not connected!
         
          // Use the connection
          connection.query(
            "INSERT INTO user " +
              "(firstName, lastName, street, city, password, emailAdress, phoneNumber, roles) " +
              "VALUES(?, ?, ?, ?, ?, ?, ?, ?)",
            [
              user.firstName,
              user.lastName,
              user.street,
              user.city,
              user.password,
              user.emailAdress,
              user.phoneNumber,
              user.roles,
            ],
            function (error, results, fields) {
              if (error) {
                logger.error("Could not add user: " + error);
                const err = {
                  status: 409,
                  message: "Email not unique",
                };
      
                next(err);
              } else {
                logger.debug("added user to database: " + user);
                user.userId = results.insertId;
                res.status(200).json({
                  status: 200,
                  message: "added user to database",
                  result: user,
                });
              }
            }
          );
        }
        )

    },
    

    getAllUsers: (req, res) => {
      const active = req.query.isActive;
      const name = req.query.firstName;
      let searchQuery = ";";
      let isActive = 1;
  
      if (active != undefined) {
        if (active != "true") {
          isActive = 0;
        }
        searchQuery = `WHERE isActive = ${isActive};`;
      }
  
      if (name != undefined) {
        searchQuery = `WHERE firstName LIKE('%${name}%');`;
      }
  
      if (active != undefined && name != undefined) {
        searchQuery = `WHERE isActive = ${isActive} AND firstName LIKE('%${name}%');`;
      }
      logger.info("Searchquery: " + searchQuery);
  
      dbconnection.query(
        "SELECT * FROM user " + searchQuery,
        function (error, results, fields) {
          if (error) throw error;
          logger.info("Amount of users: " + results.length);
          res.status(200).json({
            status: 200,
            result: results,
          });
        }
      );
    },
    getUserId:(req,res,next)=>{
      const userId = req.params.userId;
    dbconnection.query(
      `SELECT * FROM user WHERE id =${userId}`,
      (err, results, fields) => {
        if (err) throw err;
        if (results.length > 0) {
          logger.info("Found user: " + results);
          res.status(200).json({
            status: 200,
            result: results,
          });
        } else {
          logger.error("Could not find user: " + err);
          const error = {
            status: 404,
            message: "User does not exist",
          };
          next(error);
        }
      });


    },
    updateUser:(req,res,next)=>{
      const userId = req.params.userId;
    let user = req.body;

    dbconnection.getConnection(function(err, connection) {
      if (err){
        next(err)
      }  // not connected!
     

      connection.query(
      "UPDATE user SET `firstName` = ?, `lastName` = ?, `city` = ?, `street` = ?, `password` = ?, `isActive` = ?, `phoneNumber` = ? WHERE `id` = ?;",
      [
        user.firstName,
        user.lastName,
        user.street,
        user.city,
        user.password,
        user.phoneNumber,
        user.roles,
        userId,
      ],
      function (error, results, fields) {
        if (error) {
          logger.error("Could not edit user: " + error);
          const err = {
            status: 409,
            message: "User not eddited",
          };

          next(err);
        } else {
          logger.info("Succesfully added user: " + user);
          res.status(200).json({
            status: 200,
            result: user,
          });
        }
      }
    );
    }
  )},

  deleteUser: (req, res, next) => {
    let user;
    const userId = req.params.userId;
    dbconnection.query(
      `SELECT * FROM user WHERE id = ${userId};`,
      function (error, results, fields) {
        if (error) throw error;
        logger.log("#result = " + results.length);
        user = results;
      }
    );

    dbconnection.query(
      `DELETE FROM user WHERE id = ${userId} ;`,
      function (error, results, fields) {
        if (error) throw error;

        if (user.length > 0) {
          logger.log("#result = " + results.length);
          res.status(200).json({
            statusCode: 200,
            result: user,
          });
        } else {
          const err = {
            status: 400,
            message: "User does not exist",
          };
          next(err);
        }
      }
    );
  },


}


module.exports = controller;