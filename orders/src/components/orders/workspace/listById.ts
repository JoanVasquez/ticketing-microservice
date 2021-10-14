import { NextFunction, Request, Response } from "express";
import { listOrderByIdDao } from "../orders.dao";

export const listOrderById = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  listOrderByIdDao(req.params.orderId, req.currentUser!.id)
    .then((order) => res.send(order))
    .catch((err) => next(err));
};
