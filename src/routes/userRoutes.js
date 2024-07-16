const express = require('express');
const { signupUser, loginUser, getCurrentUser } = require('../controllers/userController');

const router = express.Router();

router.post('/signup', signupUser);
router.post('/local', loginUser);
router.get('/me', getCurrentUser);

module.exports = router;

