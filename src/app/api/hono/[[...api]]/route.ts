"use server";

import { Hono } from "hono";
import { z } from "zod";
import { db } from "~/server/db";
import { tickets } from "~/server/db/schema";
import { api } from "~/trpc/server";

const app = new Hono().basePath("/api/hono");

app.post("/post/ticket", async (c) => {
  const body = await c.req.json();

  const TicketSchema = z.object({
    orgId: z.string(),
    state: z.string(),
    urgency: z.number(),
    title: z.string(),
    description: z.string(),
  });

  const validation = TicketSchema.safeParse(body);

  if (!validation.success) {
    return c.json({ error: "Invalid data" }, 400);
  }

  const { orgId, state, urgency, title, description } = validation.data;

  const newTicket = await db
    .insert(tickets)
    .values({
      orgId,
      state,
      urgency,
      title,
      description,
    })
    .returning();

  return c.json({ success: true, data: newTicket });
});

// Ruta para obtener un ticket por ID
// app.get("/ticket/:id", async (c) => {
//   const ticketId = c.req.param("id");

//   const ticket = await api.tickets.getById({ id: parseInt(ticketId) });
//   if (ticket) {
//     return c.json(ticket);
//   } else {
//     return c.json("No existe el ticket " + ticketId);
//   }
// });

// Ruta para crear un ticket
// app.get("/ticket/get/:orgid/:urgency/:title/:description", async (c) => {
//   const orgId = c.req.param("orgid");
//   const urgency = parseInt(c.req.param("urgency"));
//   const title = c.req.param("title");
//   const description = c.req.param("description");

//   if (!orgId || !title || !description) {
//     return c.json({ error: "Faltan parámetros requeridos" }, 400);
//   }

//   try {
//     const newTicket = await api.tickets.create({
//       orgId,
//       state: "nuevo",
//       urgency,
//       suppUrgency: 0,
//       title,
//       description,
//     });
//     return c.json("Ticket creado"); // Devuelve el ticket creado con un código 201
//   } catch (error) {
//     return c.json({ error: "Error creando el ticket" }, 500);
//   }
// });

// Ruta para crear un comentario en un ticket
// app.get("/comments/get/:ticketId/:title/:description", async (c) => {
//   const ticketId = c.req.param("ticketId");
//   const title = c.req.param("title");
//   const description = c.req.param("description");

//   if (!ticketId || !title || !description) {
//     return c.json({ error: "Faltan parámetros requeridos" }, 400);
//   }

//   try {
//     const newTicket = await api.comments.create({
//       state: "no leido",
//       title: title,
//       description: description,
//       createdAt: new Date(),
//       userId: "",
//       ticketId: parseInt(ticketId),
//       type: "recibido",
//     });
//     return c.json("Comentario creado en Ticket " + ticketId + newTicket);
//   } catch (error) {
//     return c.json({ error: "Error creando el comentario" }, 500);
//   }
// });

// Ruta POST para crear un ticket a través de JSON

// Ruta POST para crear un comentario (no tiene lógica, solo es un ejemplo)
// app.post("/comments/post", async (c) => {
//   return c.json("Comentario creado");
// });

// Manejo de rutas no encontradas
app.notFound((c) => {
  return c.text("Custom 404 Message", 404);
});

// Exportar las funciones como asíncronas
export const GET = async (request: Request) => app.fetch(request);
export const POST = async (request: Request) => app.fetch(request);
export const PUT = async (request: Request) => app.fetch(request);
export const DELETE = async (request: Request) => app.fetch(request);
export const PATCH = async (request: Request) => app.fetch(request);
