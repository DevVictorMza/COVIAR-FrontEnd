"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import type { AutoevaluacionHistorial } from "@/lib/api/types"

interface TrendLineChartProps {
    data: AutoevaluacionHistorial[]
    className?: string
}

export function TrendLineChart({ data, className }: TrendLineChartProps) {
    // Ordenar por fecha y formatear para el gráfico
    const chartData = [...data]
        .filter(a => a.estado === 'completada' && a.porcentaje !== null)
        .sort((a, b) => new Date(a.fecha_inicio).getTime() - new Date(b.fecha_inicio).getTime())
        .map((assessment, index) => ({
            name: new Date(assessment.fecha_inicio).toLocaleDateString('es-AR', {
                month: 'short',
                year: '2-digit'
            }),
            porcentaje: assessment.porcentaje,
            puntaje: assessment.puntaje_final,
            evaluacion: index + 1,
        }))

    if (chartData.length < 2) {
        return (
            <div className={`flex items-center justify-center h-[300px] text-muted-foreground ${className}`}>
                <p>Se necesitan al menos 2 evaluaciones completadas para mostrar la tendencia</p>
            </div>
        )
    }

    return (
        <div className={className}>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
                    <Tooltip
                        content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                                const data = payload[0].payload
                                return (
                                    <div className="bg-background border border-border rounded-lg shadow-lg p-3">
                                        <p className="font-medium text-sm">Evaluación #{data.evaluacion}</p>
                                        <p className="text-muted-foreground text-sm">{data.name}</p>
                                        <p className="text-[#81242d] font-bold">{data.porcentaje}%</p>
                                        {data.puntaje && (
                                            <p className="text-sm text-muted-foreground">Puntaje: {data.puntaje}</p>
                                        )}
                                    </div>
                                )
                            }
                            return null
                        }}
                    />
                    <Legend />
                    <Line
                        type="monotone"
                        dataKey="porcentaje"
                        name="Porcentaje"
                        stroke="#81242d"
                        strokeWidth={2}
                        dot={{ fill: '#81242d', r: 4 }}
                        activeDot={{ r: 6 }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    )
}
