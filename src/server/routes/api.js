import express from 'express';
import { flashWrite, parseStringToObject } from '../utils';
import { verify } from '../utils/jwtUtils';
import authenticate from '../middleware/authentication';
import { emoji } from '../utils/emoji';
import sData from '../sData';

const router = new express.Router();
const Poll = require('mongoose').model('Poll');
const Voters = require('mongoose').model('Voters');
const User = require('mongoose').model('User');

router.post(
  '/createpoll',
  authenticate({ redirectUrl: '/', error: `you need to be logged in ${emoji.smileyUnamused}` }),
  (req, res) => {
    const items = {};

    Object.keys(req.body).map((key) => {
      if (key.includes('item')) {
        items[req.body[key]] = 1;
      }
    });

    if (items === {}) {
      flashWrite(req, 'error', 'error creating poll :(');
      return res.redirect('/');
    }

    const newPoll = new Poll({
      title: req.body.title,
      items,
      voters: ['some dude'],
    });

    newPoll.save((err, savedData) => {
      const voters = new Voters({
        pollId: savedData._id,
        sessionIds: [],
      });

      voters.save((err, voter) => {
        if (err) {
          flashWrite(req, 'error', 'error creating poll :(');
          return res.redirect('/');
        }

        const authCookie = req.cookies['auth.loc'];

        verify(authCookie, sData['jwt-secret'], (err, sub) => {
          if (err) {
            flashWrite(req, 'error', 'error creating poll :(');
            return res.redirect('/');
          }

          User.findOne({ _id: sub }, (err, user) => {
            if (err) {
              flashWrite(req, 'error', 'error creating poll :(');
              return res.redirect('/');
            }

            user.polls.push(savedData._id);

            user.save((err, saved) => {
              if (err) {
                flashWrite(req, 'error', 'error creating poll :(');
                return res.redirect('/');
              }
              flashWrite(req, 'message', `poll created ${emoji.smileyHeart}`);
              return res.redirect(`/poll/${savedData._id}`);
            });
          });
        });
      });
    });
  },
);

router.post('/vote', (req, res) => {
  const { id, item } = req.query;
  if (!req.session.id) {
    flashWrite(req, 'error', 'no session id found');
    return res.send(null);
  }
  Voters.findOne({ pollId: id || 0 })
    .then((found) => {
      const voters = found.sessionIds;

      if (voters.includes(req.session.id)) {
        flashWrite(req, 'error', `you already voted for that poll ${emoji.smileyFrown}`);
        return res.send(null);
      }

      Poll.findOne({ _id: id }, (err, poll) => {
        if (err) return null;
        const items = poll.items;
        if (!items[item]) {
          flashWrite(req, 'error', `could not vote ${emoji.smileyFrown}`);
          return res.send(saved);
        }
        items[item]++;
        poll.items = {};
        poll.items = items;
        poll.save((err, saved) => {
          if (err) {
            flashWrite(req, 'error', `could not vote ${emoji.smileyFrown}`);
            return res.send(saved);
          }
          flashWrite(req, 'message', `voted ${emoji.smileyHeart}`);

          found.sessionIds.push(req.session.id);
          found.save((err, saved) => res.send(saved));
        });
      });
    })
    .catch((err) => {
      console.log(err);
      flashWrite(req, 'error', 'an error occured, try again later');
      return res.send(null);
    });
});

router.get('/polls/all', (req, res, next) => {
  Poll.find({}, (err, resp) => {
    if (err) {
      console.log(err);
      flashWrite(req, 'error', 'an error occured');
      return res.redirect('/');
    }
    res.send(resp);
  });
});
router.get('/polls/:id', (req, res, next) => {
  Poll.findOne({ _id: req.params.id }, (err, resp) => {
    if (err) return res.redirect('/');
    res.send(resp);
  });
});

module.exports = router;
