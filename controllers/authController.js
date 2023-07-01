const User = require("../models/User");
const {StatusCodes} = require("http-status-codes");
const CustomErrors = require("../errors")
const {attachCookiesToResponse} = require("../utils/jwt");

const register = async (req, res) =>{

    const {email, name, password} = req.body;

    const emailExists = await User.findOne({email});
    if (emailExists) {
        throw new CustomErrors.BadRequestError("Email already exists");
    }

    const user = await User.create({email, name, password} );

    const tokenPayload = {
        userId: user._id, 
        name: user.name,
        role: user.role
    }
    
    attachCookiesToResponse({res, tokenPayload});

    res.status(StatusCodes.CREATED).json({user: tokenPayload});
}

const login = (req, res) =>{
    res.send('login');
}

const logout = (req, res) =>{
    res.send('logout');
}

module.exports = {
    register,
    login,
    logout
}