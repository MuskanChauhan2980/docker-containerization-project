const XLSX = require("xlsx");
const { CustomerExcel } = require("./Database/db");

async function importCustomerData() {
  try {
    const workbook = XLSX.readFile("customer_data.xlsx");
    const sheetName = workbook.SheetNames[0];
    const rawData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

    const formattedData = rawData.map(row => ({
      customer_id: row["Customer ID"],
      first_name: row["First Name"],
      last_name: row["Last Name"],
      age: row["Age"],
      phone_number: row["Phone Number"],
      monthly_salary: row["Monthly Salary"],
      approved_limit: row["Approved Limit"],
    }));

    await CustomerExcel.bulkCreate(formattedData, { ignoreDuplicates: true });

    console.log("✅ Customer data imported successfully!");
  } catch (err) {
    console.error("❌ Error importing customer data:", err);
  }
}

 module.exports=importCustomerData;
