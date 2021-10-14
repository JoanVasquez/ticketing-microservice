import { NextFunction, Request, Response } from "express";
import { body } from "express-validator";
import jwt from "jsonwebtoken";
import { signInDao } from "../user.dao";

export const signInValidator = [
  body("email").isEmail().withMessage("Email must be valid"),
  body("password").trim().notEmpty().withMessage("You must supply a pasword"),
];

export const signIn = (req: Request, res: Response, next: NextFunction) => {
  signInDao(req.body)
    .then((user) => {
      const userJwt = jwt.sign(
        {
          id: user.id,
          email: user.email,
        },
        process.env.JWT_KEY
      );
      req.session = {
        jwt: userJwt,
      };
      res.status(200).send(user);
    })
    .catch((error) => next(error));
};
