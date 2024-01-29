const mongoose = require("mongoose");

async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MONGODB");
    } catch (error) {
        console.log("Error connecting to Database", error.message);
        process.exit(1);
    }
}

module.exports = connectDB;
