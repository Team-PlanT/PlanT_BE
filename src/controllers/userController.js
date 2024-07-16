const con = require('../config/database');
const bcrypt = require('bcryptjs');

const signupUser = async (req, res) => {
  const { u_email, u_pw, u_birth } = req.body;

  if (!u_email || !u_pw || !u_birth) {
    return res.status(400).send('회원가입 정보를 모두 입력해야 합니다.');
  }

  try {
    const hashedPassword = await bcrypt.hash(u_pw, 10);

    con.query(
      'INSERT INTO user (u_email, u_pw, u_birth) VALUES (?, ?, ?)',
      [u_email, hashedPassword, u_birth],
      (error, results) => {
        if (error) {
          console.error('DB Error:', error);
          return res.status(500).send('회원가입 진행 중 에러가 발생했습니다.');
        }
        console.log('유저 회원가입:', results);
        res.status(201).send('회원가입이 완료되었습니다.');
      }
    );
  } catch (error) {
    console.error('회원가입 에러:', error);
    res.status(500).send('회원가입 진행 중 에러가 발생했습니다.');
  }
};

const loginUser = (req, res) => {
  const { u_email, u_pw } = req.body;

  if (!u_email || !u_pw) {
    return res.status(400).send('이메일과 비밀번호를 모두 입력해야 합니다.');
  }

  con.query(
    'SELECT * FROM user WHERE u_email = ?',
    [u_email],
    async (error, results) => {
      if (error) {
        return res.status(500).send('로그인 실패했습니다.');
      }

      if (results.length > 0) {
        const isMatch = await bcrypt.compare(u_pw, results[0].u_pw);
        if (isMatch) {
          req.session.uno = results[0].uno; // 세션에 uno 저장
          console.log("로그인: " + req.session.uno);
          req.session.save((err) => {
            if (err) {
              return res.status(500).send('세션 저장 중 에러가 발생했습니다.');
            }
            res.status(200).send('로그인 성공했습니다.');
          });
        } else {
          res.status(401).send('아이디 혹은 비밀번호가 잘못되었습니다.');
        }
      } else {
        res.status(401).send('아이디 혹은 비밀번호가 잘못되었습니다.');
      }
    }
  );
};

// 현재 계정 정보
const getCurrentUser = (req, res) => {
  console.log("전: " + req.session.uno);
  if (!req.session.uno) {
    return res.status(401).send('Unauthorized');
  }

  con.query(
    'SELECT * FROM user WHERE uno = ?',
    [req.session.uno],
    (error, results) => {
      if (error) {
        return res.status(500).send('Server error');
      }

      if (results.length > 0) {
        res.status(200).json(results[0]);
      } else {
        res.status(404).send('User not found');
      }
    }
  );
};

module.exports = { signupUser, loginUser, getCurrentUser };
