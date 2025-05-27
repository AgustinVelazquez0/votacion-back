const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User"); // Necesitarás crear este modelo

const JWT_SECRET =
  process.env.JWT_SECRET || "your-secret-key-change-in-production";

// Registrar nuevo usuario
const register = async (req, res) => {
  try {
    const { dni, password, name, email } = req.body;

    // Validaciones básicas
    if (!dni || !password || !name || !email) {
      return res.status(400).json({
        message: "Todos los campos son obligatorios",
      });
    }

    // Validar formato de DNI
    if (!/^\d{7,10}$/.test(dni)) {
      return res.status(400).json({
        message: "El DNI debe tener entre 7 y 10 dígitos",
      });
    }

    // Validar formato de email
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({
        message: "Email inválido",
      });
    }

    // Validar longitud de contraseña
    if (password.length < 6) {
      return res.status(400).json({
        message: "La contraseña debe tener al menos 6 caracteres",
      });
    }

    // Verificar si el usuario ya existe por DNI
    const existingUserByDni = await User.findOne({ dni });
    if (existingUserByDni) {
      return res.status(400).json({
        message: "Ya existe un usuario con este DNI",
      });
    }

    // Verificar si el usuario ya existe por email
    const existingUserByEmail = await User.findOne({ email });
    if (existingUserByEmail) {
      return res.status(400).json({
        message: "Ya existe un usuario con este email",
      });
    }

    // Hashear la contraseña
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Crear nuevo usuario
    const newUser = new User({
      dni,
      password: hashedPassword,
      name,
      email,
      hasVoted: false,
      role: "voter",
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Guardar en la base de datos
    await newUser.save();

    // Generar token JWT
    const token = jwt.sign(
      {
        userId: newUser._id,
        dni: newUser.dni,
        email: newUser.email,
        role: newUser.role,
      },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    console.log("✅ Usuario registrado:", {
      id: newUser._id,
      dni: newUser.dni,
      name: newUser.name,
      email: newUser.email,
    });

    // Respuesta exitosa (sin incluir la contraseña)
    res.status(201).json({
      message: "Usuario registrado exitosamente",
      token,
      user: {
        id: newUser._id,
        dni: newUser.dni,
        name: newUser.name,
        email: newUser.email,
        hasVoted: newUser.hasVoted,
        role: newUser.role,
      },
    });
  } catch (error) {
    console.error("❌ Error en register:", error);

    // Manejar errores específicos de MongoDB
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      return res.status(400).json({
        message: `Ya existe un usuario con ese ${field}`,
      });
    }

    res.status(500).json({
      message: "Error interno del servidor",
    });
  }
};

// Iniciar sesión
const login = async (req, res) => {
  try {
    const { dni, password } = req.body;

    // Validaciones básicas
    if (!dni || !password) {
      return res.status(400).json({
        message: "DNI y contraseña son obligatorios",
      });
    }

    // Buscar usuario por DNI (incluir la contraseña para verificación)
    const user = await User.findOne({ dni }).select("+password");
    if (!user) {
      return res.status(401).json({
        message: "Credenciales inválidas",
      });
    }

    // Verificar si el usuario está activo
    if (!user.isActive) {
      return res.status(401).json({
        message: "Usuario desactivado. Contacte al administrador.",
      });
    }

    // Verificar contraseña
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({
        message: "Credenciales inválidas",
      });
    }

    // Actualizar último login
    user.lastLogin = new Date();
    user.updatedAt = new Date();
    await user.save();

    // Generar token JWT
    const token = jwt.sign(
      {
        userId: user._id,
        dni: user.dni,
        email: user.email,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    console.log("✅ Login exitoso:", {
      id: user._id,
      dni: user.dni,
      name: user.name,
      email: user.email,
    });

    // Respuesta exitosa (sin incluir la contraseña)
    res.json({
      message: "Login exitoso",
      token,
      user: {
        id: user._id,
        dni: user.dni,
        name: user.name,
        email: user.email,
        hasVoted: user.hasVoted,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("❌ Error en login:", error);
    res.status(500).json({
      message: "Error interno del servidor",
    });
  }
};

// Verificar token y obtener información del usuario
const getUserStatus = async (req, res) => {
  try {
    // El middleware verifyToken ya decodificó el token y agregó req.user
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({
        message: "Usuario no encontrado",
      });
    }

    if (!user.isActive) {
      return res.status(401).json({
        message: "Usuario desactivado",
      });
    }

    // Actualizar último acceso
    user.updatedAt = new Date();
    await user.save();

    console.log("✅ Status verificado para usuario:", user.dni);

    // Respuesta con información del usuario (sin contraseña)
    res.json({
      _id: user._id,
      dni: user.dni,
      name: user.name,
      email: user.email,
      hasVoted: user.hasVoted,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  } catch (error) {
    console.error("❌ Error en getUserStatus:", error);
    res.status(500).json({
      message: "Error interno del servidor",
    });
  }
};

// Cerrar sesión (opcional, principalmente del lado del cliente)
const logout = async (req, res) => {
  try {
    // En un sistema real, podrías invalidar el token en una blacklist
    // Por ahora, simplemente confirmamos el logout
    console.log("✅ Logout exitoso");
    res.json({
      message: "Logout exitoso",
    });
  } catch (error) {
    console.error("❌ Error en logout:", error);
    res.status(500).json({
      message: "Error interno del servidor",
    });
  }
};

module.exports = {
  register,
  login,
  getUserStatus,
  logout,
};
