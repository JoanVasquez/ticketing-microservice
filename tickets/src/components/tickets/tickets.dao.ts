import { throwError } from "@jvtickets22/common-node-express";
import { TicketCreatedPublisher } from "../../events/publisher/ticket.created.publisher";
import Ticket from "./tickets.model";
import { natsWrapper } from "../../nats.wrapper";
import { TicketUpdatedPublisher } from "../../events/publisher/ticket.updated.publisher";

export const createTicketDao = async (data: any, userId: string) => {
  const { title, price } = data;
  const ticket = Ticket.build({
    title,
    price,
    userId,
  });
  await ticket.save();

  await new TicketCreatedPublisher(natsWrapper.client).publish({
    id: ticket.id,
    title: ticket.title,
    price: ticket.price,
    userId: ticket.userId,
    version: ticket.version,
  });

  return ticket;
};

export const listTicketsDao = async () => {
  const tickets = await Ticket.find({});
  return tickets;
};

export const listTicketsByIdDao = async (ticketId: string) => {
  const tickets = await Ticket.findById(ticketId);

  if (!tickets) {
    throw throwError(404, "Ticket not found");
  }

  return tickets;
};

export const updateTicketDao = async (data: any, userId: string) => {
  const ticket = await Ticket.findById(data.id);

  if (!ticket) {
    throw throwError(404, "Ticket not found");
  }

  if (ticket.userId !== userId) {
    throw throwError(401, "Not Authorized");
  }

  if (ticket.orderId) {
    throw throwError(400, "Cannot edit a reserved ticket");
  }

  ticket.set({
    title: data.title,
    price: data.price,
  });

  await ticket.save();

  await new TicketUpdatedPublisher(natsWrapper.client).publish({
    id: ticket.id,
    title: ticket.title,
    price: ticket.price,
    userId: ticket.userId,
    version: ticket.version,
  });

  return ticket;
};
