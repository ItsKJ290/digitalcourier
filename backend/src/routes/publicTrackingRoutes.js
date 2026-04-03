const express = require('express');
const trackingController = require('../controllers/trackingController');

const router = express.Router();

router.get('/track/:tracking_id', trackingController.getTracking);

module.exports = router;

