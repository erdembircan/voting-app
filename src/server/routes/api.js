import express from 'express';
import mongoose from 'mongoose';
import { flashWrite } from '../utils';
import authenticate from '../middleware/authentication';

const router = new express.Router();
const Poll = require('mongoose').model('Poll');

router.post('/createpoll', authenticate, (req, res) => {
  console.log(req.cookies['auth.loc']);
  console.log(req.body);
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
