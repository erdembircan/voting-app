'use strict';

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _utils = require('../utils');

var _authentication = require('../middleware/authentication');

var _authentication2 = _interopRequireDefault(_authentication);

var _emoji = require('../utils/emoji');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = new _express2.default.Router();
var Poll = require('mongoose').model('Poll');
var Voters = require('mongoose').model('Voters');

router.post('/createpoll', (0, _authentication2.default)({ redirectUrl: '/', error: 'you need to be logged in ' + _emoji.emoji.smileyUnamused }), function (req, res) {
  var items = {};

  (0, _keys2.default)(req.body).map(function (key) {
    if (key.includes('item')) {
      items[req.body[key]] = 1;
    }
  });

  if (items === {}) {
    (0, _utils.flashWrite)(req, 'error', 'error creating poll :(');
    return res.redirect('/');
  }

  var newPoll = new Poll({
    title: req.body.title,
    items: items,
    voters: ['some dude']
  });

  newPoll.save(function (err, savedData) {
    var voters = new Voters({
      pollId: savedData._id,
      sessionIds: []
    });

    voters.save(function (err, voter) {
      if (err) {
        (0, _utils.flashWrite)(req, 'error', 'error creating poll :(');
        return res.redirect('/');
      }

      (0, _utils.flashWrite)(req, 'message', 'poll created ' + _emoji.emoji.smileyHeart);
      return res.redirect('/poll/' + savedData._id);
    });
  });
});

router.post('/vote', function (req, res) {
  var _req$query = req.query,
      id = _req$query.id,
      item = _req$query.item;

  if (!req.session.id) {
    (0, _utils.flashWrite)(req, 'error', 'no session id found');
    return res.send(null);
  }
  Voters.findOne({ pollId: id || 0 }).then(function (found) {
    var voters = found.sessionIds;

    if (voters.includes(req.session.id)) {
      (0, _utils.flashWrite)(req, 'error', 'you already voted for that poll ' + _emoji.emoji.smileyFrown);
      return res.send(null);
    }

    Poll.findOne({ _id: id }, function (err, poll) {
      if (err) return null;
      var items = poll.items;
      if (!items[item]) {
        (0, _utils.flashWrite)(req, 'error', 'could not vote ' + _emoji.emoji.smileyFrown);
        return res.send(saved);
      }
      items[item]++;
      poll.items = {};
      poll.items = items;
      poll.save(function (err, saved) {
        if (err) {
          (0, _utils.flashWrite)(req, 'error', 'could not vote ' + _emoji.emoji.smileyFrown);
          return res.send(saved);
        }
        (0, _utils.flashWrite)(req, 'message', 'voted ' + _emoji.emoji.smileyHeart);

        found.sessionIds.push(req.session.id);
        found.save(function (err, saved) {
          return res.send(saved);
        });
      });
    });
  }).catch(function (err) {
    console.log(err);
    (0, _utils.flashWrite)(req, 'error', 'an error occured, try again later');
    return res.send(null);
  });
});

router.get('/polls/all', function (req, res, next) {
  Poll.find({}, function (err, resp) {
    if (err) {
      console.log(err);
      (0, _utils.flashWrite)(req, 'error', 'an error occured');
      return res.redirect('/');
    }
    res.send(resp);
  });
});
router.get('/polls/:id', function (req, res, next) {
  Poll.findOne({ _id: req.params.id }, function (err, resp) {
    if (err) return res.redirect('/');
    res.send(resp);
  });
});

module.exports = router;
//# sourceMappingURL=api.js.map
