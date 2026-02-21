"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import type { ResultadoCapitulo } from "@/lib/api/types"

interface ChapterProgressCardProps {
    capitulo: ResultadoCapitulo
}

const getColor = (percentage: number): string => {
    if (percentage >= 75) return '#22c55e'
    if (percentage >= 50) return '#eab308'
    if (percentage >= 25) return '#f97316'
    return '#ef4444'
}

export function ChapterProgressCard({ capitulo }: ChapterProgressCardProps) {
    const color = getColor(capitulo.porcentaje)

    return (
        <Card className="border-l-4" style={{ borderLeftColor: color }}>
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium leading-tight">
                    {capitulo.nombre}
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                        {capitulo.indicadores_completados}/{capitulo.indicadores_total} indicadores
                    </span>
                    <span className="font-bold" style={{ color }}>
                        {Math.round(capitulo.porcentaje)}%
                    </span>
                </div>

                <Progress
                    value={capitulo.porcentaje}
                    className="h-2"
                    style={{
                        '--progress-background': color
                    } as React.CSSProperties}
                />

                <div className="text-xs text-muted-foreground">
                    {capitulo.puntaje_obtenido} / {capitulo.puntaje_maximo} puntos
                </div>
            </CardContent>
        </Card>
    )
}
