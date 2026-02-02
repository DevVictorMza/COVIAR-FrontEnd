"use client"

import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Tooltip } from "recharts"
import type { ResultadoCapitulo } from "@/lib/api/types"

interface ScoreRadarChartProps {
    data: ResultadoCapitulo[]
    className?: string
}

export function ScoreRadarChart({ data, className }: ScoreRadarChartProps) {
    const chartData = data.map(capitulo => ({
        subject: capitulo.nombre.length > 15
            ? capitulo.nombre.substring(0, 15) + '...'
            : capitulo.nombre,
        fullName: capitulo.nombre,
        score: capitulo.porcentaje,
        fullMark: 100,
    }))

    return (
        <div className={className}>
            <ResponsiveContainer width="100%" height={350}>
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
                    <PolarGrid stroke="#e5e7eb" />
                    <PolarAngleAxis
                        dataKey="subject"
                        tick={{ fill: '#6b7280', fontSize: 11 }}
                    />
                    <PolarRadiusAxis
                        angle={30}
                        domain={[0, 100]}
                        tick={{ fill: '#9ca3af', fontSize: 10 }}
                    />
                    <Radar
                        name="Puntaje"
                        dataKey="score"
                        stroke="#81242d"
                        fill="#81242d"
                        fillOpacity={0.3}
                    />
                    <Tooltip
                        content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                                const data = payload[0].payload
                                return (
                                    <div className="bg-background border border-border rounded-lg shadow-lg p-3">
                                        <p className="font-medium text-sm">{data.fullName}</p>
                                        <p className="text-[#81242d] font-bold">{data.score}%</p>
                                    </div>
                                )
                            }
                            return null
                        }}
                    />
                </RadarChart>
            </ResponsiveContainer>
        </div>
    )
}
