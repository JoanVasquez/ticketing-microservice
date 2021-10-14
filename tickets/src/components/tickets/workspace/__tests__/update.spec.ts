import supertest from "supertest";
import mongoose from "mongoose";
import app from "../../../..";
import { natsWrapper } from "../../../../nats.wrapper";
import Ticket from "../../tickets.model";

const tmpTicket: any = {
  title: "Any title",
  price: 50,
};

describe("Ticket REST API TEST", () => {
  test("Testing ticket by ID not found ==> Update", async () => {
    const ticketId = new mongoose.Types.ObjectId().toHexString();
    tmpTicket.id = ticketId;
    await supertest(app)
      .put("/api/tickets")
      .set("Cookie", global.signup())
      .send(tmpTicket)
      .expect(404);
  });

  test("Unauthorized ==> Updating", async () => {
    const ticketId = new mongoose.Types.ObjectId().toHexString();
    tmpTicket.id = ticketId;
    return supertest(app).put("/api/tickets").send(tmpTicket).expect(401);
  });

  test("Testing if the user own the ticket", async () => {
    const response = await supertest(app)
      .post("/api/tickets")
      .set("Cookie", global.signup())
      .send(tmpTicket);

    response.body.title = "A new title";
    await supertest(app)
      .put("/api/tickets")
      .set("Cookie", global.signup())
      .send(response.body)
      .expect(401);
  });

  test("Updating ==> input validation", async () => {
    const cookie = global.signup();

    await supertest(app)
      .post("/api/tickets")
      .set("Cookie", cookie)
      .send(tmpTicket);

    await supertest(app)
      .put("/api/tickets")
      .set("Cookie", cookie)
      .send({ title: "", price: -10 })
      .expect(400);
  });

  test("Testing updating of ticket", async () => {
    const cookie = global.signup();

    const response = await supertest(app)
      .post("/api/tickets")
      .set("Cookie", cookie)
      .send(tmpTicket);

    tmpTicket.id = response.body.id;
    tmpTicket.title = "A new title";

    await supertest(app)
      .put("/api/tickets")
      .set("Cookie", cookie)
      .send(tmpTicket)
      .expect(200);

    const ticketResponse = await supertest(app)
      .get(`/api/tickets/${response.body.id}`)
      .expect(200);

    expect(ticketResponse.body.title).toEqual("A new title");
    expect(natsWrapper.client.publish).toHaveBeenCalled();
  });

  test("Rejects updates if the ticket is reserved", async () => {
    const cookie = global.signup();

    const response = await supertest(app)
      .post("/api/tickets")
      .set("Cookie", cookie)
      .send({
        title: "asldkfj",
        price: 20,
      });

    const ticket = await Ticket.findById(response.body.id);
    ticket!.set({ orderId: new mongoose.Types.ObjectId().toHexString() });
    await ticket!.save();

    await supertest(app)
      .put(`/api/tickets`)
      .set("Cookie", cookie)
      .send({
        title: "new title",
        price: 100,
        id: response.body.id,
      })
      .expect(400);
  });
});
