module.exports = (req, res, next) => {
  req.paginationOpts = {
    page: Number(req.query.page || 1),
    paginate: 3,
  };

  next();
};
