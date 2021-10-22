const { Op } = require("sequelize");
const { Friend, User, sequelize } = require("../models");
const asyncHandler = require("../middlewares/async");
const ErrorResponse = require("../utils/ErrorResponse");

/**
 * @desc      Get all friends
 * @route     GET /api/v1/friends
 * @route     GET /api/v1/friends?name=friendname
 * @access    Private
 */
exports.getFriends = asyncHandler(async (req, res, next) => {
  let friends;
  const { name } = req.query;
  const currUserId = 1;

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
    `SELECT * FROM users WHERE id in (${arrFriendsId.join(", ")})`,
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
  const currUserId = 1;
  let friend = await sequelize.query(
    `SELECT * FROM friend 
     WHERE user_id_requester = ${currUserId} 
     AND user_id_requested = ${req.params.id} 
     OR user_id_requester = ${req.params.id} 
     AND user_id_requested = ${currUserId}`,
    { model: Friend, mapToModel: true }
  );

  if (!friend[0])
    return next(new ErrorResponse("Ce lien d'amitié n'existe pas", 404));

  await friend[0].destroy();
  // await friend.destroy();

  res.status(200).json({
    success: true,
    data: friend,
  });
});
