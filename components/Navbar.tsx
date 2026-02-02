"use client"

import { useState } from 'react';
import Link from 'next/link';

const logoColor = "/assets/logos/logocolorhorz.png";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  // Definimos los items en un array para usarlos tanto en móvil como en escritorio
  const navLinks = [
    { name: 'Inicio', href: '#inicio' },
    { name: '¿Para qué sirve?', href: '#introduccion' },
    { name: 'Proceso', href: '#proceso' },
    { name: 'Mejora continua', href: '#mejora-continua' },
  ];

  return (
    <nav className="bg-white shadow-md fixed w-full z-50 top-0 left-0 font-sans transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-32 items-center"> {/* Altura aumentada para mejor visibilidad */}
          
          {/* LOGO COVIAR - Versión Positiva */}
          <div className="shrink-0 flex items-center">
            <a href="#" className="block">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                className="h-28 w-auto object-contain hover:opacity-90 transition-opacity" // Logo aumentado aprox 50%
                src={logoColor} 
                alt="COVIAR Corporación Vitivinícola Argentina" 
              />
            </a>
          </div>

          {/* MENÚ DE ESCRITORIO */}
          <div className="hidden md:flex space-x-8 items-center">
            {navLinks.map((item) => (
              <a 
                key={item.name}
                href={item.href} 
                className="text-gray-600 hover:text-coviar-borravino px-4 py-2 font-medium transition duration-300 uppercase text-sm tracking-widest"
              >
                {item.name}
              </a>
            ))}
            
           
            <Link href="/login" className="bg-coviar-red text-white px-6 py-2 rounded shadow-md hover:bg-red-700 transition duration-300 font-bold uppercase text-sm tracking-widest transform hover:-translate-y-0.5">
              Ingresar
            </Link>
          </div>

          {/* BOTÓN HAMBURGUESA (Móvil) */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-coviar-borravino hover:text-coviar-red focus:outline-none"
            >
              {isOpen ? (
                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* MENÚ MÓVIL (Completo y Estilizado) */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 absolute w-full shadow-lg">
          <div className="px-4 pt-2 pb-6 space-y-2 flex flex-col">
            {navLinks.map((item) => (
              <a 
                key={item.name}
                href={item.href}
                className="block text-gray-600 hover:text-coviar-borravino hover:bg-gray-50 px-3 py-3 rounded-md font-medium uppercase text-base tracking-wide"
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </a>
            ))}
            {/* CTA Móvil */}
            <Link href="/login" className="block w-full text-center bg-coviar-red text-white px-4 py-3 mt-4 rounded-md hover:bg-red-700 uppercase text-base font-bold tracking-widest" onClick={() => setIsOpen(false)}>
              Ingresar
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
