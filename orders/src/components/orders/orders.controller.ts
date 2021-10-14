import express, { Router } from "express";
import { listOrders } from "./workspace/list";
import { deleteOrder } from "./workspace/delete";
import { createOrder, createValidator } from "./workspace/create";
import { listOrderById } from "./workspace/listById";
import { requireAuth, validateRequest } from "@jvtickets22/common-node-express";

const router: Router = express.Router();

router.post(
  "/orders",
  requireAuth,
  createValidator,
  validateRequest,
  createOrder
);
router.get("/orders", requireAuth, listOrders);
router.get("/orders/:orderId", requireAuth, listOrderById);
router.delete("/orders/:orderId", requireAuth, deleteOrder);

export default router;
