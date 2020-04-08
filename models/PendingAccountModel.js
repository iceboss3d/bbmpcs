var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var PendingAccountSchema = new Schema({
  accountType: {type: String, required: true},
  amount: {type: Number, required: true},
  txRef: {type: String, required: true},
	user: { type: Schema.ObjectId, ref: "User", required: true },
}, {timestamps: true});

module.exports = mongoose.model("PendingAccount", PendingAccountSchema);