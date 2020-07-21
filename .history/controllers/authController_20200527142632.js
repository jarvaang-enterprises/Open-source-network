const User = require('../models/User');
const catchAsync = require('./../utilities/catchAsync');
const jwt = require('jsonwebtoken');
const AppError = require('./../utilities/appError');
const crypto = require('crypto');
const { promisify } = require('util');

exports.login = catchAsync(async (req, res, next) => {});
exports.signup = catchAsync(async (req,res,next) =>{

})