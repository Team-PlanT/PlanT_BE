const con = require('../config/database');

const getPlansById = (req, res) => {
  const { id } = req.params;
  con.query('SELECT * FROM plan WHERE p_id = ? ORDER BY pl_date ASC, pl_startTime ASC', [id], (err, results) => {
    if (err) {
      console.error('Error fetching detail:', err);
      return res.status(500).send('Error fetching detail');
    }
    res.json(results);
  });
};

module.exports = {
  getPlansById,
};