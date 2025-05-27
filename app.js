const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

// Importar rutas
const authRoutes = require("./routes/authRoutes");
const votingRoutes = require("./routes/votingRoutes");

// Crear instancia de Express
const app = express();

// Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Middleware para obtener IP del cliente
app.use((req, res, next) => {
  req.ip =
    req.headers["x-forwarded-for"] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    (req.connection.socket ? req.connection.socket.remoteAddress : null);
  next();
});

// Conexión a MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/voting-system"
    );
    console.log("✅ Conectado a MongoDB");
  } catch (error) {
    console.error("❌ Error conectando a MongoDB:", error.message);
    process.exit(1);
  }
};

// Conectar a la base de datos
connectDB();

// Rutas principales
app.use("/api/auth", authRoutes);
app.use("/api/voting", votingRoutes);

// Ruta de prueba
app.get("/", (req, res) => {
  res.json({
    message: "🗳️ API del Sistema de Votación",
    version: "1.0.0",
    status: "Funcionando correctamente",
    endpoints: {
      auth: {
        register: "POST /api/auth/register",
        login: "POST /api/auth/login",
      },
      voting: {
        candidates: "GET /api/voting/candidates",
        vote: "POST /api/voting/vote",
        results: "GET /api/voting/results",
        userStatus: "GET /api/voting/user-status",
      },
    },
  });
});

// Ruta para verificar el estado del servidor
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Middleware para rutas no encontradas
app.use("*", (req, res) => {
  res.status(404).json({
    message: "Ruta no encontrada",
    availableRoutes: [
      "GET /",
      "GET /api/health",
      "POST /api/auth/register",
      "POST /api/auth/login",
      "GET /api/voting/candidates",
      "POST /api/voting/vote",
      "GET /api/voting/results",
      "GET /api/voting/user-status",
    ],
  });
});

// Middleware de manejo de errores global
app.use((error, req, res, next) => {
  console.error("❌ Error:", error.stack);

  // Error de validación de Mongoose
  if (error.name === "ValidationError") {
    const errors = Object.values(error.errors).map((err) => err.message);
    return res.status(400).json({
      message: "Error de validación",
      errors,
    });
  }

  // Error de duplicado en MongoDB
  if (error.code === 11000) {
    const field = Object.keys(error.keyValue)[0];
    return res.status(400).json({
      message: `Ya existe un registro con ese ${field}`,
    });
  }

  // Error de JWT
  if (error.name === "JsonWebTokenError") {
    return res.status(401).json({
      message: "Token inválido",
    });
  }

  // Error de JWT expirado
  if (error.name === "TokenExpiredError") {
    return res.status(401).json({
      message: "Token expirado",
    });
  }

  // Error genérico del servidor
  res.status(500).json({
    message: "Error interno del servidor",
    ...(process.env.NODE_ENV === "development" && { error: error.message }),
  });
});

// Configurar el puerto
const PORT = process.env.PORT || 3000;

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`
🚀 Servidor iniciado exitosamente
📍 Puerto: ${PORT}
🌐 URL: http://localhost:${PORT}
🗃️  Base de datos: ${
    process.env.MONGODB_URI || "mongodb://localhost:27017/voting-system"
  }
🌍 Entorno: ${process.env.NODE_ENV || "development"}
  `);
});

// Manejo de cierre graceful
process.on("SIGINT", async () => {
  console.log("\n🛑 Cerrando servidor...");
  await mongoose.connection.close();
  console.log("✅ Conexión a MongoDB cerrada");
  process.exit(0);
});

process.on("SIGTERM", async () => {
  console.log("\n🛑 Cerrando servidor...");
  await mongoose.connection.close();
  console.log("✅ Conexión a MongoDB cerrada");
  process.exit(0);
});

module.exports = app;
