const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: 6 },
  tweets: [{ type: mongoose.Types.ObjectId, required: true, ref: 'Tweet' }],
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);
