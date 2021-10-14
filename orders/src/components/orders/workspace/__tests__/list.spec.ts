import supertest from "supertest";
import app from "../../../../";
import Ticket from "../../tickets.model";
import mongoose from "mongoose";

describe("Orders REST API TEST", () => {
  test("Testing list of orders", async () => {
    const ticket = Ticket.build({
      id: new mongoose.Types.ObjectId().toHexString(),
      title: "concent",
      price: 20,
    });
    await ticket.save();

    const user = global.signup();

    await supertest(app)
      .post("/api/orders")
      .set("Cookie", user)
      .send({
        ticketId: ticket.id,
      })
      .expect(201);

    const response = await supertest(app)
      .get("/api/orders")
      .set("Cookie", user)
      .expect(200);

    expect(response.body.length).toEqual(1);
  });
});
