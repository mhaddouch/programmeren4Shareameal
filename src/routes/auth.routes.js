const express = require('express');
const { getUserProfile } = require('../controllers/meal.controller');
const router = express.Router();
const authController = require('../controllers/auth.controller');

  
 router.post("/api/auth/login",authController.login);


  module.exports = router;
