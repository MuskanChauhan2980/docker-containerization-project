const express = require("express");
const router = express.Router();
const { Loan, Customer } = require("../Database/db"); // use real tables

// Utility function for EMI calculation
function calculateEMI(principal, rate, tenure) {
  let monthlyRate = rate / (12 * 100); // convert annual % to monthly fraction
  return (
    (principal * monthlyRate * Math.pow(1 + monthlyRate, tenure)) /
    (Math.pow(1 + monthlyRate, tenure) - 1)
  );
}

const createLoan= async (req, res) => {
  try {
    const { customer_id, loan_amount, interest_rate, tenure } = req.body;

    // 1. Check if customer exists in real Customer table
    const customer = await Customer.findByPk(customer_id);
    if (!customer) {
      return res.status(404).json({
        loan_id: null,
        customer_id,
        loan_approved: false,
        message: "Customer not found",
        monthly_installment: null,
      });
    }

    // 2. Eligibility check (requested <= approved_limit)
    if (loan_amount > customer.approved_limit) {
      return res.status(400).json({
        loan_id: null,
        customer_id,
        loan_approved: false,
        message: "Loan amount exceeds approved limit",
        monthly_installment: null,
      });
    }

    // 3. Calculate EMI
    const monthly_installment = calculateEMI(
      loan_amount,
      interest_rate,
      tenure
    );

    // 4. Create loan entry in Loan table
    const loan = await Loan.create({
      customer_id,
      loan_amount,
      tenure,
      interest_rate,
      monthly_installment,
      EMIs_paid_on_time: 0,
      date_of_approval: new Date(),
      end_date: new Date(new Date().setMonth(new Date().getMonth() + tenure)),
    });

    // 5. Respond with loan details
    return res.json({
      loan_id: loan.loan_id, // should auto increment now
      customer_id,
      loan_approved: true,
      message: "Loan approved successfully",
      monthly_installment,
    });
  } catch (err) {
    console.error("Loan processing error:", err);
    return res.status(500).json({
      loan_id: null,
      customer_id: req.body.customer_id,
      loan_approved: false,
      message: "Server error",
      monthly_installment: null,
    });
  }
}

module.exports = createLoan;
