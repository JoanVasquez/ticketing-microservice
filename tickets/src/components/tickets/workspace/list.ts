import { NextFunction, Request, Response } from "express";
import { listTicketsDao } from "../tickets.dao";

export const listTickets = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  listTicketsDao().then((tickets) => {
    res.send(tickets);
  });
};
