const User = require("../models/User");
const {StatusCodes} = require("http-status-codes");
const CustomErrors = require("../errors");
const {attachCookiesToResponse} = require("../utils")

const getAllUsers = async (req, res)=>{
    let users = await User.find({role: "user"}).select("-password");

    res.status(StatusCodes.OK).json(users)
}

const getSingleUser = async (req, res)=>{

    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
        throw new CustomErrors.NotFound("Wrong user id");
    }
    res.status(StatusCodes.OK).json(user)
}

const showCurrentUser = (req, res)=>{
    const user = req.user;

    res.status(StatusCodes.OK).json({user});
}

const updateUser = async (req, res)=>{
    const {name, email} = req.body;

    if (!email || !name) {
        throw new CustomErrors.BadRequestError("Please provide email and name");
    }
    const userId = req.user.userId;

    const user = await User.findByIdAndUpdate(
        userId, 
        {name, email}, 
        {new: true, runValidators: true}
        );

    const tokenPayload = {
        userId: user._id, 
        name: user.name,
        role: user.role
    }
    
    attachCookiesToResponse({res, tokenPayload});

    res.status(StatusCodes.OK).json({user: {...tokenPayload, email}});

}

const updateUserPassword = async (req, res)=>{
    const {oldPassword, newPassword} = req.body;
    if (!oldPassword || ! newPassword) {
        throw new CustomErrors.BadRequestError("Please provide old and new passwords");
    }
    const user = await User.findById(req.user.userId);
    if (!user) {
        throw new CustomErrors.UnauthorizedError("Nonexisting user")
    }
    if (!await user.comparePassword(oldPassword)) {
        throw new CustomErrors.UnauthorizedError("Wrong old password");
    }
    user.password = newPassword;
    await user.save();

    res.status(StatusCodes.OK).json({msg: 'Password updated'});
}

module.exports = {
    getAllUsers,
    getSingleUser,
    showCurrentUser,
    updateUser,
    updateUserPassword
}