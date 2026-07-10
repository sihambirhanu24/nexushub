const pool = require('../config/db');

exports.getResources = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM resources ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getResourceById = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query('SELECT * FROM resources WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Resource not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.createResource = async (req, res) => {
  const { resource_code, name, category, status } = req.body;

  try {
    const result = await pool.query(
      'INSERT INTO resources (resource_code, name, category, status) VALUES ($1, $2, $3, $4) RETURNING *',
      [resource_code, name, category, status || 'available']
    );

    res.status(201).json({ message: 'Resource created successfully', resource: result.rows[0] });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.updateResource = async (req, res) => {
  const { id } = req.params;
  const { name, category, status, assigned_to } = req.body;

  try {
    const result = await pool.query(
      'UPDATE resources SET name = $1, category = $2, status = $3, assigned_to = $4 WHERE id = $5 RETURNING *',
      [name, category, status, assigned_to, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Resource not found' });
    }

    res.json({ message: 'Resource updated successfully', resource: result.rows[0] });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.deleteResource = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query('DELETE FROM resources WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Resource not found' });
    }

    res.json({ message: 'Resource deleted successfully', resource: result.rows[0] });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};