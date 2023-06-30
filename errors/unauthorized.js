const {StatusCodes} = require("http-status-codes")

const CustomAPIError = require("./custom-api");

class UnauthorizedError extends CustomAPIError {
    constructor(msg){
        super(StatusCodes.UNAUTHORIZED, msg)
    }
}

module.exports = UnauthorizedError;