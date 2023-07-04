const {StatusCodes} = require("http-status-codes")

const CustomAPIError = require("./custom-api");

class UnauthorizedError extends CustomAPIError {
    constructor(msg){
        super(StatusCodes.UNAUTHORIZED, msg)
    }
}
class ForbiddenError extends CustomAPIError {
    constructor(msg){
        super(StatusCodes.FORBIDDEN, msg)
    }
}

module.exports = {
    UnauthorizedError,
    ForbiddenError
};