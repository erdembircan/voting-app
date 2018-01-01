import express from 'express';
import mongoose from 'mongoose';

const router = new express.Router();
const Poll = require('mongoose').model('Poll');

router.get('/polls/:id', (req, res, next) => {
  Poll.findOne({ _id: req.params.id }, (err, resp) => {
    if (err) return res.redirect('/');
    res.send(resp);
  });
});

module.exports = router;
