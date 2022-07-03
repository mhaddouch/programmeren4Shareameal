const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller')
const authController = require('../controllers/auth.controller');
const { validateToken } = require("../controllers/auth.controller");

router.get("/", (req, res) => {
  res.status(200).json({
    status: 200,
    result: "Share a meal application",
  });
});

router.post("/api/user", userController.validateUser, userController.addUser);

router.get("/api/user", userController.getAllUsers);

router.get("/api/user/profile", validateToken, userController.getProfile);

router.get("/api/user/:userId", validateToken, userController.getUserId);

router.put("/api/user/:userId", validateToken, userController.updateUser);

router.delete("/api/user/:userId", validateToken, userController.deleteUser);

module.exports = router;