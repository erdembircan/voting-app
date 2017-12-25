import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const UserSchema = new mongoose.Schema({
  password: String,
  token: {
    type: String,
    index: { unique: true },
  },
  tokenSecret: String,
});

UserSchema.pre('save', function saveHook(next) {
  const user = this;

  return bcrypt.genSalt((err, salt) => {
    if (err) return next(err);

    user.password = bcrypt.hashSync(user.password, salt);
    user.tokenSecret = bcrypt.hashSync(user.tokenSecret, salt);

    return next();
  });
});

module.exports = mongoose.model('User', UserSchema);
