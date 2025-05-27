const express = require("express");
const router = express.Router();
const {
  register,
  login,
  getUserStatus,
  logout,
} = require("../controllers/authController");
const verifyToken = require("../middleware/verifyToken");
const userController = require("../controllers/userController");

// Rutas públicas (no requieren autenticación)
router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);

// Rutas protegidas (requieren autenticación)
router.get("/user-status", verifyToken, getUserStatus);
router.get("/users/count", verifyToken, userController.getUserCount);

module.exports = router;
