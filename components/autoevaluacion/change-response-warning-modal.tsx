"use client"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { AlertTriangle, FileX, ArrowRightLeft } from "lucide-react"

interface ChangeResponseWarningModalProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: () => void
    nombreArchivo: string
    isProcessing?: boolean
}

export function ChangeResponseWarningModal({
    isOpen,
    onClose,
    onConfirm,
    nombreArchivo,
    isProcessing = false
}: ChangeResponseWarningModalProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-md p-0 gap-0 bg-white border-0 shadow-2xl rounded-xl overflow-hidden">
                <div className="relative">
                    {/* Header con gradiente de advertencia */}
                    <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 border-b-2 border-amber-200">
                        <div className="px-6 pt-6 pb-4">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 border-2 border-amber-300">
                                    <AlertTriangle className="h-6 w-6 text-amber-600" />
                                </div>
                                <div>
                                    <DialogTitle className="text-xl font-bold text-gray-900">
                                        ¿Cambiar respuesta?
                                    </DialogTitle>
                                    <p className="text-sm text-amber-700 font-medium mt-0.5">
                                        Esta acción eliminará la evidencia cargada
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contenido principal */}
                    <div className="px-6 py-5 space-y-4">
                        {/* Mensaje principal */}
                        <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-lg">
                            <p className="text-sm text-gray-700 leading-relaxed">
                                Este indicador tiene una <span className="font-semibold text-amber-900">evidencia asociada</span>. 
                                Al cambiar la respuesta seleccionada, la evidencia será <span className="font-semibold text-red-700">eliminada permanentemente</span>.
                            </p>
                        </div>

                        {/* Archivo que será eliminado */}
                        <div className="flex items-start gap-3 p-4 bg-red-50 rounded-lg border border-red-200">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 shrink-0">
                                <FileX className="h-5 w-5 text-red-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-semibold text-red-900 uppercase tracking-wide mb-1">
                                    Evidencia a eliminar
                                </p>
                                <p className="text-sm text-red-800 font-medium truncate" title={nombreArchivo}>
                                    {nombreArchivo}
                                </p>
                            </div>
                        </div>

                        {/* Información adicional */}
                        <div className="flex items-start gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                            <ArrowRightLeft className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                            <div>
                                <p className="text-xs text-blue-800 leading-relaxed">
                                    <span className="font-semibold">Importante:</span> Después de cambiar la respuesta, 
                                    podrás cargar una nueva evidencia si lo deseas.
                                </p>
                            </div>
                        </div>

                        {/* Pregunta de confirmación */}
                        <div className="text-center pt-2">
                            <p className="text-sm font-semibold text-gray-700">
                                ¿Deseas continuar con el cambio de respuesta?
                            </p>
                        </div>
                    </div>

                    {/* Footer con botones */}
                    <DialogFooter className="px-6 py-4 bg-gray-50 border-t flex flex-col sm:flex-row gap-3">
                        <Button
                            variant="outline"
                            onClick={onClose}
                            disabled={isProcessing}
                            className="flex-1 order-2 sm:order-1 border-gray-300 bg-white hover:bg-gray-100 text-gray-700 hover:text-gray-900 h-11 font-medium"
                        >
                            Cancelar
                        </Button>
                        <Button
                            onClick={onConfirm}
                            disabled={isProcessing}
                            className="flex-1 order-1 sm:order-2 bg-amber-600 hover:bg-amber-700 text-white h-11 font-medium shadow-lg hover:shadow-xl transition-all duration-300"
                        >
                            {isProcessing ? "Procesando..." : "Sí, Cambiar Respuesta"}
                        </Button>
                    </DialogFooter>
                </div>
            </DialogContent>
        </Dialog>
    )
}
