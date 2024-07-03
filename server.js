const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const session = require('express-session');
const cors = require('cors');

const userRoutes = require('./src/routes/userRoutes');
const authRoutes = require('./src/routes/authRoutes');

const con = require('./src/config/database');

dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(cors({
  // 프론트엔드 주소
  origin: 'http://localhost:3000',
  credentials: true,
}));

app.use(express.json());

app.use(session({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: false }));

app.use('/api/users', userRoutes);
app.use('/auth', authRoutes);

// DB 연결 끊겼을 때 재연결 코드
con.on('error', (err) => {
  console.log('db error', err);
  if (err.code === 'PROTOCOL_CONNECTION_LOST') {
    console.log('Reconnecting to the database...');
    con.connect((err) => {
      if (err) {
        console.error('Error reconnecting to the database:', err);
      } else {
        console.log('Reconnected to the database.');
      }
    });
  } else {
    throw err;
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
