'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _compression = require('compression');

var _compression2 = _interopRequireDefault(_compression);

var _zlib = require('zlib');

var _zlib2 = _interopRequireDefault(_zlib);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _cookieParser = require('cookie-parser');

var _cookieParser2 = _interopRequireDefault(_cookieParser);

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _expressSession = require('express-session');

var _expressSession2 = _interopRequireDefault(_expressSession);

var _routes = require('./routes');

var _routes2 = _interopRequireDefault(_routes);

var _api = require('./routes/api');

var _api2 = _interopRequireDefault(_api);

var _ = require('./templates/404.js');

var _2 = _interopRequireDefault(_);

var _sData = require('./sData');

var _sData2 = _interopRequireDefault(_sData);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var compress = (0, _compression2.default)({
  flush: _zlib2.default.Z_PARTIAL_FLUSH
});

var Server = function () {
  function Server(port, dbObject) {
    _classCallCheck(this, Server);

    this._app = (0, _express2.default)();
    this._app.set('port', process.env.PORT || port);
    this._port = this._app.get('port');
    this._app.use(compress);
    this._db = dbObject;
    this._app.use('/css', _express2.default.static(_path2.default.resolve(__dirname, '../client/css')));
    this._app.use('/js', _express2.default.static(_path2.default.resolve(__dirname, '../client/scripts')));

    this._app.set('json spaces', 2);

    this._app.use((0, _expressSession2.default)({
      secret: _sData2.default['session-secret'],
      resave: false,
      saveUninitialized: true,
      cookie: { maxAge: 365 * 24 * 60 * 60 * 1000 }
    }));

    this._app.use((0, _cookieParser2.default)());

    this._app.use(_bodyParser2.default.urlencoded({ extended: false }));

    this._app.use(_routes2.default);
    this._app.use('/api', _api2.default);

    this._app.use(function (req, res) {
      res.status(404).send((0, _2.default)());
    });

    this._app.use(function (err, req, res, next) {
      res.status(500).send('An error occured: ' + err);
    });
  }

  _createClass(Server, [{
    key: 'listen',
    value: function listen() {
      var _this = this;

      this._app.listen(this._port, function () {
        console.log(_chalk2.default.bgBlue.bold('[SERVER]:') + ' \uD83C\uDF0D  Server started on port: ' + _this._port);
      });
    }
  }]);

  return Server;
}();

exports.default = Server;
//# sourceMappingURL=server.js.map
