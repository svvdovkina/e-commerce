const mongoose = require("mongoose");
const validator = require("validator");

const UserSchema = new mongoose.Schema({
    name:{
        type: String,
        maxlength: 20,
        minlength: 3,
        required : [true, "Please provide name"]
    },
    email:{
        type: String,
        required : [true, "Please provide email"],
        validate: {
            validator: validator.isEmail,
            message: 'Please provide valid email'
        }
    },
    password:{
        type: String,
        maxlength: 30,
        minlength: 5,
        required : [true, "Please provide password"]
    },
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user'
    }

});

module.exports = mongoose.model('User', UserSchema);