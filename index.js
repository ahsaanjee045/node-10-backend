require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const todoRouter = require("./routes/todoroutes");
const connectDB = require("./db/connectDB");
const userRouter = require("./routes/userroutes");
const CustomError = require("./utils/CustomError");
const errorHandler = require("./middlewares/errorHandlingMiddleware");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.resolve("public")));

app.use("/todo", todoRouter);
app.use("/user", userRouter);

app.get("/", (req, res, next) => {
    
    res.status(200).json({
        message: "Server is up and running!",
    });
});

app.all("*", (req, res) => {
    res.status(404).json({
        message: `The page you are looking for could not be found : ${req.url}`,
    });
});

app.use(errorHandler);

let PORT = process.env.PORT || 5000;
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server started on PORT ${PORT}`);
    });
});
