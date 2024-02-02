class CustomError extends Error {
    constructor(message, statusCode, success) {
        super(message);
        this.statusCode = statusCode;
        this.success = success;

        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = CustomError
