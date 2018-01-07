'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

var _main = require('../templates/layouts/main.js');

var _main2 = _interopRequireDefault(_main);

var _index = require('../templates/index.js');

var _index2 = _interopRequireDefault(_index);

var _auth_res = require('../templates/auth_res.js');

var _auth_res2 = _interopRequireDefault(_auth_res);

var _poll = require('../templates/poll.js');

var _poll2 = _interopRequireDefault(_poll);

var _createPoll = require('../templates/createPoll.js');

var _createPoll2 = _interopRequireDefault(_createPoll);

var _twitterAuth = require('../utils/twitterAuth');

var _twitterAuth2 = _interopRequireDefault(_twitterAuth);

var _sData = require('../sData');

var _sData2 = _interopRequireDefault(_sData);

var _utils = require('../utils');

var _jwtUtils = require('../utils/jwtUtils');

var _authentication = require('../middleware/authentication');

var _authentication2 = _interopRequireDefault(_authentication);

var _emoji = require('../utils/emoji');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

require('../models/user');
require('../models/poll');
require('../models/voters');
var User = require('mongoose').model('User');
var Poll = require('mongoose').model('Poll');

var router = _express2.default.Router();

router.get('/favicon.ico', function (req, res) {
  res.sendStatus(203);
});

router.get('/', function (req, res) {
  res.send((0, _utils.renderToLayout)(_main2.default, (0, _index2.default)({ userName: req.session.user ? req.session.user.name : '' }), req, {
    user: req.session.user
  }));
});

router.get('/createpoll', (0, _authentication2.default)({ error: 'you need to be logged in ' + _emoji.emoji.smileyUnamused, redirectUrl: '/' }), function (req, res, next) {
  res.send((0, _utils.renderToLayout)(_main2.default, (0, _createPoll2.default)(), req, {
    user: req.session.user
  }));
});

router.get('/login', function (req, res, next) {
  var authString = (0, _twitterAuth2.default)({
    callback: 'http://localhost:3000/sign-in-with-twitter/',
    consumer_key: _sData2.default['twitter-consumer-key'],
    nonce: (0, _utils.nonce)(42),
    signature_method: 'HMAC-SHA1'
  }, 'post', 'https://api.twitter.com/oauth/request_token');

  var config = {
    headers: { Authorization: authString }
  };

  _axios2.default.post('https://api.twitter.com/oauth/request_token', {}, config).then(function (resp) {
    var data = resp.data;

    var parsedObj = (0, _utils.parseStringToObject)(data, '&');

    if (parsedObj.oauth_callback_confirmed === 'true') {
      (0, _utils.flashWrite)(req, 'oauth_token', parsedObj.oauth_token);
      (0, _utils.flashWrite)(req, 'oauth_token_secret', parsedObj.oauth_token_secret);
      res.redirect(302, 'https://api.twitter.com/oauth/authenticate?oauth_token=' + encodeURIComponent(parsedObj.oauth_token));
    }
  }).catch(function (err) {
    next(err);
  });
});

router.get('/sign-in-with-twitter', function (req, res, next) {
  var sessionToken = (0, _utils.flashRead)(req, 'oauth_token');
  var receivedToken = req.query.oauth_token;
  var sessionTokenSecret = (0, _utils.flashRead)(req, 'oauth_token_secret');

  if (sessionToken === receivedToken) {
    var authString = (0, _twitterAuth2.default)({
      consumer_key: _sData2.default['twitter-consumer-key'],
      nonce: (0, _utils.nonce)(42),
      signature_method: 'HMAC-SHA1',
      token: sessionToken,
      body: 'oauth_verifier=' + req.query.oauth_verifier,
      tokenSecret: sessionTokenSecret
    }, 'post', 'https://api.twitter.com/oauth/access_token');

    var config = {
      headers: { Authorization: authString }
    };

    var content = 'oauth_verifier= ' + req.query.oauth_verifier;
    _axios2.default.post('https://api.twitter.com/oauth/access_token', content, config).then(function (resp) {
      var data = resp.data;

      var parsedObj = (0, _utils.parseStringToObject)(data, '&');

      var newUser = new User({
        password: (0, _utils.nonce)(42),
        token: parsedObj.oauth_token,
        tokenSecret: parsedObj.oauth_token_secret
      });

      newUser.save(function (err, save) {
        if (err && err.code !== 11000) next(err);
        User.findOne({ token: newUser.token }, function (findErr, userData) {
          if (findErr) next(findErr);
          var payload = (0, _jwtUtils.sign)(userData._id, _sData2.default['jwt-secret']);
          res.cookie('auth.loc', payload, { maxAge: 30 * 24 * 60 * 60 * 1000 });
          (0, _utils.flashWrite)(req, 'message', 'log in successfull ' + _emoji.emoji.smileyBig);

          // prepare for fetching user details from twitter
          var authString = (0, _twitterAuth2.default)({
            consumer_key: _sData2.default['twitter-consumer-key'],
            nonce: (0, _utils.nonce)(42),
            signature_method: 'HMAC-SHA1',
            token: userData.token,
            tokenSecret: userData.tokenSecret
          }, 'get', 'https://api.twitter.com/1.1/account/verify_credentials.json');

          (0, _axios2.default)({
            method: 'get',
            url: 'https://api.twitter.com/1.1/account/verify_credentials.json',
            headers: { Authorization: authString }
          }).then(function (resp) {
            req.session.user = {
              avatar: resp.data.profile_image_url,
              name: resp.data.name
            };

            res.redirect('/auth_resp');
          }).catch(function (err) {
            next(err);
          });
        });
      });
    }).catch(function (err) {
      next(err);
    });
  } else next('token missmatch, try again later');
});

router.get('/poll/:id', function (req, res) {
  Poll.findOne({ _id: req.params.id }, function (err, resp) {
    if (err) {
      (0, _utils.flashWrite)(req, 'error', 'invalid poll id ' + _emoji.emoji.smileyFrown);
      return res.redirect('/');
    }

    var pollTitle = resp.title;
    pollTitle += pollTitle.endsWith('?') ? '' : '?';
    res.send((0, _utils.renderToLayout)(_main2.default, (0, _poll2.default)({ id: req.params.id, pollTitle: pollTitle }), req, {
      user: req.session.user
    }));
  });
});

router.get('/auth_resp', function (req, res) {
  res.send((0, _auth_res2.default)());
});

router.get('/logout', function (req, res) {
  if (req.cookies['auth.loc']) res.clearCookie('auth.loc');
  (0, _utils.flashWrite)(req, 'message', 'logged out ' + _emoji.emoji.smileyUnamused);
  req.session.user = undefined;
  res.redirect('/');
});

exports.default = router;
//# sourceMappingURL=index.js.map
