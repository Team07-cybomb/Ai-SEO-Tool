const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
        
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    mobile: {
        type: String,
        required: false 
    },
    password: {
        type: String,
        required: false 
    },
    profilePicture: {
        type: String,
        required: false
    },
    githubId: {
        type: String,
        required: false,
        unique: true,
        sparse: true
    },
    googleId: { // Added for consistency
        type: String,
        required: false,
        unique: true,
        sparse: true
    }
});

// A pre-save hook that hashes the password before saving a user.
UserSchema.pre('save', async function(next) {
    if (!this.isModified('password') || !this.password) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

const User = mongoose.model('User', UserSchema);

module.exports = User;