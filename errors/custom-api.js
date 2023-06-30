class CustomAPIError extends Error {
    constructor(code, msg) {
        this.code = code;
        super(msg);
    }
}

module.exports = CustomAPIError;