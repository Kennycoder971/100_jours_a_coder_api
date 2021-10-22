const { Op } = require("sequelize");
const { Friend, User, sequelize } = require("../models");
const asyncHandler = require("../middlewares/async");
const ErrorResponse = require("../utils/ErrorResponse");

/**
 * @desc      Get all friends
 * @route     GET /api/v1/friends
 * @route     GET /api/v1/friends?name=friendName
 * @access    Private
 */
exports.getFriends = asyncHandler(async (req, res, next) => {
  let friends;
  const { name } = req.query;
  const currUserId = req.user.id;

  /**
   * @desc  Find friends as such :
   *  {
   *   user_id_requester:1,
   *   user_id_requested:2,
   *  }
   */

  friends = await Friend.findAll({
    where: {
      [Op.or]: [
        {
          user_id_requester: currUserId,
        },
        {
          user_id_requested: currUserId,
        },
      ],
    },
  });

  if (!friends[0])
    return res.status(200).json({
      success: true,
      data: [],
    });

  // Get all friends id
  const arrFriendsId = friends.map(
    ({ user_id_requester, user_id_requested }) => {
      return user_id_requester === currUserId
        ? user_id_requested
        : user_id_requester;
    }
  );

  // Get the friends (users) by id and define them as a User instance
  friends = await sequelize.query(
    `SELECT id, username, profile_picture FROM users WHERE id in (${arrFriendsId.join(
      ", "
    )})`,
    {
      model: User,
      mapToModel: true,
    }
  );

  if (name) {
    // Filter the friends by username, firstname and lastname
    friends = friends.filter((user) => {
      if (
        user?.username?.toLowerCase().includes(name.toLowerCase()) ||
        user?.firstname?.toLowerCase().includes(name.toLowerCase()) ||
        user?.lastname?.toLowerCase().includes(name.toLowerCase())
      ) {
        return user;
      }
    });
  }

  res.status(200).json({
    success: true,
    data: friends,
  });
});

/**
 * @desc      Delete a single friend
 * @route     DELETE /api/v1/friends/:id
 * @access    Private
 */
exports.deleteFriend = asyncHandler(async (req, res, next) => {
  const friend = await sequelize.query(
    `SELECT * FROM friends
     WHERE user_id_requester = ${req.user.id} 
     AND user_id_requested = ${req.params.id} 
     OR user_id_requester = ${req.params.id} 
     AND user_id_requested = ${req.user.id}`,
    { model: Friend, mapToModel: true }
  );

  if (!friend[0])
    return next(new ErrorResponse("Ce lien d'amitié n'existe pas", 404));

  await friend[0].destroy();

  // Destroy the friend request as well

  res.status(200).json({
    success: true,
    data: {},
  });
});
