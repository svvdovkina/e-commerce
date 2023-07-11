const User = require("../models/User");
const {StatusCodes} = require("http-status-codes");
const CustomErrors = require("../errors")
const {attachCookiesToResponse} = require("../utils/jwt");
const crypto = require("crypto");

const register = async (req, res) =>{

    const {email, name, password} = req.body;

    const emailExists = await User.findOne({email});
    if (emailExists) {
        throw new CustomErrors.BadRequestError("Email already exists");
    }

    const verificationToken = crypto.randomBytes(40).toString('hex');
    const user = await User.create({email, name, password, verificationToken} );
   

    res.status(StatusCodes.CREATED).json({msg: 'Success! Please check your email to verity the account', token: user.verificationToken});
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


    if (!user.isVerified) {
        throw new CustomErrors.UnauthorizedError("Please verify your email");
    }


    const tokenPayload = {
        userId: user._id, 
        name: user.name,
        role: user.role
    }
    
    attachCookiesToResponse({res, tokenPayload});

    res.status(StatusCodes.OK).json({user: tokenPayload});
}

const verifyEmail = async (req, res)=>{
    const {verificationToken, email} = req.body;

    const user = await User.findOne({email});

    if (!user ) {
        throw new CustomErrors.UnauthorizedError("No user with given email found");
    }

    if (user.verificationToken !== verificationToken) {
        throw new CustomErrors.UnauthorizedError("Bad verification token");
    }

    user.isVerified = true;
    user.verified = Date.now();
    user.verificationToken = '';

    await user.save();

    res.status(StatusCodes.OK).json({msg: "Email verified"})
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
    logout,
    verifyEmail
}