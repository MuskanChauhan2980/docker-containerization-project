const express = require("express");
const router= express.Router();
const {CustomerExcel,LoanExcel} = require("../Database/db");


function calculateEMI(principal,rate,tenure){
  const monthlyRate= rate/(12*100);
  return(
    principal*monthlyRate*Math.pow(1+monthlyRate,tenure)/
    (Math.pow(1+monthlyRate,tenure) -1 )
  )
}

 const checkEligibility = async (req, res) => {
  try {
    const { customer_id, loan_amount, interest_rate, tenure } = req.body;

    // 1. Get customer
    const customer = await CustomerExcel.findByPk(customer_id);
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    // 2. Get customer loans
    const pastLoans = await LoanExcel.findAll({ where: { customer_id } });
    let credit_score = 50; // base score

    // 3. Past loans paid on time
    const onTimePayments = pastLoans.reduce((sum, loan) => sum + loan.EMIs_paid_on_time, 0);
    credit_score += Math.min(onTimePayments * 2, 20);

    // 4. No of past loans
    credit_score += pastLoans.length < 3 ? 10 : 5;

    // 5. Loan activity this year
    const thisYear = new Date().getFullYear();
    const currentYearLoans = pastLoans.filter(
      loan => new Date(loan.date_of_approval).getFullYear() === thisYear
    ).length;
    credit_score += currentYearLoans > 0 ? 5 : 0;

    // 6. Loan approved volume
    const totalLoanVolume = pastLoans.reduce((sum, loan) => sum + loan.loan_amount, 0);
    credit_score += totalLoanVolume > 50000 ? 10 : 5;

    // 7. Check if active loans > approved limit
    const activeLoanSum = pastLoans.reduce(
      (sum, loan) => sum + (loan.status === "active" ? loan.loan_amount : 0),
      0
    );
    if (activeLoanSum + loan_amount > customer.approved_limit) {
      credit_score = 0;
    }

    // 8. Check salary-to-EMI ratio
    const currentEmis = pastLoans.reduce(
      (sum, loan) => sum + (loan.status === "active" ? loan.monthly_payment : 0),
      0
    );
    const newEmi = calculateEMI(loan_amount, interest_rate, tenure);
    if ((currentEmis + newEmi) > 0.5 * customer.monthly_salary) {
      return res.json({
        customer_id,
        approval: false,
        interest_rate,
        corrected_interest_rate: interest_rate,
        tenure,
        monthly_installment: null,
        message: "Rejected: EMI exceeds 50% of salary"
      });
    }

    // 9. Decide approval based on credit score
    let approved = false;
    let corrected_rate = interest_rate;

    if (credit_score > 50) {
      approved = true;
    } else if (credit_score > 30) {
      if (interest_rate >= 12) {
        approved = true;
      } else {
        corrected_rate = 12;
        approved = true;
      }
    } else if (credit_score > 10) {
      if (interest_rate >= 16) {
        approved = true;
      } else {
        corrected_rate = 16;
        approved = true;
      }
    } else {
      approved = false;
    }

    return res.json({
      customer_id,
      approval: approved,
      interest_rate,
      corrected_interest_rate: corrected_rate,
      tenure,
      monthly_installment: approved ? calculateEMI(loan_amount, corrected_rate, tenure) : null,
      credit_score
    });

  } catch (err) {
    console.error("❌ Eligibility check error:", err);
    res.status(500).json({ message: "Server error" });
  }
}

module.exports =  checkEligibility ;