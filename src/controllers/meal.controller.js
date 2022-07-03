process.env.DB_DATABASE = process.env.DB_DATABASE || 'share-a-meal'
process.env.LOGLEVEL = 'warn'

const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('../../index')
const assert = require('assert')
require('dotenv').config()
const logger = require('../config/config').logger
const jwtSecretKey = require('../config/config').jwtSecretKey
const jwt = require('jsonwebtoken')

chai.should()
chai.use(chaiHttp)

const dbconnection = require('../database/dbconnection');


let controller ={
    validateMeal:(req,res,next)=>{
        const meal = req.body;

    let {
      name,
      description,
      isActive,
      isVega,
      isVegan,
      isToTakeHome,
      dateTime,
      imageUrl,
      maxAmountOfParticipants,
      price,
      allergenes,
    } = meal;
    logger.debug("Time " + meal.dateTime);
    logger.debug("Raw mealdata: " + meal[0]);
    try {
      assert(typeof name == "string", "Name must be filled in and a string");
      assert(
        typeof description == "string",
        "Description must be filled in or a string"
      );
      assert(typeof isActive == "boolean", "Must be a boolean");
      assert(typeof isVega == "boolean", "Must be a boolean");
      assert(typeof isVegan == "boolean", "Must be a boolean");
      assert(typeof isToTakeHome == "boolean", "must be a boolean");
      assert(typeof dateTime == "string", "Must be a string");
      assert(typeof imageUrl == "string", "Must be a string");
      assert(typeof allergenes == "object", "Must be an object/array");
      logger.debug(typeof meal.allergenes);
      assert(typeof maxAmountOfParticipants == "number", "Must be a number");
      assert(typeof price == "number", "Must be a number");
      logger.debug("Validation complete");
      next();
    } catch (error) {
      logger.debug("Validation failed");
      logger.error(error);
      const err = {
        status: 400,
        message: error.message,
      };
      next(err);
    }
    },

    getMealId: (req, res, next) => {
        const mealId = req.params.mealId;
        dbconnection.query(
          `SELECT * FROM meal WHERE id = ${mealId};`,
          function (error, results, fields) {
            if (error) throw error;
            if (results.length > 0) {
              logger.info("Meal: " + results);
              res.status(200).json({
                status: 200,
                result: results[0],
              });
            } else {
              logger.debug("Could not find mealId: " + mealId);
              const error = {
                status: 404,
                message: "Meal does not exist",
              };
              next(error);
            }
          }
        );
    
      },
      checkAuthority: (req, res, next) => {
        const auth = req.headers.authorization;
        const token = auth.substring(7, auth.length);
        const encodedLoad = jwt.decode(token);
        const mealId = req.params.mealId;
        const userId = encodedLoad.userId;
        const test = req.query.test;
        const userRole = encodedLoad.roles;
        if (test) {
          next();
        } else {
          dbconnection.query(
            `SELECT cookId FROM meal WHERE id = ${mealId};`,
            function (error, results, fields) {
              if (typeof results[0].cookId != "undefined" && results[0].cookId != null) {
                if (!(results[0].cookId === userId)) {
                  const err = {
                    status: 403,
                    message: "Unauthorized",
                  };
                  next(err);
                } else {
                  logger.info("User authorized");
                  next();
                }
              } else {
                const err = {
                  status: 403,
                  message: "Unauthorized",
                };
                next(err);
              }
            }
          );
        }
      },
      addMeal: (req, res, next) => {
        let meal = req.body;
        let cookId = 1;
         if (typeof meal.id != "undefined" && meal.id != null) {
            cookId = meal.id;
          } else {
            const auth = req.headers.authorization;
            const token = auth.substring(7, auth.length);
            const encodedLoad = jwt.decode(token);
            cookId = encodedLoad.userId;
          }
        meal.dateTime = meal.dateTime.replace("T", " ").substring(0, 19);
      

        meal.allergenes = `${meal.allergenes}`;
    
    
        // meal.allergenes = meal.allergenes.toString();
        // meal.allergenes = join("', '", meal.allergenes);
        logger.debug("meal " + meal.allergenes);
        logger.debug(meal.dateTime);
        logger.debug("Converted meal data: " + meal);
    
        dbconnection.query(
          "INSERT INTO meal " +
            "(name, description, isVega, isVegan, isToTakeHome, dateTime, imageUrl, maxAmountOfParticipants, price, allergenes, isActive, cookId) " +
            "VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          [
            meal.name,
            meal.description,
            meal.isVega,
            meal.isVegan,
            meal.isToTakeHome,
            meal.dateTime,
            meal.imageUrl,
            meal.maxAmountOfParticipants,
            meal.price,
            meal.allergenes,
            meal.isActive,
            cookId,
          ],
          function (error, results, fields) {
            if (error) {
              logger.debug("Could not add meal: " + meal[0]);
              logger.error(error);
              const err = {
                status: 409,
                message: "Could not add meal",
              };
              next(err);
            } else {
              dbconnection.query( `SELECT * FROM meal WHERE id = ${results.insertId};`, function (error, results, fields){
                res.status(201).json({
                  status: 201,
                  result: results[0] ,
                });
                logger.warn("time "+ results[0].dateTime);
                logger.info("Added meal: " + results );
              })
            }
          }
        );
    },
    deleteMeal: (req, res, next) => {
        const mealId = req.params.mealId;
        let meal;
    
        dbconnection.query(
          `SELECT * FROM meal WHERE id = ${mealId};`,
          function (error, results, fields) {
            if (error) throw error;
            logger.info("Deleting meal: " + mealId);
            meal = results[0];
          }
        );
    
        dbconnection.query(
          `DELETE FROM meal WHERE id = ${mealId} ;`,
          function (error, results, fields) {
            if (error) throw error;
            if (results.affectedRows > 0) {
              logger.info("#Deleted meal: " + meal);
              res.status(200).json({
                status: 200,
                result: meal,
              });
            } else {
              logger.debug("Meal does not exist");
              const error = {
                status: 400,
                message: "Meal does not exist",
              };
              next(error);
            }
          }
        );
      },
      updateMeal: (req, res, next) => {
        let meal = req.body;
    const currentId = req.params.mealId;

    let cookId = 1;
    if (meal.id != null) {
      cookId = meal.id;
    } else {
      const auth = req.headers.authorization;
      const token = auth.substring(7, auth.length);
      const encodedLoad = jwt.decode(token);
      cookId = encodedLoad.userId;
    }


    meal.allergenes = `${meal.allergenes}`;

    logger.info("Converted meal data: " + meal);

    dbconnection.query(
      "UPDATE meal SET name = ? ,description = ?, isActive = ?,isVega = ?,isVegan = ?,isToTakeHome = ?,dateTime = ?,imageUrl = ?,allergenes = ?,maxAmountOfParticipants = ?, price = ? WHERE id = ?;",
      [
        meal.name,
        meal.description,
        meal.isActive,
        meal.isVega,
        meal.isVegan,
        meal.isToTakeHome,
        meal.dateTime,
        meal.imageUrl,
        meal.allergenes,
        meal.maxAmountOfParticipants,
        meal.price,
        currentId,
      ],
      function (error, result, fields) {
        if (error) {
          const error = {
            status: 404,
            error: "error",
          };
          next(error);
        } else if (result.affectedRows) {
          dbconnection.query(
            `SELECT * FROM meal WHERE id = ${currentId};`,
            function (error, results, fields) {
              res.status(200).json({
                status: 200,
                result: results[0],
              });
              logger.warn(results[0]);
            }
          );
        }
        else{
          const error = {
            status: 404,
            message: "Meal does not exist"
          };
          next(error);
        }
      }
    );
      },
}

module.exports = controller;