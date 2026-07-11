const express = require('express');
const router = express.Router();
// const { register ,login} = require('../controllers/authController');
const { register, login, updateProfile } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');


router.post('/login', login);
router.put('/profile', protect, updateProfile);

router.post('/register', register);

module.exports = router;