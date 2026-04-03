const pool = require('./pool');

async function getUserByEmail(email) {
  const [rows] = await pool.execute('SELECT id, name, email, password, role FROM users WHERE email = ? LIMIT 1', [email]);
  return rows[0] || null;
}

async function getUserById(id) {
  const [rows] = await pool.execute('SELECT id, name, email, role FROM users WHERE id = ? LIMIT 1', [id]);
  return rows[0] || null;
}

async function listUsersForAdmin() {
  const [rows] = await pool.execute('SELECT id, name, email, role FROM users ORDER BY id ASC');
  return rows;
}

async function createUser({ name, email, passwordHash, role = 'user' }) {
  const [result] = await pool.execute(
    'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
    [name, email, passwordHash, role]
  );
  return result.insertId;
}

module.exports = {
  getUserByEmail,
  getUserById,
  listUsersForAdmin,
  createUser,
};

