const Account = require("../models/AccountModel");
const { body, validationResult } = require("express-validator");
const { sanitizeBody } = require("express-validator");
const apiResponse = require("../helpers/apiResponse");
const auth = require("../middlewares/jwt");
const { isAdmin, isOwner } = require("../helpers/userValidation");
var mongoose = require("mongoose");
mongoose.set("useFindAndModify", false);

// Account Schema
function AccountData(data) {
	this.accountType = data.accountType;
	this.accountNumber = data.accountNumber;
	this.createdAt = data.createdAt;
	this.approvedBy = data.approvedBy;
}

/**
 * Create Account.
 * 
 * @param {string}      accountType
 * 
 * @returns {Object}
 */
exports.createAccount = [
	auth,
	body("accountType", "Account Type must not be empty.").isLength({ min: 1 }).trim(),
	sanitizeBody("*").escape(),
	(req, res) => {
		try {
			const errors = validationResult(req);
			var account = new Account(
				{ accountType: req.body.accountType,
					user: req.user,
				});

			if (!errors.isEmpty()) {
				return apiResponse.validationErrorWithData(res, "Validation Error.", errors.array());
			}
			else {
				//Save Account.
				account.save(function (err) {
					if (err) { return apiResponse.ErrorResponse(res, err); }
					let accountData = new AccountData(account);
					return apiResponse.successResponseWithData(res,"Account Creation Successful.", accountData);
				});
			}
		} catch (err) {
			//throw error in json response with status 500. 
			return apiResponse.ErrorResponse(res, err);
		}
	}
];

/**
 * Account update.
 * 
 * @param {string}      accountNumber
 * 
 * @returns {Object}
 */
exports.accountUpdate = [
	auth,
	body("accountNumber", "Account Number must not be empty.").isLength({ min: 10 }).trim(),
	sanitizeBody("*").escape(),
	(req, res) => {
		if (!isAdmin) {
			return apiResponse.unauthorizedResponse(res, "Admin Level Clearance Required");
		}
		try {
			const errors = validationResult(req);
			const { accountNumber } = req.body;
			const account = {
				status: "created",
				accountNumber,
				approvedBy: req.user._id
			};

			if (!errors.isEmpty()) {
				return apiResponse.validationErrorWithData(
					res,
					"Validation Error.",
					errors.array()
				);
			} else {
				Account.find({ accountNumber }, (err, accounts) => {
					if (accounts.length >= 1) {
						return apiResponse.ErrorResponse(
							res,
							"An Account with such Account Number already exists"
						);
					} else {
						Account.findById(req.params.id, (err, foundAccount) => {
							if (foundAccount === undefined) {
								return apiResponse.notFoundResponse(res, "Account not found");
							} else {
								Account.findByIdAndUpdate(req.params.id, account, err => {
									if (err) {
										return apiResponse.ErrorResponse(res, err);
									} else {
										let accountData = new AccountData(account);
										return apiResponse.successResponseWithData(
											res,
											"Account Updated Succesfully",
											accountData
										);
									}
								});
							}
						});
					}
				});
			}
		} catch (err) {
			//throw error in json response with status 500.
			return apiResponse.ErrorResponse(res, err);
		}
	}
];

/**
 * Pending Account List.
 * 
 * @returns {Object}
 */
exports.accountListStatus = [
	auth,
	function (req, res) {
		if (!isAdmin(req.user)){
			return apiResponse.unauthorizedResponse(res, "Admin Level Clearance Required");
		}
		try {
			Account.find({ status: req.query.status }).then(accounts => {
				if (accounts.length > 0) {
					return apiResponse.successResponseWithData(
						res,
						"Operation Success",
						accounts
					);
				} else {
					return apiResponse.successResponseWithData(
						res,
						"Operation success",
						{}
					);
				}
			});
		} catch (err) {
			//throw error in json response with status 500.
			return apiResponse.ErrorResponse(res, err);
		}
	}
];

/**
 * Account List.
 * 
 * @returns {Object}
 */
exports.accountList = [
	auth,
	function (req, res) {
		if (!isAdmin(req.user)){
			return apiResponse.unauthorizedResponse(res, "Admin Level Clearance Required");
		}
		try {
			Account.find({}).then(accounts => {
				if (accounts.length > 0) {
					return apiResponse.successResponseWithData(
						res,
						"Operation Success",
						accounts
					);
				} else {
					return apiResponse.successResponseWithData(
						res,
						"Operation success",
						{}
					);
				}
			});
		} catch (err) {
			//throw error in json response with status 500.
			return apiResponse.ErrorResponse(res, err);
		}
	}
];

/**
 * Account Detail.
 * 
 * @returns {Object}
 */
exports.accountNumber = [
	auth,
	async function (req, res) {
		if (!isOwner(req.params.accountNumber, req.user)) {
			return apiResponse.unauthorizedResponse(res, "Admin Clearnace Required");
		}
		try {
			Account.findOne({ accountNumber: req.params.accountNumber }).then(
				account => {
					if (account) {
						return apiResponse.successResponseWithData(
							res,
							"Operation Success",
							account
						);
					} else {
						return apiResponse.notFoundResponse(res, "Account not Found");
					}
				}
			);
		} catch (err) {
			//throw error in json response with status 500.
			return apiResponse.ErrorResponse(res, err);
		}
	}
];

/**
 * Account Detail.
 * 
 * @returns {Object}
 */
exports.accountById = [
	auth,
	async function (req, res) {
		if (!isOwner(req.params.id, req.user)) {
			return apiResponse.unauthorizedResponse(res, "Admin Clearnace Required");
		}
		try {
			Account.findOne({ _id: req.params.id }).then(
				account => {
					if (account) {
						return apiResponse.successResponseWithData(
							res,
							"Operation Success",
							account
						);
					} else {
						return apiResponse.notFoundResponse(res, "Account not Found");
					}
				}
			);
		} catch (err) {
			//throw error in json response with status 500.
			return apiResponse.ErrorResponse(res, err);
		}
	}
];

/**
 * Account List.
 * 
 * @returns {Object}
 */
exports.accountUser = [
	auth,
	function (req, res) {
		try {
			Account.find({user: req.params.userId, status: "created"}).then((accounts) => {
				if(accounts.length > 0){
					return apiResponse.successResponseWithData(res, "Operation Success", accounts);
				} else {
					return apiResponse.successResponseWithData(res, "Operation Success", []);
				}
			});
		} catch (err) {
			//throw error in json response with status 500. 
			return apiResponse.ErrorResponse(res, err);
		}
	}
];