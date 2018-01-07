'use strict';

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var PollSchema = new _mongoose2.default.Schema({
  title: String,
  items: Object,
  voters: Array
});

module.exports = _mongoose2.default.model('Poll', PollSchema);
//# sourceMappingURL=poll.js.map
