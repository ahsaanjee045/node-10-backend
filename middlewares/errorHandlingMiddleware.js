const errorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Something went wrong";

    if (err.name === "JsonWebTokenError") {
        err.message = "Invalid JSON Web Token";
    } else if (err.name === "TokenExpiredError") {
        err.message =
            "JWT Token is expired. Please login again to generate a new token.";
    }
    //    validation error
    else if (err.name === "CastError") {
        console.log(err)
        err.message =
            "JWT Token is expired. Please login again to generate a new token.";
    } else if (err.name === "ValidationError") {
        err.message =
            "JWT Token is expired. Please login again to generate a new token.";
    } else if (err.code === 11000) {
        err.message =
            "JWT Token is expired. Please login again to generate a new token.";
    }

    // mongoose error

    return res
        .status(err.statusCode)
        .json({ error: err.message, success: err.success, stack: err.stack });
};

module.exports = errorHandler;
