const pool = require("../config/postgresClient");

// Método para manejar el login
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  console.log("Login solicitado", req.body); // Verifica si llega la solicitud
  res.json({ message: "Login exitoso" }); // Respuesta simple
  try {
    // Buscar el usuario por email
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const user = result.rows[0];

    // Validar la contraseña
    if (user.password === password) {
      return res.json({
        message: "Login exitoso",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          document: user.document,
        },
      });
    } else {
      return res.status(401).json({ message: "Contraseña incorrecta" });
    }
  } catch (error) {
    console.error("Error al consultar PostgreSQL:", error);
    return res.status(500).json({ message: "Error del servidor" });
  }
};

// Método para registrar un nuevo usuario
const registerUser = async (req, res) => {
  const { name, document, email, password } = req.body;

  console.log("Datos recibidos para registro:", {
    name,
    document,
    email,
    password,
  });

  try {
    // Verificar si el correo ya está registrado
    const existingUser = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );
    if (existingUser.rows.length > 0) {
      return res
        .status(400)
        .json({ message: "El correo electrónico ya está registrado" });
    }

    // Insertar el nuevo usuario
    const result = await pool.query(
      "INSERT INTO users (name, document, email, password, created_at, updated_at) VALUES ($1, $2, $3, $4, NOW(), NOW()) RETURNING *",
      [name, document, email, password]
    );

    const newUser = result.rows[0];
    console.log("Nuevo usuario registrado:", newUser);
    res.status(201).json({
      message: "Usuario registrado exitosamente",
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        document: newUser.document,
      },
    });
  } catch (error) {
    console.error("Error al registrar el usuario:", error);
    res.status(500).json({ message: "Error al registrar el usuario" });
  }
};

module.exports = { loginUser, registerUser };
