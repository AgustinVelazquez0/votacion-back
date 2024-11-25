const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const todoRoutes = require("./routes/todoRoutes");

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Rutas
app.use("/todos", todoRoutes);

// Conexión a MongoDB
mongoose
  .connect("mongodb://127.0.0.1:27017/todoDB")
  .then(() => console.log("Conexión a MongoDB exitosa"))
  .catch((err) => console.error("Error conectando a MongoDB:", err));

// Servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
