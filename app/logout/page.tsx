"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { CheckCircle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function LogoutPage() {
    const router = useRouter()
    const [countdown, setCountdown] = useState(5)

    useEffect(() => {
        // Countdown para redirección automática
        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(timer)
                    router.push("/login")
                    return 0
                }
                return prev - 1
            })
        }, 1000)

        return () => clearInterval(timer)
    }, [router])

    const handleGoToLogin = () => {
        router.push("/login")
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/30 p-4">
            <Card className="w-full max-w-md shadow-lg">
                <CardContent className="pt-8 pb-8 text-center space-y-6">
                    {/* Icono de confirmación */}
                    <div className="flex justify-center">
                        <div className="rounded-full bg-green-100 p-4">
                            <CheckCircle className="h-12 w-12 text-green-600" />
                        </div>
                    </div>

                    {/* Título */}
                    <div className="space-y-2">
                        <h1 className="text-2xl font-bold text-foreground">
                            ¡Hasta pronto!
                        </h1>
                        <p className="text-lg text-muted-foreground">
                            Has cerrado sesión exitosamente
                        </p>
                    </div>

                    {/* Mensaje de agradecimiento */}
                    <p className="text-sm text-muted-foreground px-4">
                        Gracias por usar la plataforma <span className="font-semibold text-primary">COVIAR</span>.
                        Tu sesión ha sido cerrada de forma segura.
                    </p>

                    {/* Botón de acción */}
                    <div className="space-y-3">
                        <Button
                            onClick={handleGoToLogin}
                            className="w-full"
                            size="lg"
                        >
                            Volver al inicio
                        </Button>
                        <p className="text-xs text-muted-foreground">
                            Serás redirigido automáticamente en {countdown} segundos...
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
