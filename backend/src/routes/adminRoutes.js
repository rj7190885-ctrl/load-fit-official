const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// Simple static auth middleware for early stage protection
const adminAuth = (req, res, next) => {
    const token = req.headers.authorization;
    if (token === `Bearer ${process.env.ADMIN_SECRET || 'dev_secret_key'}`) {
        next();
    } else {
        res.status(401).json({ status: 'error', message: 'Unauthorized access' });
    }
};

router.get('/metrics', adminAuth, adminController.getMetrics);

module.exports = router;
