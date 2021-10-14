import app from "./index";
import dbConnection from "./database";
import { natsWrapper } from "./nats.wrapper";
import { OrderCreatedListener } from "./events/listener/order.created.listener";
import { OrderCancelledListener } from "./events/listener/order.cancelled.listener";

// if (!process.env.JWT_KEY) {
//   throw throwError(500, "JWT Key must be define");
// }

// if (!process.env.MONGO_URI) {
//   throw throwError(500, "MONGO URI must be defined");
// }

// if (!process.env.NATS_CLIENT_ID) {
//   throw throwError(500, "MONGO URI must be defined");
// }

// if (!process.env.NATS_URL) {
//   throw throwError(500, "MONGO URI must be defined");
// }

// if (!process.env.NATS_CLUSTER_ID) {
//   throw throwError(500, "MONGO URI must be defined");
// }

async function start() {
  await natsWrapper.connect(
    process.env.NATS_CLUSTER_ID,
    process.env.NATS_CLIENT_ID,
    process.env.NATS_URL
  );
  natsWrapper.client.on("close", () => {
    console.log("NATS connection closed");
    process.exit();
  });
  process.on("SIGINT", () => natsWrapper.client.close());
  process.on("SIGTERM", () => natsWrapper.client.close());

  new OrderCreatedListener(natsWrapper.client).listen();
  new OrderCancelledListener(natsWrapper.client).listen();

  await dbConnection();
}

start();

app.set("PORT", process.env.PORT || 3000);
app.listen(app.get("PORT"), () =>
  console.log(`Listening on port ${app.get("PORT")}`)
);
