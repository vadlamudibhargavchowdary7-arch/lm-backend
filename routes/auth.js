const router = require('express').Router();
const authController = require('../controllers/authController');

// AUTH ROUTES
router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/google-login', authController.googleLogin);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);

module.exports = router;
