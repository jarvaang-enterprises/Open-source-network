const User = require('../models/User');
const catchAsync = require('./../utilities/catchAsync');
const jwt = require('jsonwebtoken');
const AppError = require('./../utilities/appError');
const crypto = require('crypto');
const { promisify } = require('util');

const signToken = (id) => {
	return jwt.sign({ id }, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRES_IN,
	});
};

const createSendToken = (user, statusCode, res) => {
	const token = signToken(user._id);
	const cookieOptions = {
		expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
		httpOnly: true,
	};
	if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

	res.cookie('jwt', token, cookieOptions);
	// console.log("cookie sent",res.cookie)
	// Remove password from output
	user.password = undefined;

	res.status(statusCode).json({
		status: 'success',
		token,
		data: {
			user, 
		},
	});
};
exports.login = catchAsync(async (req, res, next) => {
	const { email, password } = req.body;
	if (!email || !password) return next(new AppError('please provide email and password', 400));
	const user = await (await User.findOne({ email })).isSelected('+password');

	if (!user || !(await user.comparePassword(password, user.password))) {
		return next(new AppError('password or email does not match any records', 401));
	}

	createSendToken(user, 200, res);
});
exports.signup = catchAsync(async (req, res, next) => {
	const newUser = await User.create({
		name: req.body.name,
		password: req.body.password,
		passwordConfirm: req.body.passwordConfirm,
		email: req.body.email,
	});
	createSendToken(newUser, 201, res);
});

exports.protect = catchAsync(async (req, res, next) => {
	let token;
	if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
		token = req.headers.authorization.split(' ')[1];
	} else if (req.cookies.jwt) {
		token = req.cookies.jwt;
	}
	if (!token) {
		return next(new AppError('you are not logged in please login to get access', 401));
	}
	const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
	const currentUser = await User.findById(decoded.id);
	if (!currentUser) {
		return next(new AppError('the user with this token does not exist', 401));
	}
	req.user = currentUser;
	res.locals.user = currentUser;
	next();
});
