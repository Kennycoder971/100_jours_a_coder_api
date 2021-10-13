class ErrorResponse extends Error {
  constructor(message, statusCode, errName) {
    super(message);
    this.statusCode = statusCode;
    this.errName = errName;

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = ErrorResponse;
