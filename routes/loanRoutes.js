const express = require('express');
const router = express.Router();
const loanController = require('../controllers/loanController');
const { authenticateToken } = require('../middleware'); // Ensure middleware is properly imported


// Route to apply for a loan
router.post('/apply', authenticateToken, loanController.applyLoan); // Added authentication to secure route

// Route to fetch loan details for a specific user by ID
router.get('/:userId', authenticateToken, loanController.getLoanDetails); // Added authentication to secure route

module.exports = router;


