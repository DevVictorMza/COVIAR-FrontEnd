"use client"

import { useState, useEffect } from "react"
import { solicitarRestablecimientoPassword } from "@/lib/api/auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, UserMinus, UserPlus, AlertTriangle, Key } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface Bodega {
  id_bodega: number
  razon_social: string
  nombre_fantasia: string
  cuit: string
  inv_bod: string | null
  inv_vin: string | null
  calle: string
  numeracion: string
  id_localidad: number
  telefono: string
  email_institucional: string
}

interface Responsable {
  id_responsable: number
  id_cuenta: number
  nombre: string
  apellido: string
  cargo: string
  dni: string
  activo: boolean
}

interface CuentaConBodega {
  id_cuenta: number
  tipo: string
  email_login: string
  fecha_registro: string
  bodega?: Bodega
}

interface FormData {
  admin_first_name: string
  admin_last_name: string
  admin_dni: string
  admin_role: string
  nombre_fantasia: string
  mail_institucional: string
  razon_social: string
  cuit: string
  bodega_inv: string
  vinedo_inv: string
  telefono: string
  calle: string
  numeracion: string
  id_localidad: number
}

interface NuevoResponsableForm {
  nombre: string
  apellido: string
  cargo: string
  dni: string
}

export default function ConfiguracionPage() {
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  // IDs para las actualizaciones
  const [cuentaId, setCuentaId] = useState<number | null>(null)
  const [bodegaId, setBodegaId] = useState<number | null>(null)
  const [responsableId, setResponsableId] = useState<number | null>(null)
  const [responsableActivo, setResponsableActivo] = useState<boolean>(true)

  // Datos originales para poder cancelar
  const [originalData, setOriginalData] = useState<FormData | null>(null)

  // Modal de dar de baja
  const [showBajaModal, setShowBajaModal] = useState(false)
  const [isProcessingBaja, setIsProcessingBaja] = useState(false)

  // Modal de nuevo responsable
  const [showNuevoModal, setShowNuevoModal] = useState(false)
  const [isCreatingResponsable, setIsCreatingResponsable] = useState(false)
  const [nuevoResponsable, setNuevoResponsable] = useState<NuevoResponsableForm>({
    nombre: "",
    apellido: "",
    cargo: "",
    dni: ""
  })

  // Estado para cambio de contraseña
  const [isSendingPasswordReset, setIsSendingPasswordReset] = useState(false)

  const [formData, setFormData] = useState<FormData>({
    admin_first_name: "",
    admin_last_name: "",
    admin_dni: "",
    admin_role: "",
    nombre_fantasia: "",
    mail_institucional: "",
    razon_social: "",
    cuit: "",
    bodega_inv: "",
    vinedo_inv: "",
    telefono: "",
    calle: "",
    numeracion: "",
    id_localidad: 0
  })

  useEffect(() => {
    loadData()
  }, [])

  // Limpiar mensajes después de 5 segundos
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(null), 5000)
      return () => clearTimeout(timer)
    }
  }, [successMessage])

  const loadData = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const usuarioStr = localStorage.getItem('usuario')
      if (!usuarioStr) {
        setError("No se encontró información de sesión. Por favor, inicia sesión nuevamente.")
        setIsLoading(false)
        return
      }

      const usuario: CuentaConBodega = JSON.parse(usuarioStr)
      setCuentaId(usuario.id_cuenta)

      const cuentaResponse = await fetch(`/api/cuentas/${usuario.id_cuenta}`, {
        credentials: 'include'
      })

      if (!cuentaResponse.ok) {
        throw new Error("Error al obtener datos de la cuenta")
      }

      const cuentaData: CuentaConBodega = await cuentaResponse.json()

      const responsablesResponse = await fetch(`/api/cuentas/${usuario.id_cuenta}/responsables`, {
        credentials: 'include'
      })

      let responsable: Responsable | null = null
      if (responsablesResponse.ok) {
        const responsables: Responsable[] = await responsablesResponse.json()
        responsable = responsables.find(r => r.activo) || null
      }

      const bodega = cuentaData.bodega

      if (bodega) {
        setBodegaId(bodega.id_bodega)
      }

      if (responsable) {
        setResponsableId(responsable.id_responsable)
        setResponsableActivo(responsable.activo)
      } else {
        setResponsableId(null)
        setResponsableActivo(false)
      }

      const newFormData: FormData = {
        admin_first_name: responsable?.nombre || "",
        admin_last_name: responsable?.apellido || "",
        admin_dni: responsable?.dni || "",
        admin_role: responsable?.cargo || "",
        nombre_fantasia: bodega?.nombre_fantasia || "",
        mail_institucional: bodega?.email_institucional || "",
        razon_social: bodega?.razon_social || "",
        cuit: bodega?.cuit || "",
        bodega_inv: bodega?.inv_bod || "",
        vinedo_inv: bodega?.inv_vin || "",
        telefono: bodega?.telefono || "",
        calle: bodega?.calle || "",
        numeracion: bodega?.numeracion || "",
        id_localidad: bodega?.id_localidad || 0
      }

      setFormData(newFormData)
      setOriginalData(newFormData)

    } catch (err) {
      console.error('Error cargando datos:', err)
      setError(err instanceof Error ? err.message : "Error al cargar los datos")
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleNuevoResponsableChange = (field: keyof NuevoResponsableForm, value: string) => {
    setNuevoResponsable(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSave = async () => {
    setIsSaving(true)
    setError(null)

    try {
      if (bodegaId) {
        const bodegaResponse = await fetch(`/api/bodegas/${bodegaId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            telefono: formData.telefono,
            email_institucional: formData.mail_institucional,
            nombre_fantasia: formData.nombre_fantasia
          })
        })

        if (!bodegaResponse.ok) {
          const errorData = await bodegaResponse.json()
          throw new Error(errorData.message || "Error al actualizar datos de la bodega")
        }
      }

      if (responsableId && responsableActivo) {
        const responsableResponse = await fetch(`/api/responsables/${responsableId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            nombre: formData.admin_first_name,
            apellido: formData.admin_last_name,
            cargo: formData.admin_role,
            dni: formData.admin_dni
          })
        })

        if (!responsableResponse.ok) {
          const errorData = await responsableResponse.json()
          throw new Error(errorData.message || "Error al actualizar datos del responsable")
        }
      }

      setOriginalData(formData)

      const usuarioStr = localStorage.getItem('usuario')
      if (usuarioStr) {
        const usuario = JSON.parse(usuarioStr)
        if (usuario.bodega) {
          usuario.bodega.nombre_fantasia = formData.nombre_fantasia
          usuario.bodega.telefono = formData.telefono
          usuario.bodega.email_institucional = formData.mail_institucional
          localStorage.setItem('usuario', JSON.stringify(usuario))
        }
      }

      setIsEditing(false)
      setSuccessMessage("Cambios guardados exitosamente")

    } catch (err) {
      console.error('Error guardando:', err)
      setError(err instanceof Error ? err.message : "Error al guardar los cambios")
    } finally {
      setIsSaving(false)
    }
  }

  const handleDarDeBaja = async () => {
    if (!responsableId) return

    setIsProcessingBaja(true)
    setError(null)

    try {
      const response = await fetch(`/api/responsables/${responsableId}/baja`, {
        method: 'POST',
        credentials: 'include'
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Error al dar de baja al responsable")
      }

      setShowBajaModal(false)
      setSuccessMessage("Responsable dado de baja exitosamente")

      // Recargar datos
      await loadData()

    } catch (err) {
      console.error('Error dando de baja:', err)
      setError(err instanceof Error ? err.message : "Error al dar de baja al responsable")
    } finally {
      setIsProcessingBaja(false)
    }
  }

  const handleCrearResponsable = async () => {
    if (!cuentaId) return

    // Validar campos
    if (!nuevoResponsable.nombre.trim() || !nuevoResponsable.apellido.trim() ||
        !nuevoResponsable.cargo.trim() || !nuevoResponsable.dni.trim()) {
      setError("Todos los campos son obligatorios")
      return
    }

    if (!/^\d{7,8}$/.test(nuevoResponsable.dni)) {
      setError("El DNI debe tener 7 u 8 dígitos")
      return
    }

    setIsCreatingResponsable(true)
    setError(null)

    try {
      const response = await fetch(`/api/cuentas/${cuentaId}/responsables`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(nuevoResponsable)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Error al crear el responsable")
      }

      setShowNuevoModal(false)
      setNuevoResponsable({ nombre: "", apellido: "", cargo: "", dni: "" })
      setSuccessMessage("Nuevo responsable creado exitosamente")

      // Recargar datos
      await loadData()

    } catch (err) {
      console.error('Error creando responsable:', err)
      setError(err instanceof Error ? err.message : "Error al crear el responsable")
    } finally {
      setIsCreatingResponsable(false)
    }
  }

  const handleCancel = () => {
    if (originalData) {
      setFormData(originalData)
    }
    setIsEditing(false)
    setError(null)
  }

  const handleCambiarContrasena = async () => {
    setIsSendingPasswordReset(true)
    setError(null)

    try {
      const usuarioStr = localStorage.getItem('usuario')
      if (!usuarioStr) {
        setError("No se encontró información de sesión")
        return
      }

      const usuario: CuentaConBodega = JSON.parse(usuarioStr)
      const email = usuario.email_login

      if (!email) {
        setError("No se encontró el email del usuario")
        return
      }

      await solicitarRestablecimientoPassword(email)
      setSuccessMessage("Se ha enviado un correo con instrucciones para cambiar tu contraseña")

    } catch (err) {
      console.error('Error solicitando cambio de contraseña:', err)
      setError(err instanceof Error ? err.message : "Error al solicitar cambio de contraseña")
    } finally {
      setIsSendingPasswordReset(false)
    }
  }

  if (isLoading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Cargando configuración...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Configuración</h1>
          <p className="text-muted-foreground">Administra tu cuenta y preferencias</p>
        </div>
        {!isEditing ? (
          <Button onClick={() => setIsEditing(true)}>
            Editar Información
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleCancel} disabled={isSaving}>
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Guardando...
                </>
              ) : (
                "Guardar Cambios"
              )}
            </Button>
          </div>
        )}
      </div>

      {error && (
        <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="bg-green-100 border border-green-500 text-green-700 px-4 py-3 rounded-md">
          {successMessage}
        </div>
      )}

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Información del Responsable</CardTitle>
            <CardDescription>
              {responsableActivo
                ? "Datos de la persona responsable de la cuenta"
                : "No hay un responsable activo asignado"}
            </CardDescription>
          </div>
          <div className="flex gap-2">
            {responsableActivo && responsableId && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowBajaModal(true)}
                disabled={isEditing}
                className="text-destructive hover:text-destructive"
              >
                <UserMinus className="h-4 w-4 mr-2" />
                Dar de Baja
              </Button>
            )}
            {!responsableActivo && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowNuevoModal(true)}
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Agregar Responsable
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {responsableActivo ? (
            <>
              <div>
                <Label htmlFor="admin_first_name">Nombre</Label>
                {isEditing ? (
                  <Input
                    id="admin_first_name"
                    value={formData.admin_first_name}
                    onChange={(e) => handleInputChange("admin_first_name", e.target.value)}
                    className="mt-2"
                  />
                ) : (
                  <p className="font-medium mt-2">{formData.admin_first_name || "-"}</p>
                )}
              </div>

              <div>
                <Label htmlFor="admin_last_name">Apellido</Label>
                {isEditing ? (
                  <Input
                    id="admin_last_name"
                    value={formData.admin_last_name}
                    onChange={(e) => handleInputChange("admin_last_name", e.target.value)}
                    className="mt-2"
                  />
                ) : (
                  <p className="font-medium mt-2">{formData.admin_last_name || "-"}</p>
                )}
              </div>

              <div>
                <Label htmlFor="admin_dni">DNI</Label>
                {isEditing ? (
                  <Input
                    id="admin_dni"
                    value={formData.admin_dni}
                    onChange={(e) => handleInputChange("admin_dni", e.target.value)}
                    className="mt-2"
                    maxLength={8}
                  />
                ) : (
                  <p className="font-medium mt-2">{formData.admin_dni || "-"}</p>
                )}
              </div>

              <div>
                <Label htmlFor="admin_role">Cargo</Label>
                {isEditing ? (
                  <Input
                    id="admin_role"
                    value={formData.admin_role}
                    onChange={(e) => handleInputChange("admin_role", e.target.value)}
                    className="mt-2"
                  />
                ) : (
                  <p className="font-medium mt-2">{formData.admin_role || "-"}</p>
                )}
              </div>
            </>
          ) : (
            <div className="md:col-span-2 text-center py-8 text-muted-foreground">
              <UserMinus className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No hay un responsable activo.</p>
              <p className="text-sm mt-2">Haz clic en "Agregar Responsable" para designar uno nuevo.</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Información de la Bodega/Viñedo</CardTitle>
          <CardDescription>Datos registrados de tu establecimiento</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="nombre_fantasia">Nombre de Fantasía</Label>
            {isEditing ? (
              <Input
                id="nombre_fantasia"
                value={formData.nombre_fantasia}
                onChange={(e) => handleInputChange("nombre_fantasia", e.target.value)}
                className="mt-2"
              />
            ) : (
              <p className="font-medium mt-2">{formData.nombre_fantasia || "-"}</p>
            )}
          </div>

          <div>
            <Label htmlFor="mail_institucional">Mail Institucional</Label>
            <p className="font-medium mt-2 text-muted-foreground">{formData.mail_institucional || "-"}</p>
            <p className="text-xs text-muted-foreground mt-1">No editable</p>
          </div>

          <div>
            <Label htmlFor="razon_social">Razón Social</Label>
            <p className="font-medium mt-2 text-muted-foreground">{formData.razon_social || "-"}</p>
            <p className="text-xs text-muted-foreground mt-1">No editable</p>
          </div>

          <div>
            <Label htmlFor="cuit">CUIT</Label>
            <p className="font-medium mt-2 text-muted-foreground">{formData.cuit || "-"}</p>
            <p className="text-xs text-muted-foreground mt-1">No editable</p>
          </div>

          <div>
            <Label htmlFor="bodega_inv">Nº Bodega INV</Label>
            <p className="font-medium mt-2 text-muted-foreground">{formData.bodega_inv || "-"}</p>
            <p className="text-xs text-muted-foreground mt-1">No editable</p>
          </div>

          <div>
            <Label htmlFor="vinedo_inv">Nº Viñedo INV</Label>
            <p className="font-medium mt-2 text-muted-foreground">{formData.vinedo_inv || "-"}</p>
            <p className="text-xs text-muted-foreground mt-1">No editable</p>
          </div>

          <div>
            <Label htmlFor="telefono">Teléfono</Label>
            {isEditing ? (
              <Input
                id="telefono"
                value={formData.telefono}
                onChange={(e) => handleInputChange("telefono", e.target.value)}
                className="mt-2"
              />
            ) : (
              <p className="font-medium mt-2">{formData.telefono || "-"}</p>
            )}
          </div>

          <div>
            <Label htmlFor="calle">Dirección</Label>
            <p className="font-medium mt-2 text-muted-foreground">
              {formData.calle ? `${formData.calle} ${formData.numeracion}` : "-"}
            </p>
            <p className="text-xs text-muted-foreground mt-1">No editable</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Seguridad</CardTitle>
          <CardDescription>Gestiona la seguridad de tu cuenta</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start justify-between p-4 border rounded-lg">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Key className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">Contraseña</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Solicita un cambio de contraseña. Recibirás un correo electrónico con instrucciones para establecer una nueva contraseña.
              </p>
            </div>
            <Button
              variant="outline"
              onClick={handleCambiarContrasena}
              disabled={isSendingPasswordReset || isEditing}
              className="ml-4 shrink-0"
            >
              {isSendingPasswordReset ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  <Key className="mr-2 h-4 w-4" />
                  Cambiar Contraseña
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Modal de confirmación para dar de baja */}
      <Dialog open={showBajaModal} onOpenChange={setShowBajaModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Confirmar Baja de Responsable
            </DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que deseas dar de baja a <strong>{formData.admin_first_name} {formData.admin_last_name}</strong>?
              <br /><br />
              Esta acción marcará al responsable como inactivo. No podrás realizar autoevaluaciones sin un responsable activo.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowBajaModal(false)}
              disabled={isProcessingBaja}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleDarDeBaja}
              disabled={isProcessingBaja}
            >
              {isProcessingBaja ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Procesando...
                </>
              ) : (
                "Confirmar Baja"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal para agregar nuevo responsable */}
      <Dialog open={showNuevoModal} onOpenChange={setShowNuevoModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5 text-primary" />
              Agregar Nuevo Responsable
            </DialogTitle>
            <DialogDescription>
              Ingresa los datos del nuevo responsable de la cuenta.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="nuevo_nombre">Nombre *</Label>
                <Input
                  id="nuevo_nombre"
                  value={nuevoResponsable.nombre}
                  onChange={(e) => handleNuevoResponsableChange("nombre", e.target.value)}
                  className="mt-2"
                  placeholder="Juan"
                />
              </div>
              <div>
                <Label htmlFor="nuevo_apellido">Apellido *</Label>
                <Input
                  id="nuevo_apellido"
                  value={nuevoResponsable.apellido}
                  onChange={(e) => handleNuevoResponsableChange("apellido", e.target.value)}
                  className="mt-2"
                  placeholder="Pérez"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="nuevo_dni">DNI *</Label>
                <Input
                  id="nuevo_dni"
                  value={nuevoResponsable.dni}
                  onChange={(e) => handleNuevoResponsableChange("dni", e.target.value)}
                  className="mt-2"
                  placeholder="12345678"
                  maxLength={8}
                />
              </div>
              <div>
                <Label htmlFor="nuevo_cargo">Cargo *</Label>
                <Input
                  id="nuevo_cargo"
                  value={nuevoResponsable.cargo}
                  onChange={(e) => handleNuevoResponsableChange("cargo", e.target.value)}
                  className="mt-2"
                  placeholder="Gerente General"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowNuevoModal(false)
                setNuevoResponsable({ nombre: "", apellido: "", cargo: "", dni: "" })
              }}
              disabled={isCreatingResponsable}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleCrearResponsable}
              disabled={isCreatingResponsable}
            >
              {isCreatingResponsable ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creando...
                </>
              ) : (
                "Crear Responsable"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
