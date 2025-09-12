const express = require("express");
const bodyParser = require("body-parser");
const checkEligibility = require('./controller.js/check-eligibility.Controller.js');
const register=require("./controller.js/registerController.js");
const createLoan = require("./controller.js/loansController.js");
const viewLoanByLoanExcel= require("./controller.js/view-loanController.js");
const viewLoanByCustomerExcel= require("./controller.js/viiew-loanCustomerController.js");
const app = express();
const importCustomerData= require('./importData.js');
const importLoanData= require('./importLoneData.js');

app.use(bodyParser.json());
const { Customer, Loan } = require("./Database/db.js");
 
importCustomerData();
importLoanData();
app.use('/',register);
 app.use('/',checkEligibility);
 app.use('/',createLoan);
 app.use('/',viewLoanByLoanExcel);
 app.use('/',viewLoanByCustomerExcel);
// Start server
app.listen(3000, () => {
  console.log("🚀 Server running on http://localhost:3000");
});
