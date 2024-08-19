"use client"

import { api } from "~/trpc/react"
// import { useOrganization, useUser } from "@clerk/nextjs"
import Link from "next/link";
import { List } from "../_components/ui/list";
import { Card, CardTitle, CardDescription } from "../_components/ui/tarjeta";
// import { Title } from "./_components/ui/title";
import Dashboard from "../_components/dashboard/dashboard";
import { Button } from "../_components/ui/button";

export default function Page() {

  const ticketsPorOrg = api.tickets.getByOrg.useQuery({ orgId: "dimetallo" }).data;

  const { mutateAsync: CreateTicket } = api.tickets.create.useMutation()


  return (
    <div className="h-screen w-screen ml-36 mt-16 grid grid-rows-8">
      <div className='flex max-h-full place-content-right'>
        <Dashboard />
      </div>
      <div className='flex row-span-5 place-content-center flex-column'>
        <div className="flex pt-4 flex-col align-center">
          <div className="px-10 py-4">
            <List>
              {ticketsPorOrg?.map((ticket) => (
                <div className="my-1 bg-gray-800" key={ticket.id}>
                  <Link href={`/ticket/${ticket.id}`}>
                    <Card className="bg-gray-800 hover:bg-gray-500 active:bg-gray-600 font-semibold">
                      <CardTitle>{ticket.title}</CardTitle>
                      <CardDescription>
                        ID:{ticket.id} {ticket.description}
                      </CardDescription>
                    </Card>
                  </Link>
                </div>
              ))}
            </List>
          </div>
        </div>
      </div>
      <div>
        <Link href={`/crearTicket`}>
          Crear ticket
        </Link>
      </div>
    </div>
  )
}
