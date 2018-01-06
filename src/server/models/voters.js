import mongoose from 'mongoose';

const Voters = new mongoose.Schema({
  pollId: String,
  sessionIds: Array,
});

module.exports = mongoose.model('Voters', Voters);
