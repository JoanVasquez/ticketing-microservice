import { throwError } from "@jvtickets22/common-node-express";
import Ticket from "./tickets.model";
import Order from "./orders.model";
import { OrderStatus } from "ticketing-nats-events";
import { natsWrapper } from "../../nats.wrapper";
import { OrderCreatedPublisher } from "../../events/publisher/order.created.publisher";
import { OrderCancelledPublisher } from "../../events/publisher/order.cancelled.publisher";

const EXPIRATION_WINDOW_SECONDS = 15 * 60;

export const createOrderDao = async (ticketId: string, userId: string) => {
  //Find the ticket the user is trying to order
  const ticket = await Ticket.findById(ticketId);

  if (!ticket) {
    throw throwError(404, "Ticket not found");
  }

  //Make sure that this ticket is not already reserved
  const isReserver: boolean = await ticket.isReserved();
  if (isReserver) {
    throw throwError(400, "Ticket is already reserved");
  }

  //Calculate an expiration date for this order
  const expiration: Date = new Date();
  expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS);

  //Build the order and save it to the DB
  const order = Order.build({
    userId: userId,
    status: OrderStatus.Created,
    expiresAt: expiration,
    ticket,
  });

  await order.save();

  new OrderCreatedPublisher(natsWrapper.client).publish({
    id: order.id,
    status: order.status,
    userId: order.userId,
    expiresAt: order.expiresAt.toISOString(),
    ticket: {
      id: ticket.id,
      price: ticket.price,
    },
    version: order.version,
  });

  return order;
};

export const listOrdersDao = async (userId: string) => {
  const orders = await Order.find({ userId }).populate("ticket");
  return orders;
};

export const listOrderByIdDao = async (orderId: string, userId: string) => {
  const order = await Order.findById(orderId).populate("ticket");

  if (!order) {
    throw throwError(404, "Order not found");
  }

  if (order.userId !== userId) {
    throw throwError(401, "Not authorized");
  }

  return order;
};

export const deleteOrderDao = async (orderId: string, userId: string) => {
  const order = await Order.findById(orderId).populate("ticket");

  if (!order) {
    throw throwError(404, "Order not found");
  }

  if (order.userId !== userId) {
    throw throwError(401, "Not authorized");
  }

  order.status = OrderStatus.Cancelled;
  await order.save();

  new OrderCancelledPublisher(natsWrapper.client).publish({
    id: order.id,
    ticket: {
      id: order.ticket.id,
    },
    version: order.version,
  });

  return order;
};
