"use client"

import { useState, useEffect } from "react"
import { solicitarRestablecimientoPassword } from "@/lib/api/auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Key } from "lucide-react"

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
}

interface FormData {
  admin_first_name: string
  admin_last_name: string
  admin_dni: string
  admin_role: string
}

export default function ConfiguracionPage() {
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const [cuentaId, setCuentaId] = useState<number | null>(null)
  const [responsableId, setResponsableId] = useState<number | null>(null)

  const [originalData, setOriginalData] = useState<FormData | null>(null)

  const [isSendingPasswordReset, setIsSendingPasswordReset] = useState(false)

  const [formData, setFormData] = useState<FormData>({
    admin_first_name: "",
    admin_last_name: "",
    admin_dni: "",
    admin_role: "",
  })

  useEffect(() => {
    loadData()
  }, [])

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
      const usuarioStr = localStorage.getItem("usuario")
      if (!usuarioStr) {
        setError("No se encontró información de sesión. Por favor, inicia sesión nuevamente.")
        setIsLoading(false)
        return
      }

      const usuario: CuentaConBodega = JSON.parse(usuarioStr)
      setCuentaId(usuario.id_cuenta)

      const responsablesResponse = await fetch(`/api/cuentas/${usuario.id_cuenta}/responsables`, {
        credentials: "include",
      })

      let responsable: Responsable | null = null
      if (responsablesResponse.ok) {
        const responsables: Responsable[] = await responsablesResponse.json()
        responsable = responsables.find((r) => r.activo) || null
      }

      if (responsable) {
        setResponsableId(responsable.id_responsable)
      }

      const newFormData: FormData = {
        admin_first_name: responsable?.nombre || "",
        admin_last_name: responsable?.apellido || "",
        admin_dni: responsable?.dni || "",
        admin_role: responsable?.cargo || "",
      }

      setFormData(newFormData)
      setOriginalData(newFormData)
    } catch (err) {
      console.error("Error cargando datos:", err)
      setError(err instanceof Error ? err.message : "Error al cargar los datos")
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSave = async () => {
    setIsSaving(true)
    setError(null)

    try {
      if (responsableId) {
        const responsableResponse = await fetch(`/api/responsables/${responsableId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            nombre: formData.admin_first_name,
            apellido: formData.admin_last_name,
            cargo: formData.admin_role,
            dni: formData.admin_dni,
          }),
        })

        if (!responsableResponse.ok) {
          const errorData = await responsableResponse.json()
          throw new Error(errorData.message || "Error al actualizar datos del responsable")
        }
      }

      setOriginalData(formData)
      setIsEditing(false)
      setSuccessMessage("Cambios guardados exitosamente")
    } catch (err) {
      console.error("Error guardando:", err)
      setError(err instanceof Error ? err.message : "Error al guardar los cambios")
    } finally {
      setIsSaving(false)
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
      const usuarioStr = localStorage.getItem("usuario")
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
      console.error("Error solicitando cambio de contraseña:", err)
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
        <CardHeader>
          <CardTitle>Información del Responsable</CardTitle>
          <CardDescription>Datos de la persona responsable de la cuenta</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
    </div>
  )
}