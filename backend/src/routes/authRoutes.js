const express = require('express');
const authenticateJwt = require('../middleware/authenticateJwt');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/me', authenticateJwt, authController.me);

module.exports = router;

