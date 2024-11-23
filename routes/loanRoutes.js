const express = require('express');
const router = express.Router();
const loanController = require('../controllers/loanController');
const { authenticateToken } = require('../middleware');



router.get('/', authenticateToken, loanController.getUserLoans);


module.exports = router;
