const jwt = require("jsonwebtoken");

const JWT_SECRET =
  process.env.JWT_SECRET || "your-secret-key-change-in-production";

const verifyToken = (req, res, next) => {
  try {
    // Obtener token del header Authorization
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        message: "Token de acceso requerido",
      });
    }

    // El token debe venir en formato "Bearer TOKEN"
    const token = authHeader.startsWith("Bearer ")
      ? authHeader.slice(7)
      : authHeader;

    if (!token) {
      return res.status(401).json({
        message: "Token de acceso requerido",
      });
    }

    // Verificar y decodificar el token
    const decoded = jwt.verify(token, JWT_SECRET);

    // Agregar información del usuario al request
    req.user = {
      userId: decoded.userId,
      dni: decoded.dni,
      email: decoded.email,
      role: decoded.role || "voter",
    };

    console.log("✅ Token verificado para usuario:", decoded.dni);

    next();
  } catch (error) {
    console.error("❌ Error verificando token:", error.message);

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        message: "Token inválido",
      });
    }

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        message: "Token expirado",
      });
    }

    return res.status(401).json({
      message: "Error de autenticación",
    });
  }
};

module.exports = verifyToken;
