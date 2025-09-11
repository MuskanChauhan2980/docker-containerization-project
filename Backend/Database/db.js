const { Sequelize, DataTypes } = require("sequelize");

// 🔹 Replace username/password/dbname with your own MySQL credentials
const sequelize = new Sequelize("loan_system", "root", "muskan!!!@00$", {
  host: "localhost",
  dialect: "mysql",
});

// Define Customer Model
const Customer = sequelize.define("Customer", {
  customer_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  first_name: { type: DataTypes.STRING, allowNull: false },
  last_name: { type: DataTypes.STRING, allowNull: false },
  age: { type: DataTypes.INTEGER, allowNull: false },
  monthly_income: { type: DataTypes.INTEGER, allowNull: false },
  approved_limit: { type: DataTypes.INTEGER, allowNull: false },
  phone_number: { type: DataTypes.BIGINT, allowNull: false, unique: true },
});


const Loan = sequelize.define("Loan", {
  loan_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  customer_id: { type: DataTypes.INTEGER, allowNull: false },
  loan_amount: { type: DataTypes.FLOAT, allowNull: false },
  interest_rate: { type: DataTypes.FLOAT, allowNull: false },
  tenure: { type: DataTypes.INTEGER, allowNull: false },
  monthly_installment: { type: DataTypes.FLOAT, allowNull: false },
  start_date: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  end_date: { type: DataTypes.DATE },
  status: {
    type: DataTypes.ENUM("active", "closed"),
    defaultValue: "active",
  },
});

// Relation
Customer.hasMany(Loan, { foreignKey: "customer_id" });
Loan.belongsTo(Customer, { foreignKey: "customer_id" });


// Sync Models with Database
sequelize
  .sync()
  .then(() => console.log(" Database & tables created!"))
  .catch((err) => console.error(" Error creating database:", err));

module.exports = { sequelize, Customer ,Loan};
