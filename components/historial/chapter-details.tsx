"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Circle, ChevronDown, ChevronUp } from "lucide-react"
import type { ResultadoCapitulo } from "@/lib/api/types"

interface ChapterDetailsProps {
    capitulos: ResultadoCapitulo[]
}

export function ChapterDetails({ capitulos }: ChapterDetailsProps) {
    const [expandedChapters, setExpandedChapters] = useState<Set<number>>(new Set())

    const toggleChapter = (id: number) => {
        setExpandedChapters(prev => {
            const next = new Set(prev)
            if (next.has(id)) {
                next.delete(id)
            } else {
                next.add(id)
            }
            return next
        })
    }

    const getProgressColor = (porcentaje: number): string => {
        if (porcentaje >= 90) return 'bg-emerald-500'
        if (porcentaje >= 75) return 'bg-green-500'
        if (porcentaje >= 50) return 'bg-yellow-500'
        if (porcentaje >= 25) return 'bg-orange-500'
        return 'bg-red-500'
    }

    const getStatusBadge = (porcentaje: number) => {
        if (porcentaje >= 90) {
            return (
                <Badge className="bg-emerald-500/10 text-emerald-600 text-xs">
                    Excelente
                </Badge>
            )
        }
        if (porcentaje >= 75) {
            return (
                <Badge className="bg-green-500/10 text-green-600 text-xs">
                    Muy Bueno
                </Badge>
            )
        }
        if (porcentaje >= 50) {
            return (
                <Badge className="bg-yellow-500/10 text-yellow-600 text-xs">
                    En Progreso
                </Badge>
            )
        }
        return (
            <Badge className="bg-red-500/10 text-red-600 text-xs">
                Por Mejorar
            </Badge>
        )
    }

    return (
        <div className="space-y-4">
            <div className="grid gap-4">
                {capitulos.map((capitulo) => {
                    const isComplete = capitulo.indicadores_completados === capitulo.indicadores_total
                    const isExpanded = expandedChapters.has(capitulo.id_capitulo)
                    const hasIndicadores = capitulo.indicadores && capitulo.indicadores.length > 0

                    return (
                        <div
                            key={capitulo.id_capitulo}
                            className="rounded-lg bg-muted/30 border-l-4 border-l-[#81242d] border-r border-t border-b border-border/50 hover:bg-[#81242d]/5 transition-all duration-200"
                        >
                            {/* Header del capítulo - clickeable para expandir */}
                            <div
                                className={`p-4 ${hasIndicadores ? 'cursor-pointer' : ''}`}
                                onClick={() => hasIndicadores && toggleChapter(capitulo.id_capitulo)}
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center gap-2">
                                        {isComplete ? (
                                            <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                                        ) : (
                                            <Circle className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                                        )}
                                        <span className="font-medium">{capitulo.nombre}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {getStatusBadge(capitulo.porcentaje)}
                                        {hasIndicadores && (
                                            isExpanded
                                                ? <ChevronUp className="h-4 w-4 text-muted-foreground" />
                                                : <ChevronDown className="h-4 w-4 text-muted-foreground" />
                                        )}
                                    </div>
                                </div>

                                {/* Barra de progreso */}
                                <div className="mb-3">
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-muted-foreground">Progreso</span>
                                        <span className="font-medium">{capitulo.porcentaje}%</span>
                                    </div>
                                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                                        <div
                                            className={`h-full transition-all duration-300 ${getProgressColor(capitulo.porcentaje)}`}
                                            style={{ width: `${capitulo.porcentaje}%` }}
                                        />
                                    </div>
                                </div>

                                {/* Métricas */}
                                <div className="flex gap-6 text-sm">
                                    <div>
                                        <span className="text-muted-foreground">Puntaje: </span>
                                        <span className="font-medium">
                                            {capitulo.puntaje_obtenido} / {capitulo.puntaje_maximo}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="text-muted-foreground">Indicadores: </span>
                                        <span className="font-medium">
                                            {capitulo.indicadores_completados} / {capitulo.indicadores_total}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Tabla de indicadores expandida */}
                            {isExpanded && hasIndicadores && (
                                <div className="border-t border-border/50">
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm">
                                            <thead>
                                                <tr className="bg-muted/60">
                                                    <th className="text-left px-4 py-2.5 font-semibold text-muted-foreground text-xs uppercase tracking-wide">Indicador</th>
                                                    <th className="text-left px-4 py-2.5 font-semibold text-muted-foreground text-xs uppercase tracking-wide">Descripción</th>
                                                    <th className="text-left px-4 py-2.5 font-semibold text-muted-foreground text-xs uppercase tracking-wide">Nivel de Indicador</th>
                                                    <th className="text-center px-4 py-2.5 font-semibold text-muted-foreground text-xs uppercase tracking-wide w-20">Puntos</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {capitulo.indicadores!.map((indicador, idx) => (
                                                    <tr
                                                        key={indicador.id_indicador}
                                                        className={idx % 2 === 0 ? 'bg-background' : 'bg-muted/20'}
                                                    >
                                                        <td className="px-4 py-3 font-medium align-top whitespace-nowrap">
                                                            {indicador.nombre}
                                                        </td>
                                                        <td className="px-4 py-3 text-muted-foreground align-top">
                                                            {indicador.descripcion}
                                                        </td>
                                                        <td className="px-4 py-3 align-top">
                                                            {indicador.respuesta_nombre ? (
                                                                <div>
                                                                    <span className="font-medium">{indicador.respuesta_nombre}</span>
                                                                    {indicador.respuesta_descripcion && (
                                                                        <p className="text-xs text-muted-foreground mt-0.5">
                                                                            {indicador.respuesta_descripcion}
                                                                        </p>
                                                                    )}
                                                                </div>
                                                            ) : (
                                                                <span className="text-muted-foreground">-</span>
                                                            )}
                                                        </td>
                                                        <td className="px-4 py-3 text-center align-top font-semibold whitespace-nowrap">
                                                            {indicador.respuesta_puntos} / {indicador.puntaje_maximo}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                            <tfoot>
                                                <tr className="bg-muted/40 border-t border-border/50">
                                                    <td colSpan={3} className="px-4 py-2.5 font-semibold text-right">
                                                        Puntaje del Capítulo
                                                    </td>
                                                    <td className="px-4 py-2.5 text-center font-bold">
                                                        {capitulo.puntaje_obtenido} / {capitulo.puntaje_maximo}
                                                    </td>
                                                </tr>
                                            </tfoot>
                                        </table>
                                    </div>
                                </div>
                            )}
                        </div>
                    )
                })}
            </div>

            {/* Resumen */}
            <div className="pt-4 border-t border-border/50">
                <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Total Capítulos</span>
                    <span className="font-medium">{capitulos.length}</span>
                </div>
                <div className="flex justify-between text-sm mt-1">
                    <span className="text-muted-foreground">Capítulos Completados</span>
                    <span className="font-medium">
                        {capitulos.filter(c => c.indicadores_completados === c.indicadores_total).length} / {capitulos.length}
                    </span>
                </div>
            </div>
        </div>
    )
}
