const express = require("express");
const { protect } = require("../middlewares/auth");
const {
  getFriendRequests,
  getFriendRequest,
  createFriendRequest,
  updateFriendRequest,
  deleteFriendRequest,
} = require("../controllers/friend_requests");

const router = express.Router();

router.use(protect);

router.route("/").get(getFriendRequests);

router
  .route("/:id")
  .get(getFriendRequest)
  .post(createFriendRequest)
  .put(updateFriendRequest)
  .delete(deleteFriendRequest);

module.exports = router;
