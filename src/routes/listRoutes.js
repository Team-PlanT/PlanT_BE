const express = require('express');
const { loadPost } = require('../controllers/listController');

const router = express.Router();

router.get('/loadPost', loadPost);

module.exports = router;
