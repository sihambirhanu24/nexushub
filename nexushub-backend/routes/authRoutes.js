const express = require('express');
const router = express.Router();
const {  login, updateProfile, changePassword, getProfile } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');


router.post('/login', login);
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.put('/change-password', protect, changePassword);

module.exports = router;