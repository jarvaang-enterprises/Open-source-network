const Tweet = require('../models/Tweet');
const User = require('../models/User');
const path = require('path');


exports.index = (req, res) => {
  res.render('index');
}

exports.register = (req, res) => {
  res.render('register');
}

exports.me = (req, res) => {
  res.send(req.session);
}

exports.login = (req, res) => {
  res.render('login');
}

exports.users = (req, res) => {
  User.find({}, (err, users) => {
    if (err) throw err;
    res.send(users);
  });
}

exports.newTweet = (req, res) => {
  res.render('createPost');
}

exports.postTweet = async (req, res) => {
  if (!req.body || !req.body.tweet) {
    return res.render('error', { error: 'no tweet found', title: 'error' });

  }
  const newTweet = new Tweet({
    tweet: req.body.tweet
  }, (err, tweet) => {
    if (err) return res.render('error', { error: 'error creating tweet', title: 'error' });

  })
  await newTweet.save();
  res.send(newTweet);
  console.log('created tweet');

}

exports.postImage = (req, res) => {

}
