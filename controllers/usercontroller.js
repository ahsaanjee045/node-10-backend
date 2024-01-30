const User = require("../models/userSchema");
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");

const registerUser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        let formattedError = errors
            .array()
            .map((err) => err.msg)
            .join(" ");

        return res.status(400).json({
            message: errors.array()[0].msg,
        });
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
            return res.status(400).json({
                error: "User already registered. Please try with another email/username",
            });
        }

        // if not then register the user in database and return registerd user

        let hashedPassword = await bcrypt.hash(data.password, 10);

        let newUser = await new User({
            username: data.username,
            email: data.email,
            password: hashedPassword,
        }).save();

        if (!newUser) {
            return res.status(500).json({
                error: "Cannot create user at this time.",
            });
        }

        return res.status(201).json({
            message: "User Registered Successfully.",
            user: newUser,
        });
    } catch (error) {
        return res.status(500).json({
            error: error.message || "Something went wrong",
        });
    }
};

module.exports = {
    registerUser,
};
