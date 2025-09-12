const express = require("express");
const router = express.Router();
const { LoanExcel, CustomerExcel } = require("../Database/db");

const viewLoanByLoanId= require("../controller.js/view-loanController");

router.get("/view-loan/loan_id",viewLoanByLoanId);
module.exports=router