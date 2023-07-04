const User = require("../models/User");
const {StatusCodes} = require("http-status-codes");
const CustomErrors = require("../errors");

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

const updateUser = (req, res)=>{
    res.send("updateUser")
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