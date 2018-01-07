'use strict';

var mongoose = require('mongoose');

module.exports.connect = function (uri) {
  mongoose.connect(uri);
  mongoose.Promise = global.Promise;

  mongoose.connection.on('error', function (err) {
    console.log('An error occured');
  });
  require('./user');
};
//# sourceMappingURL=index.js.map
