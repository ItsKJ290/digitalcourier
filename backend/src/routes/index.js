const express = require('express');

const authRoutes = require('./authRoutes');
const dashboardRoutes = require('./dashboardRoutes');
const publicTrackingRoutes = require('./publicTrackingRoutes');
const adminParcelRoutes = require('./adminParcelRoutes');
const adminUsersRoutes = require('./adminUsersRoutes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/', publicTrackingRoutes);
router.use('/', adminParcelRoutes);
router.use('/admin', adminUsersRoutes);

module.exports = router;

