const express = require("express");
const { protect } = require("../middlewares/auth");
const {
  createChallenge,
  getChallenges,
  getLastChallenge,
  updateChallenge,
  deleteChallenge,
  getUserLastChallenges,
  getAllChallenges,
} = require("../controllers/challenge");

const {
  createComment,
  getComments,
  updateComment,
  deleteComment,
} = require("../controllers/comment_challenge");

const {
  createChallengeLike,
  getChallengeLikes,
  deleteChallengeLike,
} = require("../controllers/like_challenge");

const {
  getCommentLikes,
  createCommentLike,
  deleteCommentLike,
} = require("../controllers/like_comment");

const router = express.Router();

router.use(protect);

router
  .route("/:challengeId/comments/:commentId/likes")
  .get(getCommentLikes)
  .post(createCommentLike)
  .delete(deleteCommentLike);

router.route("/:challengeId/comments").get(getComments).post(createComment);

router
  .route("/:challengeId/comments/:id")
  .put(updateComment)
  .delete(deleteComment);

router
  .route("/:challengeId/likes")
  .get(getChallengeLikes)
  .post(createChallengeLike)
  .delete(deleteChallengeLike);

router
  .route("/")
  .get(getChallenges)
  .post(createChallenge)
  .put(updateChallenge)
  .delete(deleteChallenge);

router.get("/last/:id", getUserLastChallenges);
router.get("/last", getLastChallenge);

router.get("/all", getAllChallenges);

module.exports = router;
