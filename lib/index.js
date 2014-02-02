/**
 * Only allow incoming requests from a given list of IP addresses
 *
 *     connect().use(require('bc-node-request-filter')(["127.0.0.1"]))
 *
 * @param {Array} list
 *   List of IP Addresses that should be allowed and process request
 * @param {String} level
 * @return {Function}
 */
module.exports = function filter(approvedList) {
  if (typeof approvedList === "string") approvedList = [approvedList]

  return function filter(req, res, next) {
    if (approvedList.indexOf(req.ip) === -1) {
      res.send(404);
    } else {
      next();
    }
  };
};
