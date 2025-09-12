const express = require("express");
const bodyParser = require("body-parser");
const checkEligibility = require("./router/check-eligibilityRouter.js");
const register = require("./router/registerRouter.js");
const createLoan = require("./router/loansRouter.js");
const viewLoanByLoanExcel = require("./router/viewLoanRouter.js");
const viewLoanByCustomerExcel = require("./router/viewLoanCustomerRouter.js");
const app = express();
const importCustomerData = require("./importData.js");
const importLoanData = require("./importLoneData.js");

app.use(bodyParser.json());
const { Customer, Loan } = require("./Database/db.js");

importCustomerData();
importLoanData();
app.use("/", register);
app.use("/", checkEligibility);
app.use("/", createLoan);
app.use("/", viewLoanByLoanExcel);
app.use("/", viewLoanByCustomerExcel);

module.exports=app;