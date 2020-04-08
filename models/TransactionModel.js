var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var TransactionSchema = new Schema({
	transactionType: {type: String, required: true},
	amount: {type: Number},
	status: {type: String, default: "pending"},
	accountNumber: { type: String, required: true },
	reference: {type: String, required: true},
	txRef: {type: String, required: true},
	approvedBy: {type: Schema.ObjectId, ref: "User"},
	channel: {type: String, required: true},
	description: {type: String, required: false}
}, {timestamps: true});

module.exports = mongoose.model("Transaction", TransactionSchema);