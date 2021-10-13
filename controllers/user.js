const { User } = require("../models");
const asyncHandler = require("../middlewares/async");
const ErrorResponse = require("../utils/ErrorResponse");
const buildWhereQuery = require("../utils/buildWherequery");

/**
 * @desc      Get all users
 * @route     GET /api/v1/users
 * @route     GET /api/v1/users?name=username
 * @access    Private/Admin
 */
exports.getUsers = asyncHandler(async (req, res, next) => {
  let users;

  const whereQuery = buildWhereQuery(req);

  // If req query obj is not empty, search with query keys
  if (req.query && Object.keys(req.query).length !== 0) {
    users = await User.findAll({
      where: whereQuery,
    });
  } else {
    users = await User.findAll();
  }

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

  await user.destroy(req.body);

  res.status(200).json({
    success: true,
    data: {},
  });
});
