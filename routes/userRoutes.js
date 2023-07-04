const express = require("express");
const {getAllUsers, getSingleUser, showCurrentUser, updateUser, updateUserPassword} = require("../controllers/userController")
const {authorizePermissions} = require("../middleware/authentication");

const router = express.Router();

router.route("/").get(authorizePermissions("admin", "owner"), getAllUsers);

router.route('/showMe').get(showCurrentUser);

router.route('/updateUser').patch(updateUser);

router.route('/updateUserPassword').patch(updateUserPassword);

router.route('/:id').get(getSingleUser);


module.exports = router