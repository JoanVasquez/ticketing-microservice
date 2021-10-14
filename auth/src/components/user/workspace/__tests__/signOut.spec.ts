import supertest from "supertest";
import app from "../../../../";

describe("User REST API tEST", () => {
  test("clears the cookie after signing out", async () => {
    await supertest(app)
      .post("/api/users/signup")
      .send({
        email: "test@test.com",
        password: "password",
      })
      .expect(201);

    return await supertest(app).post("/api/users/signout").send({}).expect(200);
  });
});
