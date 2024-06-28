const con = require('../config/database');

const registerUser = (req, res) => {
  const { u_id, u_pw, u_name, u_nickname, u_email, u_birth, u_img } = req.body;

  if (!u_id || !u_pw || !u_name || !u_nickname || !u_email || !u_birth) {
    return res.status(400).send('회원가입 정보를 모두 입력해야 합니다.');
  }

  con.query(
    'INSERT INTO user (u_id, u_pw, u_name, u_nickname, u_email, u_birth, u_img) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [u_id, u_pw, u_name, u_nickname, u_email, u_birth, u_img],
    (error, results) => {
      if (error) {
        return res.status(500).send('회원가입 진행 중 에러가 발생했습니다.');
      }
      res.status(201).send('회원가입이 완료되었습니다.');
    }
  );

  console.log("register")
};

const loginUser = (req, res) => {
  const { u_id, u_pw } = req.body;

  if (!u_id || !u_pw) {
    return res.status(400).send('아이디와 비밀번호를 모두 입력해야 합니다.');
  }

  con.query(
    'SELECT * FROM user WHERE u_id = ? AND u_pw = ?',
    [u_id, u_pw],
    (error, results) => {
      if (error) {
        return res.status(500).send('로그인 실패했습니다.');
      }

      if (results.length > 0) {
        res.status(200).send('로그인 성공했습니다.');
      } else {
        res.status(401).send('아이디 혹은 비밀번호가 잘못되었습니다.');
      }
    }
  );
};

module.exports  = { registerUser, loginUser };