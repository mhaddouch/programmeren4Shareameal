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
    validateMeal: (req, res, next) => {
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

      getMealById: (req, res, next) => {
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

}



module.exports = controller;