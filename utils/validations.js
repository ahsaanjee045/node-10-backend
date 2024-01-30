const { query, body, param, header, check } = require("express-validator");

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

module.exports = {
    registerValidations,
};
