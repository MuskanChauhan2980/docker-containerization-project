const XLSX = require("xlsx");
const { LoanExcel } = require("./Database/db");

async function importLoanData() {
  try {
    // ✅ Use the correct loan data file
    const workbook = XLSX.readFile("loan_data.xlsx");
    const sheetName = workbook.SheetNames[0];
    const rawData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

    // ✅ Map Excel rows into DB-friendly objects
    const formattedData = rawData.map(row => ({
      customer_id: row["Customer ID"],
      loan_id: row["Loan ID"],
      loan_amount: row["Loan Amount"],   // not "Last Name"
      tenure: row["Tenure"],
      interest_rate: row["Interest Rate"],
      monthly_payment: row["Monthly payment"],
      EMIs_paid_on_time: row["EMIs paid on Time"],
      date_of_approval: row["Date of Approval"],
      end_date: row["End Date"]
    }));

    // ✅ Insert into MySQL table
    await LoanExcel.bulkCreate(formattedData,{ ignoreDuplicates: true });

    console.log("Loan data imported successfully!");
  } catch (err) {
    console.error("Error importing loan data:", err);
  }
}

module.exports = importLoanData;
