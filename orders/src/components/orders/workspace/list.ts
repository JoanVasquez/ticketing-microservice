import { NextFunction, Request, Response } from "express";
import { listOrdersDao } from "../orders.dao";

export const listOrders = (req: Request, res: Response, next: NextFunction) => {
  listOrdersDao(req.currentUser!.id).then((orders) => {
    res.send(orders);
  });
};
