const Process = () => {
  const steps = [
    { num: "01", title: "Registro", desc: "Creación del perfil único de tu bodega en la plataforma segura de COVIAR." },
    { num: "02", title: "Categorías", desc: "El sistema adapta la encuesta según tu tamaño: desde 'Micro Bodega' hasta 'Gran Bodega Turística'." },
    { num: "03", title: "Evaluación", desc: "Completá los indicadores por capítulos: Gobernanza, Agua, Energía, Residuos, etc." },
    { num: "04", title: "Resultados", desc: "Obtené tu puntaje total, nivel de sostenibilidad alcanzado e inform de mejoras." },
  ];

  return (
    <section id="proceso" className="scroll-mt-32 py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h3 className="font-serif text-2xl md:text-3xl font-bold text-coviar-borravino mb-2">
            Proceso
          </h3>
          <h2 className="text-coviar-borravino-dark text-3xl md:text-4xl lg:text-5xl font-serif font-bold mt-2">Camino a la Autoevaluación ¿Cómo funciona?</h2>
        </div>

        <div className="grid md:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative group text-center md:text-left">
              <div className="text-5xl font-bold text-gray-100 group-hover:text-coviar-red/10 transition-colors mb-4 absolute -top-8 -left-4 -z-10">
                {step.num}
              </div>
              <div className="w-12 h-12 bg-coviar-borravino text-white rounded-full flex items-center justify-center font-bold text-xl mb-4 mx-auto md:mx-0 shadow-lg relative z-10">
                {index + 1}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{step.desc}</p>
              
              {/* Línea conectora (solo visible en desktop, excepto el último) */}
              {index !== steps.length - 1 && (
                <div className="hidden md:block absolute top-6 left-12 w-full h-0.5 bg-gray-100 -z-20"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Process;
