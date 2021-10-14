const express = require("express");
const {
  getUsers,
  getUser,
  getUserFriendRequests,
  createUser,
  updateUser,
  deleteUser,
} = require("../controllers/user");

const router = express.Router({ mergeParams: true });

router.get("/:userId/friend_requests", getUserFriendRequests);

router.route("/").get(getUsers).post(createUser);

router.route("/:id").get(getUser).put(updateUser).delete(deleteUser);

module.exports = router;
