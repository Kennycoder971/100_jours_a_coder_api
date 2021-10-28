const { Conversation, User } = require("../models");
const { Op } = require("sequelize");
const asyncHandler = require("../middlewares/async");
const ErrorResponse = require("../utils/ErrorResponse");
const { getPagination, getPagingData } = require("../utils/pagination");

/**
 * @desc      Get all conversations
 * @route     GET /api/v1/conversations
 * @access    Private
 */
exports.getConversations = asyncHandler(async (req, res, next) => {
  const { limit, offset } = getPagination(req.query.page);

  let { count, rows } = await Conversation.findAndCountAll({
    where: {
      user_id: req.user.id,
    },
    limit,
    offset,
  });

  const conversations = await Promise.all(
    rows.map(async (conversation) => {
      return {
        user: await User.findByPk(conversation.user_two, {
          attributes: ["username", "firstname", "lastname", "profile_picture"],
        }),
        conversation,
        last_msg: await conversation.getReplies({
          order: [["createdAt", "DESC"]],
          limit: 1,
        }),
      };
    })
  );

  const result = { rows: conversations, count };
  const data = getPagingData(result, req.query.page, limit);
  res.json({
    success: true,
    data,
  });
});

/**
 * @desc      Look is a user has a conversation with another one
 * @route     GET /api/v1/conversations/:id
 * @access    Private
 */
exports.getConversation = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({
    where: {
      id: req.user.id,
    },
  });

  const conversations = await user.getConversations({
    where: {
      id: req.params.id,
    },
  });

  res.json({
    success: true,
    data: conversations[0],
  });
});

/**
 * @desc      Create a conversation and/or add a reply
 * @route     POST /api/v1/conversations
 * @access    Private
 */
exports.createConversation = asyncHandler(async (req, res, next) => {
  const user2 = await User.findOne({
    where: {
      id: req.body.user_id,
    },
  });

  if (!user2)
    return next(
      new ErrorResponse(`L'utilisateur avec l'id ${user2.id} n'existe pas`, 404)
    );

  const conversation = await Conversation.findOrCreate({
    where: {
      [Op.or]: [
        {
          [Op.and]: [{ user_id: req.user.id }, { user_two: req.body.user_id }],
        },
        {
          [Op.and]: [{ user_id: req.body.user_id }, { user_two: req.user.id }],
        },
      ],
    },
    defaults: {
      user_id: req.user.id,
      user_two: req.body.user_id,
    },
  });

  await conversation[0].createReply({
    content: req.body.content,
    user_id: req.user.id,
  });

  const replies = await conversation[0].getReplies();

  res.json({
    success: true,
    data: {
      conversation,
      replies,
    },
  });
});

/**
 * @desc      Delete the last conversation
 * @route     DELETE /api/v1/conversations
 * @access    Private
 */
exports.deleteconversation = asyncHandler(async (req, res, next) => {
  const conversation = await conversation.findOne({
    where: {
      user_id: req.user.id,
    },
    order: [["createdAt", "DESC"]],
  });

  if (!conversation)
    return next(
      new ErrorResponse(`Le défi avec l' id ${req.params.id} n' exite pas`, 404)
    );
  if (req.user.id != conversation.user_id)
    return next(new ErrorResponse(`Le défi ne vous appartient pas`, 401));

  await conversation.destroy(req.body);

  res.json({
    success: true,
    data: {},
  });
});
