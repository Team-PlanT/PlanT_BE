const { naverCallback } = require('../services/authService');

const handleNaverLogin = (req, res) => {
  const naverLoginUrl = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${process.env.NAVER_CLIENT_ID}&redirect_uri=${process.env.NAVER_CALLBACK_URL}&state=${Math.random()
    .toString(36)
    .substring(3, 14)}`;
  res.redirect(naverLoginUrl);
};

const handleNaverCallback = async (req, res) => {
  await naverCallback(req, res);
};

module.exports = { handleNaverLogin, handleNaverCallback };
