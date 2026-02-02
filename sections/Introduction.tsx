const Introduction = () => {
  const benefits = [
    { title: "Diagnóstico Real", desc: "Conocé el nivel actual de desempeño de tu bodega en sostenibilidad con indicadores precisos." },
    { title: "Mejora Continua", desc: "Identificá oportunidades concretas y planificá acciones estratégicas a corto y largo plazo." },
    { title: "Competitividad", desc: "Alineate con las tendencias internacionales y exigencias del turismo sostenible global." },
  ];

  return (
    <section id="introduccion" className="scroll-mt-32 py-20 bg-gray-50 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="font-serif text-2xl md:text-3xl font-bold text-coviar-borravino mb-2">
            Para qué sirve
          </h1>
          <h2 className="text-coviar-borravino-dark font-serif text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Gestión y mejora progresiva
          </h2>
          <p className="text-gray-600 text-lg">
            Esta plataforma es un espacio digital diseñado para acompañar a las bodegas en la gestión de sus prácticas, brindando una hoja de ruta clara hacia la sostenibilidad.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {benefits.map((item, index) => (
            <div key={index} className="bg-white p-8 rounded-lg shadow-sm border-t-4 border-coviar-borravino hover:shadow-md transition-shadow">
              <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
              <p className="text-gray-600 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Introduction;
