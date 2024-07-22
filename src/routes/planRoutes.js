const express = require('express');
const router = express.Router();
const con = require('../config/database');

router.get('/', (req, res) => {
  const { p_id } = req.query;
  console.log(`Fetching plans for p_id: ${p_id}`); // 쿼리 로그 추가
  const query = 'SELECT * FROM plan WHERE p_id = ? ORDER BY pl_startTime';

  con.query(query, [p_id], (err, results) => {
    if (err) {
      console.error('Error fetching plans:', err);
      return res.status(500).json({ error: 'Error fetching plans' });
    }
    console.log('Fetched plans:', results); // 결과 로그 추가
    res.json(results);
  });
});

module.exports = router;