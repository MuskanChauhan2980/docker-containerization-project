const express = require("express");
const router = express.Router();
const { Loan, Customer } = require("../Database/db");

// 📌 View Loan Details with Customer Info
router.get("/view-loan/:loan_id", async (req, res) => {
  try {
    const { loan_id } = req.params;

    // Get loan with customer info
    const loan = await Loan.findOne({
      where: { loan_id },
      include: [
        {
          model: Customer,
          attributes: ["customer_id", "first_name", "last_name", "phone_number", "age"]
        }
      ]
    });

    if (!loan) {
      return res.status(404).json({ message: "Loan not found" });
    }

    // Format response
    return res.json({
      loan_id: loan.loan_id,
      customer: loan.Customer, // contains customer_id, first_name, last_name, phone_number, age
      loan_amount: loan.loan_amount,
      interest_rate: loan.interest_rate,
      monthly_installment: loan.monthly_installment,
      tenure: loan.tenure
    });

  } catch (err) {
    console.error(" Error fetching loan:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
