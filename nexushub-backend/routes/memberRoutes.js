const express = require('express');
const router = express.Router();
const { getMembers, addMember, getMemberById ,updateMember, deleteMember} = require('../controllers/memberController');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const bcrypt = require('bcrypt');
const generateTempPassword = require('../utils/generatePassword');
const sendWelcomeEmail = require('../utils/sendEmail');


router.post('/', protect, adminOnly, addMember);
router.post('/members', authMiddleware, adminOnly, async (req, res) => {
  try {
    const { name, email, role, department } = req.body;

    if (!name || !email) {
      return res.status(400).json({ message: 'Name and email are required' });
    }

    const tempPassword = generateTempPassword();
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    const result = await pool.query(
      `INSERT INTO users (name, email, password, role, department, must_change_password)
       VALUES ($1, $2, $3, $4, $5, true)
       RETURNING id, name, email, role, department, status, created_at`,
      [name, email, hashedPassword, role || 'staff', department]
    );

    // Send the plaintext password only via email — never stored or returned to the admin
    await sendWelcomeEmail(email, name, tempPassword);

    res.status(201).json(result.rows[0]);
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({ message: 'Email already in use' });
    }
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});
router.get('/', protect, getMembers);
router.get('/:id', protect, getMemberById);
router.put('/:id', protect, adminOnly, updateMember);
router.delete('/:id', protect, adminOnly, deleteMember);

module.exports = router;