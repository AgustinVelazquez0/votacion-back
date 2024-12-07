// routes/userRoutes.js
const express = require("express");
const { loginUser, registerUser } = require("../controllers/userController");

const router = express.Router();

// Ruta para el login
router.post(
  "/login",
  (req, res, next) => {
    console.log("Solicitud POST a /login recibida");
    next(); // Llamamos al siguiente middleware
  },
  loginUser
);

// Ruta para registrar un nuevo usuario
router.post("/register", (req, res) => {
  console.log("Ruta POST /register alcanzada");
  registerUser(req, res);
});

module.exports = router;
