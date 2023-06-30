const {StatusCodes} = require("http-status-codes")

const CustomAPIError = require("./custom-api");

class BadRequestError extends CustomAPIError {
    constructor(msg){
        super(StatusCodes.BAD_REQUEST, msg)
    }
}

module.exports = BadRequestError;
