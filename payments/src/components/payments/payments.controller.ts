import { requireAuth, validateRequest } from "@jvtickets22/common-node-express";
import express, { Router } from "express";
import { createPayments, createValidator } from "./workspace/create";

const router: Router = express.Router();

router.post(
  "/payments",
  requireAuth,
  createValidator,
  validateRequest,
  createPayments
);

export default router;
