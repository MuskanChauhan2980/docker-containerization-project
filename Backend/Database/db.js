const { Sequelize, DataTypes } = require("sequelize");

const sequelize = new Sequelize("loan_system", "root", "muskan!!!@00$", {
  host: "localhost",
  dialect: "mysql",
});

// ------------------ Customer ------------------
const Customer = sequelize.define("Customer", {
  customer_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  first_name: { type: DataTypes.STRING, allowNull: false },
  last_name: { type: DataTypes.STRING, allowNull: false },
  age: { type: DataTypes.INTEGER, allowNull: false },
  monthly_income: { type: DataTypes.INTEGER, allowNull: false },
  approved_limit: { type: DataTypes.INTEGER, allowNull: false },
  phone_number: { type: DataTypes.BIGINT, allowNull: false, unique: true },
}, {
  freezeTableName: true,
  timestamps: false
});

// ------------------ Loan ------------------
const Loan = sequelize.define("Loan", {
  loan_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  customer_id: { type: DataTypes.INTEGER, allowNull: false },
  loan_amount: { type: DataTypes.FLOAT, allowNull: false },
  interest_rate: { type: DataTypes.FLOAT, allowNull: false },
  tenure: { type: DataTypes.INTEGER, allowNull: false },
  monthly_installment: { type: DataTypes.FLOAT, allowNull: false },
  start_date: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  end_date: { type: DataTypes.DATE },
  status: { type: DataTypes.ENUM("active", "closed"), defaultValue: "active" },
}, {
  freezeTableName: true,
  timestamps: false
});

// ------------------ CustomerExcel ------------------
const CustomerExcel = sequelize.define("CustomerExcel", {
  customer_id: { type: DataTypes.INTEGER, primaryKey: true },
  first_name: { type: DataTypes.STRING },
  last_name: { type: DataTypes.STRING },
  age: { type: DataTypes.INTEGER },
  phone_number: { type: DataTypes.BIGINT },
  monthly_salary: { type: DataTypes.INTEGER },
  approved_limit: { type: DataTypes.INTEGER }
}, {
  freezeTableName: true,
  timestamps: false
});

// ------------------ LoanExcel ------------------
const LoanExcel = sequelize.define("LoanExcel", {
  loan_id: { type: DataTypes.INTEGER, primaryKey: true },
  customer_id: { type: DataTypes.INTEGER, allowNull: false },
  loan_amount: { type: DataTypes.FLOAT, allowNull: false },
  tenure: { type: DataTypes.INTEGER, allowNull: false },
  interest_rate: { type: DataTypes.FLOAT, allowNull: false },
  monthly_payment: { type: DataTypes.FLOAT, allowNull: false },
  EMIs_paid_on_time: { type: DataTypes.INTEGER, allowNull: false },
  date_of_approval: { type: DataTypes.DATE, allowNull: false },
  end_date: { type: DataTypes.DATE, allowNull: false }
}, {
  freezeTableName: true,
  timestamps: false
});

// ------------------ Relationships ------------------
Customer.hasMany(Loan, { foreignKey: "customer_id" });
Loan.belongsTo(Customer, { foreignKey: "customer_id" });

// ------------------ Sync DB ------------------
sequelize.sync({ alter: true })  // use { force: true } only in dev
  .then(() => console.log("✅ Database & tables created/updated!"))
  .catch((err) => console.error("❌ Error creating database:", err));

module.exports = { sequelize, Customer, Loan, CustomerExcel, LoanExcel };
