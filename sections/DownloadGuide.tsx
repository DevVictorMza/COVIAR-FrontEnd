const DownloadGuide = () => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          
          {/* Tarjeta de Descarga */}
          <a 
            href="/documents/guia-sostenibilidad-enoturistica-argentina.pdf"
            download="Guia-Sostenibilidad-Enoturistica-Argentina.pdf"
            className="block bg-gradient-to-br from-coviar-borravino to-coviar-borravino-dark p-8 md:p-12 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden group"
          >
            {/* Decoración de fondo */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 group-hover:scale-110 transition-transform duration-500"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-coviar-red/10 rounded-full -ml-24 -mb-24 group-hover:scale-110 transition-transform duration-500"></div>
            
            <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
              
              {/* Icono PDF */}
              <div className="flex-shrink-0 w-20 h-20 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/20 group-hover:bg-white/20 transition-colors">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>

              {/* Texto */}
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-2xl md:text-3xl font-serif font-bold text-white mb-2">
                  Para más información
                </h3>
                <p className="text-white/90 text-lg">
                  Descargue nuestra Guía de Sostenibilidad Enoturística Argentina
                </p>
              </div>

              {/* Flecha */}
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/20 group-hover:bg-white/20 group-hover:translate-x-1 transition-all">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </div>
              </div>

            </div>
          </a>

        </div>
      </div>
    </section>
  );
};

export default DownloadGuide;