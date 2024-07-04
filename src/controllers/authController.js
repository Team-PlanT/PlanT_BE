const {
  naverCallback,
  kakaoCallback,
  googleCallback,
} = require("../services/authService");

const handleNaverLogin = (req, res) => {
  const naverLoginUrl = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${
    process.env.NAVER_CLIENT_ID
  }&redirect_uri=${process.env.NAVER_CALLBACK_URL}&state=${Math.random()
    .toString(36)
    .substring(3, 14)}`;
  res.redirect(naverLoginUrl);
};

const handleNaverCallback = async (req, res) => {
  await naverCallback(req, res);
};

const handleKakaoLogin = (req, res) => {
  const kakaoLoginUrl = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${process.env.KAKAO_CLIENT_ID}&redirect_uri=${process.env.KAKAO_CALLBACK_URL}`;
  res.redirect(kakaoLoginUrl);
};

const handleGoogleLogin = (req, res) => {
  const googleLoginUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=${process.env.GOOGLE_LOGIN_REDIRECT_URI}&response_type=code&scope=email profile`;
  res.redirect(googleLoginUrl);
};

const handleKakaoCallback = async (req, res) => {
  await kakaoCallback(req, res);
};

const handleGoogleCallback = async (req, res) => {
  await googleCallback(req, res);
};

module.exports = {
  handleNaverLogin,
  handleNaverCallback,
  handleKakaoLogin,
  handleKakaoCallback,
  handleGoogleLogin,
  handleGoogleCallback,
};
