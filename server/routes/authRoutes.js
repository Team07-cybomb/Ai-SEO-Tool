const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/auth');

router.post('/signup', authController.signup);
router.post('/signup/verify-otp', authController.verifyOtpAndSignup);
router.post('/login', authController.login);
router.get('/profile', authMiddleware, authController.getProfile);
router.get('/auth/google', authController.googleAuth);
router.get('/auth/google/callback', authController.googleCallback);
router.get('/auth/github', authController.githubAuth);
router.get('/auth/github/callback', authController.githubCallback);
router.post('/logout', authController.logoutUser);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);

module.exports = router;