import Link from 'next/link';

const Hero = () => {
  return (
    <section id="inicio" className="scroll-mt-32 relative w-full h-screen min-h-150 bg-gray-100 flex items-center justify-center overflow-hidden">
      
      {/* FONDO: Imagen + Superposición Corporativa */}
      <div className="absolute inset-0 z-0">
        <div className="w-full h-full bg-gray-200">
           {/* eslint-disable-next-line @next/next/no-img-element */}
           <img src="/assets/header-banner.png" alt="Viñedo" className="w-full h-full object-cover" />
        </div>
        {/* Degradado Borravino con opacidad para leer el texto */}
        <div className="absolute inset-0 bg-gradient-to-r from-coviar-borravino/95 to-coviar-borravino/70 mix-blend-multiply"></div>
      </div>

      {/* CONTENIDO */}
      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto mt-16">
        <div className="mb-4 inline-block bg-white/10 px-4 py-1 rounded-full border border-white/20 backdrop-blur-sm">
          <span className="text-white text-sm font-semibold tracking-wider uppercase">Guía de Enoturismo Sostenible</span>
        </div>

        <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
          Plataforma de Autoevaluación para Bodegas Turísticas <br />
          <span className="text-white border-b-4 border-coviar-red">y sus Experiencias Enoturísticas</span>
        </h1>
        
        <p className="font-sans text-lg md:text-xl text-gray-100 mb-10 max-w-3xl mx-auto font-light leading-relaxed">
          Evaluá, ordená y fortalecé la sostenibilidad de tu bodega con estándares internacionales adaptados a nuestra realidad vitivinícola.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <a href="#introduccion" className="text-white border border-white/40 hover:border-white px-8 py-4 rounded-md font-medium transition duration-300 hover:bg-white/10 uppercase tracking-wide text-sm">
            Más información
          </a>
        </div>
      </div>

      {/* Decoración Inferior (Rombo) */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none transform rotate-180">
        <svg className="relative block w-full h-15" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M1200 120L0 16.48 0 0 1200 0 1200 120z" className="fill-gray-50"></path>
        </svg>
      </div>
    </section>
  );
};

export default Hero;
