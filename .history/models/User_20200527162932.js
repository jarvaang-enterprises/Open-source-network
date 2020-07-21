const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const crypto = require('crypto');
const validator = require('validator');

const userSchema = new mongoose.Schema({
	name: {
		type: String,
		trim: true,
		required: [true, 'a user must have a name'],
	},
	password: {
		type: String,
		trim: true,
		required: [true, 'please submit a password'],
		min: 8,
		select: false,
	},
	passwordConfirm: {
		type: String,
		trim: true,
		required: [true, 'please confirm password'],
		validate: {
			validator: function (item) {
				return item === this.password;
			},
			message: "passwords don't match",
		},
	},
	email: {
		type: String,
		required: [true, 'please fill in your email'],
		unique: true,
		lowercase: true,
		validate: [validator.isEmail, 'please provide a email address'],
	},
	profilePhoto: {
		type: String,
	},
	created_at: Date,
	passwordChangedAt: Date,
	passwordResetToken: String,
	passwordResetExpires: Date,
	active: {
		type: Boolean,
		default: true,
		select: false,
	},
});

userSchema.pre('save', function (next) {
	if (!this.isModified('password')) {
		return next();
	}
	this.password = bcrypt.hashSync(this.password, 10);
	next();
});

userSchema.pre('save', async function (next) {
	//execute when password is modified
	if (!this.isModified('password')) return next();

	//harsh password on schema
	this.password = await bcrypt.hash(this.password, 12);

	this.passwordConfirm = undefined;
	next();
});

userSchema.methods.comparePassword = async function (candidatePassword, StoredPassword) {
	return await bcrypt.compare(candidatePassword, StoredPassword);
};
userSchema.pre('save', function (next) {
	if (!this.isModified('password') || this.isNew) return next();
	this.passwordChangedAt = Date.now() - 1000;
	next();
});
userSchema.pre(/^find/, function (next) {
	this.find({ active: { $ne: false } });
	next();
});
userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
	if (this.passwordChangedAt) {
		const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);

		return JWTTimestamp < changedTimestamp;
	}

	// False means NOT changed
	return false;
};
userSchema.methods.createPasswordResetToken = function () {
	const resetToken = crypto.randomBytes(32).toString('hex');

	this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');

	console.log({ resetToken }, this.passwordResetToken);

	this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

	return resetToken;
};

module.exports = mongoose.model('User', userSchema);
