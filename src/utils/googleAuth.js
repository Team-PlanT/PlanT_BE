const axios = require("axios");

const getGoogleToken = async (code) => {
  try {
    const response = await axios.post("https://oauth2.googleapis.com/token", {
      grant_type: "authorization_code",
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      code,
      redirect_uri: process.env.GOOGLE_LOGIN_REDIRECT_URI,
    });
    await console.log("구글 토큰 response:", response.data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const getGoogleProfile = async (token) => {
  try {
    const response = await axios.get(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    await console.log("유저 프로필 response:", response.data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

module.exports = { getGoogleToken, getGoogleProfile };
