const express = require("express");
const { searchPost } = require("../controllers/searchController");

const router = express.Router();

router.get("/searchPost", searchPost);

module.exports = router;
