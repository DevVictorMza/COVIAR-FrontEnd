"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

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

export default function DashboardPage() {
  const [usuario, setUsuario] = useState<UsuarioData | null>(null)

  useEffect(() => {
    const usuarioStr = localStorage.getItem('usuario')
    if (usuarioStr) {
      try {
        const user = JSON.parse(usuarioStr)
        setUsuario(user)
      } catch (error) {
        console.error('Error al parsear usuario:', error)
      }
    }
  }, [])

  if (!usuario) {
    return (
      <div className="flex items-center justify-center h-full">
        <p>Cargando...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Header sin fondo */}
      <div className="p-8 pb-4">
        <h1 className="text-3xl font-bold">
          Bienvenido/a, {usuario.responsable?.nombre} {usuario.responsable?.apellido}
        </h1>
        <p className="text-muted-foreground">
          {usuario.bodega?.nombre_fantasia} — Panel de control de sostenibilidad enoturística COVIAR
        </p>
      </div>

      {/* Banner de Acceso Principal con Fondo de Botellas de Vino */}
      <div className="relative min-h-[calc(100vh-120px)] flex items-center">
        {/* Imagen de Fondo */}
        <div className="absolute inset-0 z-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src="/assets/wine-bottles-background.jpg" 
            alt="Bodega de Vinos" 
            className="w-full h-full object-cover"
          />
          {/* Overlay con degradado más claro para imagen oscura */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/92 via-white/88 to-white/92"></div>
        </div>

        {/* Contenido */}
        <div className="relative z-10 w-full py-16 px-8">
          <div className="space-y-12 max-w-5xl mx-auto">
            {/* Título Principal */}
            <div className="text-center space-y-4">
              <h2 className="text-4xl md:text-5xl font-bold font-serif text-coviar-borravino tracking-tight uppercase drop-shadow-sm">
                Guía de Autoevaluación
                <span className="block text-foreground mt-2 font-sans font-black">Sostenibilidad Enoturística Argentina</span>
              </h2>
              <p className="text-muted-foreground font-medium tracking-widest uppercase">
                #PEVI2030 El Plan de la Vitivinicultura Argentina
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
