import { NextFunction, Request, Response } from "express";
import { deleteOrderDao } from "../orders.dao";

export const deleteOrder = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  deleteOrderDao(req.params.orderId, req.currentUser!.id)
    .then((order) => res.status(204).send(order))
    .catch((err) => next(err));
};
