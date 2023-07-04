const CustomErrors = require("../errors");
const { isTokenValid } = require("../utils/jwt");

const authenticateUser = async (req, res, next)=>{
    const token = req.signedCookies.token;

    if (!token) {
        throw new CustomErrors.UnauthorizedError("No token");
    }

    try {
        const {userId, name, role} = isTokenValid({token});
        req.user = {userId, name, role};
        next();
    } catch (error) {
        throw new CustomErrors.UnauthorizedError("Authentication invalid");
    }
    
}

const authorizePermissions = (...roles)=>{
    return (req, res, next)=>{
        const {role} = req.user;
        if (!roles.includes(role)) {
            throw new CustomErrors.ForbiddenError("Admins only");
        }
        next();
    }
}

module.exports = {
    authenticateUser,
    authorizePermissions
};