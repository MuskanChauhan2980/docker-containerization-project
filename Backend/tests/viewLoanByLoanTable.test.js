import request from "supertest";
import express from "express";
import { vi } from "vitest";

// mock DB models
vi.mock("../Database/db.js", () => ({
  LoanExcel: { findOne: vi.fn() },
  CustomerExcel: {} // included in relation
}));

import { LoanExcel } from "../Database/db.js";
import viewLoanByLoanId from "../controller.js/view-loanController.js";

// setup express app for testing
const app = express();
app.get("/loan/:loan_id", viewLoanByLoanId);

describe("GET /loan/:loan_id", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should return loan details with customer info", async () => {
    // mock DB return
    LoanExcel.findOne.mockResolvedValue({
      loan_id: 1313,
      loan_amount: 50000,
      interest_rate: 12,
      monthly_payment: 4500,
      tenure: 12,
      CustomerExcel: {
        customer_id: 10,
        first_name: "Bhauhvan",
        last_name: "Chauhan",
        phone_number: "9037913092",
        age: 21
      }
    });

    const res = await request(app).get("/loan/1313");

    expect(res.status).toBe(200);
    expect(res.body.loan_id).toBe(1);
    expect(res.body.customer.first_name).toBe("Bhauhvan");
    expect(res.body.loan_amount).toBe(50000);
  });

  it("should return 404 if loan not found", async () => {
    LoanExcel.findOne.mockResolvedValue(null);

    const res = await request(app).get("/loan/999");

    expect(res.status).toBe(404);
    expect(res.body.message).toBe("Loan not found");
  });
});
