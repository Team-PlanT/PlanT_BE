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

module.exports = {
  createPlan,
};
