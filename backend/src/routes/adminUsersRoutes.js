const express = require('express');
const authenticateJwt = require('../middleware/authenticateJwt');
const requireRole = require('../middleware/requireRole');
const adminController = require('../controllers/adminController');

const router = express.Router();

router.get('/users', authenticateJwt, requireRole('admin'), adminController.listUsers);

module.exports = router;

