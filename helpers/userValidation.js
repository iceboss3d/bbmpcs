const User = require("../models/UserModel");
const Account = require("../models/AccountModel");

const isAdmin = (userId) => {
	User.findById({_id: userId}, (err, user) => {
		if (err){
			return false;
		}
		if (user.level !== "admin") {
			return false;
		}
		return true;
	});
};

const isOwner = (accountNumber, userId) => {
	Account.findByOne({accountNumber}, (err, account) => {
		if (err){
			return false;
		}
		if (account.user !== userId) {
			return false;
		}
		return true;
	});
};

module.exports = { isAdmin, isOwner };