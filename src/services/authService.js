const jwt = require('jsonwebtoken');
const { getNaverToken, getNaverProfile } = require('../utils/naverAuth');
const con = require('../config/database');

const generateToken = (user) => {
  return jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '1h' });
};

const naverCallback = async (req, res) => {
  const { code, state } = req.query;

  try {
    const tokenData = await getNaverToken(code, state);
    const naverProfile = await getNaverProfile(tokenData.access_token);

    const { id, name, nickname, email, birthyear, birthday, profile_image } = naverProfile;

    const user = {
      u_id: id,
      u_name: name,
      u_nickname: nickname,
      u_email: email,
      u_birth: `${birthyear}-${birthday}`,
      u_img: profile_image
    };

    console.log('유저 데이터 db로 insert:', user);

    con.query(
      'INSERT INTO user (u_id, u_name, u_nickname, u_email, u_birth, u_img) VALUES (?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE u_name = VALUES(u_name), u_nickname = VALUES(u_nickname), u_email = VALUES(u_email), u_birth = VALUES(u_birth), u_img = VALUES(u_img)',
      [id, name, nickname, email, `${birthyear}-${birthday}`, profile_image],
      (error, results) => {
        if (error) {
          console.error('DB Error:', error);
          return res.status(500).send('회원 정보를 가져오지 못했습니다.');
        }

        const token = generateToken(user);
        // 리다이렉션
        const redirectUrl = `http://localhost:3000/auth/success?token=${token}`;
        res.redirect(redirectUrl);
      }
    );
  } catch (error) {
    res.status(500).send('네이버 로그인에 실패했습니다.');
  }
};

module.exports = { naverCallback };
