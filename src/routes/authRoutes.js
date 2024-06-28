const express = require('express');
const { handleNaverLogin, handleNaverCallback } = require('../controllers/authController');

const router = express.Router();

// 서비스 url
router.get('/naver/login', handleNaverLogin);
// 콜백 url
router.get('/naver/callback', handleNaverCallback);

module.exports = router;
