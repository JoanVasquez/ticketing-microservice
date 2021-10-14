import supertest from "supertest";
import app from "../../../..";
import mongoose from "mongoose";

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
  test("Testing list ticket by Id", async () => {
    const response = await createTicket().send(tmpTicket);

    const ticketResponse = await supertest(app)
      .get(`/api/tickets/${response.body.id}`)
      .expect(200);

    expect(ticketResponse.body.title).toEqual(tmpTicket.title);
    expect(ticketResponse.body.price).toEqual(tmpTicket.price);
  });

  test("Testing ticket by ID not found ==> Get By Id", async () => {
    const ticketId = new mongoose.Types.ObjectId().toHexString();
    await supertest(app).get(`/api/tickets/${ticketId}`).expect(404);
  });
});
