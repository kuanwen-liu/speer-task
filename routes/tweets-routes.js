const express = require('express');
const { check } = require('express-validator');

const tweetController = require('../controllers/tweets-controllers');

const router = express.Router();

router.get('/:tid', tweetController.getTweetById);

router.get('/user/:uid', tweetController.getTweetsByUserId);

router.post(
  '/',
  [check('content').isLength({ min: 5 })],
  tweetController.createTweet
);

router.patch(
  '/:tid',
  [check('content').isLength({ min: 5 })],
  tweetController.updateTweetById
);

router.delete('/:tid', tweetController.deleteTweet);

module.exports = router;
