const express = require('express');
const { handleNaverLogin, handleNaverCallback, handleKakaoLogin, handleKakaoCallback } = require('../controllers/authController');

const router = express.Router();

// 네이버 로그인 및 콜백
router.get('/naver/login', handleNaverLogin);
router.get('/naver/callback', handleNaverCallback);

// 카카오 로그인 및 콜백
router.get('/kakao/login', handleKakaoLogin);
router.get('/kakao/callback', handleKakaoCallback);

module.exports = router;