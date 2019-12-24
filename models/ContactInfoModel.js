var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var ContactInfoSchema = new Schema(
	{
		homeAddress: { type: String, required: true, default: "" },
		city: { type: String, required: true, default: "" },
		state: { type: String, required: true, default: "" },
		user: { type: Schema.ObjectId, ref: "User", required: true }
	},
	{ timestamps: true }
);

module.exports = mongoose.model("ContactInfo", ContactInfoSchema);
