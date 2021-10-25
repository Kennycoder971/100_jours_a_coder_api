const express = require("express");
const { protect } = require("../middlewares/auth");
const {
  createChallenge,
  getChallenges,
  updateChallenge,
  deleteChallenge,
} = require("../controllers/challenge");

const router = express.Router();

router.use(protect);

router
  .route("/")
  .get(getChallenges)
  .post(createChallenge)
  .put(updateChallenge)
  .delete(deleteChallenge);

module.exports = router;
