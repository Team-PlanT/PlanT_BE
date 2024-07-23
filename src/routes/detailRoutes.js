const express = require('express');
const router = express.Router();
const { getPlansById } = require('../controllers/detailController');

router.get('/:id', getPlansById);

module.exports = router;
