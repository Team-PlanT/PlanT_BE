const axios = require('axios');

const getNaverToken = async (code, state) => {
  try {
    const response = await axios.get('https://nid.naver.com/oauth2.0/token', {
      params: {
        grant_type: 'authorization_code',
        client_id: process.env.NAVER_CLIENT_ID,
        client_secret: process.env.NAVER_CLIENT_SECRET,
        code,
        state,
      },
    });
    console.log('네이버 토큰 response:', response.data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const getNaverProfile = async (token) => {
  try {
    const response = await axios.get('https://openapi.naver.com/v1/nid/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log('유저 프로필 response:', response.data.response);
    return response.data.response;
  } catch (error) {
    throw error;
  }
};

module.exports = { getNaverToken, getNaverProfile };
