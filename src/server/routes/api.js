import express from 'express';
import { flashWrite } from '../utils';
import authenticate from '../middleware/authentication';

const router = new express.Router();
const Poll = require('mongoose').model('Poll');

router.post('/createpoll', authenticate, (req, res) => {
  const items = {};

  Object.keys(req.body).map((key) => {
    if (key.includes('item')) {
      items[key] = 1;
    }
  });

  const newPoll = new Poll({
    title: req.body.title,
    items,
    voters: ['some dude'],
  });

  newPoll.save((err, savedData) => {
    if (err) {
      flashWrite(req, 'error', 'error creating poll :(');
      return res.redirect('/');
    }

    flashWrite(req, 'message', 'poll created :)');
    return res.redirect(`/poll/${savedData._id}`);
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
