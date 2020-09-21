const ContactInfo = require("../models/ContactInfoModel");
const BankDetails = require("../models/BankDetailsModel");
const User = require("../models/UserModel");
const Kyc = require("../models/KycModel");
const apiResponse = require("../helpers/apiResponse");
const auth = require("../middlewares/jwt");
const mongoose = require("mongoose");
mongoose.set("useFindAndModify", false);

exports.getContact = [
  auth,
  (req, res) => {
    try {
      ContactInfo.findOne({ user: req.user }, (err, user) => {
        if (err) {
          return apiResponse.notFoundResponse(res, "Contact not found");
        }
        return apiResponse.successResponseWithData(
          res,
          "Successfully Fetched Info",
          user
        );
      });
    } catch (err) {
      return apiResponse.ErrorResponse(res, "Something went wrong");
    }
  }
];

exports.getUserContact = [
  auth,
  (req, res) => {
    try {
      ContactInfo.findOne({ user: req.params.id }, (err, user) => {
        if (err) {
          return apiResponse.notFoundResponse(res, "Contact not found");
        }
        return apiResponse.successResponseWithData(
          res,
          "Successfully Fetched Info",
          user
        );
      });
    } catch (err) {
      return apiResponse.ErrorResponse(res, "Something went wrong");
    }
  }
];

exports.updateContact = [
  auth,
  (req, res) => {
    try {
      ContactInfo.findOne({ user: req.user }, (err, user) => {
        const contact = {
          phoneNumber: req.body.phoneNumber,
          homeAddress: req.body.homeAddress,
          city: req.body.city,
          state: req.body.state,
          user: req.user
        };
        if (user) {
          ContactInfo.findOneAndUpdate({ user: req.user }, contact, err => {
            if (err) {
              return apiResponse.ErrorResponse(res, "Something went wrong");
            }
            return apiResponse.successResponse(res, "Profile Updated");
          });
        } else {
          ContactInfo.create(contact)
            .then(() => {
              return apiResponse.successResponse(res, "Profile Updated");
            })
            .catch(() =>
              apiResponse.ErrorResponse(res, "Something went wrong")
            );
        }
      });
    } catch (err) {
      apiResponse.ErrorResponse(res, "Something Went wrong");
    }
  }
];

exports.getKyc = [
  auth,
  (req, res) => {
    try {
      Kyc.findOne({ user: req.user }, (err, kyc) => {
        if (err) {
          return apiResponse.notFoundResponse(res, "KYC not found");
        }
        return apiResponse.successResponseWithData(
          res,
          "Successfully Fetched Info",
          kyc
        );
      });
    } catch (err) {
      return apiResponse.ErrorResponse(res, err);
    }
  }
];

exports.getUserKyc = [
  auth,
  (req, res) => {
    try {
      Kyc.findOne({ user: req.params.id }, (err, kyc) => {
        if (err) {
          return apiResponse.notFoundResponse(res, "KYC not found");
        }
        return apiResponse.successResponseWithData(
          res,
          "Successfully Fetched Info",
          kyc
        );
      });
    } catch (err) {
      return apiResponse.ErrorResponse(res, err);
    }
  }
];

exports.updateKyc = [
  auth,
  (req, res) => {
    try {
      Kyc.findOne({ user: req.user }, (err, user) => {
        const kyc = {
          dateOfBirth: req.body.dateOfBirth,
          gender: req.body.gender,
          maritalStatus: req.body.maritalStatus,
          stateOfOrigin: req.body.stateOfOrigin,
          lga: req.body.lga,
          idUrl: req.body.idUrl,
          passportUrl: req.body.passportUrl,
          signatureUrl: req.body.signatureUrl,
          user: req.user
        };
        if (user) {
          Kyc.findOneAndUpdate({ user: req.user }, kyc, err => {
            if (err) {
              return apiResponse.ErrorResponse(res, err);
            }
            return apiResponse.successResponse(res, "KYC Updated");
          });
        } else {
          Kyc.create(kyc)
            .then(() => {
              return apiResponse.successResponse(res, "KYC Created");
            })
            .catch(err => apiResponse.ErrorResponse(res, err));
        }
      });
    } catch (err) {
      apiResponse.ErrorResponse(res, err);
    }
  }
];

exports.getBank = [
  auth,
  (req, res) => {
    try {
      BankDetails.find({ user: req.user }, (err, bank) => {
        if (err) {
          return apiResponse.notFoundResponse(res, "Contact not found");
        }
        return apiResponse.successResponseWithData(
          res,
          "Successfully Fetched Info",
          bank
        );
      });
    } catch (err) {
      return apiResponse.ErrorResponse(res, "Something went wrong");
    }
  }
];

exports.getUserBank = [
  auth,
  (req, res) => {
    try {
      BankDetails.find({ user: req.params.uid }, (err, bank) => {
        if (err) {
          return apiResponse.notFoundResponse(res, "Bank not found");
        }
        return apiResponse.successResponseWithData(
          res,
          "Successfully Fetched Info",
          bank
        );
      });
    } catch (err) {
      return apiResponse.ErrorResponse(res, "Something went wrong");
    }
  }
];

exports.getUser = [
  auth,
  (req, res) => {
    try {
      User.findOne({ _id: req.params.id }, (err, user) => {
        if (err) {
          return apiResponse.notFoundResponse(res, "User not found");
        }
        return apiResponse.successResponseWithData(
          res,
          "Successfully Fetched Info",
          user
        );
      });
    } catch (err) {
      return apiResponse.ErrorResponse(res, "Something went wrong");
    }
  }
];

exports.getUsers = [
  auth,
  (req, res) => {
    try {
      User.find({}, (err, users) => {
        if (err) {
          return apiResponse.notFoundResponse(res, "User not found");
        }
        return apiResponse.successResponseWithData(
          res,
          "Successfully Fetched Info",
          users
        );
      });
    } catch (err) {
      return apiResponse.ErrorResponse(res, "Something went wrong");
    }
  }
];

exports.updateBank = [
  auth,
  (req, res) => {
    try {
      BankDetails.findOne({ user: req.user }, (err, user) => {
        const bank = {
          bank: req.body.bank,
          accountNumber: req.body.accountNumber,
          accountName: req.body.accountName,
          user: req.user
        };
        if (user) {
          BankDetails.findOneAndUpdate({ user: req.user }, bank, err => {
            if (err) {
              return apiResponse.ErrorResponse(res, "Something went wrong");
            }
            return apiResponse.successResponse(res, "Profile Updated");
          });
        } else {
          BankDetails.create(bank)
            .then(() => {
              return apiResponse.successResponse(res, "Profile Updated");
            })
            .catch(() =>
              apiResponse.ErrorResponse(res, "Something went wrong")
            );
        }
      });
    } catch (err) {
      apiResponse.ErrorResponse(res, "Something Went wrong");
    }
  }
];
