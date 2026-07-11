const pool = require('../config/db');

exports.globalSearch = async (req, res) => {
  const { q } = req.query;

  if (!q || q.trim() === '') {
    return res.json({ members: [], requests: [], resources: [] });
  }

  const searchTerm = `%${q}%`;

  try {
    const [members, requests, resources] = await Promise.all([
      pool.query(
        `SELECT id, name, email, role, department FROM users 
         WHERE name ILIKE $1 OR email ILIKE $1 LIMIT 5`,
        [searchTerm]
      ),
      pool.query(
        `SELECT id, request_number, title, status FROM work_requests 
         WHERE title ILIKE $1 OR request_number ILIKE $1 LIMIT 5`,
        [searchTerm]
      ),
      pool.query(
        `SELECT id, resource_code, name, category FROM resources 
         WHERE name ILIKE $1 OR resource_code ILIKE $1 LIMIT 5`,
        [searchTerm]
      ),
    ]);

    res.json({
      members: members.rows,
      requests: requests.rows,
      resources: resources.rows,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};