/**
 * @desc Get the prev and next page for pagination
 * @param  {Number} page
 * @param  {Number} limit
 * @param  {Number} total
 * @returns {Object} pagination
 */
module.exports = (page, limit, total) => {
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  // Pagination result
  const pagination = {};

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit,
    };
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    };
  }

  return pagination;
};
