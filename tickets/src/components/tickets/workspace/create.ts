import { NextFunction, Request, Response } from "express";
import { body } from "express-validator";
import { createTicketDao } from "../tickets.dao";

export const createValidator = [
  body("title").not().isEmpty().withMessage("Title is required"),
  body("price").isFloat({ gt: 0 }).withMessage("Price must be greater than 0"),
];

export const createTicket = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  createTicketDao(req.body, req.currentUser!.id).then((ticket) =>
    res.status(201).send(ticket)
  );
};
