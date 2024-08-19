"use client"

import { useState } from "react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export default function CrearTicket() {
    const [description, setDescription] = useState("")
    const [motivo, setMotivo] = useState("")
    const [organization, setOrganization] = useState("dimetallo")
    const [urgencia, setUrgencia] = useState(0)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()

    async function handleCreate() {
        try {
            const response = await fetch('http://localhost:3000/api/hono/dimetallo', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    orgId: organization,
                    state: "pendiente",
                    urgency: urgencia,
                    suppUrgency: 0,
                    title: motivo,
                    description: description,
                }),
            });

            if (!response.ok) {
                throw new Error('Error en la creación del ticket');
            }

            const data = await response.json();
            toast.success('Ticket creado correctamente');
            router.refresh();
        } catch (e) {
            setError('No se pudo crear el ticket');
            toast.error('No se pudo crear el ticket');
        }
    }

    return (
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
    )
}
