const { Customer, Loan } = require("../Database/db");
const { Op } = require("sequelize");
const express= require("express");
const router = express.Router();

// Utility: EMI calculation
function calculateEMI(P, annualRate, N) {
  let R = annualRate / (12 * 100); // monthly interest rate
  return (P * R * Math.pow(1 + R, N)) / (Math.pow(1 + R, N) - 1);
}

// Utility: Credit Score calculation
async function calculateCreditScore(customer_id, approved_limit) {
  const loans = await Loan.findAll({ where: { customer_id } });

  if (!loans.length) return 50; // no history → neutral score

  let score = 100;

  // Past loans paid on time (dummy rule: closed loans add points)
  const closedLoans = loans.filter((l) => l.status === "closed").length;
  score += closedLoans * 2;

  // Number of loans taken in past (penalty)
  score -= loans.length * 2;

  // Loan activity in current year
  const currentYear = new Date().getFullYear();
  const thisYearLoans = loans.filter(
    (l) => new Date(l.start_date).getFullYear() === currentYear
  ).length;
  score -= thisYearLoans * 5;

  // Loan approved volume penalty
  const totalLoanVolume = loans.reduce((sum, l) => sum + l.loan_amount, 0);
  if (totalLoanVolume > approved_limit) score -= 30;

  // If current debt > approved limit → credit score = 0
  const activeLoans = loans.filter((l) => l.status === "active");
  const activeDebt = activeLoans.reduce((sum, l) => sum + l.loan_amount, 0);
  if (activeDebt > approved_limit) score = 0;

  return Math.max(score, 0);
}

router.post("/check-eligibility", async (req, res) => {
  try {
    const { customer_id, loan_amount, interest_rate, tenure } = req.body;

    // Validate request
    if (!customer_id || !loan_amount || !interest_rate || !tenure) {
      return res.status(400).json({ error: "All fields are required." });
    }

    const customer = await Customer.findByPk(customer_id);
    if (!customer) {
      return res.status(404).json({ error: "Customer not found" });
    }

    // Calculate credit score
    const credit_score = await calculateCreditScore(
      customer_id,
      customer.approved_limit
    );

    let approval = false;
    let corrected_interest_rate = interest_rate;

    // Loan approval logic
    if (credit_score > 50) {
      approval = true;
    } else if (credit_score > 30) {
      approval = true;
      if (interest_rate < 12) corrected_interest_rate = 12;
    } else if (credit_score > 10) {
      approval = true;
      if (interest_rate < 16) corrected_interest_rate = 16;
    } else {
      approval = false;
    }

    // EMI calculation
    const monthly_installment = calculateEMI(
      loan_amount,
      corrected_interest_rate,
      tenure
    );

    // Check if EMI burden > 50% of salary
    const activeLoans = await Loan.findAll({
      where: { customer_id, status: "active" },
    });
    const totalCurrentEMI = activeLoans.reduce(
      (sum, l) => sum + l.monthly_installment,
      0
    );

    if (totalCurrentEMI + monthly_installment > 0.5 * customer.monthly_income) {
      approval = false;
    }

    return res.status(200).json({
      customer_id,
      approval,
      interest_rate,
      corrected_interest_rate,
      tenure,
      monthly_installment: parseFloat(monthly_installment.toFixed(2)),
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports= router
