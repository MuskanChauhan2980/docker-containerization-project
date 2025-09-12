const express = require("express");
const router = express.Router();
const { Loan, Customer } = require("../Database/db"); // use real tables
const createLoan= require("../controller.js/loansController.js");

router.post("/create-loan" , createLoan );
module.exports=router;