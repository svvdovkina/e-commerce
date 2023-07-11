const express = require("express");

const {register, login, logout, verifyEmail} = require("../controllers/authController")

const router = express.Router();

router.route("/register").post(register);

router.route("/login").get(login).post(login);

router.route("/logout").post(logout);

router.route("/verify-email").post(verifyEmail);


module.exports = router;