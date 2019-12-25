const User = require("../models/UserModel");
const Account = require("../models/AccountModel");

const isAdmin = async (userId) => {	
	await User.findById({_id: userId._id}, (err, user) => {
		if (err){
			return false;
		} else if (user.level !== "admin") {
			return false;
		} else {
			return true;
		}
	});
};

const isOwner = async (accountNumber, userId) => {
	await Account.findOne({accountNumber}, (err, account) => {
		if (err){
			return false;
		}
		if (account.user != userId._id) {
			return false;
		}
		return true;
	});
};

module.exports = { isAdmin, isOwner };
