/**
 * Only allow incoming requests from a given list of IP
 *   addresses and requiring a given set of provided headers
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

  var requiredHeaders = filters.headers || [];
  if (typeof requiredHeaders === "string") requiredHeaders = [requiredHeaders];

  return function filter(req, res, next) {
    for (var i = 0; i < requiredHeaders.length; i++) {
      // Check that all required headers are present and fail if any are not found
      var header = requiredHeaders[i];
      if (req.headers[header] == null) {
        res.send(404);
        return;
      }
    }

    // Check that current IP falls in the range of approved IPs or fail if not approved
    if (approvedIps.indexOf(req.ip) === -1) {
      res.send(404);
    } else {
      next();
    }
  };
};
