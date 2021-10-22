const { Op } = require("sequelize");
const { FriendRequest, User } = require("../models");
const asyncHandler = require("../middlewares/async");
const ErrorResponse = require("../utils/ErrorResponse");

/**
 * @desc      Get all friend requests received
 * @route     GET /api/v1/friend_requests
 * @route     GET /api/v1/friend_requests?sender=:id
 * @access    Private
 */
exports.getFriendRequests = asyncHandler(async (req, res, next) => {
  let friendRequests;
  if (req.query.sender) {
    friendRequests = await FriendRequest.findAll({
      where: {
        request_id_from: req.query.sender,
      },
      include: {
        model: User,
        attributes: ["firstname", "username", "lastname"],
      },
    });
  } else {
    friendRequests = await FriendRequest.findAll({});
  }

  res.status(201).json({
    success: true,
    data: friendRequests,
  });
});

/**
 * @desc      Get a single friend request
 * @route     GET /api/v1/friend_requests/:id
 * @access    Private
 */
exports.getFriendRequest = asyncHandler(async (req, res, next) => {
  const user = await FriendRequest.findByPk(req.params.id);

  if (!user) return next(new ErrorResponse("Cet utilisateur n'existe pas"));

  res.status(200).json({
    success: true,
    data: user,
  });
});

/**
 * @desc      Create a friend request
 * @route     POST /api/v1/friend_requests/:id
 * @access    Private
 */
exports.createFriendRequest = asyncHandler(async (req, res, next) => {
  const body = {
    request_id_from: req.user.id,
    request_id_to: req.params.id,
    status: "p",
  };

  // Look if this friend request does not yet exists
  let friendRequest = await FriendRequest.findOne({
    where: {
      request_id_from: body.request_id_from,
      request_id_to: body.request_id_to,
    },
  });

  if (friendRequest)
    return next(
      new ErrorResponse(
        `L'utilisateur aves l'id ${body.request_id_from} a déjà  envoyé une requête d'amis à l'utilisateur avec l'id ${body.request_id_to}`,
        400
      )
    );

  // Look for  the sender and receiver of the friend request
  const [sender, receiver] = await User.findAll({
    where: {
      [Op.or]: [
        {
          id: req.user.id,
        },
        {
          id: req.params.id,
        },
      ],
    },
  });

  if (!sender)
    return next(
      new ErrorResponse(`L'utilisateur qui envoie la requête n'existe pas`, 404)
    );

  if (!receiver)
    return next(
      new ErrorResponse(
        `L'utilisateur qui reçois la requête et avec l'id ${req.params.id} n'existe pas `,
        404
      )
    );

  friendRequest = await FriendRequest.create({
    request_id_from: req.user.id,
    request_id_to: req.params.id,
    status: "p",
  });

  res.status(201).json({
    success: true,
    data: friendRequest,
  });
});

/**
 * @desc      Update or accept a friend request and create a friend
 * @route     PUT /api/v1/friend_requests/:id
 * @access    Private
 */
exports.updateFriendRequest = asyncHandler(async (req, res, next) => {
  const friendRequest = await FriendRequest.findByPk(req.params.id);

  if (!friendRequest)
    return next(
      new ErrorResponse(
        `La requête d'amis avec l'id ${friendRequests.id} n'existe pas`,
        404
      )
    );

  await friendRequest.update({
    status: "a",
  });

  const requester = await User.findByPk(friendRequest.request_id_from);
  const requested = await User.findByPk(friendRequest.request_id_to);

  await requester.createFriend({
    user_id_requester: requester.id,
    user_id_requested: requested.id,
  });

  res.status(200).json({
    success: true,
    data: friendRequest,
  });
});

/**
 * @desc      Delete a single friend requests
 * @route     DELETE /api/v1/friend_requests/:id
 * @access    Private
 */
exports.deleteFriendRequest = asyncHandler(async (req, res, next) => {
  const friendRequest = await FriendRequest.findByPk(req.params.id);

  if (!friendRequest)
    return next(
      new ErrorResponse(
        `La requête d'amis avec l'id ${req.params.id} n'existe pas`,
        404
      )
    );

  await friendRequest.destroy(req.body);

  res.status(200).json({
    success: true,
    data: {},
  });
});
