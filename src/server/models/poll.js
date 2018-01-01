import mongoose from 'mongoose';

const PollSchema = new mongoose.Schema({
  title: String,
  items: Object,
  voters: Array,
});

module.exports = mongoose.model('Poll', PollSchema);
