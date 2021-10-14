import express, { Router } from "express";
import { requireAuth, validateRequest } from "@jvtickets22/common-node-express";
import { createTicket, createValidator } from "./workspace/create";
import { updateTicket } from "./workspace/update";
import { listTickets } from "./workspace/list";
import { listTicketById } from "./workspace/listById";

const router: Router = express.Router();

router.post(
  "/tickets",
  requireAuth,
  createValidator,
  validateRequest,
  createTicket
);
router.put(
  "/tickets",
  requireAuth,
  createValidator,
  validateRequest,
  updateTicket
);
router.get("/tickets", listTickets);
router.get("/tickets/:ticketId", listTicketById);

export default router;
