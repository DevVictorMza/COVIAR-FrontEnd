"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts"
import type { ResultadoCapitulo } from "@/lib/api/types"

interface ProgressBarChartProps {
    data: ResultadoCapitulo[]
    className?: string
}

const getBarColor = (percentage: number) => {
    if (percentage >= 75) return '#22c55e'
    if (percentage >= 50) return '#eab308'
    if (percentage >= 25) return '#f97316'
    return '#ef4444'
}

export function ProgressBarChart({ data, className }: ProgressBarChartProps) {
    const chartData = data.map(capitulo => ({
        name: capitulo.nombre.length > 20
            ? capitulo.nombre.substring(0, 20) + '...'
            : capitulo.nombre,
        fullName: capitulo.nombre,
        porcentaje: capitulo.porcentaje,
        puntaje: `${capitulo.puntaje_obtenido}/${capitulo.puntaje_maximo}`,
    }))

    return (
        <div className={className}>
            <ResponsiveContainer width="100%" height={350}>
                <BarChart
                    layout="vertical"
                    data={chartData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 12 }} />
                    <YAxis
                        type="category"
                        dataKey="name"
                        width={150}
                        tick={{ fontSize: 11 }}
                    />
                    <Tooltip
                        content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                                const data = payload[0].payload
                                return (
                                    <div className="bg-background border border-border rounded-lg shadow-lg p-3">
                                        <p className="font-medium text-sm">{data.fullName}</p>
                                        <p className="text-muted-foreground text-sm">Puntaje: {data.puntaje}</p>
                                        <p className="font-bold" style={{ color: getBarColor(data.porcentaje) }}>
                                            {Math.round(data.porcentaje)}%
                                        </p>
                                    </div>
                                )
                            }
                            return null
                        }}
                    />
                    <Bar dataKey="porcentaje" radius={[0, 4, 4, 0]}>
                        {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={getBarColor(entry.porcentaje)} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    )
}
