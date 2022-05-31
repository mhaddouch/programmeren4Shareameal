const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller')

let database = [];
let id =0;

router.get("/", (req, res) => {
    res.status(200).json({
      status: 200,
      result: "Share a meal application",
    });
  });
  
  
  router.post("/api/user",userController.addUser);
  
  router.get("/api/user", userController.getAllUsers);
  
  router.get("/api/user/profile", (req, res) => {
    res.status(401).json({
      status: 401,
      result: "This feature has not been implemented yet.",
    });
  });
  
  router.get("/api/user/:userId", userController.getUserId);
  
  router.put("/api/user/:id", (req, res) => {
    const id = req.params.id;
    let userArray = database.filter((item) => item.id == id);
    if (userArray.length > 0) {
      console.log(userArray);
      let user = req.body;
      user = {
        id,
        ...user,
      };
      let email = user.emailAdress;
      if (email == undefined) {
        res.status(400).json({
          status: 400,
          result: "Please enter a value for 'emailAddress'.",
        });
      } else {
        let userArray = database.filter((item) => item.emailAdress == email);
        if (userArray.length > 0 && id != userArray[0].id) {
          res.status(401).json({
            status: 401,
            result: `The email address ${email} is already in use, please use a different email address.`,
          });
        } else {
          database[database.indexOf(userArray[0])] = user;
          res.status(201).json({
            status: 201,
            result: `User with id ${id} was updated.`,
          });
        }
      }
    } else {
      res.status(404).json({
        status: 404,
        result: `User with id ${id} not found`,
      });
    }
  });
  
  router.delete("/api/user/:userId", (req, res) => {
    const userId = req.params.userId;
    let userArray = database.filter((item) => item.id == userId);
    if (userArray.length > 0) {
      console.log(userArray);
      database.splice(database.indexOf(userArray[0]), 1);
      res.status(201).json({
        status: 201,
        result: `User with id ${userId} was deleted.`,
      });
    } else {
      res.status(404).json({
        status: 404,
        result: `User with id ${userId} not found`,
      });
    }
  });

  module.exports = router;