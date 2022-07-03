const express = require('express');
const { getUserProfile } = require('../controllers/meal.controller');
const router = express.Router();
const mealController = require('../controllers/meal.controller');
const authController = require('../controllers/auth.controller');
const { validateToken } = require("../controllers/auth.controller");

router.get("/", (req, res) => {
    res.status(200).json({
      status: 200,
      result: "Share a meal application",
    });
  });
  
 router.post("/api/meal",validateToken,mealController.validateMeal,mealController.addMeal);
// router.post("/api/meal",mealController.addMeal);
  
  //router.get("/api/meal", userController.getAllUsers);
  
  /* router.get("/api/meal/profile", (req, res) => {
    res.status(401).json({
      status: 401,
      result: "This feature has not been implemented yet.",
    });
  }); */
  
  router.get("/api/meal/:mealId",validateToken, mealController.getMealId);
  
  router.put("/api/meal/:mealId",validateToken, mealController.updateMeal);
  
  router.delete("/api/meal/:mealId",validateToken, mealController.deleteMeal);

  module.exports = router;
