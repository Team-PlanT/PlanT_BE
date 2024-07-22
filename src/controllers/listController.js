const con = require("../config/database");

const loadPost = (req, res) => {
  con.query("SELECT * FROM post ORDER BY p_id DESC", (error, results) => {
    if (error) {
      console.error("Error reading post:", error);
      return res.status(500).send("Error reading post");
    }
    res.status(200).json({ posts: results });
  });
};

module.exports = { loadPost };
