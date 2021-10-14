import supertest from "supertest";
import { OrderStatus } from "ticketing-nats-events";
import app from "../../../../";
import { natsWrapper } from "../../../../nats.wrapper";
import Order from "../../orders.model";
import Ticket from "../../tickets.model";
import mongoose from "mongoose";

describe("Orders REST API TEST", () => {
  test("Testing cancel ==> unauthorized", async () => {
    const ticket = Ticket.build({
      id: new mongoose.Types.ObjectId().toHexString(),
      title: "concent",
      price: 20,
    });
    await ticket.save();

    const order = Order.build({
      ticket,
      userId: "asfsfasdf",
      status: OrderStatus.Created,
      expiresAt: new Date(),
    });
    await order.save();

    return await supertest(app)
      .delete(`/api/orders/${order.id}`)
      .set("Cookie", global.signup())
      .expect(401);
  });

  test("Testing creation of order ==> Ticket reserved", async () => {
    const ticket = Ticket.build({
      id: new mongoose.Types.ObjectId().toHexString(),
      title: "concent",
      price: 20,
    });
    await ticket.save();
    const order = Order.build({
      ticket,
      userId: "asfsfasdf",
      status: OrderStatus.Created,
      expiresAt: new Date(),
    });
    await order.save();

    return supertest(app)
      .post("/api/orders")
      .set("Cookie", global.signup())
      .send({
        ticketId: ticket.id,
      })
      .expect(400);
  });

  test("Testing creation of orders", async () => {
    const ticket = Ticket.build({
      id: new mongoose.Types.ObjectId().toHexString(),
      title: "concent",
      price: 20,
    });
    await ticket.save();

    await supertest(app)
      .post("/api/orders")
      .set("Cookie", global.signup())
      .send({
        ticketId: ticket.id,
      })
      .expect(201);

    const orders = await Order.find({});
    expect(orders.length).toEqual(1);
    expect(natsWrapper.client.publish).toHaveBeenCalled();
  });

  test("Can only be accessed if the user is signed in ==> Creation", async () => {
    return supertest(app)
      .post("/api/orders")
      .send({ ticketId: "" })
      .expect(401);
  });

  test("Testing creation of order validation ==> ticketId", async () => {
    return supertest(app)
      .post("/api/orders")
      .set("Cookie", global.signup())
      .send({ ticketId: "" })
      .expect(400);
  });

  test("Testing creation of order ==> Ticket does not exist", async () => {
    const ticketId: string = new mongoose.Types.ObjectId().toHexString();
    return supertest(app)
      .post("/api/orders")
      .set("Cookie", global.signup())
      .send({
        ticketId,
      })
      .expect(404);
  });
});
