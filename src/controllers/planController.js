const con = require('../config/database');

const createPlan = (req, res) => {
  const { p_id, pl_date, pl_startTime, pl_endTime, pl_schedule, pl_place, pl_cost, pl_content } = req.body;

  con.query(
    'INSERT INTO plan (p_id, pl_date, pl_startTime, pl_endTime, pl_schedule, pl_place, pl_cost, pl_content) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [p_id, pl_date, pl_startTime, pl_endTime, pl_schedule, pl_place, pl_cost, pl_content],
    (err, results) => {
      if (err) {
        console.error('Error inserting plan:', err);
        return res.status(500).send('Error inserting plan');
      }

      res.status(201).send('Plan created successfully');
    }
  );
};

const getPlans = (req, res) => {
  con.query('SELECT * FROM plan ORDER BY pl_date DESC', (err, results) => {
    if (err) {
      console.error('Error fetching plans:', err);
      return res.status(500).send('Error fetching plans');
    }

    res.json(results);
  });
};

const getPlanById = (req, res) => {
  const { id } = req.params;
  con.query('SELECT * FROM plan WHERE p_id = ?', [id], (err, results) => {
    if (err) {
      console.error('Error fetching plan:', err);
      return res.status(500).send('Error fetching plan');
    }

    if (results.length === 0) {
      return res.status(404).send('Plan not found');
    }

    console.log('Fetched plan:', results[0]);
    res.json(results[0]);
  });
};

module.exports = {
  createPlan,
  getPlans,
  getPlanById, // 단일 계획을 가져오는 함수 추가
};