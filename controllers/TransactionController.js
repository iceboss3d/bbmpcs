const Transaction = require("../models/TransactionModel");
const Account = require("../models/AccountModel");
const { body,validationResult } = require("express-validator");
const { sanitizeBody } = require("express-validator");
const apiResponse = require("../helpers/apiResponse");
const auth = require("../middlewares/jwt");
var mongoose = require("mongoose");
mongoose.set("useFindAndModify", false);

// Transaction Schema
function TransactionData(data) {
	this.transactionType = data.transactionType;
	this.amount = data.amount;
	this.status = data.status;
	this.accountNumber = data.accountNumber;
	this.reference = data.reference;
	this.approvedBy = data.approvedBy;
	this.channel = data.channel;
}


/**
 * Create Transaction.
 * 
 * @param {string}      transactionType
 * @param {number}      amount
 * @param {string}      accountNumber
 * @param {string}      reference
 * @param {string}      channel
 * 
 * @returns {Object}
 */
exports.createTransaction = [
	auth,
	body("transactionType", "Transaction Type must not be empty.").isLength({ min: 1 }).trim(),
	body("amount", "Amount must not be empty.").isLength({ min: 1 }).trim(),
	body("accountNumber", "Account Number must not be empty.").isLength({ min: 1 }).trim().custom((value) => {
		return Account.findOne({accountNumber: value}).then(account => {
			if (!account) {
				return Promise.reject("Account Number doesn't exist.");
			}
		});
	}),
	body("reference", "Reference must not be empty.").isLength({ min: 1 }).trim().custom((value,{req}) => {
		const {accountNumber, amount, transactionType} = req.body;
		return Transaction.findOne({reference: value, accountNumber, amount, transactionType}).then(transaction => {
			if (transaction) {
				return Promise.reject("Transaction already exist with this Reference.");
			}
		});
	}),
	sanitizeBody("*").escape(),
	(req, res) => {
		try {
			const errors = validationResult(req);
			const {accountNumber, amount, transactionType, reference, channel, description} = req.body;
			var transaction = new Transaction(
				{ transactionType,
					accountNumber,
					amount,
					reference,
					channel,
					description,
					txRef
				});

			if (!errors.isEmpty()) {
				return apiResponse.validationErrorWithData(res, "Validation Error.", errors.array());
			}
			else {
				//Save Transaction.
				transaction.save(function (err) {
					if (err) { return apiResponse.ErrorResponse(res, err); }
					let transactionData = new TransactionData(transaction);
					return apiResponse.successResponseWithData(res,"Transaction Creation Successful.", transactionData);
				});
			}
		} catch (err) {
			//throw error in json response with status 500. 
			return apiResponse.ErrorResponse(res, err);
		}
	}
];


exports.verifyTransaction = [
	auth,
	(req, res) => {
		try {
			let transaction;
			Transaction.findOne({reference: req.body.reference}, (err, trx) => {
				if(err){
					return apiResponse.ErrorResponse(res, err);
				}
				if(trx){
					return apiResponse.ErrorResponse(res, "Transaction with same reference already exists");
				}
			})
			Transaction.findById(req.params.id, (err, foundTransaction) => {
				if(foundTransaction === undefined){
					return apiResponse.notFoundResponse(res, "Transaction not found");
				} else {
					if(foundTransaction.transactionType === "credit"){
						transaction = {
              status: "verified",
              approvedBy: req.user._id
            };
					} else {
						transaction = {
							status: "verified",
							refrence: req.body.reference,
              approvedBy: req.user._id
            };
					}
					Transaction.findByIdAndUpdate(req.params.id, transaction, (err) => {
						if(err){
							return apiResponse.ErrorResponse(res, err);
						} else {
							let transactionData = new TransactionData(transaction);
							return apiResponse.successResponseWithData(res, "Transaction Verified", transactionData);
						}
					});
				}
			});
		} catch (err) {
			//throw error in json response with status 500. 
			return apiResponse.ErrorResponse(res, err);
		}
	}
];

/**
 * Status Transaction List.
 * 
 * @returns {Object}
 */
exports.transactionListStatus = [
	auth,
	function (req, res) {
		try {
			Transaction.find({status: req.query.status}).then((transactions) => {
				if(transactions.length > 0){
					return apiResponse.successResponseWithData(res, "Operation Success", transactions);
				} else {
					return apiResponse.successResponseWithData(res, "Operation success", {});
				}
			});
		} catch (err) {
			//throw error in json response with status 500. 
			return apiResponse.ErrorResponse(res, err);
		}
	}
];

/**
 * Transaction List.
 * 
 * @returns {Object}
 */
exports.transactionList = [
	auth,
	function (req, res) {
		try {
			Transaction.find({}).then((transactions) => {
				if(transactions.length > 0){
					return apiResponse.successResponseWithData(res, "Operation Success", transactions);
				} else {
					return apiResponse.successResponseWithData(res, "Operation success", {});
				}
			});
		} catch (err) {
			//throw error in json response with status 500. 
			return apiResponse.ErrorResponse(res, err);
		}
	}
];

/**
 * Transaction Detail.
 * 
 * @returns {Object}
 */
exports.transactionDetail = [
	auth,
	function (req, res) {
		try {
			Transaction.findOne({_id: req.params.id}).then((transaction) => {
				if(transaction){
					return apiResponse.successResponseWithData(res, "Operation Success", transaction);
				} else {
					return apiResponse.notFoundResponse(res, "Account not Found");
				}
			});
		} catch (err) {
			//throw error in json response with status 500. 
			return apiResponse.ErrorResponse(res, err);
		}
	}
];
/**
 * Account Transactions.
 * 
 * @returns {Object}
 */
exports.accountTransactions = [
	auth,
	function (req, res) {
		try {
			Transaction.find({accountNumber: req.params.accountNumber, status: "verified"}).then((transaction) => {
				if(transaction > 0){
					return apiResponse.successResponseWithData(res, "Operation Success", transaction);
				} else {
					return apiResponse.successResponseWithData(res, "Operation Success", transaction);
				}
			});
		} catch (err) {
			//throw error in json response with status 500. 
			return apiResponse.ErrorResponse(res, err);
		}
	},
];

exports.withdraw = [
	auth,
	(req, res) => {
		try {
			const { amount, accountNumber } = req.body;
			const transaction = new Transaction({
				amount,
				accountNumber,
				transactionType: "debit",
				reference: "pending",
				channel: "bank"
			});

			transaction.save((err) => {
				if (err) {
					return apiResponse.ErrorResponse(res, err);
				}
				let transactionData = new TransactionData(transaction);
				return apiResponse.successResponseWithData(
					res,
					"Transaction Creation Successful.",
					transactionData
				);
			});
		} catch (err) {
			return apiResponse.ErrorResponse(res, "Something went wrong");
		}
	}
];