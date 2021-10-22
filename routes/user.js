const express = require("express");
const { protect } = require("../middlewares/auth");
const {
  getUsers,
  getUser,
  getUserFriendRequests,
  createUser,
  updateUser,
  deleteUser,
  userPhotoUpload,
} = require("../controllers/user");

const router = express.Router({ mergeParams: true });

router.get("/:userId/friend_requests", protect, getUserFriendRequests);

router.route("/:id/photo").put(protect, userPhotoUpload);

router.route("/").get(protect, getUsers).post(createUser);

router
  .route("/:id")
  .get(protect, getUser)
  .put(protect, updateUser)
  .delete(protect, deleteUser);

module.exports = router;
