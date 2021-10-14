import supertest from "supertest";
import app from ".";
import {
  createOrderDao,
  listOrdersDao,
  listOrderByIdDao,
  deleteOrderDao,
} from "./components/orders/orders.dao";
import Order from "./components/orders/orders.model";
import Ticket from "./components/orders/tickets.model";
import { OrderStatus, TicketUpdatedEvent } from "ticketing-nats-events";
import mongoose from "mongoose";

test("Order DAO functions should exists", () => {
  expect(createOrderDao).toBeDefined();
  expect(listOrderByIdDao).toBeDefined();
  expect(listOrdersDao).toBeDefined();
  expect(deleteOrderDao).toBeDefined();
});

test("Testing 404", async () => {
  return supertest(app).get("/api/safdsf").expect(404);
});

test("Implements optimistic concunrrency control", async () => {
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

  const firstInstance = await Order.findById(order.id);
  const secondInstance = await Order.findById(order.id);

  firstInstance!.set({ price: 10 });
  secondInstance!.set({ price: 15 });

  await firstInstance!.save();

  try {
    await secondInstance!.save();
  } catch (error) {
    return;
  }

  throw new Error("Should not reach this point");
});

test("increments the version number on multiple saves", async () => {
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

  expect(order.version).toEqual(0);
  await order.save();
  expect(order.version).toEqual(1);
});
