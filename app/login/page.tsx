"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Eye, EyeOff, ArrowLeft } from "lucide-react"
import { loginUsuario } from "@/lib/api/auth"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      console.log('Iniciando login con:', { email_login: email.trim() })

      const usuario = await loginUsuario({
        email_login: email.trim(),
        password: password.trim(),
      })

      console.log('Login exitoso, usuario recibido:', usuario)

      // Guardar datos del usuario en localStorage (ya se hace en loginUsuario, pero por si acaso)
      localStorage.setItem('usuario', JSON.stringify(usuario))

      console.log('Usuario guardado en localStorage')
      console.log('Verificando localStorage:', localStorage.getItem('usuario'))

      // Redirigir según el tipo de cuenta
      const tipoCuenta = (usuario as any)?.tipo || localStorage.getItem('tipoCuenta')

      if (tipoCuenta === 'ADMINISTRADOR_APP') {
        console.log('Redirigiendo a /admin (Administrador)')
        router.push("/admin")
      } else {
        console.log('Redirigiendo a /dashboard (Usuario normal)')
        router.push("/dashboard")
      }
    } catch (error: unknown) {
      console.error('Error en login:', error)
      const errorMessage = error instanceof Error ? error.message : "Ocurrió un error al iniciar sesión"

      // Personalizar mensaje para error de credenciales incorrectas
      if (errorMessage.includes("401") || errorMessage.includes("Unauthorized")) {
        setError("Su email o contraseña no coinciden")
      } else {
        setError(errorMessage)
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen relative flex flex-col items-center justify-center p-6 bg-gray-100">

      {/* Volver al inicio */}
      <Link href="/" className="absolute top-8 left-8 z-50 flex items-center gap-2 text-white/80 hover:text-white transition-colors group">
        <div className="bg-white/10 p-2 rounded-full backdrop-blur-sm group-hover:bg-white/20 transition-all">
          <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
        </div>
        <span className="font-medium text-sm drop-shadow-md">Volver al inicio</span>
      </Link>

      {/* Background from Landing */}
      <div className="absolute inset-0 z-0">
        <div className="w-full h-full bg-gray-200">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/header-banner.png" alt="Viñedo" className="w-full h-full object-cover" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-coviar-borravino/95 to-coviar-borravino/70 mix-blend-multiply"></div>
      </div>

      <Card className="relative z-10 w-full max-w-md overflow-hidden p-0 shadow-2xl border-0">
        <CardHeader className="bg-white border-b p-8">
          <div className="flex justify-center mb-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/logos/logocolorhorz.png" alt="Coviar" className="h-20 object-contain" />
          </div>
          <CardTitle className="text-2xl text-center font-serif text-coviar-borravino font-bold">Bienvenido</CardTitle>
          <CardDescription className="text-gray-500 text-center">
            Plataforma de Autoevaluación de Sostenibilidad
          </CardDescription>
        </CardHeader>
        <CardContent className="p-8 space-y-6">
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="tu@email.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Contraseña</Label>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pr-10 h-11"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <div className="flex justify-end pt-1">
                <Link href="/recuperar-contrasena" className="text-xs text-muted-foreground hover:text-coviar-borravino transition-colors">
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
            </div>
            {error && <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">{error}</div>}

            <Button type="submit" className="w-full bg-coviar-borravino hover:bg-coviar-borravino-dark h-11 text-base font-medium" disabled={isLoading}>
              {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
            </Button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-muted-foreground">O</span>
              </div>
            </div>

            <div className="pt-2">
              <p className="text-center text-sm text-muted-foreground mb-3">¿Aún no tienes una cuenta?</p>
              <Link href="/registro" className="w-full block">
                <Button variant="outline" type="button" className="w-full border-coviar-borravino text-coviar-borravino hover:bg-coviar-borravino hover:text-white h-11 text-base font-medium transition-colors">
                  Registrarte
                </Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Footer decorations or text if needed */}
      <div className="absolute bottom-4 left-0 right-0 text-center text-white/50 text-xs z-10 p-4">
        &copy; {new Date().getFullYear()} Corporación Vitivinícola Argentina. Todos los derechos reservados.
      </div>
    </div>
  )
}