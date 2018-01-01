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

/**
 * read session data and then remove it from session
 * @param {object} req - request object
 * @param {string} key - session property name
 * @returns {string} - session property value
 */
function flashRead(req, key) {
  const value = req.session[key];
  req.session[key] = undefined;
  return value;
}

/**
 * write flash messages to session
 * @param {object} req -request object
 * @param {string} key - key
 * @param {string} value - value
 */
function flashWrite(req, key, value) {
  req.session[key] = value;
}

/**
 * generate array of random rgb colors
 * @param {number} amount - array length
 * @return {array} - color array
 */
function generateColors(amount) {
  const rand = () => Math.floor(Math.random() * 255);
  const tempArray = [];
  for (let i = 0; i < amount; i++) {
    tempArray.push(`rgb(${rand()},${rand()},${rand()})`);
  }

  return tempArray;
}

module.exports = {
  parseStringToObject,
  nonce,
  flashRead,
  generateColors,
  flashWrite,
};
