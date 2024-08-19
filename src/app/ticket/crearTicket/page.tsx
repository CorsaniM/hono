"use client"

import { useState } from "react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { api } from "~/trpc/react"
import LayoutContainer from "~/app/_components/layout-container"

export default function CrearTicket() {

    const { mutateAsync: CrearTicket, isPending } = api.tickets.create.useMutation();

    const [description, setDescription] = useState("")
    const [motivo, setMotivo] = useState("")
    const [organization, setOrganization] = useState("dimetallo")
    const [urgencia, setUrgencia] = useState(0)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()

    async function handleCreate() {
        try {
            


            const baseUrl = "http://localhost:3000/api/hono/ticket/get"; 
            const url = `${baseUrl}/${encodeURIComponent(organization)}/${urgencia}/${encodeURIComponent(motivo)}/${encodeURIComponent(description)}`;


            const response = await fetch(url);
            // const data = await response.json();

            if (!response.ok) {
                throw new Error('Error en la creación del ticket');
            }

            await CrearTicket({
                orgId: organization ?? "",
                state: "pendiente",
                urgency: urgencia ?? "",
                suppUrgency: 0,
                title: motivo ?? "",
                description: description ?? "" 
            })
            // const data = await response.json();
            toast.success('Ticket creado correctamente');
            router.refresh();
        } catch (e) {
            setError('No se pudo crear el ticket');
            toast.error('No se pudo crear el ticket');
        }
    }



    return (
        <LayoutContainer>

        <div className="flex flex-col m-4">
            <div className="h-1/5 flex flex-col m-2">
                <div className="flex flex-row gap-6">
                    <div className="flex-auto w-1/2 text-center">
                        <h1>Ingrese el motivo de su ticket</h1>
                    </div>
                </div>
                <div className="flex flex-row gap-6">
                    <div className="flex-auto w-1/2 align-center">
                        <input
                            value={motivo}
                            placeholder='Motivo...'
                            onChange={(e) => setMotivo(e.target.value)}
                        />
                    </div>
                </div>
            </div>
            <div className="h-1/5 flex flex-col m-2 text-center">
                <h1>Ingrese una descripción de su ticket</h1>
                <textarea
                    className="resize-y h-36 w-full border border-gray-300 p-2"
                    value={description}
                    placeholder='Descripción...'
                    onChange={(e) => setDescription(e.target.value)}
                />
            </div>
            <div className="h-1/5 flex flex-col m-2 text-center">
                <h1>Ingrese nivel prioridad</h1>
                <textarea
                    className="resize-y h-36 w-full border border-gray-300 p-2"
                    value={urgencia}
                    placeholder='Urgencia...'
                    onChange={(e) => setUrgencia(parseInt(e.target.value))}
                />
            </div>
            <button
                className="m-4 px-4 py-2 text-black disabled:opacity-50 rounded-full bg-slate-200 hover:bg-slate-300"
                onClick={handleCreate}
            >
                Crear ticket
            </button>
        </div>
        </LayoutContainer>

    )
}
