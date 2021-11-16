const express = require("express");
const { protect } = require("../middlewares/auth");
const {
  getFriends,
  deleteFriend,
  getUserFriends,
} = require("../controllers/friend");

const router = express.Router();

router.use(protect);

router.get("/", getFriends);

router
  .route("/:id")
  .get(getUserFriends)
  .delete(deleteFriend);

module.exports = router;
