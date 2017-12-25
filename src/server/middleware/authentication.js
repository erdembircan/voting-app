import { verify } from '../utils/jwtUtils';
import sData from '../sData';

module.exports = (req, res, next) => {
  const User = require('mongoose').model('User');
  const authCookie = req.cookies['auth.loc'];
  if (authCookie) {
    verify(authCookie, sData['jwt-secret'], (err, sub) => {
      if (err) return next(err);
      User.findOne({ _id: sub }, (err, userData) => {
        if (err) return next(err);
        return next();
      });
    });
  } else return res.redirect('/');
};
