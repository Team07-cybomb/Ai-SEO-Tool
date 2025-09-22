const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: path.resolve(__dirname, '../../.env.local') });

const JWT_SECRET = process.env.JWT_SECRET;
const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const NEXT_PUBLIC_CLIENT_URL = process.env.NEXT_PUBLIC_CLIENT_URL;

const GITHUB_REDIRECT_URI = `${process.env.NEXT_PUBLIC_API_URL}/api/auth/github/callback`;
const GOOGLE_REDIRECT_URI = `${process.env.NEXT_PUBLIC_API_URL}/api/auth/google/callback`;

let tokenBlacklist = [];
const signup = async (req, res) => {
    const { name, email, mobile, password } = req.body;
    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }
        user = new User({ name, email, mobile, password });
        await user.save();
        res.status(201).json({ msg: 'User registered successfully' });
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

        // ✅ Fix JWT to include id + role
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

        // ✅ Fix JWT for GitHub auth
        const token = jwt.sign(
            { user: { id: user._id, role: user.role || "user" } },
            JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.redirect(`${NEXT_PUBLIC_CLIENT_URL}/profile?token=${token}`);
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

        // ✅ Fix JWT for Google auth
        const token = jwt.sign(
            { user: { id: user._id, role: user.role || "user" } },
            JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.redirect(`${NEXT_PUBLIC_CLIENT_URL}/profile?token=${token}`);
    } catch (err) {
        console.error("Server error during Google auth:", err);
        res.status(500).send('Server error during Google auth');
    }
};

module.exports = {
    signup,
    login,
    getProfile,
    logoutUser,
    githubAuth,
    githubCallback,
    googleAuth,
    googleCallback,
    tokenBlacklist
};
