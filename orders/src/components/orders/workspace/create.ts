import { NextFunction, Request, Response } from "express";
import { body } from "express-validator";
import mongoose from "mongoose";
import { createOrderDao } from "../orders.dao";

export const createValidator = [
  body("ticketId")
    .not()
    .isEmpty()
    .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
    .withMessage("TicketId must be provided"),
];

export const createOrder = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { ticketId } = req.body;
  createOrderDao(ticketId, req.currentUser!.id)
    .then((order) => res.status(201).send(order))
    .catch((error) => next(error));
};
