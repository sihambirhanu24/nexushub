const pool = require('../config/db');
const bcrypt = require('bcryptjs');

exports.getMembers = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, name, email, role, department, status, created_at FROM users ORDER BY created_at DESC'
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
exports.addMember = async (req, res) => {
  const { name, email, password, role, department } = req.body;

  try {
    const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

    if (existingUser.rows.length > 0) {
      return res.status(400).json({ message: 'A member with this email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      'INSERT INTO users (name, email, password, role, department) VALUES ($1, $2, $3, $4, $5) RETURNING id, name, email, role, department, status, created_at',
      [name, email, hashedPassword, role, department]
    );

    res.status(201).json({ message: 'Member added successfully', member: result.rows[0] });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
exports.getMemberById = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      'SELECT id, name, email, role, department, status, created_at FROM users WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Member not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
exports.updateMember = async (req, res) => {
  const { id } = req.params;
  const { name, email, role, department, status } = req.body;

  try {
    const result = await pool.query(
      `UPDATE users 
       SET name = $1, email = $2, role = $3, department = $4, status = $5 
       WHERE id = $6 
       RETURNING id, name, email, role, department, status, created_at`,
      [name, email, role, department, status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Member not found' });
    }

    res.json({ message: 'Member updated successfully', member: result.rows[0] });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
exports.deleteMember = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING id', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Member not found' });
    }

    res.json({ message: 'Member deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};