"use client"

import { useEffect, useState, use } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { RefreshCw, LayoutDashboard, Info, AlertTriangle } from "lucide-react"
import { crearAutoevaluacion } from "@/lib/api/autoevaluacion"
import { determineSustainabilityLevel } from "@/lib/utils/scoring"

interface PageProps {
    params: Promise<{ id: string }>
}

// Estructura de datos guardados localmente
interface ResultadoLocal {
    assessmentId: string
    puntaje_final: number
    puntaje_maximo: number
    porcentaje: number
    fecha_completo: string
    segmento: string
    nombre_bodega?: string
    responsable?: string
}

// Función para formatear fecha
const formatearFecha = (fechaISO: string): string => {
    const fecha = new Date(fechaISO)
    return fecha.toLocaleDateString('es-AR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    })
}

// Datos de referencia para la tabla de niveles
const REFERENCIA_NIVELES = [
    { segmento: "Bodega Turística Artesanal", min: "22 - 26", med: "27 - 42", alto: "43 - 54" },
    { segmento: "Bodega Turística Boutique", min: "28 - 42", med: "43 - 66", alto: "67 - 84" },
    { segmento: "Bodega Turística", min: "39 - 59", med: "60 - 92", alto: "93 - 117" },
    { segmento: "Gran Bodega Turística", min: "42 - 64", med: "65 - 99", alto: "100 - 126" },
]

export default function ResultadoDetallePage({ params }: PageProps) {
    const { id } = use(params)
    const router = useRouter()
    const [resultado, setResultado] = useState<ResultadoLocal | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [isCreating, setIsCreating] = useState(false)
    const [showConfirmModal, setShowConfirmModal] = useState(false)

    useEffect(() => {
        // Cargar resultado desde localStorage
        const storedData = localStorage.getItem(`resultado_${id}`)
        if (storedData) {
            try {
                const parsed = JSON.parse(storedData) as ResultadoLocal
                
                // Si no tiene datos de bodega/responsable, intentar obtenerlos del usuario actual
                if (!parsed.nombre_bodega || !parsed.responsable) {
                    const usuarioStr = localStorage.getItem('usuario')
                    if (usuarioStr) {
                        const usuario = JSON.parse(usuarioStr)
                        if (!parsed.nombre_bodega) {
                            parsed.nombre_bodega = usuario?.bodega?.nombre_fantasia || usuario?.bodega?.razon_social || 'N/A'
                        }
                        if (!parsed.responsable) {
                            parsed.responsable = usuario?.responsable 
                                ? `${usuario.responsable.nombre || ''} ${usuario.responsable.apellido || ''}`.trim() 
                                : 'N/A'
                        }
                    }
                }
                
                setResultado(parsed)
            } catch (e) {
                console.error("Error al parsear resultado:", e)
                setError("No se pudo cargar el resultado guardado.")
            }
        } else {
            setError("No se encontró ningún resultado para esta evaluación. Es posible que no hayas completado la evaluación o los datos se hayan perdido.")
        }
        setIsLoading(false)
    }, [id])

    const handleNuevaEvaluacion = async () => {
        setIsCreating(true)
        try {
            const usuarioStr = localStorage.getItem('usuario')
            if (!usuarioStr) {
                router.push("/login")
                return
            }
            const usuario = JSON.parse(usuarioStr)
            const idBodega = usuario.bodega?.id_bodega || usuario.id_bodega

            if (idBodega) {
                await crearAutoevaluacion(idBodega)
                router.push("/dashboard/autoevaluacion")
            } else {
                alert("No se pudo identificar la bodega para crear una nueva evaluación.")
            }
        } catch (err) {
            console.error('Error al crear nueva evaluación:', err)
            alert('Error al iniciar nueva evaluación')
        } finally {
            setIsCreating(false)
            setShowConfirmModal(false)
        }
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Cargando resultados...</p>
                </div>
            </div>
        )
    }

    if (error || !resultado) {
        return (
            <div className="p-8">
                <Button variant="ghost" onClick={() => router.back()} className="mb-4">
                    Volver
                </Button>
                <div className="text-destructive bg-destructive/10 p-4 rounded-lg">
                    {error || 'No se encontró el resultado'}
                </div>
            </div>
        )
    }

    const nivel = resultado.porcentaje !== null
        ? determineSustainabilityLevel(resultado.porcentaje)
        : null

    return (
        <div className="p-8 space-y-8 max-w-6xl mx-auto">
            {/* Encabezado con información de la evaluación */}
            <div className="bg-gradient-to-r from-[#8B1E2F]/5 to-[#B89B5E]/5 rounded-xl p-6 border border-[#8B1E2F]/10">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="space-y-1">
                        <h1 className="text-2xl font-bold text-gray-900">
                            {resultado.nombre_bodega || 'Bodega'}
                        </h1>
                        <p className="text-gray-600">
                            Segmento: <span className="font-medium">{resultado.segmento}</span>
                        </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4 text-sm">
                        <div className="flex items-center gap-2 text-gray-600">
                            <svg className="h-4 w-4 text-[#8B1E2F]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            <span>Responsable: <span className="font-medium text-gray-900">{resultado.responsable || 'N/A'}</span></span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                            <svg className="h-4 w-4 text-[#8B1E2F]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span>Fecha: <span className="font-medium text-gray-900">{formatearFecha(resultado.fecha_completo)}</span></span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tarjeta de Puntuación Principal */}
            <Card className="overflow-hidden border-2 border-primary/10 shadow-lg">
                <CardContent className="p-0">
                    <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-100">
                        {/* Puntuación */}
                        <div className="p-10 flex flex-col items-center justify-center text-center">
                            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">
                                PUNTUACIÓN TOTAL OBTENIDA
                            </h3>
                            <div className="text-[#8B1E2F] text-8xl font-black leading-none mb-2">
                                {resultado.puntaje_final ?? 0}
                            </div>
                            <span className="text-gray-400 font-medium">puntos</span>
                        </div>

                        {/* Nivel de Sostenibilidad */}
                        <div className="p-10 flex flex-col items-center justify-center text-center">
                            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6">
                                NIVEL DE SOSTENIBILIDAD ALCANZADO
                            </h3>
                            {/* Aquí iría un indicador visual o badge grande si se requiere, por ahora simplificado como texto/badge */}
                            <div className="flex flex-col items-center gap-2">
                                <span className={`text-3xl font-bold px-6 py-2 rounded-full border-2`}
                                    style={{
                                        borderColor: nivel?.color || '#ccc',
                                        color: nivel?.color || '#ccc',
                                        backgroundColor: `${nivel?.color || '#ccc'}15`
                                    }}
                                >
                                    {nivel?.nombre || 'Sin Nivel'}
                                </span>
                                <p className="text-gray-500 max-w-xs mt-2 text-sm">
                                    {nivel?.descripcion}
                                </p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Botones de Acción */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 py-4">
                <Button
                    onClick={() => router.push("/dashboard")}
                    className="bg-[#8B1E2F] hover:bg-[#6D1A1A] text-white px-8 h-12 text-base font-medium rounded-md shadow-sm min-w-[200px]"
                >
                    <LayoutDashboard className="mr-2 h-5 w-5" />
                    Ir al Dashboard
                </Button>

                <Button
                    variant="outline"
                    onClick={() => setShowConfirmModal(true)}
                    disabled={isCreating}
                    className="border-[#8B1E2F] text-[#8B1E2F] hover:bg-[#8B1E2F]/5 hover:text-[#8B1E2F] px-8 h-12 text-base font-medium rounded-md shadow-sm min-w-[200px]"
                >
                    <RefreshCw className={`mr-2 h-5 w-5 ${isCreating ? 'animate-spin' : ''}`} />
                    Realizar nueva evaluación
                </Button>
            </div>

            {/* Tabla de Niveles de Sostenibilidad */}
            <Card className="border shadow-md">
                <CardContent className="p-4 md:p-8">
                    <div className="text-center mb-6 md:mb-8">
                        <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">Niveles de Sostenibilidad</h2>
                        <p className="text-sm md:text-base text-gray-500">Guía de referencia de puntuación según segmento</p>
                    </div>

                    <div className="flex flex-col md:flex-row justify-center gap-2 md:gap-4 mb-6">
                        <div className="px-4 py-2 bg-[#84cc16] text-white font-bold rounded text-xs md:text-sm uppercase text-center">Nivel mínimo de sostenibilidad</div>
                        <div className="px-4 py-2 bg-[#22c55e] text-white font-bold rounded text-xs md:text-sm uppercase text-center">Nivel medio de sostenibilidad</div>
                        <div className="px-4 py-2 bg-[#15803d] text-white font-bold rounded text-xs md:text-sm uppercase text-center">Nivel alto de sostenibilidad</div>
                    </div>

                    <div className="overflow-x-auto -mx-4 md:mx-0 px-4 md:px-0">
                        <table className="w-full text-sm text-center border-collapse min-w-[700px]">
                            <thead>
                                <tr className="bg-gray-50/50 border-b-2 border-gray-100">
                                    <th className="p-4 text-left font-bold text-gray-500 uppercase text-xs w-1/4">SEGMENTO</th>
                                    <th className="p-4 font-bold text-gray-600 bg-lime-50/50 uppercase text-xs w-1/4 border-l border-white">NIVEL MÍNIMO DE SOSTENIBILIDAD</th>
                                    <th className="p-4 font-bold text-gray-600 bg-green-50/50 uppercase text-xs w-1/4 border-l border-white">NIVEL MEDIO DE SOSTENIBILIDAD</th>
                                    <th className="p-4 font-bold text-gray-600 bg-emerald-50/50 uppercase text-xs w-1/4 border-l border-white">NIVEL ALTO DE SOSTENIBILIDAD</th>
                                </tr>
                                <tr className="text-xs text-red-600 font-bold border-b border-gray-100">
                                    <th className="p-2"></th>
                                    <th className="p-2 bg-lime-50/30 border-l border-white">
                                        <div className="grid grid-cols-2">
                                            <span>MÍNIMO</span>
                                            <span>MÁXIMO</span>
                                        </div>
                                    </th>
                                    <th className="p-2 bg-green-50/30 border-l border-white">
                                        <div className="grid grid-cols-2">
                                            <span>MÍNIMO</span>
                                            <span>MÁXIMO</span>
                                        </div>
                                    </th>
                                    <th className="p-2 bg-emerald-50/30 border-l border-white">
                                        <div className="grid grid-cols-2">
                                            <span>MÍNIMO</span>
                                            <span>MÁXIMO</span>
                                        </div>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {REFERENCIA_NIVELES.map((row, index) => (
                                    <tr key={index} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="p-4 text-left font-medium text-gray-700 bg-gray-50/30">{row.segmento}</td>

                                        <td className="p-0 bg-lime-50/10 border-l border-gray-100">
                                            <div className="grid grid-cols-2 h-full py-4">
                                                <span className="font-semibold text-gray-700">{row.min.split('-')[0].trim()}</span>
                                                <span className="font-semibold text-gray-700">{row.min.split('-')[1].trim()}</span>
                                            </div>
                                        </td>

                                        <td className="p-0 bg-green-50/10 border-l border-gray-100">
                                            <div className="grid grid-cols-2 h-full py-4">
                                                <span className="font-semibold text-gray-700">{row.med.split('-')[0].trim()}</span>
                                                <span className="font-semibold text-gray-700">{row.med.split('-')[1].trim()}</span>
                                            </div>
                                        </td>

                                        <td className="p-0 bg-emerald-50/10 border-l border-gray-100">
                                            <div className="grid grid-cols-2 h-full py-4">
                                                <span className="font-semibold text-gray-700">{row.alto.split('-')[0].trim()}</span>
                                                <span className="font-semibold text-gray-700">{row.alto.split('-')[1].trim()}</span>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="mt-8 flex items-start gap-3 p-4 bg-blue-50 text-blue-800 rounded-md text-sm">
                        <Info className="h-5 w-5 shrink-0" />
                        <p>
                            Los valores indican el rango de puntuación requerido para cada categoría.
                            El nivel de sostenibilidad de su bodega se determina según el segmento al que pertenece y la puntuación obtenida en la autoevaluación.
                        </p>
                    </div>

                    <div className="text-right mt-4 text-xs text-gray-400">
                        Ref.: TBL-SOST-2823-V2
                    </div>
                </CardContent>
            </Card>

            {/* Modal de Confirmación */}
            <Dialog open={showConfirmModal} onOpenChange={setShowConfirmModal}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader className="space-y-4">
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-amber-100">
                            <AlertTriangle className="h-7 w-7 text-amber-600" />
                        </div>
                        <DialogTitle className="text-center text-xl font-semibold">
                            ¿Iniciar nueva evaluación?
                        </DialogTitle>
                        <DialogDescription className="text-center text-gray-600">
                            Estás a punto de comenzar una nueva autoevaluación de sostenibilidad. 
                            Esta acción creará un nuevo registro de evaluación para tu bodega.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-center gap-3 mt-6">
                        <Button
                            variant="outline"
                            onClick={() => setShowConfirmModal(false)}
                            disabled={isCreating}
                            className="px-6"
                        >
                            Cancelar
                        </Button>
                        <Button
                            onClick={handleNuevaEvaluacion}
                            disabled={isCreating}
                            className="bg-[#8B1E2F] hover:bg-[#6D1A1A] text-white px-6"
                        >
                            {isCreating ? (
                                <>
                                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                                    Iniciando...
                                </>
                            ) : (
                                "Sí, comenzar"
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
