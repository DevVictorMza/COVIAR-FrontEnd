const Pillars = () => {
  const pillars = ["Gobernanza y Ética", "Dimensión Ambiental", "Dimensión Social", "Patrimonio y Calidad"];

  return (
    <section id="mejora-continua" className="scroll-mt-32 py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid md:grid-cols-2 gap-12 items-center">
          
          {/* Izquierda: Pilares */}
          <div>
            <h2 className="text-3xl font-serif font-bold text-coviar-borravino-dark mb-6 leading-tight">
              Sistema Evolutivo de Mejora Continua
            </h2>
            <p className="text-gray-600 mb-8 text-lg leading-relaxed text-justify">
              La plataforma fue diseñada como un sistema evolutivo de mejora continua, que permite a cada bodega evaluarse según su realidad actual y avanzar progresivamente hacia niveles más exigentes de sostenibilidad enoturística. A medida que la actividad turística crece, la bodega puede revisar su categoría, incorporar nuevos indicadores y consolidar prácticas, preparándose para futuros esquemas de reconocimiento y certificación.
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              {pillars.map((pillar) => (
                <div key={pillar} className="bg-white p-4 rounded shadow-sm border-l-4 border-coviar-red flex items-center">
                  <span className="font-semibold text-gray-800">{pillar}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Derecha: Sistema Evolutivo */}
          <div className="bg-coviar-borravino text-white p-8 rounded-xl shadow-xl relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-2xl font-serif font-bold mb-4">No es un ranking,<br/>es evolución.</h3>
              <p className="text-white/90 mb-6">
                La plataforma funciona como una herramienta técnica para crecer. Las bodegas pueden avanzar desde un <strong>Nivel Inicial</strong> hasta niveles más exigentes a medida que consolidan sus prácticas.
              </p>
              <ul className="space-y-3 text-sm">
                <li className="flex items-center"><span className="w-2 h-2 bg-coviar-red rounded-full mr-2"></span>Reportes detallados por indicador</li>
                <li className="flex items-center"><span className="w-2 h-2 bg-coviar-red rounded-full mr-2"></span>Visualización gráfica de datos</li>
                <li className="flex items-center"><span className="w-2 h-2 bg-coviar-red rounded-full mr-2"></span>Confidencialidad absoluta</li>
              </ul>
            </div>
            {/* Decoración fondo */}
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full"></div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Pillars;
