import supertest from "supertest";
import app from "../../../../";
import { UserAttrs } from "../../user.model";

const tmpUser = {
  email: "test@test.com",
  password: "123456",
} as UserAttrs;

describe("User REST API tEST", () => {
  test("Testing signup", async () => {
    return supertest(app).post("/api/users/signup").send(tmpUser).expect(201);
  });

  test("Request signup validations ==> email", async () => {
    return supertest(app)
      .post("/api/users/signup")
      .send({ email: "test", password: "123456" } as UserAttrs)
      .expect(400);
  });

  test("Request signup validations ==> password", async () => {
    return supertest(app)
      .post("/api/users/signup")
      .send({ email: "test@test.com", password: "" })
      .expect(400);
  });

  test("dissallow duplicate emails", async () => {
    await supertest(app).post("/api/users/signup").send(tmpUser).expect(201);
    await supertest(app).post("/api/users/signup").send(tmpUser).expect(400);
  });
});
