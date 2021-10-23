const express = require("express");
const { protect } = require("../middlewares/auth");
const { getFriends, deleteFriend } = require("../controllers/friend");

const router = express.Router();

router.use(protect);

router.get("/", getFriends);

router.delete("/:id", deleteFriend);

module.exports = router;
