class CustomAPIError extends Error {
    constructor(code, msg) {
        super(msg);
        this.code = code;
        
    }
}

module.exports = CustomAPIError;