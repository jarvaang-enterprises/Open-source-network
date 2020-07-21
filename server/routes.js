const express = require('express'),
    router = express.Router(),
    home = require('../controllers/home');
authController = require('../controllers/authController');

module.exports = (app) => {
    router.get('/', home.index);
    router.get('/login', home.login);
    router.get('/register', home.register);
    router.get('/users.json', home.users);
    router.get('/createPost', home.newTweet);
    router.get('/me', home.me);
    
    // router.post('/register', authController.register);
    router.post('/login', authController.login);
    router.post('/tweet', home.postTweet);
    router.post('/postImage',  home.postImage);
    app.use(router);
}; 
