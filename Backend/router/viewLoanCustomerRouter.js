const express = require("express");
const router = express.Router();
const { LoanExcel } = require("../Database/db");

const viewLoanByCustomerId = require("../controller.js/viiew-loanCustomerController");

router.get("/view-loans/:customer_id",viewLoanByCustomerId);

module.exports= router