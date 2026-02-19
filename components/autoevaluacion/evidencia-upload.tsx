"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Upload, FileText, X, CheckCircle2, AlertCircle, Loader2, Trash2, AlertTriangle, Download } from "lucide-react"
import { subirEvidencia, eliminarEvidencia, guardarRespuestaIndividual, descargarEvidencia, MAX_EVIDENCE_FILE_SIZE } from "@/lib/api/autoevaluacion"

type EvidenciaStatus = "idle" | "uploading" | "success" | "error" | "has-file"

interface EvidenciaUploadProps {
    idAutoevaluacion: string
    idIndicador: number
    /** ID de la respuesta guardada en el backend (requerido para subir evidencia) */
    idRespuesta: number | null
    /** ID del nivel de respuesta seleccionado actualmente (para re-POST si falta idRespuesta) */
    idNivelRespuesta: number | null
    /** Nombre de archivo ya cargado previamente (si existe) */
    archivoExistente?: string | null
    /** Callback cuando se sube o elimina exitosamente */
    onEvidenciaChange?: (idIndicador: number, nombreArchivo: string | null) => void
    /** Callback para actualizar el id_respuesta resuelto */
    onIdRespuestaResolved?: (idIndicador: number, idRespuesta: number) => void
}

export function EvidenciaUpload({
    idAutoevaluacion,
    idIndicador,
    idRespuesta,
    idNivelRespuesta,
    archivoExistente = null,
    onEvidenciaChange,
    onIdRespuestaResolved,
}: EvidenciaUploadProps) {
    const [status, setStatus] = useState<EvidenciaStatus>(archivoExistente ? "has-file" : "idle")
    const [nombreArchivo, setNombreArchivo] = useState<string | null>(archivoExistente)
    const [errorMessage, setErrorMessage] = useState<string | null>(null)
    const [isDeleting, setIsDeleting] = useState(false)
    const [resolvedIdRespuesta, setResolvedIdRespuesta] = useState<number | null>(idRespuesta)
    const [progress, setProgress] = useState(0)
    const [showConfirmDialog, setShowConfirmDialog] = useState(false)
    const [showDeleteDialog, setShowDeleteDialog] = useState(false)
    const [pendingFile, setPendingFile] = useState<File | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const progressIntervalRef = useRef<NodeJS.Timeout | null>(null)

    // Limpieza del intervalo al desmontar
    useEffect(() => {
        return () => {
            if (progressIntervalRef.current) {
                clearInterval(progressIntervalRef.current)
            }
        }
    }, [])

    /**
     * Inicia la barra de progreso de 10 segundos.
     * Incrementa de 0 a 90% durante 10s, el 100% se alcanza al completar la subida.
     */
    const startProgressBar = useCallback(() => {
        setProgress(0)
        if (progressIntervalRef.current) {
            clearInterval(progressIntervalRef.current)
        }
        const totalDuration = 10000 // 10 segundos
        const intervalMs = 100 // actualizar cada 100ms
        const maxProgress = 90 // llegar hasta 90%, el 100% es al completar
        const increment = (maxProgress / totalDuration) * intervalMs

        progressIntervalRef.current = setInterval(() => {
            setProgress(prev => {
                const next = prev + increment
                if (next >= maxProgress) {
                    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current)
                    return maxProgress
                }
                return next
            })
        }, intervalMs)
    }, [])

    const stopProgressBar = useCallback((final: number = 100) => {
        if (progressIntervalRef.current) {
            clearInterval(progressIntervalRef.current)
            progressIntervalRef.current = null
        }
        setProgress(final)
    }, [])

    // Sincronizar prop idRespuesta con estado local
    useEffect(() => {
        if (idRespuesta != null) {
            setResolvedIdRespuesta(idRespuesta)
        }
    }, [idRespuesta])

    // Sincronizar archivo existente con estado local
    useEffect(() => {
        if (archivoExistente) {
            console.log(`📁 Inicializando archivo existente para indicador ${idIndicador}:`, archivoExistente)
            setNombreArchivo(archivoExistente)
            setStatus("has-file")
            setErrorMessage(null) // Limpiar cualquier error previo
        } else if (archivoExistente === null && nombreArchivo !== null) {
            // Si archivoExistente cambió a null, resetear el componente
            console.log(`🗑️ Reseteando evidencia para indicador ${idIndicador}`)
            setNombreArchivo(null)
            setStatus("idle")
            setErrorMessage(null)
        }
    }, [archivoExistente, idIndicador, nombreArchivo])

    /**
     * Resuelve el id_respuesta re-enviando un POST con la respuesta actual.
     * El backend es idempotente: si la respuesta ya existe, devuelve la misma con su ID.
     */
    const resolveIdRespuesta = useCallback(async (): Promise<number | null> => {
        // Si ya lo tenemos, usar directamente
        if (resolvedIdRespuesta != null) return resolvedIdRespuesta
        if (idRespuesta != null) return idRespuesta

        // Si no tenemos idNivelRespuesta, no podemos re-enviar
        if (idNivelRespuesta == null) {
            console.warn(`No hay idNivelRespuesta para indicador ${idIndicador}, no se puede resolver id_respuesta`)
            return null
        }

        console.log(`Resolviendo id_respuesta para indicador ${idIndicador} via POST individual...`)

        try {
            const result = await guardarRespuestaIndividual(idAutoevaluacion, idIndicador, idNivelRespuesta)

            if (result?.id_respuesta != null) {
                console.log(`Resuelto id_respuesta=${result.id_respuesta} para indicador ${idIndicador}`)
                setResolvedIdRespuesta(result.id_respuesta)
                onIdRespuestaResolved?.(idIndicador, result.id_respuesta)
                return result.id_respuesta
            }
        } catch (error) {
            console.warn('Error resolviendo id_respuesta via POST:', error)
        }

        return null
    }, [idAutoevaluacion, idIndicador, idNivelRespuesta, idRespuesta, resolvedIdRespuesta, onIdRespuestaResolved])

    const resetError = useCallback(() => {
        setErrorMessage(null)
        setStatus(nombreArchivo ? "has-file" : "idle")
    }, [nombreArchivo])

    const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        // Reset input para permitir re-selección del mismo archivo
        if (fileInputRef.current) {
            fileInputRef.current.value = ""
        }

        // Validar tipo
        if (file.type !== "application/pdf") {
            setStatus("error")
            setErrorMessage("Solo se permiten archivos en formato PDF")
            return
        }

        // Validar tamaño (2 MB)
        if (file.size > MAX_EVIDENCE_FILE_SIZE) {
            const sizeMB = (file.size / (1024 * 1024)).toFixed(2)
            setStatus("error")
            setErrorMessage(`El archivo excede el límite de 2 MB (${sizeMB} MB)`)
            return
        }

        // Mostrar diálogo de confirmación
        setPendingFile(file)
        setShowConfirmDialog(true)
    }, [])

    const handleConfirmUpload = useCallback(async () => {
        if (!pendingFile) return

        // Cerrar diálogo y comenzar subida
        setShowConfirmDialog(false)
        setStatus("uploading")
        setErrorMessage(null)
        startProgressBar()

        // Resolver id_respuesta si no está disponible
        const effectiveIdRespuesta = await resolveIdRespuesta()

        if (!effectiveIdRespuesta) {
            stopProgressBar(0)
            setStatus("error")
            setErrorMessage("No se pudo obtener el ID de la respuesta. Intenta de nuevo en unos segundos.")
            setPendingFile(null)
            return
        }

        // Subir archivo
        try {
            console.log(`📤 Subiendo evidencia para indicador ${idIndicador}, respuesta ${effectiveIdRespuesta}`)
            const response = await subirEvidencia(idAutoevaluacion, effectiveIdRespuesta, pendingFile)
            stopProgressBar(100)
            
            // El backend puede devolver 'nombre_archivo' o 'nombre'
            const nombreArchivoSubido = response.evidencia?.nombre_archivo || response.evidencia?.nombre || pendingFile.name
            console.log(`✅ Evidencia subida exitosamente:`, nombreArchivoSubido)
            console.log(`📋 Respuesta del backend:`, response)
            
            setNombreArchivo(nombreArchivoSubido)
            setStatus("success")
            onEvidenciaChange?.(idIndicador, nombreArchivoSubido)
            setPendingFile(null)

            // Después de 2.5s, pasar a estado "has-file"
            setTimeout(() => {
                setStatus("has-file")
            }, 2500)
        } catch (error) {
            console.error(`❌ Error al subir evidencia para indicador ${idIndicador}:`, error)
            stopProgressBar(0)
            setStatus("error")
            
            // Extraer mensaje de error más específico
            let errorMsg = "Error al subir el archivo"
            if (error instanceof Error) {
                errorMsg = error.message
                // Si es error 500, dar más contexto
                if (errorMsg.includes("500") || errorMsg.includes("interno del servidor")) {
                    errorMsg = "Error del servidor. Verifica que el archivo sea un PDF válido y no exceda 2 MB. Si el problema persiste, contacta al administrador."
                }
            }
            
            setErrorMessage(errorMsg)
            setPendingFile(null)
        }
    }, [pendingFile, idAutoevaluacion, idIndicador, onEvidenciaChange, resolveIdRespuesta, startProgressBar, stopProgressBar])

    const handleCancelUpload = useCallback(() => {
        setShowConfirmDialog(false)
        setPendingFile(null)
        setStatus(nombreArchivo ? "has-file" : "idle")
    }, [nombreArchivo])

    const handleDeleteClick = useCallback(() => {
        setShowDeleteDialog(true)
    }, [])

    const handleConfirmDelete = useCallback(async () => {
        const effectiveId = resolvedIdRespuesta ?? idRespuesta
        if (!effectiveId) return
        
        setShowDeleteDialog(false)
        setIsDeleting(true)
        
        try {
            await eliminarEvidencia(idAutoevaluacion, effectiveId)
            setNombreArchivo(null)
            setStatus("idle")
            setErrorMessage(null)
            onEvidenciaChange?.(idIndicador, null)
        } catch (error) {
            setStatus("error")
            setErrorMessage(error instanceof Error ? error.message : "Error al eliminar la evidencia")
        } finally {
            setIsDeleting(false)
        }
    }, [idAutoevaluacion, idRespuesta, resolvedIdRespuesta, idIndicador, onEvidenciaChange])

    const handleCancelDelete = useCallback(() => {
        setShowDeleteDialog(false)
    }, [])

    const handleDownload = useCallback(async () => {
        const effectiveId = resolvedIdRespuesta ?? idRespuesta
        if (!effectiveId) return
        
        try {
            await descargarEvidencia(idAutoevaluacion, effectiveId)
        } catch (error) {
            setStatus("error")
            setErrorMessage(error instanceof Error ? error.message : "Error al descargar la evidencia")
        }
    }, [idAutoevaluacion, idRespuesta, resolvedIdRespuesta])

    const handleClickUpload = () => {
        fileInputRef.current?.click()
    }

    return (
        <div className="mt-3 pt-3 border-t border-dashed border-muted-foreground/20">
            <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,application/pdf"
                onChange={handleFileSelect}
                className="hidden"
                aria-label={`Subir evidencia PDF para indicador ${idIndicador}`}
            />

            {/* Estado: Idle - Sin archivo */}
            {status === "idle" && (
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleClickUpload}
                    className="gap-2 text-muted-foreground hover:text-primary hover:border-primary transition-colors border-[#880D1E]"
                >
                    <Upload className="h-4 w-4" />
                    Adjuntar evidencia (PDF)
                </Button>
            )}

            {/* Estado: Subiendo con barra de progreso */}
            {status === "uploading" && (
                <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                            <Loader2 className="h-4 w-4 text-blue-600 dark:text-blue-400 animate-spin" />
                            <span className="text-sm text-blue-700 dark:text-blue-300 font-medium">
                                {progress < 30 ? "Procesando..." : progress < 70 ? "Subiendo archivo..." : "Finalizando..."}
                            </span>
                        </div>
                        <span className="text-xs text-blue-500 dark:text-blue-400 font-mono tabular-nums">
                            {Math.round(progress)}%
                        </span>
                    </div>
                    <div className="w-full h-2 bg-blue-100 dark:bg-blue-950/50 rounded-full overflow-hidden border border-blue-200 dark:border-blue-800">
                        <div
                            className="h-full bg-blue-500 dark:bg-blue-400 rounded-full transition-all duration-150 ease-linear"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>
            )}

            {/* Estado: Éxito - Recién subido */}
            {status === "success" && (
                <div className="flex items-center gap-2 px-3 py-2 rounded-md bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 transition-all duration-300">
                    <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                    <span className="text-sm text-green-700 dark:text-green-300 font-medium">
                        Evidencia cargada exitosamente
                    </span>
                </div>
            )}

            {/* Estado: Archivo existente */}
            {status === "has-file" && nombreArchivo && (
                <div className="flex items-center justify-between gap-2 px-3 py-2 rounded-md bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800">
                    <div className="flex items-center gap-2 min-w-0">
                        <FileText className="h-4 w-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                        <span className="text-sm text-emerald-700 dark:text-emerald-300 truncate" title={nombreArchivo}>
                            {nombreArchivo}
                        </span>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={handleDownload}
                            className="h-7 px-2 text-muted-foreground hover:text-emerald-600 dark:hover:text-emerald-400"
                            title="Descargar evidencia"
                        >
                            <Download className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={handleClickUpload}
                            className="h-7 px-2 text-muted-foreground hover:text-primary"
                            title="Reemplazar archivo"
                        >
                            <Upload className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={handleDeleteClick}
                            disabled={isDeleting}
                            className="h-7 px-2 text-muted-foreground hover:text-red-600 dark:hover:text-red-400"
                            title="Eliminar evidencia"
                        >
                            {isDeleting ? (
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : (
                                <Trash2 className="h-3.5 w-3.5" />
                            )}
                        </Button>
                    </div>
                </div>
            )}

            {/* Estado: Error */}
            {status === "error" && errorMessage && (
                <div className="space-y-2">
                    <div className="flex items-start gap-2 px-3 py-2 rounded-md bg-red-50 dark:bg-red-950/30 border border-red-300 dark:border-red-800">
                        <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                            <p className="text-sm text-red-700 dark:text-red-300 font-medium">
                                {errorMessage}
                            </p>
                            {errorMessage.includes("500") && (
                                <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                                    Este es un problema del servidor. Puedes intentar de nuevo o contactar soporte si persiste.
                                </p>
                            )}
                        </div>
                        <button
                            type="button"
                            onClick={resetError}
                            className="ml-auto text-red-400 hover:text-red-600 dark:text-red-500 dark:hover:text-red-300 flex-shrink-0"
                            aria-label="Cerrar error"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleClickUpload}
                        className="gap-2 text-muted-foreground hover:text-primary hover:border-primary border-red-200 dark:border-red-800"
                    >
                        <Upload className="h-4 w-4" />
                        Intentar de nuevo
                    </Button>
                </div>
            )}

            {/* Información de ayuda */}
            {(status === "idle" || status === "error") && (
                <p className="text-xs text-muted-foreground mt-1.5">
                    Formato: PDF · Tamaño máximo: 2 MB
                </p>
            )}

            {/* Diálogo de confirmación de subida */}
            <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30">
                                <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-500" />
                            </div>
                            <DialogTitle className="text-lg">Confirmar subida de evidencia</DialogTitle>
                        </div>
                        <DialogDescription className="text-base pt-2">
                            ¿Estás seguro de que deseas subir este archivo como evidencia?
                        </DialogDescription>
                    </DialogHeader>
                    
                    {pendingFile && (
                        <div className="py-3 px-4 rounded-md bg-muted/50 border border-muted-foreground/20">
                            <div className="flex items-center gap-2">
                                <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium truncate" title={pendingFile.name}>
                                        {pendingFile.name}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        {(pendingFile.size / 1024).toFixed(1)} KB
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleCancelUpload}
                        >
                            No, cancelar
                        </Button>
                        <Button
                            type="button"
                            onClick={handleConfirmUpload}
                        >
                            Sí, subir archivo
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Diálogo de confirmación de eliminación */}
            <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
                                <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-500" />
                            </div>
                            <DialogTitle className="text-lg">Confirmar eliminación</DialogTitle>
                        </div>
                        <DialogDescription className="text-base pt-2">
                            ¿Estás seguro de que deseas eliminar esta evidencia?
                        </DialogDescription>
                    </DialogHeader>
                    
                    {nombreArchivo && (
                        <div className="py-3 px-4 rounded-md bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800">
                            <div className="flex items-center gap-2">
                                <Trash2 className="h-4 w-4 text-red-600 dark:text-red-400 flex-shrink-0" />
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-red-700 dark:text-red-300 truncate" title={nombreArchivo}>
                                        {nombreArchivo}
                                    </p>
                                    <p className="text-xs text-red-600 dark:text-red-400">
                                        Esta acción no se puede deshacer
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleCancelDelete}
                        >
                            No, cancelar
                        </Button>
                        <Button
                            type="button"
                            onClick={handleConfirmDelete}
                            className="bg-red-600 hover:bg-red-700 text-white dark:bg-red-700 dark:hover:bg-red-800"
                        >
                            Sí, eliminar evidencia
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
