import { NextFunction, Request, Response } from "express";
import { body } from "express-validator";
import { createPaymentDao } from "../payments.dao";

export const createValidator = [
  body("token").not().isEmpty(),
  body("orderId").not().isEmpty(),
];

export const createPayments = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { token, orderId } = req.body;
  createPaymentDao(token, orderId, req.currentUser.id)
    .then((payment) => {
      res.status(201).send({ id: payment.id });
    })
    .catch((err) => next(err));
};
