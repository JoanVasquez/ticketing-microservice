import app from "./index";
import dbConnection from "./database";
import { natsWrapper } from "./nats.wrapper";
import { TicketUpdatedListener } from "./events/listener/ticket.updated.listener";
import { TicketCreatedListener } from "./events/listener/ticket.created.listener";
import { ExpirationCompleteListener } from "./events/listener/expiration.complete.listener";
import { PaymentCreatedListener } from "./events/listener/payment.created.listener";

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

  new TicketCreatedListener(natsWrapper.client).listen();
  new TicketUpdatedListener(natsWrapper.client).listen();
  new ExpirationCompleteListener(natsWrapper.client).listen();
  new PaymentCreatedListener(natsWrapper.client).listen();

  await dbConnection();
}

start();

app.set("PORT", process.env.PORT || 3000);
app.listen(app.get("PORT"), () =>
  console.log(`Listening on port ${app.get("PORT")}`)
);
