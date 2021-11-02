const { Comment, Challenge } = require("../models");
const asyncHandler = require("../middlewares/async");
const ErrorResponse = require("../utils/ErrorResponse");
const paginatedResults = require("../utils/paginatedResults");

/**
 * @desc      Get all comments for a challenge
 * @route     GET /api/v1/:challengeId/comments
 * @access    Private
 */
exports.getComments = asyncHandler(async (req, res, next) => {
  const challenge = await Challenge.findOne({
    where: {
      id: req.params.challengeId,
    },
  });

  const comments = await challenge.getComments();

  res.status(200).json({
    success: true,
    data: comments,
  });
});

/**
 * @desc      Create a comment for a challenge
 * @route     POST /api/v1/challenges/:challengeId/comments
 * @access    Private
 */
exports.createComment = asyncHandler(async (req, res, next) => {
  const comment = await Comment.create({
    user_id: req.user.id,
    challenge_id: req.params.challengeId,
    ...req.body,
  });

  res.status(201).json({
    success: true,
    data: comment,
  });
});

/**
 * @desc      Update a comment
 * @route     PUT /api/v1/:challengeId/comments/:id
 * @access    Private
 */
exports.updateComment = asyncHandler(async (req, res, next) => {
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
      id: req.params.id,
    },
  });

  if (!comment[0])
    return next(
      new ErrorResponse(
        `Le commentaire avec l' id ${req.params.id} n' exite pas.`,
        404
      )
    );

  if (req.user.id != comment[0].user_id)
    return next(
      new ErrorResponse(
        `Le commentaire avec l' id ${req.params.id} ne vous appartient pas.`,
        404
      )
    );

  await comment[0].update(req.body);

  res.status(200).json({
    success: true,
    data: comment[0],
  });
});

/**
 * @desc      Delete a challenge
 * @route     DELETE /api/v1/:challengeId/comments/:id
 * @access    Private
 */
exports.deleteComment = asyncHandler(async (req, res, next) => {
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
      id: req.params.id,
    },
  });

  if (!comment[0])
    return next(
      new ErrorResponse(
        `Le commentaire avec l' id ${req.params.id} n' exite pas.`,
        404
      )
    );

  if (req.user.id != comment[0].user_id || challenge.user_id == req.user.id)
    return next(
      new ErrorResponse(
        `Vous ne pouvez pas supprimer le commentaire avec l'id ${req.params.id}.`,
        404
      )
    );

  await comment[0].destroy(req.body);

  res.status(200).json({
    success: true,
    data: {},
  });
});
