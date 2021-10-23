const { User } = require("../models");
const asyncHandler = require("../middlewares/async");
const ErrorResponse = require("../utils/ErrorResponse");

/**
 * @desc      Register user
 * @route     POST /api/v1/auth/register
 * @access    Public
 */
exports.register = asyncHandler(async (req, res, next) => {
  const user = await User.create(req.body);
  const token = user.getSignedJwtToken();

  res.status(200).json({
    success: true,
    data: user,
    token,
  });
});

/**
 * @desc      Login user
 * @route     POST /api/v1/auth/login
 * @access    Public
 */
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password)
    return next(
      new ErrorResponse("Veuillez fournir un email et un mot de passe", 400)
    );

  // Check email first
  const user = await User.findOne({
    where: {
      email,
    },
  });

  if (!user)
    return next(
      new ErrorResponse("L'email et/ou le mot de passe sont invalides", 401)
    );

  // Match user entered password to hashed password in database
  const isMatch = await user.matchPassword(password);

  if (!isMatch)
    return next(
      new ErrorResponse("L'email et/ou le mot de passe sont invalides", 401)
    );

  sendTokenResponse(user, 200, res);
});

/**
 * @desc      Get current logged in user
 * @route     GET /api/v1/auth/me
 * @access    Private
 */
exports.getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findByPk(req.user.id);

  res.status(200).json({ success: true, data: user });
});

/**
 * @desc      Get current logged in user
 * @route     POST /api/v1/auth/forgotpassword
 * @access    Public
 */
exports.forgotPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({
    where: {
      email: req.body.email,
    },
  });

  if (!user)
    return next(
      new ErrorResponse("Il n'y a pas d'utilisateur avec cet email.", 404)
    );

  // Get reset token
  // const resetToken = user.getResetPasswordToken();
  console.log(await user.getResetPasswordToken());
  res.status(200).json({ success: true, data: user });
});

// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  // Create token
  const token = user.getSignedJwtToken();

  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === "production") options.secure = true;

  res
    .status(statusCode)
    .cookie("token", token, options)
    .json({ success: true, token });
};
