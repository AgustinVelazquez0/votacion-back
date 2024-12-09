const express = require("express");
const router = express.Router();
const todoController = require("../controllers/todoController");
const verifyToken = require("../middleware/verifyToken"); // Importamos el middleware

// Rutas CRUD protegidas con JWT
router.post("/", verifyToken, todoController.createTodo); // Protegemos la creación de todo
router.get("/", verifyToken, todoController.getAllTodos); // Protegemos la obtención de todos los todos
router.get("/:id", verifyToken, todoController.getTodoById); // Protegemos la obtención de un todo por ID
router.put("/:id", verifyToken, todoController.updateTodo); // Protegemos la actualización de un todo
router.delete("/:id", verifyToken, todoController.deleteTodo); // Protegemos la eliminación de un todo

module.exports = router;
