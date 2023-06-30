const { StatusCodes } = require('http-status-codes');

const errorHandler = (err, req, res, next)=>{
    const customError = {
        code: err.code || StatusCodes.INTERNAL_SERVER_ERROR,
        msg: err.msg || "Something went wrong"
    }

    return res.status(customError.code).json({msg: customError.msg});
}

module.exports = errorHandler