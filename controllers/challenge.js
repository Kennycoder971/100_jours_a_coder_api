const { Challenge } = require("../models");
const asyncHandler = require("../middlewares/async");
const ErrorResponse = require("../utils/ErrorResponse");

/**
 * @desc      Get all challenges
 * @route     GET /api/v1/challenges
 * @access    Private
 */
exports.getChallenges = asyncHandler(async (req, res, next) => {
  const challenges = await Challenge.findAll({
    where: {
      user_id: req.user.id,
    },
  });

  res.send({
    success: true,
    data: challenges,
  });
});

/**
 * @desc      Create a challenge
 * @route     POST /api/v1/challenges
 * @access    Private
 */
exports.createChallenge = asyncHandler(async (req, res, next) => {
  const challenge = await Challenge.create({
    user_id: req.user.id,
    ...req.body,
  });

  res.send({
    success: true,
    data: challenge,
  });
});

/**
 * @desc      Update the last challenge
 * @route     PUT /api/v1/challenges
 * @access    Private
 */
exports.updateChallenge = asyncHandler(async (req, res, next) => {
  const challenge = await Challenge.findOne({
    where: {
      user_id: req.user.id,
    },
    order: [["createdAt", "DESC"]],
  });

  if (!challenge)
    return next(
      new ErrorResponse(`Le défi avec l' id ${req.params.id} n' exite pas`, 404)
    );

  await challenge.update(req.body);

  res.send({
    success: true,
    data: challenge,
  });
});

/**
 * @desc      Delete the last challenge
 * @route     DELETE /api/v1/challenges
 * @access    Private
 */
exports.deleteChallenge = asyncHandler(async (req, res, next) => {
  const challenge = await Challenge.findOne({
    where: {
      user_id: req.user.id,
    },
    order: [["createdAt", "DESC"]],
  });

  if (!challenge)
    return next(
      new ErrorResponse(`Le défi avec l' id ${req.params.id} n' exite pas`, 404)
    );

  await challenge.destroy(req.body);

  res.send({
    success: true,
    data: {},
  });
});
