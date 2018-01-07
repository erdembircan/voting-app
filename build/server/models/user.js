'use strict';

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _bcrypt = require('bcrypt');

var _bcrypt2 = _interopRequireDefault(_bcrypt);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var UserSchema = new _mongoose2.default.Schema({
  password: String,
  token: {
    type: String,
    index: { unique: true }
  },
  tokenSecret: String
});

UserSchema.pre('save', function saveHook(next) {
  var user = this;

  return _bcrypt2.default.genSalt(function (err, salt) {
    if (err) return next(err);

    user.password = _bcrypt2.default.hashSync(user.password, salt);
    // user.tokenSecret = bcrypt.hashSync(user.tokenSecret, salt);

    return next();
  });
});

module.exports = _mongoose2.default.model('User', UserSchema);
//# sourceMappingURL=user.js.map
