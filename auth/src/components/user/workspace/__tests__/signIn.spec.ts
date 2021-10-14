import supertest from "supertest";
import app from "../../../../";
import { UserAttrs } from "../../user.model";

const tmpUser = {
  email: "test@test.com",
  password: "123456",
} as UserAttrs;

describe("User REST API tEST", () => {
  test("Testing signin", async () => {
    await supertest(app).post("/api/users/signup").send(tmpUser).expect(201);
    await supertest(app).post("/api/users/signin").send(tmpUser).expect(200);
  });

  test("Request signin validations ==> email", async () => {
    return supertest(app)
      .post("/api/users/signin")
      .send({ email: "test", password: "123456" })
      .expect(400);
  });

  test("Request signin validations ==> password", async () => {
    return supertest(app)
      .post("/api/users/signin")
      .send({ email: "test@test", password: "" })
      .expect(400);
  });

  test("Request invalid credentials singin ==> Email", async () => {
    return supertest(app).post("/api/users/signin").send(tmpUser).expect(400);
  });

  test("Request invalid credentials signin ==> Password", async () => {
    await supertest(app).post("/api/users/signup").send(tmpUser).expect(201);
    await supertest(app)
      .post("/api/users/signin")
      .send({ email: "test@test.com", password: "asfsagfssdg" })
      .expect(400);
  });
});
