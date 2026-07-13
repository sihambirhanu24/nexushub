const pool = require('../config/db');

exports.createRequest = async (req, res) => {
  const { title, description, type, priority } = req.body;

  try {
    const maxResult = await pool.query(
      "SELECT MAX(CAST(SUBSTRING(request_number FROM 5) AS INTEGER)) as max_num FROM work_requests"
    );
    const maxNum = maxResult.rows[0].max_num || 0;
    const requestNumber = `REQ-${String(maxNum + 1).padStart(4, '0')}`;

    const result = await pool.query(
      `INSERT INTO work_requests (request_number, title, description, type, status, priority, requested_by) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) 
       RETURNING *`,
      [requestNumber, title, description, type, 'pending', priority, req.user.id]
    );

    res.status(201).json({ 
      message: 'Work request created successfully', 
      request: result.rows[0] 
    });
  } catch (err) {
    console.error('createRequest error:', err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getRequests = async (req, res) => {
  try {
    let query = `SELECT work_requests.*, users.name AS requested_by_name
       FROM work_requests
       JOIN users ON work_requests.requested_by = users.id`;
    let params = [];

    if (req.user.role === 'staff') {
      query += ' WHERE work_requests.requested_by = $1';
      params.push(req.user.id);
    }

    query += ' ORDER BY work_requests.created_at DESC';

    const result = await pool.query(query, params);
    res.json({ requests: result.rows });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getRequestById = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `SELECT work_requests.*, users.name AS requested_by_name
       FROM work_requests
       JOIN users ON work_requests.requested_by = users.id
       WHERE work_requests.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Request not found' });
    }

    res.json({ request: result.rows[0] });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.updateRequest = async (req, res) => {
  const { id } = req.params;
  const { title, description, type, status, priority, assigned_to } = req.body;

  try {
    const result = await pool.query(
      `UPDATE work_requests 
       SET title = $1, description = $2, type = $3, status = $4, priority = $5, assigned_to = $6, updated_at = NOW() 
       WHERE id = $7 
       RETURNING *`,
      [title, description, type, status, priority, assigned_to, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Request not found' });
    }

    res.json({ message: 'Request updated successfully', request: result.rows[0] });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.deleteRequest = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query('DELETE FROM work_requests WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Request not found' });
    }

    res.json({ message: 'Request deleted successfully', request: result.rows[0] });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};