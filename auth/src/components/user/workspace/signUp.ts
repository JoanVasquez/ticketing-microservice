import { NextFunction, Request, Response } from "express";
import { body } from "express-validator";
import jwt from "jsonwebtoken";
import { signUpDao } from "../user.dao";
import User from "../user.model";

export const signUpValidator = [
  body("email").isEmail().withMessage("Email must be valid"),
  body("password")
    .trim()
    .isLength({ min: 4, max: 20 })
    .withMessage("Password must be between 4 and 20 characters"),
];

export const signUp = (req: Request, res: Response, next: NextFunction) => {
  signUpDao(req.body)
    .then((user) => {
      const userJwt = jwt.sign(
        {
          id: user.id,
          email: user.email,
        },
        process.env.JWT_KEY!
      );
      req.session = {
        jwt: userJwt,
      };
      res.status(201).send(user);
    })
    .catch((error) => {
      next(error);
    });
};
