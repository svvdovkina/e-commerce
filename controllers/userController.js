const getAllUsers = (req, res)=>{
    res.send("getAllUsers")
}

const getSingleUser = (req, res)=>{
    res.send("getSingleUser")
}

const showCurrentUser = (req, res)=>{
    res.send("showCurrentUser")
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