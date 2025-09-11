const express = require("express");
const XLSX = require("xlsx");

const app = express();

// Load customer data
const customerWorkbook = XLSX.readFile("./customer_data.xlsx");
const customerSheet = customerWorkbook.Sheets[customerWorkbook.SheetNames[0]];
const customers = XLSX.utils.sheet_to_json(customerSheet);
// console.log(customers);

// Load loan data
const loanWorkbook = XLSX.readFile("./loan_data.xlsx");
const loanSheet = loanWorkbook.Sheets[loanWorkbook.SheetNames[0]];
const loans = XLSX.utils.sheet_to_json(loanSheet);
// console.log(loans);

// Sample route
app.get("/customers", (req, res) => {
  res.json(customers);
});

app.get("/loans", (req, res) => {
  res.json(loans);
});

app.listen(3000, () => console.log("Server running on port 3000"));
