const { query, body, param, header, check } = require("express-validator");
const { z } = require("zod");

const registerValidations = [
  body("username")
    .trim()
    .notEmpty()
    .withMessage("Username is a required field.")
    .isLength({
      min: 6,
      max: 60,
    })
    .withMessage("Username must be between 6 and 60 characters long."),
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is a required field.")
    .isEmail()
    .withMessage("Email must be in a valid format"),
  body("password")
    .trim()
    .notEmpty()
    .withMessage("Password is a required field."),
];

const loginSchema = z.object({
  email: z
    .string("Email must be a string")
    .trim()
    .min(1, "Email must contain atleast one character")
    .email("Email must be in a valid format."),
  password: z
    .string("Password must be a string")
    .trim()
    .min(1, "Password must contain atleast one character"),
});

module.exports = {
  registerValidations,
  loginSchema,
};
