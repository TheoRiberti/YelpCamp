class ExpressError extends Error {
  constructor(message, statusCode) {
    //calls the error superclass
    super();
    this.message = message;
    this.statusCode = statusCode;
  }
}

module.exports = ExpressError;
