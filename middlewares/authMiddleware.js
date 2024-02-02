const jwt = require("jsonwebtoken");
const User = require("../models/userSchema");

const verifyUser = async (req, res, next) => {
    try {
        let header = req.headers.authorization;
        if (!header) {
            // next("No header provided")
            return res.status(401).json({
                error: "No header provided.",
            });
        }

        let token = header.split(" ")[1];

        if (!token) {
            return res.status(401).json({
                error: "No Token provided.",
            });
        }
        // check if this token exists in invalid token collections

        let decoded = jwt.verify(token, process.env.JWT_SECRET);

        let user;
        if (decoded._id) {
            user = await User.findById(decoded._id);
        }

        if (!user) {
            // save this token in invalid tokens collection
            return res.status(401).json({
                error: "No User Available with this token.",
            });
        }

        req.user = user;

        next();
    } catch (error) {
        

        return res.status(500).json({
            error: error.message || "Something went wrong",
        });
    }
};

const verifyAdmin = async (req, res, next) => {
    try {
        let user = req.user;
        console.log(user);
        if (user.role === "user") {
            return res.status(403).json({
                error: "You do not have permission to access this resource.",
            });
        }

        next();
    } catch (error) {
        return res.status(500).json({
            error: error.message || "Something went wrong",
        });
    }
};

module.exports = { verifyUser, verifyAdmin };
