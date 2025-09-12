import request from "supertest";
import app from "../app.js";
import { CustomerExcel, LoanExcel } from "../Database/db.js";

vi.mock("../Database/db.js", () => ({
  CustomerExcel: { findByPk: vi.fn() },
  LoanExcel: { findAll: vi.fn() },
}));

import checkEligibility from "../controller.js/check-eligibility.Controller.js";

describe("POST /check-eligibility", () => {
  it("should return 404 if customer not found", async () => {
    // make sure mock returns null
    CustomerExcel.findByPk.mockResolvedValue(null);

    const res = await request(app)
      .post("/check-eligibility")
      .send({ customer_id: 90, loan_amount: 50000, interest_rate: 12, tenure: 12 });

    expect(res.status).toBe(404);
    expect(res.body.message).toBe("Customer not found");
  });
})
   


   describe("loan approved", () => {
  test("should approve loan when credit score is good", async () => {

    CustomerExcel.findByPk.mockResolvedValue({
      customer_id: 1,
      monthly_salary: 100000,
      approved_limit: 500000,
    });
    LoanExcel.findAll.mockResolvedValue([]); // no past loans

    const res = await request(app)
      .post("/check-eligibility")
      .send({ customer_id: 1, loan_amount: 50000, interest_rate: 12, tenure: 12 });

    expect(res.status).toBe(200);
    expect(res.body.approval).toBe(true);
    expect(res.body.monthly_installment).toBeGreaterThan(0);
  });
})

