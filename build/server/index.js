'use strict';

var _minimist = require('minimist');

var _minimist2 = _interopRequireDefault(_minimist);

var _server = require('./server');

var _server2 = _interopRequireDefault(_server);

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

var _sData = require('./sData');

var _sData2 = _interopRequireDefault(_sData);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var args = (0, _minimist2.default)(process.argv, {
  default: {
    'server-port': _config2.default['server-port']
  }
});

require('./models').connect(_sData2.default['mongo-prod']);

var server = new _server2.default(args['server-port']);
server.listen();
//# sourceMappingURL=index.js.map
