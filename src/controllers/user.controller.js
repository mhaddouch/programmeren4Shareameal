process.env.DB_DATABASE = process.env.DB_DATABASE || 'share-a-meal'
process.env.LOGLEVEL = 'warn'
const pool = require('../../dbconnection');
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
    validateUser:(req,res,next)=>{
        let user = req.body;
        let {firstName,lastName,emailAddress,password} = user;

        try {
            assert(typeof firstName === 'string','firstName must be a string.');
            assert(typeof lastName === 'string','lastName must be a string.');
            assert(typeof emailAddress === 'string','emailAdress must be a string.');
            assert(typeof password === 'string','password must be a string.');
            next();
        } catch (err) {
          const error={
            status: 400,
            result:err.message,
          }
            next(error);
        }
    },

    addUser:(req,res)=>{
        let user = req.body;
    console.log(user);
    let email = user.emailAddress;
    if (email == undefined) {
      res.status(400).json({
        status: 400,
        result: "Please enter a value for 'emailAddress'.",
      });
    } else {
      let userArray = database.filter((item) => item.emailAddress == email);
      if (userArray.length > 0) {
        res.status(401).json({
          status: 401,
          result: `The email address ${email} is already in use, please use a different emailaddress or log in.`,
        });
      } else {
        id++;
        user = {
          id,
          ...user,
        };
        database.push(user);
        console.log(database);
        res.status(201).json({
          status: 201,
          result: `User with email address ${email} was added.`,
        });
      }
    }
    },

    getAllUsers:(req,res,next)=>{
     
      const {name , isActive} = req.query;
      console.log(`name, ${name} isActive, ${isActive}`)

      let queryString = 'SELECT `id`,`name` FROM `meal`'
      if(name || isActive){
        queryString = queryString + ' WHERE '
        if(name){
          queryString = queryString + `name='${name}'`
        }
      }
      queryString+=";"
      console.log(queryString)

      dbconnection.getConnection(function(err, connection) {
        if (err){
          next(err)
        }  // not connected!
       
        // Use the connection
        connection.query(queryString, function (error, results, fields) {
          // When done with the connection, release it.
          connection.release();
       
          // Handle error after the release.
          if (error) next(error);
       
          // Don't use the connection here, it has been returned to the pool.
          console.log('result = ', results);
          res.status(200).json({
            statusCode:200,
            results:results
          });
          
         // pool.end((err)=>{
           // console.log('pool was closed.')
        //});
                
        });
      });
    },
    getUserId:(req,res,next)=>{
      const userId = req.params.id;
      pool.query(
          `SELECT * FROM user WHERE id =${userId}`,
          (err, results, fields) => {
              const user = results[0];
              if (err) {
                  const error = {
                      status: 400,
                      message: 'User with provided Id does not exist',
                  };
                  next(error);
              }

              if (user != null) {
                  res.status(200).json({
                      status: 200,
                      result: user,
                  });
              } else {
                  const error = {
                      status: 404,
                      message: 'User with provided Id does not exist',
                  };
                  next(error);
              }
          }
      );
    }
}

module.exports = controller;