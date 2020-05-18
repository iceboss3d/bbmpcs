const Account = require("../models/AccountModel");
const PendingAccount = require("../models/PendingAccountModel");
const Transaction = require("../models/TransactionModel");
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
// Account Schema
function PendingAccountData(data) {
  this.accountType = data.accountType;
  this.amount = data.amount;
  this.user = data.user;
  this.txRef = data.txRef;
}

/**
 * Create Account.
 *
 * @param {string}      accountType
 * @param {string}      txRef
 * @param {number}      amount
 *
 * @returns {Object}
 */
exports.createAccount = [
  auth,
  body("accountType", "Account Type must not be empty.")
    .isLength({ min: 1 })
    .trim(),
  body("txRef", "Transaction Reference must not be empty.")
    .isLength({ min: 1 })
    .trim(),
  body("amount", "Amount must not be empty.").isLength({ min: 1 }).trim(),
  sanitizeBody("*").escape(),
  (req, res) => {
    try {
      const errors = validationResult(req);
      var account = new PendingAccount({
        accountType: req.body.accountType,
        txRef: req.body.txRef,
        amount: req.body.amount,
        user: req.user,
      });

      if (!errors.isEmpty()) {
        return apiResponse.validationErrorWithData(
          res,
          "Validation Error.",
          errors.array()
        );
      } else {
        //Save Account.
        account.save(function (err) {
          if (err) {
            return apiResponse.ErrorResponse(res, err);
          }
          let accountData = new PendingAccountData(account);
          return apiResponse.successResponseWithData(
            res,
            "Account Creation Successful.",
            accountData
          );
        });
      }
    } catch (err) {
      //throw error in json response with status 500.
      return apiResponse.ErrorResponse(res, err);
    }
  },
];

/**
 * Account update.
 *
 * @param {string}      accountNumber
 * @param {string}      reference
 *
 * @returns {Object}
 */
exports.accountUpdate = [
  auth,
  body("accountNumber", "Account Number must not be empty.")
    .isLength({ min: 10 })
    .trim(),
  sanitizeBody("*").escape(),
  (req, res) => {
    if (!isAdmin) {
      return apiResponse.unauthorizedResponse(
        res,
        "Admin Level Clearance Required"
      );
    }
    try {
      const errors = validationResult(req);
      const { accountNumber, reference } = req.body;

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
            PendingAccount.findById(req.params.id, (err, foundAccount) => {
              if (foundAccount === undefined) {
                return apiResponse.notFoundResponse(res, "Account not found");
              } else {
                const { user, accountType, txRef, amount } = foundAccount;
                const account = new Account({
                  accountType,
                  user,
                  status: "created",
                  approvedBy: req.user,
                  accountNumber,
                });
                account.save((err, acc) => {
                  if (err) {
                    return apiResponse.ErrorResponse(res, err);
                  } else {
                    const transaction = new Transaction({
                      transactionType: "credit",
                      amount,
                      status: "verified",
                      accountNumber: acc.accountNumber,
                      reference,
                      txRef,
                      approvedBy: req.user,
                      channel: "Paystack",
                      description: "Account Opening",
                    });
                    transaction.save((err) => {
                      if (err) {
                        return apiResponse.ErrorResponse(res, err);
                      } else {
                        let accountData = new AccountData(account);
                        PendingAccount.deleteOne(
                          { _id: req.params.id },
                          (err) => {
                            if (err) {
                              return apiResponse.ErrorResponse(res, err);
                            }
                          }
                        );
                        return apiResponse.successResponseWithData(
                          res,
                          "Account Created",
                          accountData
                        );
                      }
                    });
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
  },
];

/**
 * Pending Account List
 *
 * @returns {Object}
 */

exports.pendingAccounts = [
  auth,
  (req, res) => {
    if (!isAdmin(req.user)) {
      return apiResponse.unauthorizedResponse(
        res,
        "Admin Level Clearance Required"
      );
    }
    try {
      PendingAccount.find((err, acc) => {
        if (err) {
          return apiResponse.ErrorResponse(res, err);
        }
        if (acc.length > 0) {
          return apiResponse.successResponseWithData(
            res,
            "Accounts Listed",
            acc
          );
        }
        return apiResponse.notFoundResponse(res, "No Pending Accounts");
      });
    } catch (err) {
      return apiResponse.ErrorResponse(res, err);
    }
  },
];

/**
 * Account List.
 *
 * @returns {Object}
 */
exports.accountListStatus = [
  auth,
  function (req, res) {
    if (!isAdmin(req.user)) {
      return apiResponse.unauthorizedResponse(
        res,
        "Admin Level Clearance Required"
      );
    }
    try {
      Account.find({ status: req.query.status }).then((accounts) => {
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
            []
          );
        }
      });
    } catch (err) {
      //throw error in json response with status 500.
      return apiResponse.ErrorResponse(res, err);
    }
  },
];

/**
 * Account List.
 *
 * @returns {Object}
 */
exports.accountList = [
  auth,
  function (req, res) {
    if (!isAdmin(req.user)) {
      return apiResponse.unauthorizedResponse(
        res,
        "Admin Level Clearance Required"
      );
    }
    try {
      Account.find({}).then((accounts) => {
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
            []
          );
        }
      });
    } catch (err) {
      //throw error in json response with status 500.
      return apiResponse.ErrorResponse(res, err);
    }
  },
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
        (account) => {
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
  },
];

/**
 * Account Detail.
 *
 * @returns {Object}
 */
exports.accountById = [
  auth,
  async function (req, res) {
    /* if (!isOwner(req.params.id, req.user) || !isAdmin(req.user)) {
			return apiResponse.unauthorizedResponse(res, "Admin Clearance Required");
		}*/
    try {
      PendingAccount.findOne({ _id: req.params.id }).then((account) => {
        if (account) {
          return apiResponse.successResponseWithData(
            res,
            "Operation Success",
            account
          );
        } else {
          return apiResponse.notFoundResponse(res, "Account not Found");
        }
      });
    } catch (err) {
      //throw error in json response with status 500.
      return apiResponse.ErrorResponse(res, err);
    }
  },
];

/**
 * Pending Account Detail.
 *
 * @returns {Object}
 */
exports.pendingAcc = [
  auth,
  async function (req, res) {
    /* if (!isOwner(req.params.id, req.user) || !isAdmin(req.user)) {
			return apiResponse.unauthorizedResponse(res, "Admin Clearance Required");
		}*/
    try {
      PendingAccount.findOne({ _id: req.params.id }).then((account) => {
        if (account) {
          return apiResponse.successResponseWithData(
            res,
            "Operation Success",
            account
          );
        } else {
          return apiResponse.notFoundResponse(res, "Account not Found");
        }
      });
    } catch (err) {
      //throw error in json response with status 500.
      return apiResponse.ErrorResponse(res, err);
    }
  },
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
      Account.find({ user: req.params.userId, status: "created" }).then(
        (accounts) => {
          if (accounts.length > 0) {
            return apiResponse.successResponseWithData(
              res,
              "Operation Success",
              accounts
            );
          } else {
            return apiResponse.successResponseWithData(
              res,
              "Operation Success",
              []
            );
          }
        }
      );
    } catch (err) {
      //throw error in json response with status 500.
      return apiResponse.ErrorResponse(res, err);
    }
  },
];
