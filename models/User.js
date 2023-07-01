const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require('bcryptjs');

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
        unique: true,
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

UserSchema.pre('save', async function() {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);

});

UserSchema.methods.comparePassword = async function (candidatePassword){
    return await bcrypt.compare(candidatePassword, this.password);
}

module.exports = mongoose.model('User', UserSchema);