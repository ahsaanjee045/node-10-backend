const express = require("express");
const {
    createTodo,
    getAllTodos,
    updateTodo,
    deleteTodo,
    getSingleTodo,
} = require("../controllers/todocontroller");
const { param } = require("express-validator");
const { verifyUser, verifyAdmin } = require("../middlewares/authMiddleware");

const todoRouter = express.Router();

todoRouter.post("/create", verifyUser, createTodo);
todoRouter.get("/", verifyUser, getAllTodos);

todoRouter.get(
    "/:todoid",
    param("todoid").isMongoId().withMessage("Todo is not a valid mongo db id"),
    getSingleTodo
);
todoRouter.put("/:todoid", updateTodo);
todoRouter.delete("/:todoid", deleteTodo);

module.exports = todoRouter;
