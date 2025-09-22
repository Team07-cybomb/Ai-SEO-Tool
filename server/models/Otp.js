// models/Otp.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const OtpSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    otp: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 600, // OTP expires after 600 seconds (10 minutes)
    },
});

// Hash the OTP before saving to the database
OtpSchema.pre('save', async function(next) {
    if (this.isModified('otp')) {
        const salt = await bcrypt.genSalt(10);
        this.otp = await bcrypt.hash(this.otp, salt);
    }
    next();
});

const Otp = mongoose.models.Otp || mongoose.model('Otp', OtpSchema);

module.exports = Otp;