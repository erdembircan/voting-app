/**
 * parse a string joined with a char into an key/value object
 * @param {string} value - value
 * @param {string} joinChar - char that joined the pairs together
 * @returns {object} - parsed object
 */
function parseStringToObject(value, joinChar) {
  const parsedObj = {};

  const parsedDataOne = value.split(joinChar);

  parsedDataOne.map((part) => {
    const temp = part.split('=');
    parsedObj[temp[0]] = temp[1];
  });

  return parsedObj;
}

/**
 * generate a unique string with a given length
 * @param {number} length - length of unique string
 * @returns {string} - unique string
 */
function nonce(length) {
  let text = '';

  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  return text;
}

module.exports = { parseStringToObject, nonce };
