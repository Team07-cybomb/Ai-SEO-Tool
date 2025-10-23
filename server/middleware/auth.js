const jwt = require('jsonwebtoken');
const { tokenBlacklist } = require("../controllers/authController");
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;

const auth = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    // 🔹 Step 1: Check if token is blacklisted
    if (tokenBlacklist.includes(token)) {
        return res.status(401).json({ msg: 'Token has been logged out. Please log in again.' });
    }

    try {
        // Debugging log
      //  console.log('JWT_SECRET inside middleware:', JWT_SECRET);

        // 🔹 Step 2: Verify token
        const decoded = jwt.verify(token, JWT_SECRET);

        // 🔹 Step 3: Debug what's in the decoded token
       // console.log('Decoded token:', decoded);

        // 🔹 Step 4: Attach user info to request - FIXED
        // Make sure we're using the correct property name
        if (decoded.user && decoded.user.id) {
            req.user = { id: decoded.user.id };
        } else if (decoded.user && decoded.user._id) {
            req.user = { id: decoded.user._id };
        } else if (decoded.id) {
            req.user = { id: decoded.id };
        } else {
            return res.status(401).json({ msg: 'Invalid token structure' });
        }

      //  console.log('req.user set to:', req.user);
        next();
    } catch (e) {
        console.error('Token validation failed:', e.message);
        res.status(401).json({ msg: 'Token is not valid' });
    }
};

module.exports = auth;