const jwt = require("jsonwebtoken");
const asyncHandler = require("./async");
const ErrorResponse = require("../utils/ErrorResponse");
const { User } = require("../models");

/**
 * @desc Make sure the user is logged in and protect routes.
 */
exports.protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  //   Make sur token exists

  if (!token)
    return next(
      new ErrorResponse("Vous n'êtes pas authorisé à accéder à cette route."),
      401
    );

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findByPk(decoded.id);

    next();
  } catch (error) {
    return next(
      new ErrorResponse("Vous n'êtes pas authorisé à accéder à cette route."),
      401
    );
  }
});

exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role))
      return next(
        new ErrorResponse(
          `L'utilisateur avec le role ${req.user.role} n'est pas authorisé à accéder à cette route.`
        ),
        403
      );
    next();
  };
};
