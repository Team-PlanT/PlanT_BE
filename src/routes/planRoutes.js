const express = require('express');
const { createPlan } = require('../controllers/planController');

const router = express.Router();

router.post('/', createPlan);

module.exports = router;
