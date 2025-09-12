const express = require("express");
const bodyParser = require("body-parser");
const { Customer } = require("../Database/db");
const router = express.Router();
const app = express();
app.use(bodyParser.json());

// Utility function: round to nearest lakh
function roundToNearestLakh(amount) {
  return Math.round(amount / 100000) * 100000;
}

 
 const register  = async (req, res) => {
  try {
    const { first_name, last_name, age, monthly_income, phone_number } = req.body;

    // Validation
    if (!first_name || !last_name || !age || !monthly_income || !phone_number) {
      return res.status(400).json({ error: "All fields are required." });
    }

    if (typeof age !== "number" || age <= 0) {
      return res.status(400).json({ error: "Age must be a positive number." });
    }

    if (typeof monthly_income !== "number" || monthly_income <= 0) {
      return res.status(400).json({ error: "Monthly income must be a positive number." });
    }

    // Calculate approved limit
    let approved_limit = 36 * monthly_income;
    approved_limit = roundToNearestLakh(approved_limit);

    // Save to DB
    const customer = await Customer.create({
      first_name,
      last_name,
      age,
      monthly_income,
      approved_limit,
      phone_number,
    });

    // Response format
    return res.status(201).json({
      customer_id: customer.customer_id,
      name: `${customer.first_name} ${customer.last_name}`,
      age: customer.age,
      monthly_income: customer.monthly_income,
      approved_limit: customer.approved_limit,
      phone_number: customer.phone_number,
    });
  } catch (error) {
    console.error(error);

    // Handle duplicate phone number
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(409).json({ error: "Phone number already exists." });
    }

    return res.status(500).json({ error: "Internal Server Error" });
  }
}

 module.exports= register ;