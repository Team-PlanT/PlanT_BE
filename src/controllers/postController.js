const con = require('../config/database');

const createPost = (req, res) => {
  const { title, uno, p_like } = req.body;

  con.query(
    'INSERT INTO post (p_title, uno, p_like) VALUES (?, ?, ?)',
    [title, uno, p_like],
    (error, results) => {
      if (error) {
        console.error('Error inserting post:', error);
        return res.status(500).send('Error inserting post');
      }
      res.status(201).json({ insertId: results.insertId });
    }
  );
};

module.exports = { createPost };
