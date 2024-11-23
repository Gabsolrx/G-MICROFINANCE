const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { logoutUser } = require('../controllers/authController')


router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/logout', authController.logout);



module.exports = router;
