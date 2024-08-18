"use client"
import React from 'react';
import { NumeroGrande, Subtitle } from '../ui/title';
import { api } from '~/trpc/react';
import { useUser } from '@clerk/nextjs';

export default function Dashboard() { 
  const { user } = useUser();

  // Si no hay usuario, no continuar con la lógica
  if (!user) {
    return <div>No hay usuario autenticado</div>;
  }

  // Realizar la consulta de tickets
  const { data: tickets, error } = api.tickets.getByUser.useQuery({ userId: user.id });

  if (error) {
    return <div>Error al cargar los tickets</div>;
  }

  const ticketpend = tickets?.filter((pend) => pend.state === "Pendiente");
  const ticketasig = tickets?.filter((asig) => asig.state === "Asignado");
  const ticketfin = tickets?.filter((fin) => fin.state === "Finalizado");

  return (
    <div className='flex flex-auto p-2 border-solid border-2 border-gray-400 place-content-center bg-gray-800'>
      <h1 className="flex flex-auto basis-1/12 text-xl font-semibold justify-center place-self-center">Tickets</h1>
      <div className='flex-auto basis-1/3 place-content-center'>
        <NumeroGrande>{ticketpend?.length ?? 0}</NumeroGrande>
        <Subtitle>Pendientes</Subtitle>
      </div>
      <div className='flex-auto basis-1/3 place-content-center'>
        <NumeroGrande>{ticketasig?.length ?? 0}</NumeroGrande>
        <Subtitle>En espera</Subtitle>
      </div>
      <div className='flex-auto basis-1/3 place-content-center'>
        <NumeroGrande>{ticketfin?.length ?? 0}</NumeroGrande>
        <Subtitle>Finalizados</Subtitle>
      </div>
    </div>
  );
};
