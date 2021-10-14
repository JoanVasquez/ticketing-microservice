import supertest from "supertest";
import { OrderStatus } from "ticketing-nats-events";
import { natsWrapper } from "../../../../nats.wrapper";
import app from "../../../../";
import Order from "../../orders.model";
import Ticket from "../../tickets.model";
import mongoose from "mongoose";

describe("Orders REST API TEST", () => {
  test("Testing cancel order ==> Not Found", async () => {
    const orderId: string = new mongoose.Types.ObjectId().toHexString();

    return await supertest(app)
      .delete(`/api/orders/${orderId}`)
      .set("Cookie", global.signup())
      .expect(404);
  });

  test("Testing cancel order", async () => {
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

    await supertest(app)
      .delete(`/api/orders/${order.id}`)
      .set("Cookie", user)
      .expect(204);

    const updatedOrder = await Order.findById(order.id);
    expect(updatedOrder.status).toEqual(OrderStatus.Cancelled);
    expect(natsWrapper.client.publish).toHaveBeenCalled();
  });
});
