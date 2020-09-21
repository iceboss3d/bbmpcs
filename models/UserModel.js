var mongoose = require("mongoose");

var UserSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    otherNames: { type: String, required: false },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    level: { type: String, required: true, default: "customer" },
    isConfirmed: { type: Boolean, required: true, default: 0 },
    confirmOTP: { type: String, required: false },
    otpTries: { type: Number, required: false, default: 0 },
    status: { type: Boolean, required: true, default: 1 },
  },
  { timestamps: true },
);

// Virtual for user's full name
UserSchema.virtual("fullName").get(function () {
  return this.firstName + " " + this.lastName;
});

module.exports = mongoose.model("User", UserSchema);
