import request from "supertest";
import { describe, test, expect, beforeAll, afterAll } from "vitest";
import express from "express";
import bodyParser from "body-parser";
import { Customer } from "../Database/db"; // <-- Sequelize model
import register from "../controller.js/registerController"; // <-- your register controller

const app = express();
app.use(bodyParser.json());

// Mount the route
app.post("/register", register);

describe("POST /register", () => {
  const testCustomer = {
    first_name: "Muskan",
    last_name: "Chauhan",
    age: 21,
    monthly_income: 30000,
    phone_number: "9999999999",
  };

  afterAll(async () => {
    // Cleanup test user from DB
    await Customer.destroy({
      where: { phone_number: testCustomer.phone_number },
    });
  });

  test("should create a new customer successfully", async () => {
    const response = await request(app)
      .post("/register")
      .send(testCustomer);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("customer_id");
    expect(response.body).toHaveProperty("approved_limit");
    expect(response.body.name).toBe("Muskan Chauhan");
  });

  test("should return 400 when required fields are missing", async () => {
    const response = await request(app)
      .post("/register")
      .send({ first_name: "Test" }); // missing fields

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error", "All fields are required.");
  });

  test("should return 400 when age is invalid", async () => {
    const invalidCustomer = { ...testCustomer, age: -5, phone_number: "8888888888" };
    const response = await request(app)
      .post("/register")
      .send(invalidCustomer);

    expect(response.status).toBe(400);
    expect(response.body.error).toBe("Age must be a positive number.");
  });

  test("should return 409 when phone number already exists", async () => {
    // First insert
    await request(app).post("/register").send(testCustomer);

    // Insert again with same phone_number
    const response = await request(app)
      .post("/register")
      .send(testCustomer);

    expect(response.status).toBe(409);
    expect(response.body.error).toBe("Phone number already exists.");
  });
});
