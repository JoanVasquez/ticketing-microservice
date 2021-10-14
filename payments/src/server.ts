import app from "./index";
import dbConnection from "./database";
import { natsWrapper } from "./nats.wrapper";
import { OrderCancelledListener } from "./events/listeners/order.cancelled.listener";
import { OrderCreatedListener } from "./events/listeners/order.created.listener";

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
