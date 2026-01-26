"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

// Interfaz que coincide con la respuesta del backend
interface UsuarioData {
  cuenta: {
    id: number
    email: string
    tipo_cuenta: string
  }
  bodega: {
    id: number
    razon_social: string
    nombre_fantasia: string
    cuit: string
    calle: string
    numeracion: string
    telefono: string
    email_institucional: string
    localidad: {
      id: number
      nombre: string
      departamento: string
      provincia: string
    }
  }
  responsable: {
    id: number
    nombre: string
    apellido: string
    cargo: string
    dni: string
    activo: boolean
  }
}

export default function ConfiguracionPage() {
  const [usuario, setUsuario] = useState<UsuarioData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function cargarPerfil() {
      try {
        const usuarioStr = localStorage.getItem('usuario')
        if (usuarioStr) {
          const user = JSON.parse(usuarioStr) as UsuarioData
          setUsuario(user)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar el perfil')
      } finally {
        setIsLoading(false)
      }
    }

    cargarPerfil()
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p>Cargando configuración...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
          {error}
        </div>
      </div>
    )
  }

  if (!usuario) return null

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Configuración</h1>
        <p className="text-muted-foreground">Administra tu cuenta y preferencias</p>
      </div>

      {/* Información de la Cuenta */}
      <Card>
        <CardHeader>
          <CardTitle>Información de la Cuenta</CardTitle>
          <CardDescription>Datos de acceso a la plataforma</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Nombre Completo</p>
            <p className="font-medium">
              {usuario.responsable?.nombre} {usuario.responsable?.apellido}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Email</p>
            <p className="font-medium">{usuario.cuenta?.email}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Rol</p>
            <p className="font-medium capitalize">{usuario.responsable?.cargo}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Estado</p>
            <p className="font-medium">
              {usuario.responsable?.activo ? (
                <span className="text-green-600">✓ Activo</span>
              ) : (
                <span className="text-red-600">✗ Inactivo</span>
              )}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Tipo de Cuenta</p>
            <p className="font-medium capitalize">{usuario.cuenta?.tipo_cuenta?.toLowerCase()}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">DNI</p>
            <p className="font-medium">{usuario.responsable?.dni}</p>
          </div>
        </CardContent>
      </Card>

      {/* Información de la Bodega */}
      <Card>
        <CardHeader>
          <CardTitle>Información de la Bodega</CardTitle>
          <CardDescription>Datos de la bodega asociada</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Nombre Fantasía</p>
            <p className="font-medium">{usuario.bodega?.nombre_fantasia}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Razón Social</p>
            <p className="font-medium">{usuario.bodega?.razon_social}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">CUIT</p>
            <p className="font-medium">{usuario.bodega?.cuit}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Teléfono</p>
            <p className="font-medium">{usuario.bodega?.telefono}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Email Institucional</p>
            <p className="font-medium">{usuario.bodega?.email_institucional}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Dirección</p>
            <p className="font-medium">
              {usuario.bodega?.calle} {usuario.bodega?.numeracion}
            </p>
          </div>
          <div className="md:col-span-2">
            <p className="text-sm text-muted-foreground">Ubicación</p>
            <p className="font-medium">
              {usuario.bodega?.localidad?.nombre}, {usuario.bodega?.localidad?.departamento}, {usuario.bodega?.localidad?.provincia}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
