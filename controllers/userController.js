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

const updateUserPassword = (req, res)=>{
    res.send("updateUserPassword")
}

module.exports = {
    getAllUsers,
    getSingleUser,
    showCurrentUser,
    updateUser,
    updateUserPassword
}