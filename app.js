require("dotenv").config(); // Cargar las variables del archivo .env

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const todoRoutes = require("./routes/todoRoutes");
const userRoutes = require("./routes/userRoutes");
const pool = require("./config/postgresClient"); // Importar la configuración de PostgreSQL

const app = express();
const PORT = process.env.PORT || 5000; // Usar variable de entorno para el puerto

// Middleware
app.use(cors({ origin: process.env.CLIENT_URL })); // Permitir solicitudes desde el cliente
app.use(express.json()); // Middleware para manejar JSON

// Agregar log para verificar que las rutas están siendo alcanzadas
app.use((req, res, next) => {
  console.log(`Ruta solicitada: ${req.method} ${req.originalUrl}`);
  next();
});

// Rutas
app.use("/todos", todoRoutes);
app.use("/users", userRoutes);

// Verificar conexión a PostgreSQL
pool.query("SELECT NOW()", (err, res) => {
  if (err) {
    console.error("Error al conectarse a PostgreSQL:", err);
  } else {
    console.log("Conexión exitosa a PostgreSQL:", res.rows[0]);
  }
});

// Conexión a MongoDB
mongoose
  .connect(process.env.MONGO_URI) // Usar variable de entorno para MongoDB
  .then(() => console.log("Conexión a MongoDB exitosa"))
  .catch((err) => console.error("Error conectando a MongoDB:", err));

// Middleware de manejo de errores
app.use((err, req, res, next) => {
  console.error("Error no manejado:", err);
  res.status(500).json({ error: "Ha ocurrido un error en el servidor" });
});

// Servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
