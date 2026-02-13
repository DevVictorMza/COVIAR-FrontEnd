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
import { AlertTriangle, Lock, FileX, CheckCircle2 } from "lucide-react"

interface FinalizeConfirmationModalProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: () => void
    isProcessing?: boolean
}

export function FinalizeConfirmationModal({
    isOpen,
    onClose,
    onConfirm,
    isProcessing = false
}: FinalizeConfirmationModalProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-lg p-0 gap-0 bg-white border-0 shadow-2xl rounded-xl overflow-hidden">
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
                                        ¿Finalizar Autoevaluación?
                                    </DialogTitle>
                                    <p className="text-sm text-amber-700 font-medium mt-0.5">
                                        Esta acción no se puede deshacer
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
                                Al completar la autoevaluación, <span className="font-semibold text-amber-900">no podrás realizar las siguientes acciones:</span>
                            </p>
                        </div>

                        {/* Lista de restricciones */}
                        <div className="space-y-3">
                            {/* Restricción 1 - Cargar evidencias */}
                            <div className="flex items-start gap-3 p-3 bg-red-50 rounded-lg border border-red-200">
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100 shrink-0 mt-0.5">
                                    <FileX className="h-4 w-4 text-red-600" />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-red-900">
                                        Cargar evidencias
                                    </p>
                                    <p className="text-xs text-red-700 mt-0.5">
                                        No podrás subir archivos de evidencia a ningún indicador
                                    </p>
                                </div>
                            </div>

                            {/* Restricción 2 - Modificar respuestas */}
                            <div className="flex items-start gap-3 p-3 bg-red-50 rounded-lg border border-red-200">
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100 shrink-0 mt-0.5">
                                    <Lock className="h-4 w-4 text-red-600" />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-red-900">
                                        Modificar respuestas
                                    </p>
                                    <p className="text-xs text-red-700 mt-0.5">
                                        No podrás cambiar las respuestas seleccionadas
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Mensaje de confirmación positivo */}
                        <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-start gap-2">
                            <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                            <div>
                                <p className="text-xs text-green-800 leading-relaxed">
                                    <span className="font-semibold">Si estás seguro de tus respuestas</span>, puedes proceder a finalizar. 
                                    Se generará tu resultado y podrás consultarlo en el historial.
                                </p>
                            </div>
                        </div>

                        {/* Pregunta de confirmación */}
                        <div className="text-center pt-2">
                            <p className="text-sm font-semibold text-gray-700">
                                ¿Deseas continuar y finalizar la autoevaluación?
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
                            className="flex-1 order-1 sm:order-2 bg-coviar-borravino hover:bg-coviar-borravino-dark text-white h-11 font-medium shadow-lg hover:shadow-xl transition-all duration-300"
                        >
                            {isProcessing ? "Finalizando..." : "Sí, Finalizar Autoevaluación"}
                        </Button>
                    </DialogFooter>
                </div>
            </DialogContent>
        </Dialog>
    )
}
