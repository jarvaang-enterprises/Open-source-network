const express = require('express')
const router = express.router();
const authController = require('../controllers/authController');


router.post('/signup',authController.signup)
router.post('/login',authController.login)