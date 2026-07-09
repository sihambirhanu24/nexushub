const express = require('express');
const router = express.Router();
const { createRequest, getRequests, getRequestById, updateRequest, deleteRequest } = require('../controllers/requestController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, createRequest);
router.get('/', protect, getRequests);
router.get('/:id', protect, getRequestById);
router.put('/:id', protect, updateRequest);
router.delete('/:id', protect, deleteRequest);

module.exports = router;