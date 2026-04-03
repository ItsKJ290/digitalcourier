const express = require('express');
const authenticateJwt = require('../middleware/authenticateJwt');
const requireRole = require('../middleware/requireRole');
const dashboardController = require('../controllers/dashboardController');

const router = express.Router();

router.get('/parcels', authenticateJwt, requireRole(['admin', 'user']), dashboardController.listMyParcels);

module.exports = router;

