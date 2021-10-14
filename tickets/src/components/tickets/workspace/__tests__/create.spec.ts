import supertest from "supertest";
import app from "../../../..";
import Ticket from "../../tickets.model";
import { natsWrapper } from "../../../../nats.wrapper";

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
  test("Testing creation of tickets", async () => {
    let tickets = await Ticket.find({});
    expect(tickets.length).toEqual(0);
    await createTicket().expect(201);
    tickets = await Ticket.find({});
    expect(tickets.length).toEqual(1);
    expect(tickets[0].price).toEqual(50);
    expect(natsWrapper.client.publish).toHaveBeenCalled();
  });

  test("Unauthorized ==> Creation", async () => {
    return supertest(app).post("/api/tickets").send(tmpTicket).expect(401);
  });

  test("Testing creation of ticket validation ==> title", async () => {
    return supertest(app)
      .post("/api/tickets")
      .set("Cookie", global.signup())
      .send({ title: "", price: 20 })
      .expect(400);
  });

  test("Testing creation of ticket validation ==> price", async () => {
    return supertest(app)
      .post("/api/tickets")
      .set("Cookie", global.signup())
      .send({ title: "Any title" })
      .expect(400);
  });
});
