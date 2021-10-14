import supertest from "supertest";
import { OrderStatus } from "ticketing-nats-events";
import app from "../../../../";
import Order from "../../orders.model";
import Ticket from "../../tickets.model";
import mongoose from "mongoose";

describe("Orders REST API TEST", () => {
  test("Testing list order by ID ==> Not found", async () => {
    const orderId: string = new mongoose.Types.ObjectId().toHexString();

    return await supertest(app)
      .get(`/api/orders/${orderId}`)
      .set("Cookie", global.signup())
      .expect(404);
  });

  test("Testing list order by ID ==> Unauthorized", async () => {
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
      .get(`/api/orders/${order.id}`)
      .set("Cookie", global.signup())
      .expect(401);
  });

  test("Testing list order by ID", async () => {
    const ticket = Ticket.build({
      id: new mongoose.Types.ObjectId().toHexString(),
      title: "concent",
      price: 20,
    });
    await ticket.save();

    const user = global.signup();
    const { body: order } = await supertest(app)
      .post("/api/orders")
      .set("Cookie", user)
      .send({ ticketId: ticket.id })
      .expect(201);

    const { body: fetchedOrder } = await supertest(app)
      .get(`/api/orders/${order.id}`)
      .set("Cookie", user)
      .expect(200);

    expect(fetchedOrder.id).toEqual(order.id);
  });
});
