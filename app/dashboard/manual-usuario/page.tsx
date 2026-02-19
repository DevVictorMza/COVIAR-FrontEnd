import { BookOpen, CheckCircle, FileText, BarChart, HelpCircle, Lightbulb, Download, Users, TrendingUp } from 'lucide-react';

export default function ManualDeUso() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header con Botón de Descarga */}
      <div className="p-8 pb-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-coviar-borravino" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Instructivo de Funcionamiento</h1>
              <p className="text-muted-foreground text-lg">
                Guía de Autoevaluación — Sostenibilidad Enoturística Argentina
              </p>
            </div>
          </div>

          {/* Botón de Descarga */}
          <a 
            href="/documents/INSTRUCTIVO DE FUNCIONAMIENTO.pdf"
            download="INSTRUCTIVO DE FUNCIONAMIENTO.pdf"
            className="relative group flex-shrink-0"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#880D1E]/30 to-[#a81028]/30 rounded-lg blur opacity-40 group-hover:opacity-60 transition duration-300"></div>
            <div className="relative bg-gradient-to-br from-[#880D1E] to-[#6a0a17] px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 flex items-center gap-3">
              <Download className="w-5 h-5 text-white" />
              <span className="text-white font-semibold whitespace-nowrap">Descargue nuestro instructivo</span>
            </div>
          </a>
        </div>
      </div>

      <div className="px-8 pb-8">
        <div className="max-w-5xl mx-auto space-y-8">

          {/* Grid: ¿Qué es? y ¿Para qué sirve? */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Sección: ¿Qué es la plataforma? */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-[#B89B5E]/30 to-[#d4b76f]/30 rounded-2xl blur-xl opacity-60 group-hover:opacity-80 transition duration-300"></div>
              <div className="relative bg-white/98 backdrop-blur-md p-8 rounded-xl border-l-4 border-l-coviar-borravino shadow-lg h-full">
                <div className="flex items-center gap-3 mb-4">
                  <HelpCircle className="w-7 h-7 text-coviar-borravino" />
                  <h2 className="text-xl font-bold text-gray-900">¿Qué es la plataforma de autoevaluación?</h2>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  La Plataforma de Autoevaluación de Enoturismo Sostenible es una herramienta digital desarrollada por COVIAR 
                  para acompañar a las bodegas con apertura turística de la Vitivinicultura Argentina en la evaluación, gestión 
                  y mejora progresiva de sus prácticas enoturísticas, en línea con los principios de la sostenibilidad y los 
                  estándares internacionales de turismo responsable.
                </p>
              </div>
            </div>

            {/* Sección: ¿Para qué sirve? */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-[#880D1E]/20 to-[#a81028]/20 rounded-lg blur-lg opacity-40 group-hover:opacity-60 transition duration-300"></div>
              <div className="relative bg-white/98 backdrop-blur-md p-8 rounded-xl border-l-4 border-l-coviar-borravino shadow-lg h-full">
                <div className="flex items-center gap-3 mb-4">
                  <Lightbulb className="w-7 h-7 text-coviar-borravino" />
                  <h2 className="text-xl font-bold text-gray-900">¿Para qué sirve?</h2>
                </div>
                <p className="text-gray-700 mb-4 font-medium">La plataforma permite a las bodegas:</p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-coviar-borravino mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 text-sm">
                      Evaluar su nivel de sostenibilidad enoturística de manera ordenada y objetiva.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-coviar-borravino mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 text-sm">
                      Cuantificar su desempeño y contar con una referencia clara del estado de evolución de la organización.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-coviar-borravino mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 text-sm">
                      Identificar fortalezas y oportunidades de mejora en la gestión turística.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-coviar-borravino mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 text-sm">
                      Planificar acciones de mejora continua y realizar seguimiento en el tiempo.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-coviar-borravino mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 text-sm">
                      Prepararse para futuros esquemas de reconocimiento y certificación en sostenibilidad.
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Sección: ¿Cómo funciona? */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-[#880D1E]/20 to-[#a81028]/20 rounded-lg blur-lg opacity-40 group-hover:opacity-60 transition duration-300"></div>
            <div className="relative bg-white/98 backdrop-blur-md p-8 rounded-xl border-l-4 border-l-coviar-borravino shadow-lg">
              <div className="flex items-center gap-3 mb-6">
                <TrendingUp className="w-7 h-7 text-coviar-borravino" />
                <h2 className="text-2xl font-bold text-gray-900">¿Cómo funciona la plataforma?</h2>
              </div>
              <p className="text-gray-700 mb-6 font-medium">
                Plataforma simple, guiada y adaptada a la realidad de cada bodega turística, basada en un proceso de autoevaluación por etapas.
              </p>

              <div className="space-y-6">
                {/* Etapa 1 */}
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-coviar-borravino/10 rounded-full flex items-center justify-center border-2 border-coviar-borravino/30">
                      <span className="text-coviar-borravino font-bold text-lg">1</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">ETAPA 1: Creación de cuenta</h3>
                    <ul className="text-gray-700 space-y-1.5">
                      <li className="flex gap-2">
                        <span className="text-coviar-borravino font-bold">•</span>
                        Cada bodega crea su perfil institucional
                      </li>
                      <li className="flex gap-2">
                        <span className="text-coviar-borravino font-bold">•</span>
                        Se registran datos generales
                      </li>
                      <li className="flex gap-2">
                        <span className="text-coviar-borravino font-bold">•</span>
                        Se almacenan resultados para seguimiento y evolución en el tiempo
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Etapa 2 */}
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-coviar-borravino/10 rounded-full flex items-center justify-center border-2 border-coviar-borravino/30">
                      <span className="text-coviar-borravino font-bold text-lg">2</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">ETAPA 2: Selección de categoría de bodega turística</h3>
                    <ul className="text-gray-700 space-y-1.5">
                      <li className="flex gap-2">
                        <span className="text-coviar-borravino font-bold">•</span>
                        Se elige la categoría según visitas turísticas anuales
                      </li>
                      <li className="flex gap-2">
                        <span className="text-coviar-borravino font-bold">•</span>
                        Las categorías evitan exigencias desproporcionadas
                      </li>
                      <li className="flex gap-2">
                        <span className="text-coviar-borravino font-bold">•</span>
                        La categoría define qué indicadores se evalúan
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Etapa 3 */}
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-coviar-borravino/10 rounded-full flex items-center justify-center border-2 border-coviar-borravino/30">
                      <span className="text-coviar-borravino font-bold text-lg">3</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">ETAPA 3: Adaptación automática de la evaluación</h3>
                    <ul className="text-gray-700 space-y-1.5">
                      <li className="flex gap-2">
                        <span className="text-coviar-borravino font-bold">•</span>
                        La plataforma despliega solo los capítulos e indicadores pertinentes
                      </li>
                      <li className="flex gap-2">
                        <span className="text-coviar-borravino font-bold">•</span>
                        Cada bodega evalúa aspectos acordes a su escala y nivel de desarrollo
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Etapa 4 */}
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-coviar-borravino/10 rounded-full flex items-center justify-center border-2 border-coviar-borravino/30">
                      <span className="text-coviar-borravino font-bold text-lg">4</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">ETAPA 4: Autoevaluación y asignación de puntaje</h3>
                    <p className="text-gray-700 mb-2">Evaluación objetiva del desempeño en sostenibilidad enoturística</p>
                    <p className="text-gray-900 mb-2 font-semibold">Indicadores con 4 niveles de cumplimiento:</p>
                    <ul className="text-gray-700 space-y-1.5 mb-3">
                      <li className="flex gap-2">
                        <span className="text-coviar-borravino font-bold">•</span>
                        Nivel 0: no alcanza Nivel 1
                      </li>
                      <li className="flex gap-2">
                        <span className="text-coviar-borravino font-bold">•</span>
                        Nivel 1: cumplimiento inicial
                      </li>
                      <li className="flex gap-2">
                        <span className="text-coviar-borravino font-bold">•</span>
                        Nivel 2: cumplimiento intermedio
                      </li>
                      <li className="flex gap-2">
                        <span className="text-coviar-borravino font-bold">•</span>
                        Nivel 3: cumplimiento avanzado
                      </li>
                    </ul>
                    <p className="text-gray-900 font-semibold">Puntaje automático por indicador: 0 / 1 / 2 / 3 puntos</p>
                    <p className="text-gray-700 mt-1">No requiere cálculos manuales</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sección: Resultados y nivel de sostenibilidad */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-[#880D1E]/20 to-[#a81028]/20 rounded-lg blur-lg opacity-40 group-hover:opacity-60 transition duration-300"></div>
            <div className="relative bg-white/98 backdrop-blur-md p-8 rounded-xl border-l-4 border-l-coviar-borravino shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <BarChart className="w-7 h-7 text-coviar-borravino" />
                <h2 className="text-2xl font-bold text-gray-900">Resultados y nivel de sostenibilidad alcanzado</h2>
              </div>
              
              <div className="space-y-3 mb-6">
                <p className="text-gray-700 font-medium">1. Sumatoria automática del puntaje total</p>
                <p className="text-gray-700 font-medium">2. La plataforma presenta el Grado de Desarrollo de la Sostenibilidad</p>
              </div>

              <p className="text-gray-900 font-semibold mb-4">Niveles globales:</p>
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 p-4 bg-lime-50 rounded-lg border-2 border-lime-200">
                  <div className="w-4 h-4 rounded-full bg-lime-500"></div>
                  <span className="font-semibold text-lime-900">Nivel mínimo de sostenibilidad</span>
                </div>
                <div className="flex items-center gap-3 p-4 bg-emerald-50 rounded-lg border-2 border-emerald-200">
                  <div className="w-4 h-4 rounded-full bg-emerald-500"></div>
                  <span className="font-semibold text-emerald-900">Nivel medio de sostenibilidad</span>
                </div>
                <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg border-2 border-green-200">
                  <div className="w-4 h-4 rounded-full bg-green-600"></div>
                  <span className="font-semibold text-green-900">Nivel alto de sostenibilidad</span>
                </div>
              </div>

              <p className="text-gray-700 mb-4 leading-relaxed">
                Estos niveles reflejan la situación actual de la organización respecto del puntaje obtenido y permiten 
                orientar la planificación de acciones de mejora continua.
              </p>

              <p className="text-gray-900 font-semibold mb-2">Se entiende que:</p>
              <ul className="text-gray-700 space-y-2 mb-4">
                <li className="flex gap-2">
                  <span className="text-coviar-borravino font-bold">•</span>
                  <span>
                    El <strong>Nivel mínimo de sostenibilidad</strong> se alcanza cuando todos los indicadores aplicables 
                    cumplen al menos el Nivel 1 (1 punto).
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="text-coviar-borravino font-bold">•</span>
                  <span>
                    El <strong>Nivel máximo de sostenibilidad</strong> se alcanza cuando todos los indicadores aplicables 
                    cumplen el Nivel 3 (3 puntos).
                  </span>
                </li>
              </ul>

              <p className="text-gray-700 leading-relaxed">
                Si una organización se encuentra en un nivel mínimo, deberá planificar acciones orientadas a fortalecer 
                aquellos indicadores que no alcanzan el Nivel 1, avanzando progresivamente hacia niveles superiores de 
                desempeño en sostenibilidad enoturística.
              </p>
            </div>
          </div>

          {/* Sección: Categorías de bodegas */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-[#880D1E]/20 to-[#a81028]/20 rounded-lg blur-lg opacity-40 group-hover:opacity-60 transition duration-300"></div>
            <div className="relative bg-white/98 backdrop-blur-md p-8 rounded-xl border-l-4 border-l-coviar-borravino shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <Users className="w-7 h-7 text-coviar-borravino" />
                <h2 className="text-2xl font-bold text-gray-900">Categorías de bodegas turísticas</h2>
              </div>
              
              <p className="text-gray-900 font-semibold mb-4">
                Criterio de Segmentación: Nivel de Actividad Turística / Promedio Anual de Visitantes
              </p>

              <div className="space-y-3 mb-6">
                <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border-l-4 border-l-coviar-borravino">
                  <p className="font-bold text-gray-900">Micro Bodega Turística / Artesanal</p>
                  <p className="text-gray-700">Menos de 1.000 visitantes</p>
                </div>
                <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border-l-4 border-l-coviar-borravino">
                  <p className="font-bold text-gray-900">Pequeña Bodega Turística</p>
                  <p className="text-gray-700">Entre 1.000 y 5.000 visitantes</p>
                </div>
                <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border-l-4 border-l-coviar-borravino">
                  <p className="font-bold text-gray-900">Mediana Bodega Turística</p>
                  <p className="text-gray-700">Entre 5.000 y 15.000 visitantes</p>
                </div>
                <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border-l-4 border-l-coviar-borravino">
                  <p className="font-bold text-gray-900">Bodega Turística</p>
                  <p className="text-gray-700">Más de 15.000 y 30.000 visitantes</p>
                </div>
                <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border-l-4 border-l-coviar-borravino">
                  <p className="font-bold text-gray-900">Gran Bodega Turística</p>
                  <p className="text-gray-700">Más de 30.000 visitantes</p>
                </div>
              </div>

              <p className="text-gray-700 leading-relaxed">
                Cada categoría incluye un rango de visitas turísticas anuales claramente definido en la plataforma. 
                Las categorías no constituyen un ranking, sino una herramienta técnica que permite aplicar indicadores 
                acordes al nivel de actividad turística, obtener resultados comparables en el tiempo y orientar adecuadamente 
                el proceso de mejora continua.
              </p>
            </div>
          </div>

          {/* Sección: Sistema evolutivo */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-[#B89B5E]/30 to-[#d4b76f]/30 rounded-2xl blur-xl opacity-60 group-hover:opacity-80 transition duration-300"></div>
            <div className="relative bg-white/98 backdrop-blur-md p-8 rounded-2xl border-2 border-[#B89B5E]/30 shadow-2xl">
              <div className="flex items-center gap-3 mb-4">
                <TrendingUp className="w-7 h-7 text-coviar-borravino" />
                <h2 className="text-2xl font-bold text-gray-900">Un sistema evolutivo de mejora continua</h2>
              </div>
              <p className="text-gray-700 leading-relaxed">
                La Plataforma de la Guía de Autoevaluación de Enoturismo Sostenible de COVIAR fue diseñada como un <strong>sistema evolutivo</strong>, 
                que permite a cada bodega evaluarse según su realidad actual y avanzar progresivamente hacia niveles más exigentes 
                de sostenibilidad. A medida que la actividad turística crece, la bodega puede revisar su categoría, incorporar nuevos 
                indicadores y consolidar prácticas, preparándose para futuros esquemas de reconocimiento y certificación.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}