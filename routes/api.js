var express = require("express");
var authRouter = require("./auth");
var bookRouter = require("./book");
var accountRouter = require("./account");
var transactionRouter = require("./transaction");
var profileRouter = require("./profile");

var app = express();

app.use("/auth/", authRouter);
app.use("/book/", bookRouter);
app.use("/account/", accountRouter);
app.use("/transaction/", transactionRouter);
app.use("/profile/", profileRouter);

module.exports = app;