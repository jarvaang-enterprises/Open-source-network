const passport = require('passport');

const path = require('path'),
    routes = require('./routes'),
    express = require('express'),
    bodyParser = require('body-parser')
session = require('express-session');

module.exports = (app) => {
    routes(app); // Lawrence Aang: Moved call to routes up the branch in order to include routes before other objects are set
    app.use(bodyParser.urlencoded({ 'extended': true }));
    app.use(bodyParser.json());

    app.use(passport.initialize());
    app.use(passport.session());
    app.use('/public/', express.static(path.join(__dirname,
        '../public')));
    app.use(session({
        secret: 'work hard',
        resave: false,
        saveUninitialized: false
    }));

    app.set('views', path.join(__dirname, '../views'));
    app.set('view engine', 'pug');
    // routes(app); // TODO: Fortune Please elaborate on why routes is called twice
    return app;
}; 