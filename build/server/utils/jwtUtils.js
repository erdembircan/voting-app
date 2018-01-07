'use strict';

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * sign a jsonwebtoken token
 * @param {string} data - data
 * @param {string} pass - secret
 */
function sign(data, pass) {
  var payload = {
    sub: data
  };
  var token = _jsonwebtoken2.default.sign(payload, pass);
  return token;
}

/**
 * verify a jsonwebtoken
 * @param {string} token - web token
 * @param {string} pass - token secret
 * @params {function} callback - callback function
 */
function verify(token, pass, callback) {
  _jsonwebtoken2.default.verify(token, pass, function (err, decoded) {
    if (err) return callback(err);

    var data = decoded.sub;
    return callback(null, data);
  });
}

module.exports = {
  sign: sign,
  verify: verify
};
//# sourceMappingURL=jwtUtils.js.map
