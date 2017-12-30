import express from 'express';
import axios from 'axios';
import mainTemp from '../templates/index.js';
import authResp from '../templates/auth_res.js';
import createAuthString from '../utils/twitterAuth';
import sData from '../sData';
import { parseStringToObject, nonce, flashRead } from '../utils';
import { sign, verify } from '../utils/jwtUtils';
import authenticate from '../middleware/authentication';
import { XMLHttpRequest } from 'xmlhttprequest';

require('../models/user');
const User = require('mongoose').model('User');

const router = express.Router();

router.get('/favicon.ico', (req, res) => {
  res.sendStatus(203);
});

router.get('/', (req, res, next) => {
  const authCookie = req.cookies['auth.loc'];
  const mainData = {
    message: flashRead(req, 'message'),
    extraScripts: "<script src= 'js/main_bundle.js' defer></script>",
  };

  if (authCookie) {
    verify(authCookie, sData['jwt-secret'], (err, data) => {
      if (err) {
        mainData.error = err;
        res.send(mainTemp(mainData));
      } else {
        User.findOne({ _id: data })
          .then((user) => {
            const userToken = user.token;
            const userTokenSecret = user.tokenSecret;

            const authString = createAuthString(
              {
                consumer_key: sData['twitter-consumer-key'],
                nonce: nonce(42),
                signature_method: 'HMAC-SHA1',
                token: userToken,
                tokenSecret: userTokenSecret,
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
                mainData.user = {};
                mainData.user.avatar = resp.data.profile_image_url;
                mainData.user.name = 'working on that';
                res.send(mainTemp(mainData));
              })
              .catch((err) => {
                next(err);
              });
          })
          .catch((err) => {
            next(err);
          });
      }
    });
  } else res.send(mainTemp(mainData));
});

router.get('/createpoll', authenticate, (req, res) => {
  res.send('ok');
});

router.get('/user', (req, res, next) => {
  const authString = createAuthString(
    {
      consumer_key: sData['twitter-consumer-key'],
      nonce: nonce(42),
      signature_method: 'HMAC-SHA1',
      token: '893691474835013632-yqpEfnVjOcAg3ngzUYepYr0JAEek4k7',
      tokenSecret: 'Etv25cj2kIDH1rDTkw6ImuNBv5pAlH9qT5zDfonp2EW3r',
    },
    'get',
    'https://api.twitter.com/1.1/account/verify_credentials.json',
  );

  const config = {
    headers: { Authorization: authString },
  };

  axios({
    method: 'get',
    url: 'https://api.twitter.com/1.1/account/verify_credentials.json',
    headers: { Authorization: authString },
  })
    .then((resp) => {
      res.send(resp.data);
    })
    .catch((err) => {
      next(err);
    });
});

router.get('/login', (req, res, next) => {
  const authString = createAuthString(
    {
      callback: 'http://localhost:3000/sign-in-with-twitter/',
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
        req.session.oauth_token = parsedObj.oauth_token;
        req.session.oauth_token_secret = parsedObj.oauth_token_secret;
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
            req.session.message = 'log in successfull';
            res.redirect('/auth_resp');
          });
        });
      })
      .catch((err) => {
        next(err);
      });
  } else next('token missmatch, try again later');
});

router.get('/auth_resp', (req, res) => {
  res.send(authResp());
});

export default router;