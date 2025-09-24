const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const path = require('path');
const nodemailer = require('nodemailer');
const otpGenerator = require('otp-generator');
 
// Load environment variables
require('dotenv').config({ path: path.resolve(__dirname, '../../.env.local') });
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
 
const JWT_SECRET = process.env.JWT_SECRET;
const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const CLIENT_URL = process.env.CLIENT_URL;
 
const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_PORT = process.env.SMTP_PORT;
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
 
const GITHUB_REDIRECT_URI = `${process.env.API_URL}/api/auth/github/callback`;
const GOOGLE_REDIRECT_URI = `${process.env.API_URL}/api/auth/google/callback`;
 
let tokenBlacklist = [];
 
// Nodemailer transporter
const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: true,
    auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
    },
});
 
// Function to send OTP email
const sendOtpEmail = async (email, otp, name) => {
    try {
        const mailOptions = {
            from: `"RankSeo.in" <${SMTP_USER}>`,
            to: email,
            subject: 'Your OTP for Verification',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
                    <h2 style="text-align: center; color: #10B981;">OTP Verification</h2>
                    <p style="font-size: 16px;">Hi, </p>
                    <p style="font-size: 16px;">Your One-Time Password (OTP) for verification is:</p>
                    <h1 style="text-align: center; font-size: 36px; color: #10B981; letter-spacing: 5px;">${otp}</h1>
                    <p style="font-size: 14px; color: #666;">This OTP is valid for 10 minutes. Do not share it with anyone.</p>
                    <hr style="margin-top: 20px; border-color: #ddd;">
                    <p style="text-align: center; font-size: 12px; color: #aaa;">Thank you!</p>
                </div>
            `,
        };
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error('Error sending OTP email:', error);
        throw new Error('Failed to send OTP email.');
    }
};
 
const signup = async (req, res) => {
    const { name, email, mobile, password } = req.body;
    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }
 
        const otp = otpGenerator.generate(6, { digits: true, lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false });
        const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
 
        user = new User({
            name,
            email,
            mobile,
            password,
            otp,
            otpExpiresAt,
        });
 
        await user.save();
        await sendOtpEmail(email, otp);
 
        res.status(201).json({ msg: 'OTP sent to your email. Please verify to complete signup.' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};
 
const verifyOtpAndSignup = async (req, res) => {
    const { email, otp } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'User not found.' });
        }
        if (user.otp !== otp || user.otpExpiresAt < Date.now()) {
            return res.status(400).json({ msg: 'Invalid or expired OTP.' });
        }
 
        // OTP is correct, save the user with a hashed password
        user.isVerified = true;
        user.otp = null;
        user.otpExpiresAt = null;
 
        await user.save();
 
        const token = jwt.sign(
            { user: { id: user._id, role: user.role || "user" } },
            JWT_SECRET,
            { expiresIn: "1d" }
        );
 
        res.status(200).json({ msg: 'Email verified and signup successful!', token });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};
 
const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ msg: 'Invalid credentials' });
        if (!user.password) return res.status(400).json({ msg: 'Please log in with your social provider.' });
       
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });
 
        const token = jwt.sign(
            { user: { id: user._id, role: user.role || "user" } },
            JWT_SECRET,
            { expiresIn: "1d" }
        );
 
        res.json({ token });
    } catch (err) {
        console.error('Server error during login:', err.message);
        res.status(500).send('Server error');
    }
};
 
const forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ msg: 'No user found with that email.' });
        }
 
        const otp = otpGenerator.generate(6, { digits: true, lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false });
        const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
 
        user.otp = otp;
        user.otpExpiresAt = otpExpiresAt;
        await user.save();
       
        await sendOtpEmail(email, otp);
 
        res.status(200).json({ msg: 'OTP sent to your email for password reset.' });
    } catch (err) {
        console.error('Server error during forgot password:', err.message);
        res.status(500).send('Server error');
    }
};
 
const resetPassword = async (req, res) => {
    const { email, otp, newPassword } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ msg: 'User not found.' });
        }
 
        if (user.otp !== otp || user.otpExpiresAt < Date.now()) {
            return res.status(400).json({ msg: 'Invalid or expired OTP.' });
        }
 
        // Hash the new password and update the user document atomically
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);
 
        // Find the user again and update all fields in a single query
        await User.findOneAndUpdate(
            { email: email },
            {
                $set: {
                    password: hashedPassword,
                    otp: null,
                    otpExpiresAt: null,
                },
            },
            { new: true }
        );
 
        res.status(200).json({ msg: 'Password has been successfully reset.' });
    } catch (err) {
        console.error('Server error during password reset:', err.message);
        res.status(500).send('Server error');
    }
};
 
 
const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};
 
const logoutUser = (req, res) => {
    const token = req.headers["authorization"]?.split(" ")[1];
    if (token) {
        tokenBlacklist.push(token);
    }
    res.json({ msg: "Logged out successfully" });
};
 
const githubAuth = (req, res) => {
    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${GITHUB_REDIRECT_URI}&scope=user:email`;
    res.redirect(githubAuthUrl);
};
 
const githubCallback = async (req, res) => {
    const { code } = req.query;
    try {
        const tokenResponse = await axios.post(
            'https://github.com/login/oauth/access_token',
            {
                client_id: GITHUB_CLIENT_ID,
                client_secret: GITHUB_CLIENT_SECRET,
                code,
                redirect_uri: GITHUB_REDIRECT_URI,
            },
            { headers: { Accept: 'application/json' } }
        );
 
        const { access_token } = tokenResponse.data;
        const userResponse = await axios.get('https://api.github.com/user', {
            headers: { Authorization: `Bearer ${access_token}` }
        });
 
        const githubUser = userResponse.data;
        const emailResponse = await axios.get('https://api.github.com/user/emails', {
            headers: { Authorization: `Bearer ${access_token}` }
        });
 
        const primaryEmailObj = emailResponse.data.find(emailObj => emailObj.primary && emailObj.verified);
        const email = primaryEmailObj ? primaryEmailObj.email : null;
        if (!email) return res.status(400).send('No primary, verified email found for GitHub user.');
 
        const user = await User.findOneAndUpdate(
            { githubId: githubUser.id },
            {
                githubId: githubUser.id,
                name: githubUser.name || githubUser.login,
                profilePicture: githubUser.avatar_url,
                password: null,
            },
            { new: true, upsert: true, setDefaultsOnInsert: true }
        );
 
        const token = jwt.sign(
            { user: { id: user._id, role: user.role || "user" } },
            JWT_SECRET,
            { expiresIn: "1d" }
        );
 
        res.redirect(`${CLIENT_URL}/profile?token=${token}`);
    } catch (err) {
        console.error("Server error during GitHub auth:", err.response ? err.response.data : err.message);
        res.status(500).send('Server error during GitHub auth');
    }
};
 
const googleAuth = (req, res) => {
    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${GOOGLE_REDIRECT_URI}&response_type=code&scope=https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile`;
    res.redirect(googleAuthUrl);
};
 
const googleCallback = async (req, res) => {
    const { code } = req.query;
    try {
        const tokenResponse = await axios.post('https://oauth2.googleapis.com/token', {
            client_id: GOOGLE_CLIENT_ID,
            client_secret: GOOGLE_CLIENT_SECRET,
            code,
            redirect_uri: GOOGLE_REDIRECT_URI,
            grant_type: 'authorization_code'
        });
 
        const { access_token } = tokenResponse.data;
        const userResponse = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
            headers: { Authorization: `Bearer ${access_token}` }
        });
 
        const googleUser = userResponse.data;
        let user = await User.findOne({ googleId: googleUser.sub });
 
        if (!user) {
            user = await User.findOne({ email: googleUser.email });
            if (user) {
                user.googleId = googleUser.sub;
                await user.save();
            } else {
                user = new User({
                    name: googleUser.name,
                    email: googleUser.email,
                    profilePicture: googleUser.picture,
                    googleId: googleUser.sub,
                    password: null,
                });
                await user.save();
            }
        }
 
        const token = jwt.sign(
            { user: { id: user._id, role: user.role || "user" } },
            JWT_SECRET,
            { expiresIn: "1d" }
        );
 
        res.redirect(`${CLIENT_URL}/profile?token=${token}`);
    } catch (err) {
        console.error("Server error during Google auth:", err);
        res.status(500).send('Server error during Google auth');
    }
};
 
module.exports = {
    signup,
    verifyOtpAndSignup,
    login,
    forgotPassword,
    resetPassword,
    getProfile,
    logoutUser,
    githubAuth,
    githubCallback,
    googleAuth,
    googleCallback,
    tokenBlacklist
};