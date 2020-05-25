const User = require('../models/User');
const session = require('express-session');

exports.register = async (req, res) => {
    try {
        const user = new User({
            name: req.body.name,
            password: req.body.password
        });
        const result = await user.save();
        res.send(result);
        console.log(result);
    } catch (error) {
        res.send('error');
    }
}

exports.login = async (req, res) => {
    const user = await User.findOne({ name: req.body.name }).exec();
    if (!user) {
        res.send('Sorry, username does not exist')
    }
    const correctPassword = user.comparePassword(req.body.password, user.password);
    if (!correctPassword) {
        res.send('wrong password');
    } else {
        req.session.userID = userID;
        req.session.save();
        console.log('logged is as: ' + user.name);
        res.redirect('/me');
    }
}