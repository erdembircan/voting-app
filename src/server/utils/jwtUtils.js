import jwt from 'jsonwebtoken';

/**
 * sign a jsonwebtoken token
 * @param {string} data - data
 * @param {string} pass - secret
 */
function sign(data, pass) {
  const payload = {
    sub: data,
  };
  const token = jwt.sign(payload, pass);
  return token;
}

/**
 * verify a jsonwebtoken
 * @param {string} token - web token
 * @param {string} pass - token secret
 * @params {function} callback - callback function
 */
function verify(token, pass, callback) {
  jwt.verify(token, pass, (err, decoded) => {
    if (err) return callback(err);

    const data = decoded.sub;
    return callback(null, data);
  });
}

module.exports = {
  sign,
  verify,
};
