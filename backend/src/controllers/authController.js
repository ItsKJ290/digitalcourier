const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userRepo = require('../db/userRepo');

function issueToken(user) {
  const payload = {
    id: user.id,
    role: user.role,
    name: user.name,
    email: user.email,
  };

  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
}

async function register(req, res) {
  const { name, email, password } = req.body || {};

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'name, email, and password are required' });
  }

  if (String(password).length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters' });
  }

  try {
    const existing = await userRepo.getUserByEmail(email);
    if (existing) return res.status(409).json({ message: 'Email already in use' });

    const passwordHash = await bcrypt.hash(password, 10);
    const userId = await userRepo.createUser({
      name: String(name),
      email: String(email).toLowerCase(),
      passwordHash,
      role: 'user',
    });

    const user = await userRepo.getUserById(userId);
    const token = issueToken(user);

    return res.status(201).json({
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
}

async function login(req, res) {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({ message: 'email and password are required' });
  }

  try {
    const user = await userRepo.getUserByEmail(String(email).toLowerCase());
    if (!user) return res.status(401).json({ message: 'Invalid email or password' });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ message: 'Invalid email or password' });

    const token = issueToken(user);
    return res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
}

async function me(req, res) {
  // authenticateJwt attaches req.user
  const user = await userRepo.getUserById(req.user.id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  return res.json({ user: { id: user.id, name: user.name, email: user.email, role: user.role } });
}

module.exports = { register, login, me };

