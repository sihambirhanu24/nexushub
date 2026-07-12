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
exports.getDepartmentStats = async (req, res) => {
  const department = req.user.department;

  if (!department) {
    return res.status(400).json({ message: 'No department assigned to this user' });
  }

  try {
    const [members, requests, activeMembers] = await Promise.all([
      pool.query(
        'SELECT COUNT(*) FROM users WHERE department = $1',
        [department]
      ),
      pool.query(
        `SELECT status, COUNT(*) FROM work_requests 
         JOIN users ON work_requests.requested_by = users.id 
         WHERE users.department = $1 
         GROUP BY status`,
        [department]
      ),
      pool.query(
        `SELECT COUNT(*) FROM users WHERE department = $1 AND status = 'active'`,
        [department]
      ),
    ]);

    res.json({
      department,
      totalMembers: members.rows[0].count,
      activeMembers: activeMembers.rows[0].count,
      requestsByStatus: requests.rows,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};