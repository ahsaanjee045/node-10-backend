const { validationResult } = require("express-validator");
const Todo = require("../models/todoSchema");
const jwt = require("jsonwebtoken");

const createTodo = async (req, res) => {
    try {
        let data = req.body;

        let newTodo = await Todo.create(data);

        res.status(201).json({
            message: "Todo Created successfully",
            todo: newTodo,
        });
    } catch (error) {
      return next(new CustomError(error.message, 500, false));
    }
};

const getAllTodos = async (req, res) => {
    try {
        let docs = await Todo.find();
        res.status(200).json({
            todos: docs,
        });
    } catch (error) {
        res.status(500).json({
            error: error.message || "Something went wrong",
        });
    }
};
const getSingleTodo = async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return next(new CustomError(errors.array()[0].msg, 400, false));
    }

    try {
        let { todoid } = req.params;
        let doc = await Todo.findById(todoid);

        if (!doc) {
            return next(new CustomError("Todo not found!", 404, false));
        }
        res.status(200).json({
            todo: doc,
        });
    } catch (error) {
        return next(new CustomError(error.message, 500, false));
    }
};

const updateTodo = async (req, res) => {
    try {
        let { todoid } = req.params;
        let data = req.body;
        let updatedTodo = await Todo.findByIdAndUpdate(todoid, data, {
            new: true,
        });
        res.status(200).json({
            message: "Todo Update Success",
            todo: updatedTodo,
        });
    } catch (error) {
      return next(new CustomError(error.message, 500, false));
    }
};

const updateTodoStatus = async () => {
    try {
        let { todoid } = req.params;
        let data = req.body;
    } catch (error) {
      return next(new CustomError(error.message, 500, false));
    }
};

const deleteTodo = async (req, res) => {
    try {
        let { todoid } = req.params;

        let deletedTodo = await Todo.findByIdAndDelete(todoid);
        res.status(200).json({
            message: "Todo Deleted Success",
            todo: deletedTodo,
        });
    } catch (error) {
      return next(new CustomError(error.message, 500, false));
    }
};

module.exports = {
    createTodo,
    getAllTodos,
    updateTodo,
    deleteTodo,
    getSingleTodo,
};
