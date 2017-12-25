import hash from 'hmacsha1';
import sData from '../sData';
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
const _params = {
  callback: '',
  consumer_key: '',
  nonce: '',
  signature_method: 'HMAC-SHA1',
  token: '',
  tokenSecret: '',
  body: '',
};

/**
 * generate twitter authorizaion header string
 * @param {_params} parameters - parameters
 * @param {string} type - request type
 * @param {string} url - request URL
 * @returns {string} - header string
 */
function createAuthString(parameters, type, url) {
  const tempArray = [];

  Object.keys(parameters).map((key) => {
    if (key === 'body' || key === 'tokenSecret') return;
    const pushStr = `oauth_${key}="${encodeURIComponent(parameters[key])}"`;
    tempArray.push(pushStr);
  });

  const timestamp = `oauth_timestamp="${Math.floor(new Date().getTime() / 1000)}"`;
  tempArray.push(timestamp);

  const version = 'oauth_version="1.0"';
  tempArray.push(version);

  const signature = `oauth_signature="${encodeURIComponent(generateSignature(
    type,
    url,
    tempArray.map(item => item.replace(/(")/g, '')),
    parameters.body,
    parameters.tokenSecret,
  ))}"`;
  tempArray.push(signature);

  return `OAuth ${tempArray.join(', ')}`;
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
  const signatureParams = `${type.toUpperCase()}&${encodeURIComponent(url)}&${encodeURIComponent(parameters.join('&'))}${body ? encodeURIComponent(`&${body}`) : ''}`;

  const signingKey = `${sData['twitter-consumer-secret']}&${tokenSecret || ''}`;
  return hash(signingKey, signatureParams);
}

module.exports = createAuthString;
