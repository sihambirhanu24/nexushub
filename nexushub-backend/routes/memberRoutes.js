const express = require('express');
const router = express.Router();
const { getMembers, addMember, getMemberById ,updateMember, deleteMember} = require('../controllers/memberController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.post('/', protect, adminOnly, addMember);
router.get('/', protect, getMembers);
router.get('/:id', protect, getMemberById);
router.put('/:id', protect, adminOnly, updateMember);
router.delete('/:id', protect, adminOnly, deleteMember);

module.exports = router;