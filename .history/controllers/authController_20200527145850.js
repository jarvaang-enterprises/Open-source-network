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
	if (!email || !passwordConfirm) return next(new AppError('please provide email and password', 400));
	const user = await (await User.findOne({ email })).isSelected('+password');

	if (!user || !(await user.comparePassword(password, user.password))) {
		return next(new AppError('password or email does not match any records', 401));
	}

	createSendToken(user, 200, res);
});
exports.signup = catchAsync(async (req, res, next) => {
    const newUser =  await User.create({
        name:req.body.name,
        password:req.body.password,
        passwordConfirm:req.body.passwordConfirm,
        email:req.body.email,

    });
    createSendToken(newUser,201,res)
});
