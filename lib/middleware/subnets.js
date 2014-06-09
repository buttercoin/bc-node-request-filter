/**
 * Only allow incoming requests from a given list of subnets
 *
 *     connect().use(require('bc-node-request-filter')({
 *       ips: ["127.0.0.0/16"],
 *       headers: ["X-Forwarded-For"]
 *     }))
 *
 * @param {Object} filters
 *   Map containing approved
 * @return {Function}
 */
module.exports = function (filters) {
  if (filters == null) filters = {};

  var approvedSubnets = filters.subnets || [];
  if (typeof approvedSubnets === "string") approvedSubnets = [approvedSubnets];

  var insubnet = require('insubnet');

  return function (req, res, next) {
    // Check that the current IP is in one of the accepted subnets
    if (insubnet.Validate(req.ip, approvedSubnets) === true) {
      next();
    } else {
      console.log(req.ip + ' not in approved subnets ' + approvedSubnets);
      res.set('Content-Type', 'text/plain');
      res.send(404, 'Cannot GET ' + req.originalUrl);
    }
  }
};
