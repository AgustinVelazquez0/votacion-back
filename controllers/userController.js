require("dotenv").config();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("../models/votingModel");

// Obtener total de usuarios
const getUserCount = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    res.json({ totalUsers });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error del servidor", error: error.message });
  }
};

// Registrar usuario
const register = async (req, res) => {
  try {
    const { dni, name, email, password } = req.body;

    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ $or: [{ email }, { dni }] });
    if (existingUser) {
      return res.status(400).json({
        message: "Usuario ya registrado con este email o DNI",
      });
    }

    // Encriptar contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Crear usuario
    const user = new User({
      dni,
      name,
      email,
      password: hashedPassword,
    });

    await user.save();

    // Generar token
    const token = jwt.sign(
      { userId: user._id, dni: user.dni },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.status(201).json({
      message: "Usuario registrado exitosamente",
      token,
      user: {
        id: user._id,
        dni: user.dni,
        name: user.name,
        email: user.email,
        hasVoted: user.hasVoted,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error del servidor", error: error.message });
  }
};

// Login
const login = async (req, res) => {
  try {
    const { dni, password } = req.body;

    // Buscar usuario
    const user = await User.findOne({ dni });
    if (!user) {
      return res.status(400).json({ message: "DNI o contraseña incorrectos" });
    }

    // Verificar contraseña
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "DNI o contraseña incorrectos" });
    }

    // Generar token
    const token = jwt.sign(
      { userId: user._id, dni: user.dni },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.json({
      message: "Login exitoso",
      token,
      user: {
        id: user._id,
        dni: user.dni,
        name: user.name,
        email: user.email,
        hasVoted: user.hasVoted,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error del servidor", error: error.message });
  }
};

module.exports = {
  register,
  login,
  getUserCount,
};
