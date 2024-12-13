const { Pool } = require("pg");

// Configuración del Pool de conexiones
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "todolist",
  password: "123456",
  port: 5433, // Puerto predeterminado de PostgreSQL
});

// Manejo de errores
pool.on("error", (err) => {
  console.error("Error en el pool de PostgreSQL:", err);
});

module.exports = pool;
