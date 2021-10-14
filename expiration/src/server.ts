import { OrderCreatedListener } from "./events/listeners/order.created.listener";
import { natsWrapper } from "./nats.wrapper";

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
}

start();
