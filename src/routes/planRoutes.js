const express = require('express');
const { createPlan, getPlans } = require('../controllers/planController');

const router = express.Router();

// POST 요청을 처리하는 라우트
router.post('/', createPlan);

// GET 요청을 처리하는 라우트 추가
router.get('/', getPlans);

module.exports = router;