"use client"

import { useState } from "react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, FileText, ArrowRight, ArrowLeft, Award, ChevronLeft, ChevronRight } from "lucide-react"

interface CapituloEstructura {
    capitulo: {
        nombre: string
    }
    indicadores: {
        indicador: {
            nombre: string
        }
        habilitado?: boolean
    }[]
}

interface SegmentConfirmationModalProps {
    isOpen: boolean
    onClose: () => void
    segmentName: string
    estructura: CapituloEstructura[]
}

export function SegmentConfirmationModal({
    isOpen,
    onClose,
    segmentName,
    estructura
}: SegmentConfirmationModalProps) {
    const [currentPage, setCurrentPage] = useState(0) // 0 = resumen, 1+ = capítulos

    // Filtrar estructura para mostrar solo lo habilitado
    const activeStructure = estructura
        .map(cap => ({
            ...cap,
            indicadores: cap.indicadores.filter(i => i.habilitado !== false)
        }))
        .filter(cap => cap.indicadores.length > 0)

    // Calcular estadísticas
    const activeChapters = activeStructure.length
    const activeIndicators = activeStructure.reduce((acc, cap) => acc + cap.indicadores.length, 0)

    // Total de páginas: 1 (resumen) + número de capítulos
    const totalPages = 1 + activeChapters
    const isLastPage = currentPage === totalPages - 1
    const isFirstPage = currentPage === 0

    const handleNext = () => {
        if (!isLastPage) {
            setCurrentPage(prev => prev + 1)
        }
    }

    const handlePrev = () => {
        if (!isFirstPage) {
            setCurrentPage(prev => prev - 1)
        }
    }

    const handleClose = () => {
        setCurrentPage(0) // Reset al cerrar
        onClose()
    }

    // Capítulo actual (si estamos en una página de capítulo)
    const currentChapter = currentPage > 0 ? activeStructure[currentPage - 1] : null

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
            <DialogContent className="sm:max-w-2xl p-0 overflow-hidden border-0 shadow-2xl">
                {/* Header con diseño premium */}
                <div className="relative bg-[#880D1E] text-white p-6 shrink-0 overflow-hidden">
                    {/* Elementos decorativos de fondo */}
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <Award className="w-24 h-24" />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-br from-[#880D1E] to-[#5a0510] opacity-90"></div>

                    <div className="relative z-10 flex flex-col items-center text-center space-y-3">
                        <div className="p-2 bg-white/10 rounded-full backdrop-blur-sm border border-white/20 shadow-lg">
                            <CheckCircle2 className="w-6 h-6 text-white" />
                        </div>
                        <DialogTitle className="text-xl font-serif tracking-wide">
                            Configuración de Evaluación Exitosa
                        </DialogTitle>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 border border-white/20 backdrop-blur-md text-xs font-medium">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]"></span>
                            Perfil: {segmentName}
                        </div>
                    </div>
                </div>

                {/* Contenido Principal */}
                <div className="bg-white -mt-4 rounded-t-3xl shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
                    <div className="px-4 sm:px-8 py-6">
                        {/* Página de Resumen */}
                        {currentPage === 0 && (
                            <div className="space-y-6">
                                <div className="text-center space-y-3">
                                    <h3 className="text-base font-semibold text-gray-900 border-b border-gray-100 pb-2">
                                        Adaptación del Instrumento de Evaluación
                                    </h3>
                                    <p className="text-muted-foreground text-sm leading-relaxed text-justify">
                                        En concordancia con la segmentación seleccionada, el sistema ha ajustado dinámicamente la estructura del cuestionario.
                                        A continuación, se detallan los capítulos y variables que serán evaluados:
                                    </p>
                                </div>

                                {/* Estadísticas de la estructura */}
                                <div className="grid grid-cols-2 gap-4 bg-gray-50 p-3 rounded-xl border border-gray-100">
                                    <div className="flex flex-col items-center justify-center p-2 bg-white rounded-lg shadow-sm border border-gray-100">
                                        <span className="text-2xl font-bold text-[#880D1E]">{activeChapters}</span>
                                        <span className="text-[10px] font-medium text-gray-500 uppercase tracking-wide mt-1">Capítulos</span>
                                    </div>
                                    <div className="flex flex-col items-center justify-center p-2 bg-white rounded-lg shadow-sm border border-gray-100">
                                        <span className="text-2xl font-bold text-[#880D1E]">{activeIndicators}</span>
                                        <span className="text-[10px] font-medium text-gray-500 uppercase tracking-wide mt-1">Indicadores</span>
                                    </div>
                                </div>

                                <p className="text-center text-sm text-gray-500">
                                    Navega por los capítulos para ver los indicadores a evaluar
                                </p>
                            </div>
                        )}

                        {/* Páginas de Capítulos */}
                        {currentChapter && (
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h4 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                                        <FileText className="w-4 h-4 text-[#880D1E]" />
                                        Capítulo {currentPage} de {activeChapters}
                                    </h4>
                                </div>

                                <div className="border border-gray-100 rounded-lg overflow-hidden">
                                    <div className="bg-gray-50 px-3 py-2 border-b border-gray-100">
                                        <h5 className="font-medium text-sm text-[#880D1E]">{currentChapter.capitulo.nombre}</h5>
                                    </div>
                                    <ul className="px-3 py-2 space-y-1.5 bg-white">
                                        {currentChapter.indicadores.map((ind, i) => (
                                            <li key={i} className="text-xs text-gray-600 flex items-start gap-2">
                                                <span className="text-emerald-500 mt-0.5">•</span>
                                                {ind.indicador.nombre}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <p className="text-center text-xs text-gray-400">
                                    {currentChapter.indicadores.length} indicador{currentChapter.indicadores.length !== 1 ? 'es' : ''} en este capítulo
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Indicadores de página */}
                    <div className="flex justify-center gap-1.5 pb-4">
                        {Array.from({ length: totalPages }).map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => setCurrentPage(idx)}
                                aria-label={`Ir a página ${idx + 1}`}
                                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                                    idx === currentPage 
                                        ? 'bg-[#880D1E] w-6' 
                                        : 'bg-gray-300 hover:bg-gray-400'
                                }`}
                            />
                        ))}
                    </div>

                    <DialogFooter className="p-6 pt-2 border-t border-gray-100 bg-white">
                        <div className="flex w-full gap-3">
                            {/* Botón Anterior */}
                            {!isFirstPage && (
                                <Button
                                    variant="outline"
                                    onClick={handlePrev}
                                    className="flex-1 h-11 text-sm font-medium border-gray-200 hover:bg-gray-50"
                                >
                                    <ChevronLeft className="w-4 h-4 mr-1" />
                                    Anterior
                                </Button>
                            )}

                            {/* Botón Siguiente o Continuar */}
                            {isLastPage ? (
                                <Button
                                    onClick={handleClose}
                                    className="flex-1 bg-[#880D1E] hover:bg-[#6a0a17] text-white h-11 text-sm font-medium shadow-lg hover:shadow-xl transition-all duration-300 group"
                                >
                                    Continuar con la autoevaluación
                                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            ) : (
                                <Button
                                    onClick={handleNext}
                                    className="flex-1 bg-[#880D1E] hover:bg-[#6a0a17] text-white h-11 text-sm font-medium shadow-lg hover:shadow-xl transition-all duration-300 group"
                                >
                                    Siguiente
                                    <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            )}
                        </div>
                    </DialogFooter>
                </div>
            </DialogContent >
        </Dialog >
    )
}
