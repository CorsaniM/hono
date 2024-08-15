"use client"
import Link from "next/link";

import { api } from "~/trpc/react";

export default function Home() {
  const { data: ticketsPorOrg } = api.tickets.getByOrg.useQuery({ orgId: "dimetallo" });


  if(ticketsPorOrg){
    console.log("test",ticketsPorOrg )

  }
  return (
    <div>
      <h1>Hola</h1>
      {ticketsPorOrg ? (
        ticketsPorOrg.map((ticket) => (
          <div key={ticket.id}>
            <h2>ID: {ticket.id}</h2>
            <p>{ticket.description}</p>
          </div>
        ))
      ) : (
        <h1>null</h1>
      )}
    </div>
  );
}