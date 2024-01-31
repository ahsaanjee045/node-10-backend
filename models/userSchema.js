const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is a required field"],
      trim: true,
      minLength: [6, "Username must be at least 6 characters long"],
      maxLength: [60, "Username must be at most 60 characters long"],
      unique: [true, "Username must be unique"],
    },
    email: {
      type: String,
      required: [true, "Email is a required field"],
      unique: [true, "Email must be unique"],
      lowercase: true,
      trim: true,
      validate: {
        validator: function (value) {
          return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value);
        },
        message: "Email is not in a valid format.",
      },
    },
    password: {
      type: String,
      required: [true, "Password is a required field"],
      trim: true,
      select: false,
    },
    role: {
      type: String,
      enum: {
        values: ["user", "admin", "superadmin"],
        message: "Role must be user, admin or superadmin",
      },
      default: "user",
    },
  },
  {
    timestamps: true,
  },
);

const User = mongoose.model("User", userSchema);

module.exports = User;
