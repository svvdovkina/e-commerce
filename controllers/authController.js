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

const login = async (req, res) =>{

    const {email, password} = req.body;

    if (!email || !password) {
        throw new CustomErrors.BadRequestError("Please provide email and password");
    }

    const user = await User.findOne({email});

    if (!user ) {
        throw new CustomErrors.UnauthorizedError("No user with given email found");
    }

    if (! await user.comparePassword(password)) {
        throw new CustomErrors.UnauthorizedError("Wrong password");
    }

    const tokenPayload = {
        userId: user._id, 
        name: user.name,
        role: user.role
    }
    
    attachCookiesToResponse({res, tokenPayload});

    res.status(StatusCodes.OK).json({user: tokenPayload});
}

const logout = (req, res) =>{
    res.cookie('token', '', {
        httpOnly: true,
        expires: new Date(Date.now()),
        secure: process.env.NODE_ENV === 'production',
        signed: true,
    });
    res.status(StatusCodes.OK).json({succsess: true})
}

module.exports = {
    register,
    login,
    logout
}