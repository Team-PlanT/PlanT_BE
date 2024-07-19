const con = require("../config/database");

const queryDatabase = (query, params) => {
  return new Promise((resolve, reject) => {
    con.query(query, params, (error, results) => {
      if (error) {
        return reject(error);
      }
      resolve(results);
    });
  });
};

const searchPost = async (req, res) => {
  const query = req._parsedUrl.query.substring(6);
  const likeQuery = `%${query}%`; // 부분 일치를 위한 쿼리

  try {
    const results0 = await queryDatabase(
      "SELECT * FROM post WHERE p_title LIKE ? ORDER BY p_id DESC",
      [likeQuery]
    );
    const results1 = await queryDatabase(
      "SELECT * FROM plan WHERE pl_schedule LIKE ? ORDER BY p_id DESC",
      [likeQuery]
    );
    const results2 = await queryDatabase(
      "SELECT * FROM plan WHERE pl_place LIKE ? ORDER BY p_id DESC",
      [likeQuery]
    );

    // 각 쿼리의 결과를 결합
    let combinedResults = [...results0, ...results1, ...results2];

    // p_id 기준으로 오름차순 정렬하면서 중복 제거
    combinedResults = combinedResults
      .sort((a, b) => b.p_id - a.p_id)
      .filter(
        (item, index, self) =>
          index === self.findIndex((t) => t.p_id === item.p_id)
      );

    res.status(200).json({ posts: combinedResults });
  } catch (error) {
    console.error("Error reading post:", error);
    res.status(500).send("Error reading post");
  }
};

module.exports = { searchPost };
