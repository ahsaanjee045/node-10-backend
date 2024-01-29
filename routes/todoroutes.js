const express = require('express');
const { createTodo, getAllTodos, updateTodo, deleteTodo, getSingleTodo } = require('../controllers/todocontroller');


const todoRouter = express.Router()

todoRouter.post("/create", createTodo)
todoRouter.get("/", getAllTodos)

todoRouter.get("/:todoid", getSingleTodo)
todoRouter.put("/:todoid", updateTodo)
todoRouter.delete("/:todoid", deleteTodo)



module.exports = todoRouter
