import { NextFunction, Request, Response } from "express";

export default (req: Request, res: Response, next: NextFunction) => {
  res.send({ currentUser: req.currentUser || null });
};
