import { verify } from '../utils/jwtUtils';
import { flashWrite } from '../utils';
import sData from '../sData';

function authenticate(params = { redirectUrl: '/', message: '', error: '' }) {
  return (req, res, next) => {
    const User = require('mongoose').model('User');
    const authCookie = req.cookies['auth.loc'];
    if (authCookie) {
      verify(authCookie, sData['jwt-secret'], (err, sub) => {
        if (err) return next(err);
        User.findOne({ _id: sub }, (err, userData) => {
          if (err) {
            flashWrite(req, 'error', params.error);
            flashWrite(req, 'message', params.message);
            return res.redirect(params.redirectUrl);
          }
          return next();
        });
      });
    } else {
      flashWrite(req, 'error', params.error);
      flashWrite(req, 'message', params.message);
      return res.redirect(params.redirectUrl);
    }
  };
}

module.exports = authenticate;

// module.exports = (req, res, next) => {
//   const User = require('mongoose').model('User');
//   const authCookie = req.cookies['auth.loc'];
//   if (authCookie) {
//     verify(authCookie, sData['jwt-secret'], (err, sub) => {
//       if (err) return next(err);
//       User.findOne({ _id: sub }, (err, userData) => {
//         if (err) return next(err);
//         return next();
//       });
//     });
//   } else return res.redirect('/');
// };
