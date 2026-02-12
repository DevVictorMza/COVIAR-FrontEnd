"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
    Award,
    Calendar,
    Building2,
    Leaf,
    Users,
    TrendingUp,
    CheckCircle2,
    ClipboardList,
    Plus,
    ChevronDown,
    ChevronUp,
    AlertCircle
} from "lucide-react"
import { NivelesSostenibilidadTable } from "@/components/results/niveles-sostenibilidad-table"
import { getNivelSostenibilidadInfo } from "@/lib/utils/scoring"
import { descargarEvidencia } from "@/lib/api/autoevaluacion"
import type { SegmentoTipo } from "@/lib/utils/scoring"
import { obtenerHistorialAutoevaluaciones, obtenerResultadosAutoevaluacion } from "@/lib/api/autoevaluacion"

// Colores institucionales COVIAR
const COLORS = {
    borravino: '#880D1E',
    borravinoLight: '#a91028',
    gold: '#B89B5E',
    forest: '#2F4F3E',
    cream: '#FAF7F2',
}

// Íconos por capítulo según temática
const CHAPTER_ICONS: Record<string, React.ReactNode> = {
    'Gestión Ambiental': <Leaf className="h-5 w-5" />,
    'Gestión Social': <Users className="h-5 w-5" />,
    'Gestión Económica': <TrendingUp className="h-5 w-5" />,
}

// Colores por capítulo
const CHAPTER_COLORS: Record<string, string> = {
    'Gestión Ambiental': '#2F4F3E',
    'Gestión Social': '#B89B5E',
    'Gestión Económica': '#880D1E',
}

function getChapterIcon(nombre: string) {
    return CHAPTER_ICONS[nombre] || <CheckCircle2 className="h-5 w-5" />
}

// Mapeo de nombres de segmento del backend a tipos del frontend
function mapSegmentoToTipo(nombreSegmento: string): SegmentoTipo | undefined {
    const mapping: Record<string, SegmentoTipo> = {
        'Bodega Turística Artesanal': 'micro_bodega',
        'Bodega Turística Boutique': 'pequena_bodega',
        'Pequeñas Bodegas': 'pequena_bodega',
        'Bodega Turística': 'bodega',
        'Gran Bodega Turística': 'gran_bodega',
    }
    return mapping[nombreSegmento]
}

function getChapterColor(nombre: string) {
    return CHAPTER_COLORS[nombre] || COLORS.borravino
}

// Función para formatear fecha en formato dd/mm/aa HH:mm
function formatDate(dateString: string): string {
    const date = new Date(dateString)
    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear().toString().slice(-2)
    const hours = date.getHours().toString().padStart(2, '0')
    const minutes = date.getMinutes().toString().padStart(2, '0')
    return `${day}/${month}/${year} - ${hours}:${minutes} hs`
}

// Componente de tarjeta de capítulo expandible
function ChapterCard({ capitulo }: { capitulo: CapituloResultado }) {
    const [isExpanded, setIsExpanded] = useState(false)
    const color = getChapterColor(capitulo.nombre)
    const icon = getChapterIcon(capitulo.nombre)

    // Calcular puntaje total del capítulo
    const puntajeCapitulo = capitulo.indicadores.reduce((acc, ind) => {
        const puntos = ind.niveles_respuesta[0]?.puntos || 0
        return acc + puntos
    }, 0)

    return (
        <Card
            className="overflow-hidden transition-all duration-300 hover:shadow-lg border-l-4"
            style={{ borderLeftColor: color }}
        >
            <CardHeader
                className="cursor-pointer select-none"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div
                            className="p-2 rounded-lg"
                            style={{ backgroundColor: `${color}15` }}
                        >
                            <span style={{ color }}>{icon}</span>
                        </div>
                        <div>
                            <CardTitle className="text-lg font-semibold">
                                {capitulo.nombre}
                            </CardTitle>
                            <p className="text-sm text-muted-foreground mt-0.5">
                                {capitulo.indicadores.length} indicadores evaluados
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <Badge
                            variant="secondary"
                            className="text-base font-bold px-3 py-1"
                            style={{ backgroundColor: `${color}15`, color }}
                        >
                            {puntajeCapitulo} pts
                        </Badge>
                        {isExpanded ? (
                            <ChevronUp className="h-5 w-5 text-muted-foreground" />
                        ) : (
                            <ChevronDown className="h-5 w-5 text-muted-foreground" />
                        )}
                    </div>
                </div>
            </CardHeader>

            {isExpanded && (
                <CardContent className="pt-0">
                    <Separator className="mb-4" />
                    <div className="space-y-4">
                        {capitulo.indicadores.map((indicador, idx) => {
                            const respuesta = indicador.niveles_respuesta[0]
                            return (
                                <div
                                    key={idx}
                                    className="p-4 rounded-lg bg-muted/30 border border-border/50"
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1">
                                            <h4 className="font-medium text-foreground">
                                                {indicador.nombre}
                                            </h4>
                                            <p className="text-sm text-muted-foreground mt-1">
                                                {indicador.descripcion}
                                            </p>
                                        </div>
                                        <Badge
                                            variant="outline"
                                            className="shrink-0 font-semibold"
                                            style={{
                                                borderColor: color,
                                                color: color
                                            }}
                                        >
                                            {respuesta?.puntos || 0} pts
                                        </Badge>
                                    </div>
                                    {respuesta && (
                                        <div className="mt-3 p-3 rounded-md bg-background border">
                                            <div className="flex items-center gap-2 text-sm">
                                                <CheckCircle2
                                                    className="h-4 w-4 shrink-0"
                                                    style={{ color }}
                                                />
                                                <span className="font-medium" style={{ color }}>
                                                    {respuesta.nombre}
                                                </span>
                                            </div>
                                            <p className="text-xs text-muted-foreground mt-1 ml-6">
                                                {respuesta.descripcion}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                </CardContent>
            )}
        </Card>
    )
}

// Tipo para capítulo local guardado con indicadores (extendido)
interface IndicadorLocal {
    id_indicador: number
    nombre: string
    descripcion: string
    orden: number
    respuesta: {
        id_nivel_respuesta: number
        nombre: string
        descripcion: string
        puntos: number
    } | null
    puntaje_maximo: number
}

interface CapituloLocalConIndicadores {
    id_capitulo: number
    nombre: string
    puntaje_obtenido: number
    puntaje_maximo: number
    porcentaje: number
    indicadores_completados: number
    indicadores_total: number
    indicadores?: IndicadorLocal[]
}

// Componente de tarjeta de capítulo para datos locales - EXPANDIBLE
function LocalChapterCard({ capitulo, idAutoevaluacion }: { capitulo: CapituloLocalConIndicadores; idAutoevaluacion: string }) {
    const [isExpanded, setIsExpanded] = useState(false)
    const [downloadingIds, setDownloadingIds] = useState<Set<number>>(new Set())
    const color = getChapterColor(capitulo.nombre)
    const icon = getChapterIcon(capitulo.nombre)
    const hasIndicadores = capitulo.indicadores && capitulo.indicadores.length > 0

    const handleDescargarEvidencia = async (idIndicador: number, idRespuesta: number) => {
        setDownloadingIds(prev => new Set(prev).add(idIndicador))
        try {
            await descargarEvidencia(idAutoevaluacion, idRespuesta)
        } catch (error) {
            console.error('Error al descargar evidencia:', error)
            alert(error instanceof Error ? error.message : 'Error al descargar la evidencia')
        } finally {
            setDownloadingIds(prev => {
                const newSet = new Set(prev)
                newSet.delete(idIndicador)
                return newSet
            })
        }
    }

    return (
        <Card
            className="overflow-hidden transition-all duration-300 hover:shadow-lg border-l-4"
            style={{ borderLeftColor: color }}
        >
            <CardHeader
                className={hasIndicadores ? "cursor-pointer select-none" : ""}
                onClick={() => hasIndicadores && setIsExpanded(!isExpanded)}
            >
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div
                            className="p-2 rounded-lg"
                            style={{ backgroundColor: `${color}15` }}
                        >
                            <span style={{ color }}>{icon}</span>
                        </div>
                        <div>
                            <CardTitle className="text-lg font-semibold">
                                {capitulo.nombre}
                            </CardTitle>
                            <p className="text-sm text-muted-foreground mt-0.5">
                                {capitulo.indicadores_completados} de {capitulo.indicadores_total} indicadores evaluados
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <Badge
                            variant="secondary"
                            className="text-base font-bold px-3 py-1"
                            style={{ backgroundColor: `${color}15`, color }}
                        >
                            {capitulo.puntaje_obtenido} / {capitulo.puntaje_maximo} pts
                        </Badge>
                        <div 
                            className="text-sm font-medium px-2 py-1 rounded"
                            style={{ backgroundColor: `${color}10`, color }}
                        >
                            {capitulo.porcentaje}%
                        </div>
                        {hasIndicadores && (
                            isExpanded ? (
                                <ChevronUp className="h-5 w-5 text-muted-foreground" />
                            ) : (
                                <ChevronDown className="h-5 w-5 text-muted-foreground" />
                            )
                        )}
                    </div>
                </div>
            </CardHeader>

            {isExpanded && hasIndicadores && (
                <CardContent className="pt-0">
                    <Separator className="mb-4" />
                    <div className="space-y-4">
                        {capitulo.indicadores!.map((indicador, idx) => (
                            <div
                                key={indicador.id_indicador || idx}
                                className="p-4 rounded-lg bg-muted/30 border border-border/50"
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1">
                                        <h4 className="font-medium text-foreground">
                                            {indicador.nombre}
                                        </h4>
                                        {indicador.descripcion && (
                                            <p className="text-sm text-muted-foreground mt-1">
                                                {indicador.descripcion}
                                            </p>
                                        )}
                                    </div>
                                    <Badge
                                        variant="outline"
                                        className="shrink-0 font-semibold"
                                        style={{
                                            borderColor: color,
                                            color: color
                                        }}
                                    >
                                        {indicador.respuesta?.puntos ?? 0} / {indicador.puntaje_maximo} pts
                                    </Badge>
                                </div>
                                {indicador.respuesta && (
                                    <div className="mt-3 p-3 rounded-md bg-background border">
                                        <div className="flex items-center gap-2 text-sm">
                                            <CheckCircle2
                                                className="h-4 w-4 shrink-0"
                                                style={{ color }}
                                            />
                                            <span className="font-medium" style={{ color }}>
                                                {indicador.respuesta.nombre}
                                            </span>
                                        </div>
                                        {indicador.respuesta.descripcion && (
                                            <p className="text-xs text-muted-foreground mt-1 ml-6">
                                                {indicador.respuesta.descripcion}
                                            </p>
                                        )}
                                    </div>
                                )}
                                
                                {/* Sección de Evidencias */}
                                <div className="mt-3">
                                    {indicador.tiene_evidencia && indicador.id_respuesta ? (
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleDescargarEvidencia(indicador.id_indicador, indicador.id_respuesta!)}
                                            disabled={downloadingIds.has(indicador.id_indicador)}
                                            className="gap-2 text-sm"
                                        >
                                            <Download className="h-4 w-4" />
                                            {downloadingIds.has(indicador.id_indicador) 
                                                ? 'Descargando...' 
                                                : 'Descargar Evidencia (PDF)'}
                                        </Button>
                                    ) : (
                                        <div className="flex items-center gap-2 px-3 py-2 rounded-md bg-muted/50 border border-dashed border-muted-foreground/30">
                                            <FileX className="h-4 w-4 text-muted-foreground" />
                                            <span className="text-sm text-muted-foreground italic">
                                                Evidencia no disponible
                                            </span>
                                        </div>
                                    )}
                                </div>
                                
                                {!indicador.respuesta && (
                                    <div className="mt-3 p-3 rounded-md bg-muted/50 border border-dashed">
                                        <p className="text-sm text-muted-foreground italic">
                                            Sin respuesta registrada
                                        </p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </CardContent>
            )}
        </Card>
    )
}

// Componente de estado vacío
function EmptyState() {
    return (
        <div className="p-8 space-y-8">
            <div>
                <h1 className="text-3xl font-bold">Resultados de la última Autoevaluación</h1>
                <p className="text-muted-foreground mt-1">
                    Análisis detallado de tu evaluación de sostenibilidad enoturística
                </p>
            </div>

            <Card className="border-dashed border-2 bg-muted/20">
                <CardContent className="py-16">
                    <div className="text-center space-y-6">
                        <div className="mx-auto w-20 h-20 rounded-full bg-[#880D1E]/10 flex items-center justify-center">
                            <ClipboardList className="h-10 w-10 text-[#880D1E]/50" />
                        </div>
                        <div className="space-y-2">
                            <h2 className="text-2xl font-bold text-foreground">
                                Sin evaluaciones completadas
                            </h2>
                            <p className="text-muted-foreground max-w-md mx-auto">
                                Aún no has completado ninguna autoevaluación de sostenibilidad.
                                Realiza tu primera evaluación para ver tus resultados aquí.
                            </p>
                        </div>
                        <Button
                            asChild
                            size="lg"
                            className="bg-[#880D1E] hover:bg-[#6a0a17] gap-2 mt-4"
                        >
                            <Link href="/dashboard/autoevaluacion">
                                <Plus className="h-5 w-5" />
                                Comenzar Autoevaluación
                            </Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

// Componente de error
function ErrorState({ message }: { message: string }) {
    return (
        <div className="p-8 space-y-8">
            <div>
                <h1 className="text-3xl font-bold">Resultados de la última Autoevaluación</h1>
                <p className="text-muted-foreground mt-1">
                    Análisis detallado de tu evaluación de sostenibilidad enoturística
                </p>
            </div>

            <Card className="border-destructive/50 bg-destructive/5">
                <CardContent className="py-12">
                    <div className="text-center space-y-4">
                        <div className="mx-auto w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
                            <AlertCircle className="h-8 w-8 text-destructive" />
                        </div>
                        <div className="space-y-2">
                            <h2 className="text-xl font-semibold text-destructive">
                                Error al cargar resultados
                            </h2>
                            <p className="text-muted-foreground max-w-md mx-auto">
                                {message}
                            </p>
                        </div>
                        <Button
                            variant="outline"
                            onClick={() => window.location.reload()}
                            className="mt-4"
                        >
                            Reintentar
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

// Estructura local del resultado guardado (coincide con calculateChapterScoresWithResponses)
// Nota: CapituloLocalConIndicadores ya está definido arriba con soporte para indicadores

interface ResultadoLocal {
    assessmentId: string
    puntaje_final: number
    puntaje_maximo: number
    porcentaje: number
    fecha_completo: string
    segmento: string
    nombre_bodega: string
    responsable: string
    capitulos: CapituloLocalConIndicadores[]
    nivel_sostenibilidad: string
}

export default function ResultadosPage() {
    const router = useRouter()
    const [resultadoLocal, setResultadoLocal] = useState<ResultadoLocal | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const cargarResultados = async () => {
            try {
                // Primero intentar cargar desde localStorage para carga rápida
                const ultimoResultado = localStorage.getItem('ultimo_resultado_completado')
                if (ultimoResultado) {
                    try {
                        const parsed = JSON.parse(ultimoResultado) as ResultadoLocal
                        setResultadoLocal(parsed)
                        setIsLoading(false)
                        return
                    } catch (e) {
                        console.error('Error al parsear resultado local:', e)
                    }
                }

                // Si no hay en localStorage, consultar la API
                const usuarioStr = localStorage.getItem('usuario')
                if (!usuarioStr) {
                    setIsLoading(false)
                    return
                }

                const usuario = JSON.parse(usuarioStr)
                const idBodega = usuario.bodega?.id_bodega || usuario.id_bodega

                if (!idBodega) {
                    setIsLoading(false)
                    return
                }

                // Obtener historial de evaluaciones completadas
                const historial = await obtenerHistorialAutoevaluaciones(idBodega)

                if (!historial || historial.length === 0) {
                    setIsLoading(false)
                    return
                }

                // Tomar la evaluación más reciente
                const ultimaEvaluacion = historial[0]

                // Obtener resultados detallados con capítulos
                const resultadosDetallados = await obtenerResultadosAutoevaluacion(ultimaEvaluacion.id_autoevaluacion)

                // Formatear respuesta de API a formato ResultadoLocal
                const resultadoFormateado: ResultadoLocal = {
                    assessmentId: ultimaEvaluacion.id_autoevaluacion.toString(),
                    puntaje_final: ultimaEvaluacion.puntaje_final || 0,
                    puntaje_maximo: ultimaEvaluacion.puntaje_maximo || 0,
                    porcentaje: ultimaEvaluacion.porcentaje || 0,
                    fecha_completo: ultimaEvaluacion.fecha_finalizacion || ultimaEvaluacion.fecha_inicio,
                    segmento: ultimaEvaluacion.nombre_segmento || 'N/A',
                    nombre_bodega: usuario.bodega?.nombre_fantasia || 'N/A',
                    responsable: `${usuario.responsable?.nombre || ''} ${usuario.responsable?.apellido || ''}`.trim() || 'N/A',
                    capitulos: resultadosDetallados.capitulos?.map(cap => ({
                        id_capitulo: cap.id_capitulo,
                        nombre: cap.nombre,
                        puntaje_obtenido: cap.puntaje_obtenido || 0,
                        puntaje_maximo: cap.puntaje_maximo || 0,
                        porcentaje: cap.porcentaje || 0,
                        indicadores_completados: cap.indicadores_completados || 0,
                        indicadores_total: cap.indicadores_total || 0,
                    })) || [],
                    nivel_sostenibilidad: ultimaEvaluacion.nivel_sostenibilidad?.nombre || 'BÁSICO'
                }

                // Guardar en localStorage para futuras consultas
                try {
                    localStorage.setItem('ultimo_resultado_completado', JSON.stringify(resultadoFormateado))
                } catch (e) {
                    console.error('Error al guardar resultado en localStorage:', e)
                }

                setResultadoLocal(resultadoFormateado)
            } catch (err) {
                console.error('Error al cargar resultados:', err)
                setError(err instanceof Error ? err.message : 'Error desconocido al cargar resultados')
            } finally {
                setIsLoading(false)
            }
        }

        cargarResultados()
    }, [])

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full min-h-[60vh]">
                <div className="text-center space-y-4">
                    <div className="relative">
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#880D1E]/20 border-t-[#880D1E] mx-auto"></div>
                    </div>
                    <p className="text-muted-foreground font-medium">Cargando resultados...</p>
                </div>
            </div>
        )
    }

    if (error) {
        return <ErrorState message={error} />
    }

    if (!resultadoLocal) {
        return <EmptyState />
    }

    // Verificar que capitulos existe
    if (!resultadoLocal.capitulos || !Array.isArray(resultadoLocal.capitulos)) {
        return <EmptyState />
    }

    // Calcular estadísticas
    const totalIndicadores = resultadoLocal.capitulos.reduce(
        (acc, cap) => acc + (cap.indicadores_total || 0), 0
    )

    // Función para limpiar el resultado al iniciar nueva evaluación
    const handleNuevaEvaluacion = () => {
        localStorage.removeItem('ultimo_resultado_completado')
        router.push('/dashboard/autoevaluacion')
    }

    // Obtener nivel de sostenibilidad
    const nivelInfo = getNivelSostenibilidadInfo(resultadoLocal.nivel_sostenibilidad)

    return (
        <div className="p-8 space-y-8 max-w-6xl mx-auto">
            {/* Header con información de la bodega */}
            <div className="space-y-6">
                {/* Info Cards Premium */}
                <div className="flex flex-wrap items-center gap-4">
                    {/* Bodega Card */}
                    <div className="group relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-[#880D1E] to-[#a81028] rounded-lg blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
                        <div className="relative flex items-center gap-3 px-5 py-3 bg-gradient-to-br from-[#880D1E] to-[#6d0a18] rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
                            <div className="p-2 bg-white/10 rounded-md backdrop-blur-sm">
                                <Building2 className="h-5 w-5 text-white" />
                            </div>
                            <span className="font-bold text-white text-base tracking-wide">{resultadoLocal.nombre_bodega || 'N/A'}</span>
                        </div>
                    </div>

                    {/* Fecha Card */}
                    <div className="group relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-[#B89B5E] to-[#d4b76f] rounded-lg blur opacity-20 group-hover:opacity-35 transition duration-300"></div>
                        <div className="relative flex items-center gap-3 px-5 py-3 bg-white border-2 border-[#B89B5E]/30 rounded-lg shadow-md hover:shadow-lg hover:border-[#B89B5E]/50 transition-all duration-300">
                            <div className="p-2 bg-gradient-to-br from-[#B89B5E]/10 to-[#B89B5E]/5 rounded-md">
                                <Calendar className="h-5 w-5 text-[#B89B5E]" />
                            </div>
                            <span className="font-semibold text-gray-700">{formatDate(resultadoLocal.fecha_completo)}</span>
                        </div>
                    </div>

                    {/* Responsable Card */}
                    <div className="group relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-[#B89B5E] to-[#d4b76f] rounded-lg blur opacity-20 group-hover:opacity-35 transition duration-300"></div>
                        <div className="relative flex items-center gap-3 px-5 py-3 bg-white border-2 border-[#B89B5E]/30 rounded-lg shadow-md hover:shadow-lg hover:border-[#B89B5E]/50 transition-all duration-300">
                            <div className="p-2 bg-gradient-to-br from-[#B89B5E]/10 to-[#B89B5E]/5 rounded-md">
                                <Users className="h-5 w-5 text-[#B89B5E]" />
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-500">Responsable:</span>
                                <span className="font-bold text-gray-800">{resultadoLocal.responsable || 'N/A'}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Títulos */}
                <div className="space-y-2 pt-2">
                    <h1 className="text-3xl font-bold text-foreground">
                        Resultados de la última Autoevaluación
                    </h1>
                    <p className="text-muted-foreground">
                        Informe detallado de sostenibilidad enoturística
                    </p>
                </div>
            </div>

            {/* Tarjetas de resumen */}
            <div className="grid gap-4 md:grid-cols-3">
                {/* Puntaje Final */}
                <Card className="relative overflow-hidden border-2 border-[#880D1E]/20 shadow-sm">
                    <div
                        className="absolute inset-0 opacity-5"
                        style={{
                            background: `linear-gradient(135deg, ${COLORS.borravino} 0%, transparent 60%)`
                        }}
                    />
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                                    Puntaje Final
                                </p>
                                <p className="text-4xl font-bold mt-2" style={{ color: COLORS.borravino }}>
                                    {resultadoLocal.puntaje_final}
                                </p>
                                <p className="text-sm text-muted-foreground mt-1">
                                    puntos obtenidos
                                </p>
                            </div>
                            <div
                                className="p-3 rounded-full"
                                style={{ backgroundColor: `${COLORS.borravino}15` }}
                            >
                                <Award className="h-8 w-8" style={{ color: COLORS.borravino }} />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Nivel de Sustentabilidad */}
                <Card className="relative overflow-hidden border-2 shadow-sm" style={{ borderColor: `${nivelInfo.color}30` }}>
                    <div
                        className="absolute inset-0 opacity-5"
                        style={{
                            background: `linear-gradient(135deg, ${nivelInfo.color} 0%, transparent 60%)`
                        }}
                    />
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                                    Nivel Alcanzado
                                </p>
                                <p className="text-xl font-bold mt-2" style={{ color: nivelInfo.color }}>
                                    {nivelInfo.nombre}
                                </p>
                                <p className="text-sm text-muted-foreground mt-1">
                                    de sostenibilidad
                                </p>
                            </div>
                            <div
                                className="p-3 rounded-full"
                                style={{ backgroundColor: `${nivelInfo.color}15` }}
                            >
                                <Leaf className="h-8 w-8" style={{ color: nivelInfo.color }} />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Segmento */}
                <Card className="relative overflow-hidden border-2 border-[#B89B5E]/20 shadow-sm">
                    <div
                        className="absolute inset-0 opacity-5"
                        style={{
                            background: `linear-gradient(135deg, ${COLORS.gold} 0%, transparent 60%)`
                        }}
                    />
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                                    Segmento
                                </p>
                                <p className="text-2xl font-bold mt-2" style={{ color: COLORS.gold }}>
                                    {resultadoLocal.segmento}
                                </p>
                                <p className="text-sm text-muted-foreground mt-1">
                                    {totalIndicadores} indicadores evaluados
                                </p>
                            </div>
                            <div
                                className="p-3 rounded-full"
                                style={{ backgroundColor: `${COLORS.gold}15` }}
                            >
                                <Building2 className="h-8 w-8" style={{ color: COLORS.gold }} />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Sección de Capítulos */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold">Detalle por Capítulo</h2>
                    <span className="text-sm text-muted-foreground">
                        {resultadoLocal.capitulos.length} capítulos evaluados
                    </span>
                </div>

                <div className="space-y-4">
                    {resultadoLocal.capitulos.map((capitulo, index) => (
                            <LocalChapterCard 
                                key={capitulo.id_capitulo || index} 
                                capitulo={capitulo} 
                                idAutoevaluacion={resultadoLocal.assessmentId}
                            />
                        ))}
                </div>
            </div>

            {/* Tabla de Niveles de Sostenibilidad */}
            <NivelesSostenibilidadTable
                segmentoActual={mapSegmentoToTipo(resultadoLocal.segmento)}
                puntajeActual={resultadoLocal.puntaje_final}
            />

            {/* Footer con acciones */}
            <div className="flex justify-center pt-4 border-t">
                <Button
                    size="lg"
                    className="bg-[#880D1E] hover:bg-[#6a0a17] gap-2"
                    onClick={handleNuevaEvaluacion}
                >
                    <Plus className="h-5 w-5" />
                    Nueva Autoevaluación
                </Button>
            </div>
        </div>
    )
}
