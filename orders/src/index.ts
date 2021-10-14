import express, { Application, NextFunction, Request, Response } from "express";
import { json } from "body-parser";
import {
  currentUserMiddleware,
  errorHandler,
  ErrorModel,
} from "@jvtickets22/common-node-express";
import cookieSession from "cookie-session";
import ordersController from "./components/orders/orders.controller";

const app: Application = express();
app.set("trust proxy", true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== "test",
  })
);

app.use(currentUserMiddleware);

app.use("/api", ordersController);
app.all("*", async (req: Request, res: Response, next: NextFunction) => {
  next({ status: 404, message: "Not Found" } as ErrorModel);
});
app.use(errorHandler);

export default app;
