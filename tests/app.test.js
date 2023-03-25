// const request = require("supertest");
const app = require("../index"); // assuming that the express app is exported from app.js
const User = require("../src/models/User");

describe("POST /api/v1/register", () => {
  it("should register a new user", async () => {
    const res = await request(app).post("/api/v1/register").send({
      name: "Test User",
      email: "testuser@example.com",
      password: "password123",
    });
    expect(res.statusCode).toEqual(200);
    expect(res.body.token).toBeDefined();
    // Clean up: delete the user from the database
    const user = await User.findOne({ email: "testuser@example.com" });
    await user.remove();
  });

  it("should return status 400 when required fields are missing", async () => {
    const res = await request(app).post("/api/v1/register").send({
      name: "Test User",
      // email and password fields are missing
    });
    expect(res.statusCode).toEqual(400);
    expect(res.body.success).toBeFalsy();
  });

  it("should return status 400 when the user already exists", async () => {
    const existingUser = new User({
      name: "Existing User",
      email: "existinguser@example.com",
      password: "password123",
    });
    await existingUser.save();
    const res = await request(app).post("/api/v1/register").send({
      name: "Test User",
      email: "existinguser@example.com", // try to register with an existing email
      password: "password123",
    });
    expect(res.statusCode).toEqual(400);
    expect(res.body.success).toBeFalsy();
    // Clean up: delete the user from the database
    await existingUser.remove();
  });

  it("should return status 400 when there is a server error", async () => {
    jest.spyOn(User, "findOne").mockImplementationOnce(() => {
      throw new Error();
    }); // simulate a server error
    const res = await request(app).post("/api/v1/register").send({
      name: "Test User",
      email: "testuser@example.com",
      password: "password123",
    });
    expect(res.statusCode).toEqual(400);
    expect(res.body.success).toBeFalsy();
    jest.spyOn(User, "findOne").mockRestore(); // restore the original implementation
  });
});
