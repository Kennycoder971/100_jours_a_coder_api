const express = require("express");
const { protect } = require("../middlewares/auth");
const {
  createChallenge,
  getChallenges,
  updateChallenge,
  deleteChallenge,
} = require("../controllers/challenge");

const {
  createComment,
  getComments,
  updateComment,
  deleteComment,
} = require("../controllers/comment_challenge");

const router = express.Router();

router.use(protect);

router.route("/:challengeId/comments").get(getComments).post(createComment);

router
  .route("/:challengeId/comments/:id")
  .put(updateComment)
  .delete(deleteComment);

router
  .route("/")
  .get(getChallenges)
  .post(createChallenge)
  .put(updateChallenge)
  .delete(deleteChallenge);

module.exports = router;
