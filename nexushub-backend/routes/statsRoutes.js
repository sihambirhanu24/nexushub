const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getStatistics, getDashboardCounts, getDepartmentStats } = require('../controllers/statsController');
router.get('/department', protect, getDepartmentStats);
router.get('/', protect, getStatistics);

module.exports = router;