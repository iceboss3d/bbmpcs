var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var KycSchema = new Schema(
	{
		dateOfBirth: { type: Date, required: false, default: "" },
		idUrl: { type: String, required: false, default: "" },
		passportUrl: { type: String, required: false, default: "" },
		signatureUrl: { type: String, required: false, default: "" },
		user: { type: Schema.ObjectId, ref: "User", required: true }
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Kyc", KycSchema);
