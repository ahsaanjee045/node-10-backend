const express = require("express");
const { registerUser, loginUser } = require("../controllers/usercontroller");

const { registerValidations } = require("../utils/validations");
// ?username=john

const userRouter = express.Router();

// validation and sanitization

userRouter.post("/register", registerValidations, registerUser);
userRouter.post("/login", loginUser);
module.exports = userRouter;
