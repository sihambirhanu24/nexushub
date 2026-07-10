const express = require('express');
const router = express.Router();
const { getStatistics } = require('../controllers/statsController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getStatistics);

module.exports = router;