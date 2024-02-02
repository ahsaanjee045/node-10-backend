const User = require("../models/userSchema");
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");
const { loginSchema } = require("../utils/validations");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // let formattedError = errors
        //     .array()
        //     .map((err) => err.msg)
        //     .join(" ");
        return next(new CustomError(errors.array()[0].msg, 400, false));
    }

    try {
        let data = req.body;
        let userRegex = new RegExp("^" + data.username + "$");
        let emailRegex = new RegExp("^" + data.email + "$");

        let user = await User.findOne({
            $or: [
                {
                    username: {
                        $regex: userRegex,
                        $options: "i",
                    },
                },
                {
                    email: {
                        $regex: emailRegex,
                        $options: "i",
                    },
                },
            ],
        });

        if (user) {
            return next(
                new CustomError(
                    "User already registered. Please try with another email/username",
                    400,
                    false
                )
            );
        }

        let hashedPassword = await bcrypt.hash(data.password, 10);

        let newUser = await new User({
            username: data.username,
            email: data.email,
            password: hashedPassword,
        }).save();

        if (!newUser) {
            return next(
                new CustomError("Cannot create user at this time.", 400, false)
            );
        }

        return res.status(201).json({
            message: "User Registered Successfully.",
            user: newUser,
        });
    } catch (error) {
        new CustomError(error.message, 400, false);
    }
};

const loginUser = async (req, res, next) => {
    let data = req.body;
    const result = loginSchema.safeParse(data);
    if (!result.success) {
        let formattedError = Object.values(result.error.format())
            .filter((key) => !Array.isArray(key))
            .map((err) => err._errors)
            .flat(1)
            .join(", ");

        return res.status(400).json({
            error: formattedError || "Something went wrong",
        });
    }

    try {
        // check user in database

        let emailRegex = new RegExp("^" + data.email + "$");

        let user = await User.findOne({
            email: {
                $regex: emailRegex,
                $options: "i",
            },
        }).select("+password");

        if (!user) {
            return res.status(400).json({
                error: "Invalid Email/Password",
            });
        }

        let comparePassword = await bcrypt.compare(
            data.password,
            user.password
        );
        if (!comparePassword) {
            return res.status(400).json({
                error: "Invalid Email/Password",
            });
        }

        user = user.toObject();
        delete user.password;

        // token -> payload, signature, options -> expiresIn -> 3d
        let token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
            expiresIn: 20,
        });
        // cookies ->
        return res.status(200).json({
            message: "Logged in Successfully",
            user,
            token,
        });
    } catch (err) {
        return res.status(500).json({
            error: err.message || "Something went wrong",
        });
    }
};

const updateUser = async (req, res) => {};

module.exports = {
    registerUser,
    loginUser,
    updateUser,
};

// session based -> session will be mainted on server
// token based -> server will generate a jwt token
