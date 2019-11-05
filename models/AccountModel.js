var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var AccountSchema = new Schema({
	accountType: {type: String, required: true},
	accountNumber: {type: String},
	status: {type: String, default: "pending"},
	approvedBy: {type: Schema.ObjectId, ref: "User",},
	user: { type: Schema.ObjectId, ref: "User", required: true },
}, {timestamps: true});

module.exports = mongoose.model("Account", AccountSchema);