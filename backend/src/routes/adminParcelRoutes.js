const express = require('express');
const authenticateJwt = require('../middleware/authenticateJwt');
const requireRole = require('../middleware/requireRole');

const parcelController = require('../controllers/parcelController');
const { updateParcelStatus } = require('../controllers/updateController');

const router = express.Router();

router.post('/parcels', authenticateJwt, requireRole('admin'), parcelController.createParcel);
router.post('/updates', authenticateJwt, requireRole('admin'), updateParcelStatus);

module.exports = router;

