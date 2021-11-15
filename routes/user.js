const express = require("express");
const { protect } = require("../middlewares/auth");
const paginationOptions = require("../middlewares/pagination_options");
const {
  getUsers,
  getUser,
  getUserFriendRequests,
  createUser,
  updateUser,
  deleteUser,
  userPhotoUpload,
  userCoverUpload,
} = require("../controllers/user");

const router = express.Router({ mergeParams: true });

router.get("/:userId/friend_requests", protect, getUserFriendRequests);

router.route("/:id/photo").put(protect, userPhotoUpload);

router.route("/:id/cover").put(protect, userCoverUpload);

router.route("/").get(protect, paginationOptions, getUsers).post(createUser);

router
  .route("/:id")
  .get(getUser)
  .put(protect, updateUser)
  .delete(protect, deleteUser);

module.exports = router;
