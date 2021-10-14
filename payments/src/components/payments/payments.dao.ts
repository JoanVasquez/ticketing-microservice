import { throwError } from "@jvtickets22/common-node-express";
import { OrderStatus } from "ticketing-nats-events";
import Order from "./orders.model";
import { stripe } from "../../stripe";
import Payment from "./payments.model";
import { PaymentCreatedPublisher } from "../../events/publishers/payment.created.publisher";
import { natsWrapper } from "../../nats.wrapper";

export const createPaymentDao = async (
  token: string,
  orderId: string,
  userId: string
) => {
  const order = await Order.findById(orderId);

  if (!order) {
    throw throwError(404, "Order not found");
  }

  if (order.userId !== userId) {
    throw throwError(401, "Not authorized");
  }

  if (order.status === OrderStatus.Cancelled) {
    throw throwError(400, "Cannot pay for a cancelled order");
  }

  const charge = await stripe.charges.create({
    currency: "usd",
    amount: order.price * 100,
    source: token,
  });

  const payment = Payment.build({
    orderId,
    stripeId: charge.id,
  });

  await payment.save();

  await new PaymentCreatedPublisher(natsWrapper.client).publish({
    id: payment.id,
    orderId: order.id,
    stripeId: charge.id,
  });

  return payment;
};
