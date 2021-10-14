import { NextFunction, Request, Response } from "express";
import { updateTicketDao } from "../tickets.dao";

export const updateTicket = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  updateTicketDao(req.body, req.currentUser!.id)
    .then((ticket) => res.send(ticket))
    .catch((error) => next(error));
};
