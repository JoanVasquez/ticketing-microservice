import app from "./index";
import dbConnection from "./database";
import { throwError } from "@jvtickets22/common-node-express";

dbConnection()
  .then(() => console.log("CONNECTED TO THE DB"))
  .catch((err) => console.error(`erroooor ==> ${err}`));

if (!process.env.JWT_KEY) {
  throw throwError(500, "JWT Key must be define");
}

if (!process.env.MONGO_URI) {
  throw throwError(500, "MONGO URI must be defined");
}

app.set("PORT", process.env.PORT || 3000);
app.listen(app.get("PORT"), () =>
  console.log(`Listening on port ${app.get("PORT")}`)
);
