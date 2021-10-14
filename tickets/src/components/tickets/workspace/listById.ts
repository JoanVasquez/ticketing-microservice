import { NextFunction, Request, Response } from "express";
import { listTicketsByIdDao } from "../tickets.dao";

export const listTicketById = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  listTicketsByIdDao(req.params.ticketId)
    .then((ticket) => res.send(ticket))
    .catch((error) => next(error));
};
