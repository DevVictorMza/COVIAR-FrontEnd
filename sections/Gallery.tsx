"use client"

import * as React from "react"
import Autoplay from "embla-carousel-autoplay"
import Image from "next/image"

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Card, CardContent } from "@/components/ui/card"

export default function Gallery() {
  const plugin = React.useRef(
    Autoplay({ delay: 4000, stopOnInteraction: false })
  )

  // Array of images - using placeholders or assuming files will be there
  // Since the user just created the folder, I'll list some filenames that they should fill
  
  // Note: For this to work, the user needs to add images to public/assets/landing-carousel/
  // named slide1.jpg, slide2.jpg, etc. or I can use dynamic generation if I had a server component traversing files.
  // For static content, we usually define a list.
  const images = [
    {
      src: "/assets/landing-carousel/DSC0372.jpg",
      alt: "Imagen de viñedo 1",
    },
    {
      src: "/assets/landing-carousel/DSC0269.jpg",
      alt: "Imagen de bodega 1",
    },
    {
      src: "/assets/landing-carousel/DSC0545.jpg",
      alt: "Proceso de producción",
    },
    {
      src: "/assets/landing-carousel/DSC0182.jpg",
      alt: "Sostenibilidad en acción",
    },
  ]

  return (
    <section className="w-full bg-gray-50 dark:bg-gray-900">
      <div className="w-full">
        <div className="flex justify-center w-full">
          <Carousel
            plugins={[plugin.current]}
            className="w-full"
            opts={{
              loop: true,
              align: "start",
            }}
          >
            <CarouselContent className="-ml-0">
              {images.map((img, index) => (
                <CarouselItem key={index} className="pl-0 basis-full">
                  <div className="relative w-full h-[500px] md:h-[600px] lg:h-[700px]">
                    <div className="w-full h-full relative bg-gray-200 flex items-center justify-center">
                      <Image
                        src={img.src}
                        alt={img.alt}
                        fill
                        className="object-cover"
                        priority={index === 0}
                      /> 
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-4" />
            <CarouselNext className="right-4" />
          </Carousel>
        </div>
      </div>
    </section>
  )
}

