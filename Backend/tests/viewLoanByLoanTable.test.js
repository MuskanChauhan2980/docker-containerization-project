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
app.get("/view-loan/:loan_id", viewLoanByLoanId);

describe("GET /view-loan/:loan_id", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should return loan details with customer info", async () => {
    // mock DB return
    LoanExcel.findOne.mockResolvedValue({
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
});

    const res = await request(app).get("/view-loan/1313");

    expect(res.status).toBe(200);
    expect(res.body.loan_id).toBe(1);
    expect(res.body.customer.first_name).toBe("Annabel");
    expect(res.body.loan_amount).toBe(50000);
  });

  it("should return 404 if loan not found", async () => {
    LoanExcel.findOne.mockResolvedValue(null);

    const res = await request(app).get("/view-loan/999");

    expect(res.status).toBe(404);
    expect(res.body.message).toBe("Loan not found");
  });
});
