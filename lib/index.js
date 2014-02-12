/**
 * Only allow incoming requests from a given list of IP addresses
 *
 *     connect().use(require('bc-node-request-filter')({
 *       ips: ["127.0.0.1"],
 *       headers: ["X-Forwarded-For"]
 *     }))
 *
 * @param {Object} filters
 *   Map containing approved
 * @return {Function}
 */
module.exports = function filter(filters) {
  if (filters == null) filters = {};

  var approvedIps = filters.ips || [];
  if (typeof approvedIps === "string") approvedIps = [approvedIps];

  return function filter(req, res, next) {
    // Check that current IP falls in the range of approved IPs or fail if not approved
    if (approvedIps.indexOf(req.ip) === -1) {
      res.set('Content-Type', 'text/plain');
      res.send(404, 'Cannot GET ' + req.originalUrl);
    } else {
      next();
    }
  };
};
