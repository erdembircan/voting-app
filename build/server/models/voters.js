'use strict';

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Voters = new _mongoose2.default.Schema({
  pollId: String,
  sessionIds: Array
});

module.exports = _mongoose2.default.model('Voters', Voters);
//# sourceMappingURL=voters.js.map
