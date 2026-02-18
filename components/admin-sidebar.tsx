"use client"

import { Home, Users, BarChart3, Settings, LogOut } from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const navigation = [
  { name: "Inicio", href: "/admin", icon: Home },
  { name: "Gestión de autoevaluaciones", href: "/admin/visualizacion-autoevaluaciones", icon: BarChart3 },
  {name: "Gestión de bodegas", href: "/admin/gestion-bodegas", icon: Users}
]

const bottomNavigation = [
  { name: "Configuración", href: "/admin/configuracion", icon: Settings }
]

export function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [usuario, setUsuario] = useState<any>(null)

  useEffect(() => {
    const usuarioStr = localStorage.getItem('usuario')
    if (usuarioStr) {
      try {
        const parsedUsuario = JSON.parse(usuarioStr)
        setUsuario(parsedUsuario)
      } catch (error) {
        console.error('Error al parsear usuario:', error)
      }
    }
  }, [])

  const handleLogout = async () => {
    const { logoutUsuario } = await import('@/lib/api/auth')
    await logoutUsuario()
    router.push("/logout")
  }

  const getInitials = () => {
    if (!usuario?.responsable) return "A" // A de Admin
    const nombre = usuario.responsable.nombre?.[0] || ""
    const apellido = usuario.responsable.apellido?.[0] || ""
    return (nombre + apellido).toUpperCase() || "A"
  }

  return (
    <div className="flex h-full w-64 flex-col bg-sidebar border-r border-sidebar-border">
      {/* Header con logo */}
      <div className="flex h-auto min-h-[120px] w-full items-center justify-center border-b border-sidebar-border bg-black py-4 px-4">
        <img
          src="/assets/logos/logoclarovert.png"
          alt="Coviar - Administración"
          className="w-full h-auto object-contain"
          style={{ maxWidth: "200px" }}
        />
      </div>

      {/* Sección de usuario */}
      {usuario && (
        <div className="border-b border-sidebar-border p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-600 text-white font-semibold text-sm">
              {getInitials()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-sidebar-foreground truncate">
                Administrador
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {usuario.cuenta?.email || usuario.email_login}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Navegación principal */}
      <nav className="flex-1 space-y-1 p-4">
        {navigation.map((item) => {
          const isActive = item.href === "/admin"
            ? pathname === "/admin"
            : pathname === item.href || pathname?.startsWith(`${item.href}/`)

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          )
        })}
      </nav>

      {/* Navegación inferior */}
      <div className="border-t border-sidebar-border p-4 space-y-1">
        {bottomNavigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          )
        })}
        <Button
          onClick={handleLogout}
          variant="ghost"
          className="w-full justify-start gap-3 px-3 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        >
          <LogOut className="h-5 w-5" />
          Cerrar Sesión
        </Button>
      </div>
    </div>
  )
}
