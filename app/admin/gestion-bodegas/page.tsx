"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { AlertCircle, Search, Building2, Filter, ChevronLeft, ChevronRight, Loader2, KeyRound, Eye, EyeOff, Info } from "lucide-react"

interface Bodega {
  id_bodega: number
  razon_social: string
  nombre_fantasia: string
  cuit: string
  inv_bod: string | null
  inv_vin: string | null
  telefono: string
  calle: string
  numeracion: string
  email_institucional: string
  fecha_registro: string
  segmento: string | null
  nivel_sostenibilidad: string | null
  localidad: string | null
  departamento: string | null
  provincia: string | null
  email_cuenta: string | null
  fecha_ultima_evaluacion: string | null
  responsable_activo: string | null
}

export default function GestionBodegasPage() {
  const [bodegas, setBodegas] = useState<Bodega[]>([])
  const [filteredBodegas, setFilteredBodegas] = useState<Bodega[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(25)

  // Dialog de cambio de contraseña
  const [dialogOpen, setDialogOpen] = useState(false)
  const [bodegaSeleccionada, setBodegaSeleccionada] = useState<Bodega | null>(null)
  const [nuevaPassword, setNuevaPassword] = useState("")
  const [confirmarPassword, setConfirmarPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [passwordError, setPasswordError] = useState<string | null>(null)
  const [cambiandoPassword, setCambiandoPassword] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  // Dialog de más información
  const [dialogInfoOpen, setDialogInfoOpen] = useState(false)
  const [bodegaInfo, setBodegaInfo] = useState<Bodega | null>(null)

  useEffect(() => {
    fetchBodegas()
  }, [])

  useEffect(() => {
    if (searchTerm === "") {
      setFilteredBodegas(bodegas)
    } else {
      const filtered = bodegas.filter(bodega =>
        bodega.nombre_fantasia.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bodega.razon_social.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bodega.cuit.includes(searchTerm) ||
        bodega.email_institucional.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredBodegas(filtered)
    }
    setCurrentPage(1)
  }, [searchTerm, bodegas])

  const fetchBodegas = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await fetch("/api/bodegas", { credentials: "include" })
      if (!response.ok) throw new Error("Error al cargar bodegas")
      const data: Bodega[] = await response.json()
      setBodegas(data)
      setFilteredBodegas(data)
      setCurrentPage(1)
    } catch (err) {
      console.error("Error al cargar bodegas:", err)
      setError(err instanceof Error ? err.message : "Error al cargar bodegas")
    } finally {
      setIsLoading(false)
    }
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "-"
    return new Date(dateString).toLocaleDateString("es-AR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
  }

  const handleAbrirDialog = (bodega: Bodega) => {
    setBodegaSeleccionada(bodega)
    setNuevaPassword("")
    setConfirmarPassword("")
    setPasswordError(null)
    setSuccessMessage(null)
    setShowPassword(false)
    setDialogOpen(true)
  }

  const handleCerrarDialog = () => {
    if (cambiandoPassword) return
    setDialogOpen(false)
    setBodegaSeleccionada(null)
    setNuevaPassword("")
    setConfirmarPassword("")
    setPasswordError(null)
    setSuccessMessage(null)
  }

  const handleCambiarPassword = async () => {
    setPasswordError(null)

    if (nuevaPassword.length < 8) {
      setPasswordError("La contraseña debe tener al menos 8 caracteres")
      return
    }
    if (nuevaPassword !== confirmarPassword) {
      setPasswordError("Las contraseñas no coinciden")
      return
    }

    if (!bodegaSeleccionada) return

    try {
      setCambiandoPassword(true)
      const response = await fetch(`/api/bodegas/${bodegaSeleccionada.id_bodega}/cambiar-password`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nueva_password: nuevaPassword }),
      })

      const data = await response.json()

      if (!response.ok) {
        setPasswordError(data.message || "Error al cambiar la contraseña")
        return
      }

      setSuccessMessage("Contraseña actualizada correctamente")
      setNuevaPassword("")
      setConfirmarPassword("")
    } catch (err) {
      console.error("Error al cambiar contraseña:", err)
      setPasswordError("Error al conectar con el servidor")
    } finally {
      setCambiandoPassword(false)
    }
  }

  //handle para abrir dialog de más información
  const handleAbrirInfo = (bodega: Bodega) => {
  setBodegaInfo(bodega)
  setDialogInfoOpen(true)
  }

  const totalPages = Math.ceil(filteredBodegas.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentBodegas = filteredBodegas.slice(startIndex, endIndex)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(Number(value))
    setCurrentPage(1)
  }

  return (
    <div className="p-8 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Gestión de Bodegas</h1>
          <p className="text-muted-foreground">
            Administra y supervisa todas las bodegas registradas en el sistema
          </p>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Filtros */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            <CardTitle>Filtros</CardTitle>
          </div>
          <CardDescription>Busca bodegas por nombre, razón social, CUIT o email</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">Buscar</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por bodega, razón social, CUIT o email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="w-full md:w-48">
              <label className="text-sm font-medium mb-2 block">Mostrar</label>
              <Select value={itemsPerPage.toString()} onValueChange={handleItemsPerPageChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="25">25 registros</SelectItem>
                  <SelectItem value="50">50 registros</SelectItem>
                  <SelectItem value="100">100 registros</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
            <Building2 className="h-4 w-4" />
            <span>
              Mostrando {filteredBodegas.length === 0 ? 0 : startIndex + 1}-{Math.min(endIndex, filteredBodegas.length)} de {filteredBodegas.length} bodegas
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Tabla */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Bodegas</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map(i => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : filteredBodegas.length === 0 ? (
            <div className="text-center py-12">
              <Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No se encontraron bodegas</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-center">ID</TableHead>
                      <TableHead className="text-center">Nombre Fantasía</TableHead>
                      <TableHead className="text-center">CUIT</TableHead>
                      <TableHead className="text-center">Teléfono</TableHead>
                      <TableHead className="text-center">Nivel de Sostenibilidad</TableHead>
                      <TableHead className="text-center">Segmentación</TableHead>
                      <TableHead className="text-center">Acciones</TableHead>
                      <TableHead className="text-center">Mas información</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentBodegas.map((bodega) => (
                      <TableRow key={bodega.id_bodega} className="text-xs">
                        <TableCell className="text-center font-medium py-2 px-2">{bodega.id_bodega}</TableCell>
                        <TableCell className="text-center py-2 px-2">{bodega.nombre_fantasia}</TableCell>
                        <TableCell className="text-center py-2 px-2">{bodega.cuit}</TableCell>
                        <TableCell className="text-center py-2 px-2">{bodega.telefono || "-"}</TableCell>
                        <TableCell className="text-center py-2 px-2">
                          {bodega.nivel_sostenibilidad ?? (
                            <span className="text-muted-foreground italic">Sin evaluación</span>
                          )}
                        </TableCell>
                        <TableCell className="text-center py-2 px-2">
                          {bodega.segmento ?? (
                            <span className="text-muted-foreground italic">Sin evaluación</span>
                          )}
                        </TableCell>
                        <TableCell className="text-center py-2 px-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleAbrirDialog(bodega)}
                            className="gap-1 h-7 px-2 text-xs"
                          >
                            <KeyRound className="h-3 w-3" />
                            Cambiar contraseña
                          </Button>
                        </TableCell>
                        <TableCell className="text-center py-2 px-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleAbrirInfo(bodega)}
                            className="h-7 px-2 text-xs"
                          >
                            ...
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Paginación */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4 pt-4 border-t">
                  <div className="text-sm text-muted-foreground">
                    Página {currentPage} de {totalPages}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4 mr-1" />
                      Anterior
                    </Button>

                    <div className="flex items-center gap-1">
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNumber: number
                        if (totalPages <= 5) {
                          pageNumber = i + 1
                        } else if (currentPage <= 3) {
                          pageNumber = i + 1
                        } else if (currentPage >= totalPages - 2) {
                          pageNumber = totalPages - 4 + i
                        } else {
                          pageNumber = currentPage - 2 + i
                        }
                        return (
                          <Button
                            key={pageNumber}
                            variant={currentPage === pageNumber ? "default" : "outline"}
                            size="sm"
                            onClick={() => handlePageChange(pageNumber)}
                            className="w-9 h-9 p-0"
                          >
                            {pageNumber}
                          </Button>
                        )
                      })}
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      Siguiente
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Dialog cambio de contraseña */}
      <Dialog open={dialogOpen} onOpenChange={(open) => { if (!open) handleCerrarDialog() }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Cambiar contraseña</DialogTitle>
            {bodegaSeleccionada && (
              <p className="text-sm text-muted-foreground">
                {bodegaSeleccionada.nombre_fantasia} — {bodegaSeleccionada.email_institucional}
              </p>
            )}
          </DialogHeader>

          <div className="space-y-4 py-2">
            {successMessage ? (
              <div className="rounded-md bg-green-50 border border-green-200 px-4 py-3 text-green-800 text-sm">
                {successMessage}
              </div>
            ) : (
              <>
                <div className="space-y-2">
                  <Label htmlFor="nueva-password">Nueva contraseña</Label>
                  <div className="relative">
                    <Input
                      id="nueva-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Mínimo 6 caracteres"
                      value={nuevaPassword}
                      onChange={(e) => setNuevaPassword(e.target.value)}
                      disabled={cambiandoPassword}
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmar-password">Confirmar contraseña</Label>
                  <Input
                    id="confirmar-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Repite la contraseña"
                    value={confirmarPassword}
                    onChange={(e) => setConfirmarPassword(e.target.value)}
                    disabled={cambiandoPassword}
                    onKeyDown={(e) => { if (e.key === "Enter") handleCambiarPassword() }}
                  />
                </div>

                {passwordError && (
                  <p className="text-sm text-destructive">{passwordError}</p>
                )}
              </>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleCerrarDialog} disabled={cambiandoPassword}>
              {successMessage ? "Cerrar" : "Cancelar"}
            </Button>
            {!successMessage && (
              <Button onClick={handleCambiarPassword} disabled={cambiandoPassword}>
                {cambiandoPassword ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  "Guardar contraseña"
                )}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog más información */}
      <Dialog open={dialogInfoOpen} onOpenChange={setDialogInfoOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Información de la Bodega</DialogTitle>
            {bodegaInfo && (
              <p className="text-sm text-muted-foreground">
                {bodegaInfo.nombre_fantasia}
              </p>
            )}
          </DialogHeader>

          {bodegaInfo && (
            <div className="space-y-3 py-2">
              <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
                <div>
                  <p className="text-muted-foreground font-medium">Razón Social</p>
                  <p>{bodegaInfo.razon_social || "-"}</p>
                </div>
                <div>
                  <p className="text-muted-foreground font-medium">INV Bodega</p>
                  <p>{bodegaInfo.inv_bod || "-"}</p>
                </div>
                <div>
                  <p className="text-muted-foreground font-medium">INV Viñedo</p>
                  <p>{bodegaInfo.inv_vin || "-"}</p>
                </div>
                <div>
                  <p className="text-muted-foreground font-medium">Provincia</p>
                  <p>{bodegaInfo.provincia || "-"}</p>
                </div>
                <div>
                  <p className="text-muted-foreground font-medium">Departamento</p>
                  <p>{bodegaInfo.departamento || "-"}</p>
                </div>
                <div>
                  <p className="text-muted-foreground font-medium">Localidad</p>
                  <p>{bodegaInfo.localidad || "-"}</p>
                </div>
                <div>
                  <p className="text-muted-foreground font-medium">Dirección</p>
                  <p>{bodegaInfo.calle ? `${bodegaInfo.calle} ${bodegaInfo.numeracion}` : "-"}</p>
                </div>
                <div>
                  <p className="text-muted-foreground font-medium">Responsable Activo</p>
                  <p>{bodegaInfo.responsable_activo || "-"}</p>
                </div>
                <div>
                  <p className="text-muted-foreground font-medium">Email Institucional</p>
                  <p className="break-all">{bodegaInfo.email_institucional || "-"}</p>
                </div>
                <div>
                  <p className="text-muted-foreground font-medium">Email de Cuenta</p>
                  <p className="break-all">{bodegaInfo.email_cuenta || "-"}</p>
                </div>
                <div>
                  <p className="text-muted-foreground font-medium">Fecha de Registro</p>
                  <p>{formatDate(bodegaInfo.fecha_registro)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground font-medium">Fecha Última Evaluación</p>
                  <p>{formatDate(bodegaInfo.fecha_ultima_evaluacion)}</p>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogInfoOpen(false)}>
              Cerrar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  )
}
