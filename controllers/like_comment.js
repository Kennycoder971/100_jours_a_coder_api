const { Challenge } = require("../models");
const asyncHandler = require("../middlewares/async");
const ErrorResponse = require("../utils/ErrorResponse");

/**
 * @desc      Get all likes for a comment
 * @route     GET /api/v1/challenges/:challengeId/comments/:commentId/likes
 * @access    Private
 */
exports.getCommentLikes = asyncHandler(async (req, res, next) => {
  const challenge = await Challenge.findOne({
    where: {
      id: req.params.challengeId,
    },
  });
  if (!challenge)
    return next(
      new ErrorResponse(
        `Le défi avec l' id ${req.params.challengeId} n' exite pas.`,
        404
      )
    );
  const comment = await challenge.getComments({
    where: {
      id: req.params.commentId,
    },
  });
  if (!comment[0])
    return next(
      new ErrorResponse(
        `Le commentaire avec l'id ${req.params.commentId} n'existe pas.`,
        404
      )
    );
  const likes = await comment[0].countLikeComments();

  res.send({
    success: true,
    data: likes,
  });
});

/**
 * @desc      Create a like for a comment
 * @route     POST /api/v1/challenges/:challengeId/comments/:commentId/likes
 * @access    Private
 */
exports.createCommentLike = asyncHandler(async (req, res, next) => {
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

  const comment = await challenge.getComments({
    where: {
      id: req.params.commentId,
    },
  });

  if (!comment[0])
    return next(
      new ErrorResponse(
        `Le commentaire avec l'id ${req.params.commentId} n'existe pas.`,
        404
      )
    );

  like = await comment[0].getLikeComments({
    where: {
      user_id: req.user.id,
    },
  });

  like = like[0];

  if (like)
    return next(
      new ErrorResponse(`Vous avez déjà donné un j'aime à ce commentaire.`, 400)
    );

  like = await comment[0].createLikeComment({
    user_id: req.user.id,
    comment_id: req.params.commentId,
  });

  res.send({
    success: true,
    data: like,
  });
});

/**
 * @desc      Delete a comment like
 * @route     DELETE /api/v1/challenges/:challengeId/comments/:commentId/likes
 * @access    Private
 */
exports.deleteCommentLike = asyncHandler(async (req, res, next) => {
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

  const comment = await challenge.getComments({
    where: {
      id: req.params.commentId,
    },
  });

  if (!comment[0])
    return next(
      new ErrorResponse(
        `Le commentaire avec l'id ${req.params.commentId} n'existe pas.`,
        404
      )
    );

  like = await comment[0].getLikeComments({
    where: {
      user_id: req.user.id,
    },
  });

  like = like[0];

  if (!like)
    return next(
      new ErrorResponse(`Vous avez pas donné un j'aime à ce commentaire.`, 400)
    );

  await like.destroy();

  res.send({
    success: true,
    data: {},
  });
});
