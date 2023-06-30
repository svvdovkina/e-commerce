const CustomAPIError = require("./custom-api");
const BadRequestError = require("./bad-request");
const UnauthorizedError = require("./unauthorized");
const NotFound = require("./not-found");

module.exports = {
    CustomAPIError,
    BadRequestError,
    UnauthorizedError,
    NotFound
}