const userRepo = require('../db/userRepo');

async function listUsers(req, res) {
  try {
    const users = await userRepo.listUsersForAdmin();
    return res.json({ users });
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
}

module.exports = { listUsers };

