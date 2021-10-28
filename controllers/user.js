const path = require("path");
const { Op } = require("sequelize");
const { FriendRequest, User } = require("../models");
const asyncHandler = require("../middlewares/async");
const ErrorResponse = require("../utils/ErrorResponse");
const getNextPrevPages = require("../utils/pagination");

/**
 * @desc      Get all users
 * @route     GET /api/v1/users
 * @route     GET /api/v1/users?name=username
 * @access    Private/Admin
 */
exports.getUsers = asyncHandler(async (req, res, next) => {
  let users = User.findAll;

  users = users.bind(User, {
    where: {
      username: {
        [Op.substring]: `%${req.query.name}%`,
      },
    },
  });

  // if (req.query.name) {
  //   const options = {
  //     where: {
  //       [Op.or]: [
  //         {
  //           username: {
  //             [Op.like]: `%${req.query.name}%`,
  //           },
  //         },
  //         {
  //           firstname: {
  //             [Op.like]: `%${req.query.name}%`,
  //           },
  //         },
  //         {
  //           lastname: {
  //             [Op.like]: `%${req.query.name}%`,
  //           },
  //         },
  //       ],
  //     },
  //     ...req.paginationOpts,
  //   };

  //   users = await User.paginate(options);

  //   users.pagination = getNextPrevPages(
  //     req.paginationOpts.page,
  //     req.paginationOpts.limit,
  //     users.total
  //   );
  // } else {
  //   users = await User.paginate(req.paginationOpts);

  //   users.pagination = getNextPrevPages(
  //     req.paginationOpts.page,
  //     req.paginationOpts.paginate,
  //     users.total
  //   );
  //   console.log("Paginaiton Opts:", req.paginationOpts);
  //   console.log(
  //     getNextPrevPages(
  //       req.paginationOpts.page,
  //       req.paginationOpts.paginate,
  //       users.total
  //     )
  //   );
  // }

  res.status(201).json({
    success: true,
    data: users,
  });
});

/**
 * @desc      Get a single user
 * @route     GET /api/v1/users/:id
 * @access    Private
 */
exports.getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByPk(req.params.id);

  if (!user) return next(new ErrorResponse("Cet utilisateur n'existe pas"));

  res.status(200).json({
    success: true,
    data: user,
  });
});

/**
 * @desc      Get all friend requests for a user
 * @route     GET /api/v1/users/:userId/friend_requests
 * @access    Private
 */
exports.getUserFriendRequests = asyncHandler(async (req, res, next) => {
  const { userId } = req.params;

  const user = await User.findByPk(userId);

  if (!user)
    return next(
      new ErrorResponse(`L'utilisateur avec l'id ${userId} n' existe pas`)
    );

  const friendRequests = await FriendRequest.findAll({
    where: { request_id_to: userId },
    include: {
      model: User,
      where: {
        id: userId,
      },
      attributes: ["firstname", "username", "lastname"],
    },
  });

  res.status(200).json({
    success: true,
    data: friendRequests,
  });
});

/**
 * @desc      Create a user
 * @route     POST /api/v1/users
 * @access    Public
 */
exports.createUser = asyncHandler(async (req, res, next) => {
  const user = await User.create(req.body);

  res.status(201).json({
    success: true,
    data: user,
  });
});

/**
 * @desc      Update a single user
 * @route     PUT /api/v1/users/:id
 * @access    Private
 */
exports.updateUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByPk(req.params.id);

  if (!user)
    return next(
      new ErrorResponse(
        `L'utilisateur avec l'id ${req.params.id} n'existe pas`,
        404
      )
    );

  if (user.id !== req.user.id)
    return next(
      new ErrorResponse(
        `Vous n'êtes pas authorisé à modifier cet utilisateur`,
        401
      )
    );

  await user.update(req.body);

  res.status(200).json({
    success: true,
    data: user,
  });
});

/**
 * @desc      Delete a single user
 * @route     DELETE /api/v1/users/:id
 * @access    Private/admin
 */
exports.deleteUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByPk(req.params.id);

  if (!user)
    return next(
      new ErrorResponse(
        `L'utilisateur avec l'id ${req.params.id} n'existe pas`,
        404
      )
    );

  if (user.id !== req.user.id)
    return next(
      new ErrorResponse(
        `Vous n'êtes pas authorisé à supprimer cet utilisateur`,
        401
      )
    );

  await user.destroy(req.body);

  res.status(200).json({
    success: true,
    data: {},
  });
});

/**
 * @desc      Upload photo for user
 * @route     PUT /api/v1/users/:id/photo
 * @access    Private
 */
exports.userPhotoUpload = asyncHandler(async (req, res, next) => {
  const user = await User.findByPk(req.params.id);

  if (!user)
    return next(
      new ErrorResponse(
        `L'utilisateur avec l'id ${req.params.id} n'existe pas`,
        404
      )
    );

  if (user.id !== req.user.id)
    return next(
      new ErrorResponse(
        `Vous n'êtes pas authorisé à modifier la photo cet utilisateur`,
        401
      )
    );

  if (!req.files)
    return next(
      new ErrorResponse(`Veuillez envoyer une image de 2Mo ou moins`, 400)
    );

  const file = req.files.file;

  // Make sure the image is a photo
  if (!file.mimetype.startsWith("image"))
    return next(
      new ErrorResponse(`Veuillez envoyer une image de 2Mo ou moins`, 400)
    );

  // Check filesize
  if (file.size > process.env.MAX_FILE_UPLOAD)
    return next(
      new ErrorResponse(`Veuillez envoyer une image de 2Mo ou moins`, 400)
    );

  // Create custom filename
  file.name = `photo_${user.id}${path.parse(file.name).ext}`;

  // Move file to ./public/uploads
  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
    if (err)
      return next(
        new ErrorResponse(
          `Une erreur est survenue durant le transfert d'image`,
          500
        )
      );

    user.update({
      profile_picture: file.name,
    });

    res.status(200).json({
      success: true,
      data: file.name,
    });
  });
});
