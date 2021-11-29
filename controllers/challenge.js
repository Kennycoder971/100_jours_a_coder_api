const { Challenge } = require("../models");
const asyncHandler = require("../middlewares/async");
const ErrorResponse = require("../utils/ErrorResponse");
const paginatedResults = require("../utils/paginatedResults");
/**
 * @desc      Get all challenges for the connected user
 * @route     GET /api/v1/challenges
 * @access    Private
 */
exports.getChallenges = asyncHandler(async (req, res, next) => {
  const options = {
    where: {
      user_id: req.user.id,
    },
  };

  const challenges = await paginatedResults(req, Challenge, options);

  res.status(200).json({
    success: true,
    data: challenges,
  });
});

/**
 * @desc      Get all challenges
 * @route     GET /api/v1/challenges/all
 * @access    Private
 */
exports.getAllChallenges = asyncHandler(async (req, res, next) => {
  const challenges = await paginatedResults(req, Challenge, {
    order: [["createdAt", "DESC"]],
  });

  res.status(200).json({
    success: true,
    data: challenges,
  });
});

/**
 * @desc      Get last challenge for a user
 * @route     GET /api/v1/challenges/last/:id
 * @access    Private
 */
exports.getUserLastChallenges = asyncHandler(async (req, res, next) => {
  const challenge = await Challenge.findOne({
    where: {
      user_id: req.params.id,
    },
    order: [["createdAt", "DESC"]],
  });

  res.status(200).json({
    success: true,
    data: challenge,
  });
});

/**
 * @desc      Get the last challenges
 * @route     GET /api/v1/challenges/last
 * @access    Private
 */
exports.getLastChallenge = asyncHandler(async (req, res, next) => {
  const challenge = await Challenge.findOne({
    where: {
      user_id: req.user.id,
    },
    order: [["createdAt", "DESC"]],
  });

  res.status(200).json({
    success: true,
    data: challenge,
  });
});

/**
 * @desc      Create a challenge if the last challenge does not exists or is succeded
 * @route     POST /api/v1/challenges
 * @access    Private
 */
exports.createChallenge = asyncHandler(async (req, res, next) => {
  let challenge = await Challenge.findOne({
    where: {
      user_id: req.user.id,
    },
    order: [["createdAt", "DESC"]],
  });

  if (challenge && challenge.succeeded === false)
    return next(new ErrorResponse("Vous avez déjà un défi en cours."));

  challenge = await Challenge.create({
    user_id: req.user.id,
    ...req.body,
  });

  res.status(201).json({
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

  if (!challenge) return next(new ErrorResponse(`Le défi n' exite pas`, 404));

  if (req.user.id != challenge.user_id)
    return next(new ErrorResponse(`Le défi ne vous appartient pas`, 401));

  await challenge.update(req.body);

  res.status(200).json({
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
  if (req.user.id != challenge.user_id)
    return next(new ErrorResponse(`Le défi ne vous appartient pas`, 401));

  await challenge.destroy(req.body);

  res.status(200).json({
    success: true,
    data: {},
  });
});
