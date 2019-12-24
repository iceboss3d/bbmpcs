const ContactInfo = require("../models/ContactInfoModel");
const BankDetails = require("../models/BankDetailsModel");
const apiResponse = require("../helpers/apiResponse");
const auth = require("../middlewares/jwt");
const mongoose = require("mongoose");
mongoose.set("useFindAndModify", false);


exports.updateContact = [
	auth,
	(req, res) => {
		try {
			ContactInfo.findOne({user: req.user}, (err, user) => {
				const contact = {
					homeAddress: req.body.homeAddress,
					city: req.body.city,
					state: req.body.state,
					user: req.user
				};
				if (user) {
					ContactInfo.findOneAndUpdate({user: req.user}, contact, (err)=> {
						if (err){
							return apiResponse.ErrorResponse(res, "Something went wrong");
						}
						return apiResponse.successResponse(res, "Profile Updated");
					});
				} else {
					ContactInfo.create(contact)
						.then(() => {
							return apiResponse.successResponse(res, "Profile Updated");
						})
						.catch(() => apiResponse.ErrorResponse(res, "Something went wrong"));
				}
			});
		} catch (err) {
			apiResponse.ErrorResponse(res, "Something Went wrong");
		}
	}
];

exports.updateBank = [
	auth,
	(req, res) => {
		try {
			BankDetails.findOne({user: req.user}, (err, user) => {
				const bank = {
					bank: req.body.bank,
					accountNumber: req.body.accountNumber,
					accountName: req.body.accountName,
					user: req.user
				};
				if (user) {
					BankDetails.findOneAndUpdate({user: req.user}, bank, (err)=> {
						if (err){
							return apiResponse.ErrorResponse(res, "Something went wrong");
						}
						return apiResponse.successResponse(res, "Profile Updated");
					});
				} else {
					BankDetails.create(bank)
						.then(() => {
							return apiResponse.successResponse(res, "Profile Updated");
						})
						.catch(() => apiResponse.ErrorResponse(res, "Something went wrong"));
				}
			});
		} catch (err) {
			apiResponse.ErrorResponse(res, "Something Went wrong");
		}
	}
];