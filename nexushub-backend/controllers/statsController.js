const pool = require('../config/db');

exports.getStatistics = async (req, res) => {
  try {
    const [membersByDept, requestsByStatus, resourcesByCategory, membersByStatus] = await Promise.all([
      pool.query('SELECT department, COUNT(*) FROM users GROUP BY department'),
      pool.query('SELECT status, COUNT(*) FROM work_requests GROUP BY status'),
      pool.query('SELECT category, COUNT(*) FROM resources GROUP BY category'),
      pool.query('SELECT status, COUNT(*) FROM users GROUP BY status'),
    ]);

    res.json({
      membersByDepartment: membersByDept.rows,
      requestsByStatus: requestsByStatus.rows,
      resourcesByCategory: resourcesByCategory.rows,
      membersByStatus: membersByStatus.rows,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};