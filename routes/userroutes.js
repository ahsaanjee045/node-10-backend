const express = require("express");
const { registerUser, loginUser, updateUser } = require("../controllers/usercontroller");

const { registerValidations } = require("../utils/validations");
const { verifyUser, verifyAdmin } = require("../middlewares/authMiddleware");
// ?username=john

const userRouter = express.Router();

// validation and sanitization

userRouter.post("/register", registerValidations, registerUser);
userRouter.post("/login", loginUser);
userRouter.put("/update/:userid", verifyUser, verifyAdmin, updateUser);
module.exports = userRouter;
