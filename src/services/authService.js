const jwt = require("jsonwebtoken");
const { getNaverToken, getNaverProfile } = require("../utils/naverAuth");
const { getKakaoToken, getKakaoProfile } = require("../utils/kakaoAuth");
const { getGoogleToken, getGoogleProfile } = require("../utils/googleAuth");
const con = require("../config/database");

const generateToken = (user) => {
  return jwt.sign(user, process.env.JWT_SECRET, { expiresIn: "1h" });
};

const naverCallback = async (req, res) => {
  const { code, state } = req.query;

  try {
    const tokenData = await getNaverToken(code, state);
    const naverProfile = await getNaverProfile(tokenData.access_token);

    const { id, name, nickname, email, birthyear, birthday, profile_image } =
      naverProfile;

    const user = {
      u_id: id,
      u_name: name,
      u_nickname: nickname,
      u_email: email,
      u_birth: `${birthyear}-${birthday}`,
      u_img: profile_image,
    };

    console.log("유저 데이터 db로 insert:", user);

    // 이미 존재하는 회원인지 검사
    con.query("SELECT * FROM user WHERE u_id = ?", [id], (err, results) => {
      if (err) {
        console.error("DB Error:", err);
        return res.status(500).send("회원 정보를 가져오지 못했습니다.");
      }

      // 회원 정보가 이미 존재하는 경우 삽입하지 않고 로그인 진행
      if (results.length > 0) {
        console.log("회원 정보가 이미 존재합니다.");
        const token = generateToken(user);
        const redirectUrl = `http://localhost:3000/auth/success?token=${token}&naver=true`;
        return res.redirect(redirectUrl);
      } else {
        // 회원 정보가 존재하지 않는 경우 삽입
        con.query(
          "INSERT INTO user (u_id, u_name, u_nickname, u_email, u_birth, u_img) VALUES (?, ?, ?, ?, ?, ?)",
          [
            id,
            name,
            nickname,
            email,
            `${birthyear}-${birthday}`,
            profile_image,
          ],
          (error, results) => {
            if (error) {
              console.error("DB Insert Error:", error);
              return res.status(500).send("회원 정보를 가져오지 못했습니다.");
            }

            console.log("User inserted successfully");
            const token = generateToken(user);
            const redirectUrl = `http://localhost:3000/auth/success?token=${token}&naver=true`;
            res.redirect(redirectUrl);
          }
        );
      }
    });
  } catch (error) {
    res.status(500).send("네이버 로그인에 실패했습니다.");
  }
};

const kakaoCallback = async (req, res) => {
  const { code } = req.query;

  try {
    const tokenData = await getKakaoToken(code);
    const kakaoProfile = await getKakaoProfile(tokenData.access_token);

    const { id, properties, kakao_account } = kakaoProfile;
    const user = {
      u_id: id,
      u_nickname: properties.nickname,
      u_img: properties.profile_image,
      u_email: kakao_account.email,
      u_birth: kakao_account.birthday
    };

    console.log("유저 데이터 db로 insert:", user);

    // 이미 존재하는 회원인지 검사
    con.query(
      "SELECT * FROM user WHERE u_id = ?",
      [user.u_id],
      (err, results) => {
        if (err) {
          console.error("DB Error:", err);
          return res.status(500).send("회원 정보를 가져오지 못했습니다.");
        }

        // 회원 정보가 이미 존재하는 경우 삽입하지 않고 로그인 진행
        if (results.length > 0) {
          console.log("회원 정보가 이미 존재합니다.");
          const token = generateToken(user);
          const redirectUrl = `http://localhost:3000/auth/success?token=${token}&kakao=true`;
          return res.redirect(redirectUrl);
        } else {
          // 회원 정보가 존재하지 않는 경우 삽입
          con.query(
            "INSERT INTO user (u_id, u_name, u_nickname, u_email, u_birth, u_img) VALUES (?, ?, ?, ?, ?, ?)",
            [
              user.u_id,
              user.u_name,
              user.u_nickname,
              user.u_email,
              user.u_birth,
              user.u_img,
            ],
            (error, results) => {
              if (error) {
                console.error("DB Insert Error:", error);
                return res.status(500).send("회원 정보를 가져오지 못했습니다.");
              }

              console.log("User inserted successfully");
              const token = generateToken(user);
              const redirectUrl = `http://localhost:3000/auth/success?token=${token}&kakao=true`;
              res.redirect(redirectUrl);
            }
          );
        }
      }
    );
  } catch (error) {
    res.status(500).send("카카오 로그인에 실패했습니다.");
  }
};

const googleCallback = async (req, res) => {
  const { code } = req.query;

  try {
    const tokenData = await getGoogleToken(code);
    //await console.log(`tokenData : ${tokenData}`);
    const googleProfile = await getGoogleProfile(tokenData.access_token);
    //await console.log(googleProfile);
    const { id, name, email, picture } = googleProfile;

    const user = {
      u_id: id,
      u_name: name,
      u_email: email,
      u_img: picture,
    };

    console.log("유저 데이터 db로 insert:", user);

    // 이미 존재하는 회원인지 검사
    con.query("SELECT * FROM user WHERE u_id = ?", [id], (err, results) => {
      if (err) {
        console.error("DB Error:", err);
        return res.status(500).send("회원 정보를 가져오지 못했습니다.");
      }

      // 회원 정보가 이미 존재하는 경우 삽입하지 않고 로그인 진행
      if (results.length > 0) {
        console.log("회원 정보가 이미 존재합니다.");
        const token = generateToken(user);
        const redirectUrl = `http://localhost:3000/auth/success?token=${token}&google=true`;
        return res.redirect(redirectUrl);
      } else {
        // 회원 정보가 존재하지 않는 경우 삽입
        con.query(
          "INSERT INTO user (u_id, u_name, u_email, u_img) VALUES (?, ?, ?, ?)",
          [id, name, email, picture],
          (error, results) => {
            if (error) {
              console.error("DB Insert Error:", error);
              return res.status(500).send("회원 정보를 가져오지 못했습니다.");
            }

            console.log("User inserted successfully");
            const token = generateToken(user);
            const redirectUrl = `http://localhost:3000/auth/success?token=${token}&goolgle=true`;
            res.redirect(redirectUrl);
          }
        );
      }
    });
  } catch (error) {
    res.status(500).send("구글 로그인에 실패했습니다");
  }
};
module.exports = { naverCallback, kakaoCallback, googleCallback };
