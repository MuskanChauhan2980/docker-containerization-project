# 🚀 Loan & Customer Management API

This project is a **Node.js + Express + MySQL backend API**, containerized with **Docker** and orchestrated using **Docker Compose**.  
It allows you to register customers, check loan eligibility, and view loan details.

---

## 📂 Project Structure

├── controller.js/ # API controllers
├── Database/ # Sequelize models & DB config
├── tests/ # Vitest + Supertest test cases
├── app.js # Express app entry
|--- router/# api design for each router
├── Dockerfile # Docker image build file
├── docker-compose.yml # Compose setup (App + MySQL)
└── README.md # Documentation

---

## ⚡ Features

- Register customers with validation
- Check loan eligibility (with credit score calculation)
- View loan details with customer info
- Dockerized for easy setup
- Unit + Integration tests with **Vitest** & **Supertest**

---

## 🛠️ Tech Stack

- **Node.js** + **Express**
- **MySQL** + **Sequelize ORM**
- **Docker** + **Docker Compose**
- **Vitest** + **Supertest** for testing

---

## 📦 Installation & Setup

### 1️⃣ Clone the repository

```bash
git clone  https://github.com/MuskanChauhan2980/docker-containerization-project.git
cd /Backend


API Endpoints (resquest and response)
👤 Register Customer
POST http://localhost:3000/register
request:
{
  "first_name": "Muskan",
  "last_name": "Chauhan",
  "age": 21,
  "monthly_income": 30000,
  "phone_number": "9999999999"
}

Success Response:
{
  "message": "Customer registered successfully",
  "customer": {
    "customer_id": 1,
    "first_name": "Muskan",
    "last_name": "Chauhan",
    "age": 21,
    "monthly_income": 30000,
    "phone_number": "9999999999"
}


💳 Check Loan Eligibility
POST http://localhost:3000/check-eligibility
request:
{
  "customer_id": 1,
  "loan_amount": 50000,
  "tenure": 12
}


response:
{
  "eligible": true,
  "loan_id": 101,
  "customer_id": 1,
  "loan_amount": 50000,
  "tenure": 12,
  "interest_rate": 10,
  "monthly_payment": 4583.33
}


📄 View Loan Details
GET http://localhost:3000/view-loan/7997
response
{
{
    "loan_id": 7997,
    "customer": {
        "customer_id": 244,
        "first_name": "Annabel",
        "last_name": "Soria",
        "phone_number": 9490132408,
        "age": 48
    },
    "loan_amount": 400000,
    "interest_rate": 12.1,
    "monthly_installment": 10408,
    "tenure": 135
}


GET http://localhost:3000/view-loans/18
Response
[
    {
        "loan_id": 6113,
        "loan_amount": 700000,
        "interest_rate": 11.26,
        "monthly_installment": 21032,
        "repayments_left": 20
    }
]


POST http://localhost:3000/create-loan
Request :
{
  "customer_id": 1,
  "loan_amount": 100000,
  "tenure": 24,
  "interest_rate": 12
}

Response:
{
    "loan_id": 3,
    "customer_id": 1,
    "loan_approved": true,
    "message": "Loan approved successfully",
    "monthly_installment": 4707.347222326467
}

🧪 Running Tests
npx vitest --run