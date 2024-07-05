const express = require('express');
const { signupUser, loginUser } = require('../controllers/userController');

const router = express.Router();

router.post('/signup', signupUser);
router.post('/local', loginUser);

module.exports = router;
