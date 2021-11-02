const { Challenge } = require("../models");
const asyncHandler = require("../middlewares/async");
const ErrorResponse = require("../utils/ErrorResponse");

/**
 * @desc      Get all likes for a challenge
 * @route     GET /api/v1/:challengeId/likes
 * @access    Private
 */
exports.getChallengeLikes = asyncHandler(async (req, res, next) => {
  const challenge = await Challenge.findOne({
    where: {
      id: req.params.challengeId,
    },
  });

  const likes = await challenge.countLikeChallenges();

  res.status(200).json({
    success: true,
    data: likes,
  });
});

/**
 * @desc      Create a like for a challenge
 * @route     POST /api/v1/challenges/:challengeId/likes
 * @access    Private
 */
exports.createChallengeLike = asyncHandler(async (req, res, next) => {
  let like;
  const challenge = await Challenge.findOne({
    where: {
      id: req.params.challengeId,
    },
  });

  like = await challenge.getLikeChallenges({
    where: {
      user_id: req.user.id,
    },
  });

  like = like[0];

  if (like)
    return next(
      new ErrorResponse(`Vous avez déjà donné un j'aime à ce défi.`, 400)
    );

  like = await challenge.createLikeChallenge({
    user_id: req.user.id,
    challenge_id: req.params.challengeId,
  });

  res.status(200).json({
    success: true,
    data: like,
  });
});

/**
 * @desc      Delete a challenge like
 * @route     DELETE /api/v1/:challengeId/likes
 * @access    Private
 */
exports.deleteChallengeLike = asyncHandler(async (req, res, next) => {
  let like;
  const challenge = await Challenge.findOne({
    where: {
      id: req.params.challengeId,
    },
  });

  if (!challenge)
    return next(
      new ErrorResponse(
        `Le défi avec l' id ${req.params.challengeId} n' exite pas`,
        404
      )
    );

  like = await challenge.getLikeChallenges({
    where: {
      user_id: req.user.id,
    },
  });

  like = like[0];

  if (!like)
    return next(
      new ErrorResponse(`Vous avez pas donné un j'aime à ce défi.`, 404)
    );

  await like.destroy(req.body);

  res.status(200).json({
    success: true,
    data: {},
  });
});
