"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    ChevronDown,
    ChevronUp,
    TrendingUp,
    FileSpreadsheet,
    FileText,
    Calendar,
    Target,
    BarChart3,
    CheckCircle2,
    Loader2
} from "lucide-react"
import type { AutoevaluacionHistorial, ResultadoDetallado } from "@/lib/api/types"
import { determineSustainabilityLevel } from "@/lib/utils/scoring"
import { ChapterDetails } from "./chapter-details"
import {
    exportResultadoDetalladoToCSV,
    exportResultadoDetalladoToPDF
} from "@/lib/utils/export-utils"

interface EvaluationCardProps {
    evaluacion: AutoevaluacionHistorial
    resultado: ResultadoDetallado | null
    index: number
    total: number
    isLoading: boolean
    onLoadDetails: (id: number) => Promise<ResultadoDetallado | null>
}

export function EvaluationCard({
    evaluacion,
    resultado,
    index,
    total,
    isLoading,
    onLoadDetails
}: EvaluationCardProps) {
    const [isExpanded, setIsExpanded] = useState(false)
    const [exportingPDF, setExportingPDF] = useState(false)
    const [exportingCSV, setExportingCSV] = useState(false)

    const isRecent = index === 0
    const evaluacionNumero = total - index
    const nivel = evaluacion.porcentaje !== null
        ? determineSustainabilityLevel(evaluacion.porcentaje)
        : null

    const handleToggleExpand = () => {
        if (!isExpanded) {
            const hasIndicatorData = resultado?.capitulos?.some(c => c.indicadores && c.indicadores.length > 0)
            if (!resultado || !hasIndicatorData) {
                onLoadDetails(evaluacion.id_autoevaluacion)
            }
        }
        setIsExpanded(!isExpanded)
    }

    const handleExportCSV = async (e: React.MouseEvent) => {
        e.stopPropagation()
        setExportingCSV(true)
        try {
            // Usar resultado existente o cargarlo bajo demanda
            const data = resultado ?? await onLoadDetails(evaluacion.id_autoevaluacion)
            if (data) {
                exportResultadoDetalladoToCSV(data, `evaluacion_${evaluacion.id_autoevaluacion}`)
            }
        } finally {
            setExportingCSV(false)
        }
    }

    const handleExportPDF = async (e: React.MouseEvent) => {
        e.stopPropagation()
        setExportingPDF(true)
        try {
            // Obtener nombre de bodega desde localStorage
            const usuarioStr = localStorage.getItem('usuario')
            const usuario = usuarioStr ? JSON.parse(usuarioStr) : {}
            const bodegaNombre = usuario.bodega?.nombre_fantasia || 'Bodega'

            // Usar resultado existente o cargarlo bajo demanda
            const data = resultado ?? await onLoadDetails(evaluacion.id_autoevaluacion)
            if (data) {
                exportResultadoDetalladoToPDF(data, bodegaNombre, `evaluacion_${evaluacion.id_autoevaluacion}`)
            }
        } finally {
            setExportingPDF(false)
        }
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('es-AR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    // Calcular indicadores respondidos basado en capítulos
    const indicadoresRespondidos = resultado?.capitulos.reduce(
        (acc, cap) => acc + cap.indicadores_completados, 0
    ) ?? null
    const indicadoresTotal = resultado?.capitulos.reduce(
        (acc, cap) => acc + cap.indicadores_total, 0
    ) ?? null

    return (
        <Card className="border-border/50 hover:bg-[#81242d]/5 hover:border-[#81242d]/50 transition-all duration-300 hover:shadow-lg" style={{
            boxShadow: '-4px 0 0 0 #81242d, 0 2px 4px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
        }}>
            <CardContent className="p-6">
                {/* Header de la tarjeta mejorado */}
                <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-3">
                        <h3 className="text-lg font-semibold">
                            Evaluación #{evaluacionNumero}
                        </h3>
                        {isRecent && (
                            <Badge className="bg-[#81242d]/10 text-[#81242d] border border-[#81242d]/20 font-medium">
                                Más reciente
                            </Badge>
                        )}
                    </div>
                    {nivel && (
                        <Badge
                            className="font-medium"
                            style={{
                                backgroundColor: `${nivel.color}15`,
                                color: nivel.color,
                                borderColor: `${nivel.color}30`
                            }}
                        >
                            {nivel.nombre}
                        </Badge>
                    )}
                </div>

                {/* Fecha */}
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <Calendar className="h-4 w-4" />
                    {formatDate(evaluacion.fecha_inicio)}
                </div>

                {/* Métricas principales con MAYOR SEPARACIÓN */}
                <div className="mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Puntaje Total */}
                        <Card className="shadow-sm hover:shadow-md transition-shadow border border-border/50 hover:border-[#81242d]/30">
                            <CardContent className="p-3.5">
                                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                                    <Target className="h-3.5 w-3.5 text-[#81242d]" />
                                    <span className="font-medium">Puntaje Total</span>
                                </div>
                                <div className="text-2xl font-bold" style={{ color: '#81242d' }}>
                                    {evaluacion.puntaje_final ?? '-'}
                                    <span className="text-sm font-normal text-muted-foreground ml-1">
                                        / {evaluacion.puntaje_maximo ?? '?'}
                                    </span>
                                </div>
                                <div className="mt-1.5 h-1 bg-muted rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-[#81242d] transition-all duration-500"
                                        style={{
                                            width: `${evaluacion.puntaje_final && evaluacion.puntaje_maximo
                                                ? (evaluacion.puntaje_final / evaluacion.puntaje_maximo * 100)
                                                : 0}%`
                                        }}
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Porcentaje Completado */}
                        <Card className="shadow-sm hover:shadow-md transition-shadow border border-border/50 hover:border-[#81242d]/30">
                            <CardContent className="p-3.5">
                                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                                    <BarChart3 className="h-3.5 w-3.5 text-[#81242d]" />
                                    <span className="font-medium">Porcentaje Alcanzado</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span
                                        className="text-2xl font-bold"
                                        style={{ color: nivel?.color || '#81242d' }}
                                    >
                                        {evaluacion.porcentaje ?? '-'}%
                                    </span>
                                    {evaluacion.porcentaje !== null && evaluacion.porcentaje >= 50 && (
                                        <div className="bg-green-500/10 p-1 rounded">
                                            <TrendingUp className="h-4 w-4 text-green-500" />
                                        </div>
                                    )}
                                </div>
                                <div className="mt-1.5 h-1 bg-muted rounded-full overflow-hidden">
                                    <div
                                        className="h-full transition-all duration-500"
                                        style={{
                                            width: `${evaluacion.porcentaje ?? 0}%`,
                                            backgroundColor: nivel?.color || '#81242d'
                                        }}
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Indicadores Respondidos */}
                        <Card className="shadow-sm hover:shadow-md transition-shadow border border-border/50 hover:border-[#81242d]/30">
                            <CardContent className="p-3.5">
                                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                                    <CheckCircle2 className="h-3.5 w-3.5 text-[#81242d]" />
                                    <span className="font-medium">Indicadores Respondidos</span>
                                </div>
                                <div className="text-2xl font-bold" style={{ color: '#81242d' }}>
                                    {indicadoresRespondidos ?? (evaluacion.puntaje_final !== null ? '✓' : '-')}
                                    {indicadoresTotal && (
                                        <span className="text-sm font-normal text-muted-foreground ml-1">
                                            / {indicadoresTotal}
                                        </span>
                                    )}
                                </div>
                                {indicadoresRespondidos !== null && indicadoresTotal && (
                                    <div className="mt-1.5 h-1 bg-muted rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-[#81242d] transition-all duration-500"
                                            style={{
                                                width: `${(indicadoresRespondidos / indicadoresTotal * 100)}%`
                                            }}
                                        />
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Botones de acción mejorados */}
                <div className="flex items-center justify-between pt-3 border-t border-border/50">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleToggleExpand}
                        className="gap-2 hover:bg-[#81242d]/5 hover:text-[#81242d]"
                    >
                        {isExpanded ? (
                            <>
                                <ChevronUp className="h-4 w-4" />
                                Ocultar detalles
                            </>
                        ) : (
                            <>
                                <ChevronDown className="h-4 w-4" />
                                Ver detalles por capítulo
                            </>
                        )}
                    </Button>

                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleExportCSV}
                            disabled={exportingCSV}
                            className="gap-2 border-[#81242d]/30 hover:bg-[#81242d]/5 hover:border-[#81242d] hover:text-[#81242d] transition-colors"
                        >
                            {exportingCSV ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <FileSpreadsheet className="h-4 w-4" />
                            )}
                            CSV
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleExportPDF}
                            disabled={exportingPDF}
                            className="gap-2 border-[#81242d]/30 hover:bg-[#81242d]/5 hover:border-[#81242d] hover:text-[#81242d] transition-colors"
                        >
                            {exportingPDF ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <FileText className="h-4 w-4" />
                            )}
                            PDF
                        </Button>
                    </div>
                </div>

                {/* Detalles expandidos con título mejorado */}
                {isExpanded && (
                    <div className="mt-6 pt-6 border-t border-border/50">
                        <h4 className="text-sm font-semibold text-foreground mb-4 uppercase tracking-wider">
                            Resultados por Capítulo
                        </h4>
                        {isLoading ? (
                            <div className="flex items-center justify-center py-8">
                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                                <span className="ml-3 text-muted-foreground">Cargando detalles...</span>
                            </div>
                        ) : resultado?.capitulos ? (
                            <ChapterDetails capitulos={resultado.capitulos} />
                        ) : (
                            <p className="text-center text-muted-foreground py-4">
                                No hay datos detallados disponibles
                            </p>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
