'use strict';

var _jwtUtils = require('../utils/jwtUtils');

var _utils = require('../utils');

var _sData = require('../sData');

var _sData2 = _interopRequireDefault(_sData);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function authenticate() {
  var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : { redirectUrl: '/', message: '', error: '' };

  return function (req, res, next) {
    var User = require('mongoose').model('User');
    var authCookie = req.cookies['auth.loc'];
    if (authCookie) {
      (0, _jwtUtils.verify)(authCookie, _sData2.default['jwt-secret'], function (err, sub) {
        if (err) return next(err);
        User.findOne({ _id: sub }, function (err, userData) {
          if (err) {
            (0, _utils.flashWrite)(req, 'error', params.error);
            (0, _utils.flashWrite)(req, 'message', params.message);
            return res.redirect(params.redirectUrl);
          }
          return next();
        });
      });
    } else {
      (0, _utils.flashWrite)(req, 'error', params.error);
      (0, _utils.flashWrite)(req, 'message', params.message);
      return res.redirect(params.redirectUrl);
    }
  };
}

module.exports = authenticate;
//# sourceMappingURL=authentication.js.map
