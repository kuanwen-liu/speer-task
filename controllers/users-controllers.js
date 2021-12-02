const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const HttpError = require('../models/http-error');
const User = require('../models/user');

const getUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find({}, '-password');
  } catch (err) {
    const error = new HttpError(
      'Fetching users failed, please try again later.',
      500
    );
    return next(error);
  }

  res.json({ users: users.map((user) => user.toObject({ getters: true })) });
};

const signup = async (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return next(new HttpError('Invalid inputs passed, please try again!', 422));
  }
  const { username, password } = req.body;

  // Check if user already exist
  let existingUser;
  try {
    existingUser = await User.findOne({ username: username });
  } catch (err) {
    const error = new HttpError(
      'Signing up failed, please try again later.',
      500
    );
    return next(error);
  }
  if (existingUser) {
    const error = new HttpError('User exists already.', 422);
    return next(error);
  }

  // Use bcrypt to hash the user password
  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    const error = new HttpError(
      'Could not create user, please try again.',
      500
    );
    return next(error);
  }

  const createUser = new User({
    username,
    password: hashedPassword,
    tweets: [],
  });

  try {
    await createUser.save();
  } catch (err) {
    const error = HttpError('Signing up failed, please try again later.', 500);
    return next(error);
  }

  // Generate jsonwebtoken
  let token;
  try {
    token = jwt.sign({ userId: createUser.id }, 'speer_technologies_test', {
      expiresIn: '1h',
    });
  } catch (err) {
    const error = HttpError('Signing up failed, please try again later.', 500);
    return next(error);
  }

  res.status(201).json({ userId: createUser.id, token });
};

const login = async (req, res, next) => {
  const { username, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ username: username });
  } catch (err) {
    const error = new HttpError(
      'Logging in failed, please try again later.',
      500
    );
    return next(error);
  }

  if (!existingUser) {
    const error = new HttpError('Invalid credentials.', 401);
    return next(error);
  }

  // Check the password with hashed password
  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(password, existingUser.password);
  } catch (err) {
    const error = new HttpError(
      'Could not log in, please check your credentials and try again.',
      500
    );
    return next(error);
  }

  if (!isValidPassword) {
    const error = new HttpError('Invalid credentials.', 401);
    return next(error);
  }

  // Generate jsonwebtoken
  let token;
  try {
    token = jwt.sign({ userId: existingUser.id }, 'speer_technologies_test', {
      expiresIn: '1h',
    });
  } catch (err) {
    const error = HttpError('Logging in failed, please try again later.', 500);
    return next(error);
  }

  res.json({ userId: existingUser.id, token });
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
