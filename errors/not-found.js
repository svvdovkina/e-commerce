const {StatusCodes} = require("http-status-codes")

const CustomAPIError = require("./custom-api");

class NotFound extends CustomAPIError {
    constructor(msg){
        super(StatusCodes.NOT_FOUND, msg)
    }
}

module.exports = NotFound;
