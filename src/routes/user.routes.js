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
  
  router.post("/api/meal",userController.validateUser,userController.addUser);

  
  router.get("/api/meal", userController.getAllUsers);
  
  router.get("/api/user/profile", (req, res) => {
    res.status(401).json({
      status: 401,
      result: "This feature has not been implemented yet.",
    });
  });
  
  router.get("/api/user/:userId", userController.getUserId);
  
  router.put("/api/user/:id", userController.updateUser);
  
  router.delete("/api/user/:userId", userController.deleteUser);

  module.exports = router;