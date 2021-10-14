import supertest from "supertest";
import app from "../../../..";

const tmpTicket: any = {
  title: "Any title",
  price: 50,
};

const createTicket = () => {
  return supertest(app)
    .post("/api/tickets")
    .set("Cookie", global.signup())
    .send(tmpTicket);
};

describe("Ticket REST API TEST", () => {
  test("Fetching list of tickets", async () => {
    await createTicket();
    await createTicket();
    await createTicket();

    const response = await supertest(app)
      .get("/api/tickets")
      .set("Cookie", global.signup())
      .expect(200);

    expect(response.body.length).toEqual(3);
  });
});
