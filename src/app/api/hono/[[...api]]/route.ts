"use server";
import { api } from "~/trpc/server";
import { Hono } from "hono";
import { z } from "zod";
import { db } from "~/server/db";
import { tickets } from "~/server/db/schema";

const app = new Hono().basePath("api/hono");

app.get("/ticket/:id", async (c) => {
  const ticketId = c.req.param("id");

  const ticket = await api.tickets.getById({ id: parseInt(ticketId) });
  if (ticket) {
    return c.json(ticket);
  } else {
    return c.json("no existe el ticket " + ticketId);
  }
});

// app.post("/api/hono/dimetallo", async (c) => {
//   const body = await c.req.json();

//   const TicketSchema = z.object({
//     orgId: z.string(),
//     state: z.string(),
//     urgency: z.number(),
//     suppUrgency: z.number().optional(),
//     title: z.string(),
//     description: z.string(),
//   });

//   const validation = TicketSchema.safeParse(body);

//   if (!validation.success) {
//     return c.json({ error: "Invalid data" }, 400);
//   }

//   const { orgId, state, urgency, title, description } = validation.data;

//   const newTicket = await db
//     .insert(tickets)
//     .values({
//       orgId,
//       state,
//       urgency,
//       title,
//       description,
//     })
//     .returning();

//   return c.json({ success: true, data: newTicket });
// });

app.get("/ticket/get/:orgid/:urgency/:title/:description", async (c) => {
  const orgId = c.req.param("orgid");
  const urgency = parseInt(c.req.param("urgency"));
  const title = c.req.param("title");
  const description = c.req.param("description");

  if (!orgId || !title || !description) {
    return c.json({ error: "Faltan parámetros requeridos" }, 400);
  }

  try {
    const newTicket = await api.tickets.create({
      orgId,
      state: "nuevo",
      urgency,
      suppUrgency: 0,
      title,
      description,
    });
    return c.json("Ticket creado");
  } catch (error) {
    return c.json({ error: "Error creando el ticket" }, 500);
  }
});

app.get("/comments/get/:ticketId/:title/:description", async (c) => {
  const ticketId = c.req.param("ticketId");
  const title = c.req.param("title");
  const description = c.req.param("description");

  if (!ticketId || !title || !description) {
    return c.json({ error: "Faltan parámetros requeridos" }, 400);
  }

  try {
    const newTicket = await api.comments.create({
      state: "no leido",
      title: title,
      description: description,
      createdAt: new Date(),
      userId: "",
      ticketId: parseInt(ticketId),
      type: "recibido",
    });
    return c.json("Comentario creado en Ticket " + ticketId + " id"); // Devuelve el ticket creado con un código 201
  } catch (error) {
    return c.json({ error: "Error creando el comentario" }, 500);
  }
});

app.notFound((c) => {
  return c.text("Custom 404 Message", 404);
});

// Exportar las funciones como asíncronas
export const GET = async (request: Request) => app.fetch(request);
export const POST = async (request: Request) => app.fetch(request);
export const PUT = async (request: Request) => app.fetch(request);
export const DELETE = async (request: Request) => app.fetch(request);
export const PATCH = async (request: Request) => app.fetch(request);

// TEST creación de ticket:
// http://localhost:3000/api/hono/ticket/post/dimetallo/2/Test%20Ticket/This%20is%20a%20test%20description
// TEST envío de coment: (funciona)
// http://localhost:3000/api/hono/comments/get/5/ExampleTitle/ExampleDescription
