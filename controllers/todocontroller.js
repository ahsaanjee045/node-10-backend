const Todo = require("../models/todoSchema");

const createTodo = async (req, res) => {
    try {
        let data = req.body;

        let newTodo = await Todo.create(data);

        res.status(201).json({
            message: "Todo Created successfully",
            todo: newTodo,
        });
    } catch (error) {
        res.status(500).json({
            error: error.message || "Something went wrong",
        });
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
const getSingleTodo = async (req, res) => {
    try {
        let {todoid} = req.params
        let doc = await Todo.findById(todoid);

        if(!doc){
            return res.status(404).json({
                error: "Todo not found!",
            });
        }
        res.status(200).json({
            todo: doc,
        });
    } catch (error) {
        res.status(500).json({
            error: error.message || "Something went wrong",
        });
    }
};

const updateTodo = async (req, res) => {
    try {
        let { todoid } = req.params;
        let data = req.body;
        let updatedTodo = await Todo.findByIdAndUpdate(todoid, data, {new : true})
        res.status(200).json({
            message : "Todo Update Success",
            todo : updatedTodo
        })

    } catch (error) {
        res.status(500).json({
            error: error.message || "Something went wrong",
        });
    }
};


const updateTodoStatus = async () => {
    try {
        let { todoid } = req.params;
        let data = req.body;

    } catch (error) {
        res.status(500).json({
            error: error.message || "Something went wrong",
        });
    }
}


const deleteTodo = async (req, res) => {
    try {
        let { todoid } = req.params;

        let deletedTodo = await Todo.findByIdAndDelete(todoid)
        res.status(200).json({
            message : "Todo Deleted Success",
            todo : deletedTodo
        })

    } catch (error) {
        res.status(500).json({
            error: error.message || "Something went wrong",
        });
    }
};

module.exports = {
    createTodo,
    getAllTodos,
    updateTodo,
    deleteTodo,
    getSingleTodo
};