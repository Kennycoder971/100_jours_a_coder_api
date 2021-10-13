const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log to console for dev
  console.log(err);

  // Map the errors if it exists
  const errors =
    err.errors?.map((e) => ({
      [e.path]: e.message,
    })) || [];

  res.status(error.statusCode || 500).json({
    success: false,
    errors,
    sqlMessage: error?.original?.sqlMessage,
    errorMessage: error.message,
  });
};

module.exports = errorHandler;
