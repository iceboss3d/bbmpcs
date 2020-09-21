var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var LoanSchema = new Schema(
  {
    loanType: { type: String, required: true },
    status: { type: Boolean, default: false },
    accountNumber: { type: String, required: false, default: "" },
    txRef: { type: String, required: false },
    businessName: { type: String, required: false },
    businessAddress: { type: String, required: false },
    typeOfBusiness: { type: String, required: false },
    netMonthlyIncome: { type: Number, required: false },
    bvn: { type: String, required: false },
    amount: { type: Number, required: false },
    duration: { type: String, required: false },
    user: {type: Schema.ObjectId, ref: "User", required: true}
  },
  { timestamps: true },
);

module.exports = mongoose.model("Loan", LoanSchema);
