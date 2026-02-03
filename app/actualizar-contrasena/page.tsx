"use client"

import type React from "react"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { restablecerPassword } from "@/lib/api/auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"

function ActualizarContrasenaContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get("token")

  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  useEffect(() => {
    if (!token) {
      setError("Token de recuperación no válido o faltante")
    }
  }, [token])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setMessage(null)

    // Validaciones
    if (password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres")
      setIsLoading(false)
      return
    }

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden")
      setIsLoading(false)
      return
    }

    if (!token) {
      setError("Token de recuperación no válido")
      setIsLoading(false)
      return
    }

    try {
      await restablecerPassword(token, password)
      setMessage("¡Contraseña actualizada exitosamente!")
      setIsSuccess(true)
      // Redirigir al login después de 3 segundos
      setTimeout(() => {
        router.push("/login")
      }, 3000)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Ocurrió un error al actualizar la contraseña")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="bg-primary text-primary-foreground">
        <CardTitle className="text-2xl text-center">Actualizar Contraseña</CardTitle>
        <CardDescription className="text-primary-foreground/80 text-center">
          Ingresa tu nueva contraseña
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        {!token ? (
          <div className="space-y-4">
            <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
              El enlace de recuperación no es válido o ha expirado.
            </div>
            <div className="text-center">
              <Link href="/recuperar-contrasena" className="text-primary hover:underline">
                Solicitar un nuevo enlace
              </Link>
            </div>
          </div>
        ) : isSuccess ? (
          <div className="space-y-4">
            <div className="text-sm text-primary bg-primary/10 p-3 rounded-md">
              {message}
            </div>
            <p className="text-center text-sm text-muted-foreground">
              Serás redirigido al inicio de sesión...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">Nueva Contraseña</Label>
              <Input
                id="password"
                type="password"
                placeholder="Mínimo 8 caracteres"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Repite tu contraseña"
                required
                minLength={8}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            {error && (
              <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
                {error}
              </div>
            )}

            {message && (
              <div className="text-sm text-primary bg-primary/10 p-3 rounded-md">
                {message}
              </div>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Actualizando..." : "Actualizar Contraseña"}
            </Button>

            <div className="text-center text-sm">
              <Link href="/login" className="text-primary hover:underline">
                Volver a Iniciar Sesión
              </Link>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  )
}

export default function ActualizarContrasenaPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <Suspense fallback={
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Cargando...</p>
          </CardContent>
        </Card>
      }>
        <ActualizarContrasenaContent />
      </Suspense>
    </div>
  )
}
