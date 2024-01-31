const User = require("../models/userSchema");
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");
const { loginSchema } = require("../utils/validations");
const jwt = require("jsonwebtoken");

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
        error:
          "User already registered. Please try with another email/username",
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

const loginUser = async (req, res) => {
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

    let comparePassword = await bcrypt.compare(data.password, user.password);
    if (!comparePassword) {
      return res.status(400).json({
        error: "Invalid Email/Password",
      });
    }

    user = user.toObject();
    delete user.password;

    // token -> payload, signature, options -> expiresIn -> 3d
    let token = jwt.sign({ _id: user._id }, "thisisasecret", {
      expiresIn: "3d",
    });

    return res.status(200).json({
      message: "Logged in Successfully",
      user,
      token,
    });
  } catch (err) {
    return res.status(500).json({
      error: error.message || "Something went wrong",
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
};

// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NWI4YTFlZGI0OTRiZmFlNjRmMTgxZjQiLCJ1c2VybmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNzA2Njg0MTUyLCJleHAiOjE3MDY5NDMzNTJ9.iaSdlBmqdUXgZmszkgK3Ff6ap8HQ-G-gU_X9dc8UF3A

// original token + eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NWI4YTFlZGI0OTRiZmFlNjRmMTgxZjQiLCJpYXQiOjE3MDY2ODQxNTIsImV4cCI6MTcwNjk0MzM1Mn0.R2C4wmoSBjpJaJTx2fpZHo1urCBMkOMk7LL5mNEQ8S4
