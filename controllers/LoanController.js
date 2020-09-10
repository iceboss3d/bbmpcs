const Loan = require("../models/LoanModel");
// const { body, validationResult } = require("express-validator");
// const { sanitizeBody } = require("express-validator");
const apiResponse = require("../helpers/apiResponse");
const auth = require("../middlewares/jwt");
const mailer = require("../helpers/mailer");
const { constants } = require("../helpers/constants");
var mongoose = require("mongoose");
const UserModel = require("../models/UserModel");
mongoose.set("useFindAndModify", false);
const paystack = require("paystack")(process.env.PAYSTACK_SECRET_KEY);

function LoanData(data) {
  this.loanType = data.loanType;
  this.user = data.user;
  this.txRef = data.txRef;
  this.accountNumber = data.accountNumber;
}

/**
 * New Loan Application
 * @param {String}      loanType
 * @param {String}      txRef
 *
 * @returns {Object}
 */

exports.newLoanApplication = [
  auth,
  async (req, res) => {
    try {
      const { loanType, txRef } = req.body;
      const user = req.user;
      await Loan.findOne({ txRef }, (err, doc) => {
        if (err) {
          return apiResponse.ErrorResponse(res, err);
        }
        if (doc) {
          return apiResponse.validationErrorWithData(
            res,
            "Transaction with Reference already exists",
            [],
          );
        }
      });
      const paystackResponse = await paystack.transaction.verify(txRef);
      if (!paystackResponse.status) {
        return apiResponse.notFoundResponse(res, paystackResponse.message);
      }
      const loanData = new LoanData({ loanType, txRef, user });
      const loan = new Loan(loanData);
      loan.save((err, doc) => {
        if (err) {
          return apiResponse.ErrorResponse(res, err);
        }
        const { amount, reference } = paystackResponse;
        const from = {
          email: constants.confirmEmails.from,
          name: constants.confirmEmails.name,
        };
        const personalization = [
          {
            to: [
              {
                email: user.email,
                name: user.firstName,
              },
            ],
          },
        ];
        const dynamicTemplateData = {
          amount,
          reference,
        };
        const templateId = "d-506a12d1841642ad8657ae0c295495bc";
        mailer
          .sendDynamic(from, personalization, dynamicTemplateData, templateId)
          .then(() => {
            return apiResponse.successResponseWithData(
              res,
              "Loan Application Saved",
              doc,
            );
          });
      });
    } catch (error) {
      return apiResponse.ErrorResponse(res, error);
    }
  },
];

/**
 * Get a single loan
 * @param {String}      loanId
 *
 * @returns {Object}
 */

exports.getLoanDetail = [
  auth,
  (req, res) => {
    try {
      Loan.findById(req.params.id, (err, loan) => {
        if (err) {
          return apiResponse.ErrorResponse(res, err);
        }
        if (!loan) {
          return apiResponse.notFoundResponse(res, "Loan not found");
        }
        return apiResponse.successResponseWithData(res, "Successfully Fetched Loan", loan);
      });
    } catch (error) {
      return apiResponse.ErrorResponse(res, error);
    }
  },
];

/**
 * Get all loans by user
 *
 * @returns {Object}
 */

exports.getLoans = [
  auth,
  (req, res) => {
    try {
      Loan.find({ user: req.user }, (err, loans) => {
        if (err) {
          return apiResponse.ErrorResponse(res, err);
        }
        return apiResponse.successResponseWithData(res, loans);
      });
    } catch (error) {
      return apiResponse.ErrorResponse(res, error);
    }
  },
];
