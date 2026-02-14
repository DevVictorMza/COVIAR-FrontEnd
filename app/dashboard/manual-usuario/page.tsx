import { BookOpen, CheckCircle, FileText, BarChart, HelpCircle, Lightbulb } from 'lucide-react';

export default function ManualDeUso() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <BookOpen className="w-8 h-8 text-coviar-borravino" />
            <h1 className="text-3xl font-bold text-gray-900">Manual de Uso</h1>
          </div>
          <p className="text-gray-600 text-lg">
            Guía paso a paso para completar tu autoevaluación de sostenibilidad enoturística.
          </p>
        </div>

        {/* Sección: ¿Qué es la autoevaluación? */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <HelpCircle className="w-6 h-6 text-coviar-borravino" />
            <h2 className="text-2xl font-semibold text-gray-900">¿Qué es la Guía de Autoevaluación?</h2>
          </div>
          <p className="text-gray-700 leading-relaxed mb-4">
            La guía de autoevaluación es una herramienta diseñada para medir el nivel de sostenibilidad enoturística de tu bodega.
            A través de un proceso estructurado por capítulos e indicadores, podrás evaluar tu progreso, identificar áreas de mejora
            y obtener una certificación según el nivel alcanzado.
          </p>
        </div>

        {/* Sección: Cómo funciona */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-6">
          <div className="flex items-center gap-2 mb-6">
            <Lightbulb className="w-6 h-6 text-coviar-borravino" />
            <h2 className="text-2xl font-semibold text-gray-900">¿Cómo Funciona?</h2>
          </div>

          <div className="space-y-6">
            {/* Paso 1 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-coviar-borravino/10 rounded-full flex items-center justify-center">
                  <span className="text-coviar-borravino font-bold">1</span>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Seleccioná tu Segmentación</h3>
                <p className="text-gray-700">
                  Elegí la categoría según el volumen turístico anual de tu bodega: Micro (0-999 turistas), Pequeña (1.000-4.999),
                  Mediana (5.000-14.999), Bodega Turística (15.000-29.999) o Gran Bodega (30.000+). Esto determina los capítulos
                  e indicadores a completar.
                </p>
              </div>
            </div>

            {/* Paso 2 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-coviar-borravino/10 rounded-full flex items-center justify-center">
                  <span className="text-coviar-borravino font-bold">2</span>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Completá los Indicadores por Nivel</h3>
                <p className="text-gray-700">
                  Cada indicador tiene 3 niveles de cumplimiento acumulativos: Nivel 1 (básico, +1 punto), Nivel 2 (intermedio, +2 puntos),
                  Nivel 3 (avanzado, +3 puntos). Si cumplís el Nivel 3, automáticamente cumplís los niveles 1 y 2.
                  Todos los indicadores son obligatorios.
                </p>
              </div>
            </div>

            {/* Paso 3 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-coviar-borravino/10 rounded-full flex items-center justify-center">
                  <span className="text-coviar-borravino font-bold">3</span>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Adjuntá Evidencia (Opcional)</h3>
                <p className="text-gray-700">
                  Podés respaldar tus respuestas con documentación. Solo archivos PDF (1 por indicador).
                  Ejemplos: fotografías, certificaciones, políticas internas, registros de capacitaciones, facturas, informes técnicos.
                </p>
              </div>
            </div>

            {/* Paso 4 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-coviar-borravino/10 rounded-full flex items-center justify-center">
                  <span className="text-coviar-borravino font-bold">4</span>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Revisá y Enviá</h3>
                <p className="text-gray-700">
                  Tus respuestas se guardan automáticamente. Podés editar antes de enviar. Una vez enviada la autoevaluación,
                  NO podrás modificarla. Luego podrás ver tus resultados en el Dashboard y descargar informes desde el Historial.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Sección: Consejos */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle className="w-6 h-6 text-coviar-red" />
            <h2 className="text-2xl font-semibold text-gray-900">Consejos para una Mejor Evaluación</h2>
          </div>

          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-coviar-red mt-0.5 flex-shrink-0" />
              <span className="text-gray-700">
                <strong>Sé honesto:</strong> La autoevaluación es para ti. Las respuestas honestas te darán
                resultados más útiles y te permitirán identificar áreas reales de mejora.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-coviar-red mt-0.5 flex-shrink-0" />
              <span className="text-gray-700">
                <strong>Tómate tu tiempo:</strong> No hay prisa. Reflexioná sobre cada indicador y nivel antes de responder.
                Podés guardar y continuar después.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-coviar-red mt-0.5 flex-shrink-0" />
              <span className="text-gray-700">
                <strong>Revisá antes de enviar:</strong> Asegurate de haber completado todos los indicadores obligatorios
                antes de enviar tu evaluación.
              </span>
            </li>
          </ul>
        </div>

        {/* Sección: Niveles de Sostenibilidad */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <BarChart className="w-6 h-6 text-coviar-borravino" />
            <h2 className="text-2xl font-semibold text-gray-900">Niveles de Sostenibilidad</h2>
          </div>
          <p className="text-gray-700 mb-4">
            Tu puntaje final determina el nivel de sostenibilidad alcanzado:
          </p>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
              <div className="w-3 h-3 rounded-full bg-green-600"></div>
              <span className="font-medium text-green-800">Nivel Alto</span>
              <span className="text-green-700 text-sm">- Excelencia en sostenibilidad enoturística</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-emerald-50 rounded-lg border border-emerald-200">
              <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
              <span className="font-medium text-emerald-800">Nivel Medio</span>
              <span className="text-emerald-700 text-sm">- Buenas prácticas implementadas</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-lime-50 rounded-lg border border-lime-200">
              <div className="w-3 h-3 rounded-full bg-lime-500"></div>
              <span className="font-medium text-lime-800">Nivel Mínimo</span>
              <span className="text-lime-700 text-sm">- Cumple requisitos mínimos de sostenibilidad</span>
            </div>
          </div>
        </div>

        {/* Sección: ¿Necesitás ayuda? */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="w-6 h-6 text-coviar-borravino" />
            <h2 className="text-2xl font-semibold text-gray-900">¿Necesitás Ayuda?</h2>
          </div>
          <p className="text-gray-700">
            Si tenés dudas durante el proceso de autoevaluación, podés contactarte con el equipo de COVIAR
            para recibir asistencia personalizada.
          </p>
        </div>
      </div>
    </div>
  );
}
