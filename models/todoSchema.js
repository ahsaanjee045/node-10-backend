const mongoose = require("mongoose");

const todoSchema = new mongoose.Schema({
    task: {
        type : String,
        required : [true, "Task is a required field"],
        trim : true,
    },
    completed: {
        type : Boolean,
        default : false
    },
    
});

const Todo = mongoose.model("Todo", todoSchema);

module.exports = Todo
