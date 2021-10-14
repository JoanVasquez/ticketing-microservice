import supertest from "supertest";
import Ticket from "./components/tickets/tickets.model";

import app from ".";
import {
  createTicketDao,
  listTicketsByIdDao,
  listTicketsDao,
  updateTicketDao,
} from "./components/tickets/tickets.dao";

test("Ticket DAO functions should exists", () => {
  expect(createTicketDao).toBeDefined();
  expect(listTicketsDao).toBeDefined();
  expect(listTicketsByIdDao).toBeDefined();
  expect(updateTicketDao).toBeDefined();
});

test("Testing 404", async () => {
  return supertest(app).get("/api/test").expect(404);
});

test("Implements optimistic concunrrency control", async () => {
  const ticket = Ticket.build({
    title: "concent",
    price: 5,
    userId: "123",
  });

  await ticket.save();

  const firstInstance = await Ticket.findById(ticket.id);
  const secondInstance = await Ticket.findById(ticket.id);

  firstInstance!.set({ price: 10 });
  secondInstance!.set({ price: 15 });

  await firstInstance!.save();

  try {
    await secondInstance!.save();
  } catch (error) {
    return;
  }

  throw new Error("Should not reach this point");
});

test("increments the version number on multiple saves", async () => {
  const ticket = Ticket.build({
    title: "content",
    price: 20,
    userId: "123",
  });

  await ticket.save();
  expect(ticket.version).toEqual(0);
  await ticket.save();
  expect(ticket.version).toEqual(1);
});
