const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const tweetSchema = new Schema({
  content: { type: String, required: true, minlength: 5 },
  creator: { type: mongoose.Types.ObjectId, required: true, ref: 'User' },
});

module.exports = mongoose.model('Tweet', tweetSchema);
