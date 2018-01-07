'use strict';

var _hmacsha = require('hmacsha1');

var _hmacsha2 = _interopRequireDefault(_hmacsha);

var _sData = require('../sData');

var _sData2 = _interopRequireDefault(_sData);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @typedef _params - params
 * @prop {string} [consumer_key] - consumer key
 * @prop {string} [callback] - callback
 * @prop {string} [nonce] - nonce
 * @prop {string} [signature_method] - signature method
 * @prop {string} [token] - token
 * @prop {string} [tokenSecret] - token secret
 * @prop {string} [body] - body
 */
var _params = {
  callback: '',
  consumer_key: '',
  nonce: '',
  signature_method: 'HMAC-SHA1',
  token: '',
  tokenSecret: '',
  body: ''
};

/**
 * generate twitter authorizaion header string
 * @param {_params} parameters - parameters
 * @param {string} type - request type
 * @param {string} url - request URL
 * @returns {string} - header string
 */
function createAuthString(parameters, type, url) {
  var tempArray = [];

  Object.keys(parameters).map(function (key) {
    if (key === 'body' || key === 'tokenSecret') return;
    var pushStr = 'oauth_' + key + '="' + encodeURIComponent(parameters[key]) + '"';
    tempArray.push(pushStr);
  });

  var timestamp = 'oauth_timestamp="' + Math.floor(new Date().getTime() / 1000) + '"';
  tempArray.push(timestamp);

  var version = 'oauth_version="1.0"';
  tempArray.push(version);

  var signature = 'oauth_signature="' + encodeURIComponent(generateSignature(type, url, tempArray.map(function (item) {
    return item.replace(/(")/g, '');
  }), parameters.body, parameters.tokenSecret)) + '"';
  tempArray.push(signature);

  return 'OAuth ' + tempArray.join(', ');
}

/**
 * generate twitter auth signature
 * @param {string} type - type of the request
 * @param {string} url - request URL
 * @param {string} parameters - parameters
 * @param {string} [body] - body
 * @param {string} [tokenSecret] - token secret
 * @returns {string} - signature
 */
function generateSignature(type, url, parameters, body, tokenSecret) {
  var signatureParams = type.toUpperCase() + '&' + encodeURIComponent(url) + '&' + encodeURIComponent(parameters.sort().join('&')) + (body ? encodeURIComponent('&' + body) : '');

  var signingKey = _sData2.default['twitter-consumer-secret'] + '&' + (tokenSecret || '');

  return (0, _hmacsha2.default)(signingKey, signatureParams);
}

module.exports = createAuthString;
//# sourceMappingURL=twitterAuth.js.map
