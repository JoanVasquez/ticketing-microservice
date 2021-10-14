import supertest from "supertest";
import app from "../../../../";

describe("User REST API tEST", () => {
  test("responds with details about the current user", async () => {
    const cookie = await global.signup();
    const response = await supertest(app)
      .get("/api/users/currentuser")
      .set("Cookie", cookie)
      .send();
    expect(200);
    expect(response.body.currentUser.email).toEqual("test@test.com");
  });

  test("Respond with null if not aunthenticated", async () => {
    const response = await supertest(app)
      .get("/api/users/currentuser")
      .expect(200);
    expect(response.body.currentUser).toEqual(null);
  });
});
