// routes/userRoutes.js

const express = require("express");
const { loginUser, registerUser } = require("../controllers/userController");
const authenticateToken = require("../middleware/verifyToken");

const router = express.Router();

// Ruta POST para login
router.post("/login", loginUser);

// Ruta para registrar un nuevo usuario
router.post("/register", registerUser);

// Ruta para obtener la información del usuario autenticado
router.get("/me", authenticateToken, (req, res) => {
  res.json({
    id: req.user.id,
    email: req.user.email,
    name: req.user.name,
  });
});

module.exports = router;
