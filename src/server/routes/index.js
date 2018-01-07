import express from 'express';
import axios from 'axios';
import mainLayout from '../templates/layouts/main.js';
import mainTemp from '../templates/index.js';
import authResp from '../templates/auth_res.js';
import pollTemp from '../templates/poll.js';
import createPollTemp from '../templates/createPoll.js';
import createAuthString from '../utils/twitterAuth';
import sData from '../sData';
import { parseStringToObject, nonce, flashRead, flashWrite, renderToLayout } from '../utils';
import { sign } from '../utils/jwtUtils';
import authenticate from '../middleware/authentication';
import { emoji } from '../utils/emoji';

require('../models/user');
require('../models/poll');
require('../models/voters');
const User = require('mongoose').model('User');
const Poll = require('mongoose').model('Poll');

const router = express.Router();

router.get('/favicon.ico', (req, res) => {
  res.sendStatus(203);
});

router.get('/', (req, res) => {
  res.send(renderToLayout(
    mainLayout,
    mainTemp({ userName: req.session.user ? req.session.user.name : '' }),
    req,
    {
      user: req.session.user,
    },
  ));
});

router.get(
  '/createpoll',
  authenticate({ error: `you need to be logged in ${emoji.smileyUnamused}`, redirectUrl: '/' }),
  (req, res, next) => {
    res.send(renderToLayout(mainLayout, createPollTemp(), req, {
      user: req.session.user,
    }));
  },
);


router.get('/login', (req, res, next) => {
  const authString = createAuthString(
    {
      callback: 'https://intense-dusk-58236.herokuapp.com/sign-in-with-twitter/',
      consumer_key: sData['twitter-consumer-key'],
      nonce: nonce(42),
      signature_method: 'HMAC-SHA1',
    },
    'post',
    'https://api.twitter.com/oauth/request_token',
  );

  const config = {
    headers: { Authorization: authString },
  };

  axios
    .post('https://api.twitter.com/oauth/request_token', {}, config)
    .then((resp) => {
      const { data } = resp;
      const parsedObj = parseStringToObject(data, '&');

      if (parsedObj.oauth_callback_confirmed === 'true') {
        flashWrite(req, 'oauth_token', parsedObj.oauth_token);
        flashWrite(req, 'oauth_token_secret', parsedObj.oauth_token_secret);
        res.redirect(
          302,
          `https://api.twitter.com/oauth/authenticate?oauth_token=${encodeURIComponent(parsedObj.oauth_token)}`,
        );
      }
    })
    .catch((err) => {
      next(err);
    });
});

router.get('/sign-in-with-twitter', (req, res, next) => {
  const sessionToken = flashRead(req, 'oauth_token');
  const receivedToken = req.query.oauth_token;
  const sessionTokenSecret = flashRead(req, 'oauth_token_secret');

  if (sessionToken === receivedToken) {
    const authString = createAuthString(
      {
        consumer_key: sData['twitter-consumer-key'],
        nonce: nonce(42),
        signature_method: 'HMAC-SHA1',
        token: sessionToken,
        body: `oauth_verifier=${req.query.oauth_verifier}`,
        tokenSecret: sessionTokenSecret,
      },
      'post',
      'https://api.twitter.com/oauth/access_token',
    );

    const config = {
      headers: { Authorization: authString },
    };

    const content = `oauth_verifier= ${req.query.oauth_verifier}`;
    axios
      .post('https://api.twitter.com/oauth/access_token', content, config)
      .then((resp) => {
        const { data } = resp;
        const parsedObj = parseStringToObject(data, '&');

        const newUser = new User({
          password: nonce(42),
          token: parsedObj.oauth_token,
          tokenSecret: parsedObj.oauth_token_secret,
        });

        newUser.save((err, save) => {
          if (err && err.code !== 11000) next(err);
          User.findOne({ token: newUser.token }, (findErr, userData) => {
            if (findErr) next(findErr);
            const payload = sign(userData._id, sData['jwt-secret']);
            res.cookie('auth.loc', payload, { maxAge: 30 * 24 * 60 * 60 * 1000 });
            flashWrite(req, 'message', `log in successfull ${emoji.smileyBig}`);

            // prepare for fetching user details from twitter
            const authString = createAuthString(
              {
                consumer_key: sData['twitter-consumer-key'],
                nonce: nonce(42),
                signature_method: 'HMAC-SHA1',
                token: userData.token,
                tokenSecret: userData.tokenSecret,
              },
              'get',
              'https://api.twitter.com/1.1/account/verify_credentials.json',
            );

            axios({
              method: 'get',
              url: 'https://api.twitter.com/1.1/account/verify_credentials.json',
              headers: { Authorization: authString },
            })
              .then((resp) => {
                req.session.user = {
                  avatar: resp.data.profile_image_url,
                  name: resp.data.name,
                };

                res.redirect('/auth_resp');
              })
              .catch((err) => {
                next(err);
              });
          });
        });
      })
      .catch((err) => {
        next(err);
      });
  } else next('token missmatch, try again later');
});

router.get('/poll/:id', (req, res) => {
  Poll.findOne({ _id: req.params.id }, (err, resp) => {
    if (err) {
      flashWrite(req, 'error', `invalid poll id ${emoji.smileyFrown}`);
      return res.redirect('/');
    }

    let pollTitle = resp.title;
    pollTitle += pollTitle.endsWith('?') ? '' : '?';
    res.send(renderToLayout(mainLayout, pollTemp({ id: req.params.id, pollTitle }), req, {
      user: req.session.user,
    }));
  });
});

router.get('/auth_resp', (req, res) => {
  res.send(authResp());
});

router.get('/logout', (req, res) => {
  if (req.cookies['auth.loc']) res.clearCookie('auth.loc');
  flashWrite(req, 'message', `logged out ${emoji.smileyUnamused}`);
  req.session.user = undefined;
  res.redirect('/');
});

export default router;
