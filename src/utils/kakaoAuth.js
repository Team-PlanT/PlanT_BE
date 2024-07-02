const axios = require('axios');

const getKakaoToken = async (code) => {
  const tokenResponse = await axios.post('https://kauth.kakao.com/oauth/token', null, {
    params: {
      grant_type: 'authorization_code',
      client_id: process.env.KAKAO_CLIENT_ID,
      redirect_uri: process.env.KAKAO_CALLBACK_URL,
      code: code,
    },
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });

  return tokenResponse.data;
};

const getKakaoProfile = async (accessToken) => {
  const profileResponse = await axios.get('https://kapi.kakao.com/v2/user/me', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return profileResponse.data;
};

module.exports = {
  getKakaoToken,
  getKakaoProfile,
};