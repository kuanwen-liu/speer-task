const { validationResult } = require('express-validator');
const mongoose = require('mongoose');

const HttpError = require('../models/http-error');
const Tweet = require('../models/tweet');
const User = require('../models/user');

let TW = [
  {
    id: 't1',
    content: 'Hello heeyyyy',
    creator: 'u1',
  },
];

const getTweetById = async (req, res, next) => {
  const tweetId = req.params.tid;

  let tweet;
  try {
    tweet = await Tweet.findById(tweetId);
  } catch (err) {
    const error = new HttpError('Something went wrong.', 500);
    return next(error);
  }

  if (!tweet) {
    const error = new HttpError(
      'Could not find tweet for the provide id.',
      404
    );
    return next(error);
  }
  res.json({ tweet: tweet.toObject({ getters: true }) });
};

const getTweetsByUserId = async (req, res, next) => {
  const userId = req.params.uid;

  let tweets;
  try {
    tweets = await Tweet.find({ creator: userId });
  } catch (err) {
    const error = new HttpError(
      'Fetching tweets failed, please try again later.',
      500
    );
    return next(error);
  }

  if (!tweets || tweets.length === 0) {
    const error = new HttpError('Could not find tweets for the user.', 404);
    return next(error);
  }

  res.json({ tweets: tweets.map((t) => t.toObject({ getters: true })) });
};

const createTweet = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs, please type more than 5 characters.', 422)
    );
  }

  const { content, creator } = req.body;

  const createTweet = new Tweet({
    content,
    creator,
  });

  let user;
  try {
    // Access to the user
    user = await User.findById(creator);
  } catch (err) {
    const error = new HttpError(
      'Creating tweet failed, please try again.',
      500
    );
    return next(error);
  }

  if (!user) {
    const error = new HttpError('Could not find user for provide id.', 404);
    return next(error);
  }

  try {
    // If one of user or tweet failed than it will not save to mongoDB
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createTweet.save({ session: sess });

    user.tweets.push(createTweet);
    await user.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      'Creating tweet failed, please try again.',
      500
    );
    return next(error);
  }
  res.status(201).json({ tweet: createTweet });
};

const updateTweetById = async (req, res, next) => {
  const { content } = req.body;
  const tweetId = req.params.tid;

  let tweet;
  try {
    tweet = await Tweet.findById(tweetId);
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not update tweet.',
      500
    );
    return next(error);
  }

  tweet.content = content;

  try {
    await tweet.save();
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not update tweet.',
      500
    );
    return next(error);
  }

  res.status(200).json({ tweet: tweet.toObject({ getters: true }) });
};

const deleteTweet = async (req, res, next) => {
  const tweetId = req.params.tid;
  let tweet;
  try {
    tweet = await Tweet.findById(tweetId);
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not delete the tweet.',
      500
    );
    return next(error);
  }

  try {
    await tweet.remove();
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not delete the tweet.',
      500
    );
    return next(error);
  }
  res.status(200).json({ message: 'Delete the tweet' });
};

exports.getTweetById = getTweetById;
exports.getTweetsByUserId = getTweetsByUserId;
exports.createTweet = createTweet;
exports.updateTweetById = updateTweetById;
exports.deleteTweet = deleteTweet;
