import supertest from "supertest";
import app from ".";

test("Testing 404", async () => {
  return supertest(app).get("/api/users/test").expect(404);
});
