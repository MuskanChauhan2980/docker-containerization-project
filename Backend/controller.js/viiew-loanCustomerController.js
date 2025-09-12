const express = require("express");
const router = express.Router();
const { LoanExcel } = require("../Database/db");

// 📌 Get all loans for a customer
 const viewLoanByCustomerId= async (req, res) => {
  try {
    const { customer_id } = req.params;

    const loans = await LoanExcel.findAll({
      where: { customer_id }
    });

    if (!loans || loans.length === 0) {
      return res.status(404).json({ message: "No loans found for this customer" });
    }

    const response = loans.map(loan => ({
      loan_id: loan.loan_id,
      loan_amount: loan.loan_amount,
      interest_rate: loan.interest_rate,
      monthly_installment: loan.monthly_payment,
      repayments_left: loan.tenure - loan.EMIs_paid_on_time
    }));

    res.json(response);

  } catch (err) {
    console.error("Error fetching loans:", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = viewLoanByCustomerId ;
