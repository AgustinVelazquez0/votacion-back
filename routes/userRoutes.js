const express = require("express");
const { loginUser, registerUser } = require("../controllers/userController");
const verifyToken = require("../middleware/verifyToken"); // Usamos verifyToken aquí

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

// Ruta para obtener la información del usuario autenticado
router.get("/me", verifyToken, (req, res) => {
  // Aquí usamos verifyToken
  res.json({
    id: req.user.id,
    email: req.user.email,
    username: req.user.username,
  });
});

module.exports = router;
