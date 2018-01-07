'use strict';

/**
 * parse a string joined with a char into an key/value object
 * @param {string} value - value
 * @param {string} joinChar - char that joined the pairs together
 * @returns {object} - parsed object
 */
function parseStringToObject(value, joinChar) {
  var parsedObj = {};

  var parsedDataOne = value.split(joinChar);

  parsedDataOne.map(function (part) {
    var temp = part.split('=');
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
  var text = '';

  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < length; i++) {
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
  var value = req.session[key];
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
  var rand = function rand() {
    return Math.floor(Math.random() * 255);
  };
  var tempArray = [];
  for (var i = 0; i < amount; i++) {
    tempArray.push('rgb(' + rand() + ',' + rand() + ',' + rand() + ')');
  }

  return tempArray;
}

function renderToLayout(layout, partial, req) {
  var layoutParams = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

  layoutParams.mainBody = partial;
  layoutParams.error = flashRead(req, 'error');
  layoutParams.message = flashRead(req, 'message');
  return layout(layoutParams);
}

module.exports = {
  parseStringToObject: parseStringToObject,
  nonce: nonce,
  flashRead: flashRead,
  generateColors: generateColors,
  flashWrite: flashWrite,
  renderToLayout: renderToLayout
};
//# sourceMappingURL=index.js.map
