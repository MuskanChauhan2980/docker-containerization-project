const express = require("express");
const router= express.Router();
const {CustomerExcel,LoanExcel} = require("../Database/db");


const checkEligibility= require("../controller.js/check-eligibility.Controller");

router.post("/check-eligibility" , checkEligibility);
module.exports=router;