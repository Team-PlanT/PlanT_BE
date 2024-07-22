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
  const decodedQuery = decodeURIComponent(query);
  const likeQuery = `%${decodedQuery}%`; // 부분 일치를 위한 쿼리
  try {
    const records0 = await queryDatabase(
      "SELECT * FROM post WHERE p_title LIKE ? ORDER BY p_id DESC",
      [likeQuery]
    );
    const records1 = await queryDatabase(
      "SELECT * FROM plan WHERE pl_schedule LIKE ? ORDER BY p_id DESC",
      [likeQuery]
    );
    const records2 = await queryDatabase(
      "SELECT * FROM plan WHERE pl_place LIKE ? ORDER BY p_id DESC",
      [likeQuery]
    );

    // 각 쿼리의 결과를 결합
    let combinedRecords = [...records0, ...records1, ...records2];

    // p_id 기준으로 오름차순 정렬하면서 중복 제거
    combinedRecords = combinedRecords
      .sort((a, b) => b.p_id - a.p_id)
      .filter(
        (item, index, self) =>
          index === self.findIndex((t) => t.p_id === item.p_id)
      );

    const postIds = combinedRecords.map((record) => record.p_id);

    const combinedResults = [];

    for (const postId of postIds) {
      const result = await queryDatabase(
        "SELECT * FROM post WHERE p_id = ? ORDER BY p_id DESC",
        [postId]
      );
      combinedResults.push(...result);
    }

    console.log("combinedResults:", combinedResults);

    res.status(200).json({ posts: combinedResults });
  } catch (error) {
    console.error("Error reading post:", error);
    res.status(500).send("Error reading post");
  }
};

module.exports = { searchPost };
