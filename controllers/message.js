const { Message,User } = require("../models");
const asyncHandler = require("../middlewares/async");
const ErrorResponse = require("../utils/ErrorResponse");
const paginatedResults = require("../utils/paginatedResults");


/**
 * @desc      Get created or sent messages
 * @route     GET /api/v1/messages
 * @route     GET /api/v1/messages?sender=me
 * @access    Private
 */
exports.getMessages = asyncHandler(async (req, res, next) => {
  let messages;
  let options;
  if (req.query.sender === "me") {
    options = {
      where: {
        user_id_from: req.user.id,
      },
    }
   messages = await paginatedResults(req,Message,options)
  } else {
    options = {
      where: {
        user_id_to: req.user.id,
      },
    }
    messages = await paginatedResults(req,Message,options)
  }

  res.status(200).json({
    success: true,
    data: messages,
  });
});

/**
 * @desc      Create (or send) a message
 * @route     POST /api/v1/messages/:userId
 * @access    Private
 */
exports.createMessage = asyncHandler(async (req, res, next) => {
  
  const user = await User.findByPk(req.params.userId)

  if(!user) return next(
    new ErrorResponse(`L' utilisateur avec l'id ${req.params.userId} n'existe pas.`))
  
    const message = await Message.create({
    user_id_from: req.user.id,
    user_id_to: req.params.userId,
    content: req.body.content,
  });

  res.status(201).json({
    success: true,
    data: message,
  });
});

/**
 * @desc      Update a message
 * @route     PUT /api/v1/messages/:id
 * @access    Private
 */
exports.updateMessage = asyncHandler(async (req, res, next) => {
  const message = await Message.findByPk(req.params.id);

  if (!message)
    return next(
      new ErrorResponse(
        `Le message avec l' id ${req.params.id} n' exite pas`,
        404
      )
    );

  await message.update(req.body);

  res.status(200).json({
    success: true,
    data: message,
  });
});
/**
 * @desc      Delete a message
 * @route     DELETE /api/v1/messages/:id
 * @access    Private
 */
exports.deleteMessage = asyncHandler(async (req, res, next) => {
  const message = await Message.findByPk(req.params.id);

  if (!message)
    return next(
      new ErrorResponse(
        `Le message avec l' id ${req.params.id} n' exite pas`,
        404
      )
    );

  await message.destroy(req.body);

  res.status(200).json({
    success: true,
    data: {},
  });
});
