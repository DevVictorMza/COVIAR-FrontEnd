"use client"

import type React from "react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { DashboardSidebar } from "@/components/dashboard-sidebar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Verificar si hay usuario en localStorage
    const usuarioStr = localStorage.getItem('usuario')

    if (!usuarioStr) {
      // No hay usuario, redirigir a login
      console.log('No hay usuario en localStorage, redirigiendo a login')
      router.push("/login")
      return
    }

    try {
      const usuario = JSON.parse(usuarioStr)
      console.log('Usuario encontrado en localStorage:', usuario)
      console.log('Estructura del usuario:', JSON.stringify(usuario, null, 2))

      // Verificar que el objeto tiene las propiedades necesarias
      // Soportar multiples formatos de respuesta del backend
      const hasValidStructure = usuario && (
        usuario.cuenta?.email ||           // Formato: { cuenta: { email }, bodega, responsable }
        usuario.email_login ||             // Formato: { id_cuenta, email_login, bodega }
        usuario.email ||                    // Formato directo: { email, ... }
        usuario.id_cuenta ||               // Formato con id_cuenta
        usuario.id ||                       // Formato con id
        usuario.idUsuario                   // Formato Usuario original
      )

      if (!hasValidStructure) {
        console.log('Usuario inválido (sin estructura válida), limpiando localStorage')
        console.log('Propiedades del usuario:', Object.keys(usuario))
        localStorage.removeItem('usuario')
        router.push("/login")
        return
      }

      console.log('Usuario válido, permitiendo acceso al dashboard')
      setIsLoading(false)
    } catch (error) {
      // Error al parsear, limpiar y redirigir
      console.error('Error al parsear usuario de localStorage:', error)
      localStorage.removeItem('usuario')
      router.push("/login")
    }
  }, [router])

  // Mostrar loading mientras verifica
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <DashboardSidebar />
      <main className="flex-1 overflow-y-auto bg-background">{children}</main>
    </div>
  )
}
