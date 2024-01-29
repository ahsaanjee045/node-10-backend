require("dotenv").config();
const express = require("express");
const cors = require("cors")
const path = require("path");
const todoRouter = require("./routes/todoroutes");
const connectDB = require("./db/connectDB");

const app = express();
const whitelist = ["https://www.google.com", "http://127.0.0.1:5500"]


app.use(cors({
    origin : function (origin, callback) {
        console.log(origin)
        if (whitelist.indexOf(origin) !== -1 || !origin) {
          callback(null, true)
        } else {
          callback(new Error('Not allowed by CORS'))
        }
      }
}))


app.use(express.json());
app.use(express.static(path.resolve("public")));

app.use("/todo", todoRouter);

app.get("/", (req, res) => {
    res.status(200).json({
        message: "Server is up and running!",
    });
});

app.all("*", (req, res) => {
    res.status(404).json({
        message: `The page you are looking for could not be found : ${req.url}`,
    });
});

let PORT = process.env.PORT || 5000;
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server started on PORT ${PORT}`);
    });
});
