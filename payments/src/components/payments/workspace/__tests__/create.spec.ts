import supertest from "supertest";
import app from "../../../..";
import mongoose from "mongoose";
import Order from "../../orders.model";
import { OrderStatus } from "ticketing-nats-events";
import { stripe } from "../../../../stripe";
import Payment from "../../payments.model";

//jest.mock("../../../../stripe");

describe("Payments REST API TEST", () => {
  test("Order not found", async () => {
    const orderId: string = new mongoose.Types.ObjectId().toHexString();
    const token: string = "lksfksalkj";

    const res = await supertest(app)
      .post("/api/payments")
      .set("Cookie", global.signup())
      .send({
        orderId,
        token,
      })
      .expect(404);

    expect(res.body[0].message).toEqual("Order not found");
  });

  test("Not authorized", async () => {
    const order = Order.build({
      id: new mongoose.Types.ObjectId().toHexString(),
      version: 0,
      userId: "adafsds",
      price: 22,
      status: OrderStatus.Created,
    });
    await order.save();
    const res = await supertest(app)
      .post("/api/payments")
      .set("Cookie", global.signup())
      .send({
        token: "sfdfsad",
        orderId: order.id,
      })
      .expect(401);
    expect(res.body[0].message).toEqual("Not authorized");
  });

  test("Cancelled order", async () => {
    const userId = new mongoose.Types.ObjectId().toHexString();

    const order = Order.build({
      id: new mongoose.Types.ObjectId().toHexString(),
      userId,
      version: 0,
      price: 20,
      status: OrderStatus.Cancelled,
    });
    await order.save();

    await supertest(app)
      .post("/api/payments")
      .set("Cookie", global.signup(userId))
      .send({
        orderId: order.id,
        token: "asdlkfj",
      })
      .expect(400);
  });

  test("valid inputs", async () => {
    const userId: string = new mongoose.Types.ObjectId().toHexString();
    const price = Math.floor(Math.random() * 100000);
    const order = Order.build({
      id: new mongoose.Types.ObjectId().toHexString(),
      userId,
      version: 0,
      price,
      status: OrderStatus.Created,
    });
    await order.save();

    const orderToJson = order.toJSON();

    expect(orderToJson).toBeDefined();

    await supertest(app)
      .post("/api/payments")
      .set("Cookie", global.signup(userId))
      .send({
        token: "tok_visa",
        orderId: order.id,
      })
      .expect(201);

    const stripeCharges = await stripe.charges.list({ limit: 50 });
    const stripeCharge = stripeCharges.data.find((charge) => {
      return charge.amount === price * 100;
    });

    expect(stripeCharge).toBeDefined();

    const payment = await Payment.findOne({
      orderId: order.id,
      stripeId: stripeCharge.id,
    });

    expect(payment).not.toBeNull();

    const paymentToJson = payment.toJSON();

    expect(paymentToJson).toBeDefined();
  });
});
