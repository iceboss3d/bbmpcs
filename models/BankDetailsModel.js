var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var BankDetailsSchema = new Schema(
	{
		bank: { type: String, required: true, default: "" },
		accountNumber: { type: String, required: true, default: "" },
		accountName: { type: String, required: true, default: "" },
		user: { type: Schema.ObjectId, ref: "User", required: true }
	},
	{ timestamps: true }
);

module.exports = mongoose.model("BankDetails", BankDetailsSchema);
