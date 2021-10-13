/**
 * @param  {Request} req
 * @description Build query with allowed where keys such as : username, firstname, lastname, etc.
 * @return {Object} An object for the where clause.
 */
const buildWhereQuery = (req) => {
  // Allowed keys to search by
  const searchFields = ["firstname", "lastname", "username", "country"];

  const whereQuery = {};
  for (const [key, value] of Object.entries(req.query)) {
    if (searchFields.includes(key)) whereQuery[key] = value;
  }

  return whereQuery;
};

module.exports = buildWhereQuery;
