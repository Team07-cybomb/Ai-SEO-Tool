const jwt = require('jsonwebtoken');
require('dotenv').config();

// The JWT_SECRET must be defined here, as this file
// is executed independently when required by server.js
const JWT_SECRET = process.env.JWT_SECRET

const auth = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }
    try {
        // Add a console.log to confirm the value right before use
        console.log('JWT_SECRET inside middleware:', JWT_SECRET);
        
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded.user;
        next();
    } catch (e) {
        console.error('Token validation failed:', e.message);
        res.status(401).json({ msg: 'Token is not valid' });
    }
};

module.exports = auth;