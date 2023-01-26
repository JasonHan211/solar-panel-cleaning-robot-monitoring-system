const mongoose = require('mongoose');

const UserSchema  = new mongoose.Schema({
    name: {
        type : String,
        required: true
    },
    email: {
        type : String,
        required: true
    },
    emailVerified: {
        type : Boolean,
        default: false
    },
    password: {
        type: String,
        required: true
    },
    referralCode: {
        type: String,
        required: true
    },
    lastPage: {
        type: String,
        required: false
    }
},{timestamps: true});

const User = mongoose.model('User',UserSchema);

module.exports = User;
