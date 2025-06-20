'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

interface CarouselProps {
  divHeightNormal: string;
  divHeightMd: string;
  images: string[];
}

const Carousel = ({ images, divHeightNormal, divHeightMd }: CarouselProps) => {
  const [current, setCurrent] = useState(0);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 3000);

    return () => clearInterval(interval);
  }, [current]);

  const nextSlide = () => {
    setLoaded(false);
    setCurrent((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setLoaded(false);
    setCurrent((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  return (
    <div
      className={`relative md:h-[${divHeightMd}] h-[${divHeightNormal}] min-h-[40vh] w-full mx-auto rounded-l-2xl overflow-hidden`}
    >
      {images.map((item, index) => (
        <Image
          unoptimized
          key={index}
          src={item}
          className={`absolute top-0 left-0 w-full h-full object-cover transition-all duration-500 rounded-l-2xl transform ${
            current === index
              ? 'translate-x-0 opacity-100'
              : 'translate-x-10 opacity-0'
          }`}
          alt="Dark & Dusky Logo"
          width={450}
          height={500}
          onLoad={() => setLoaded(true)}
        />
      ))}

      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 
             text-3xl text-gray-700 hover:text-black transition-all duration-300"
      >
        ‹
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 
             text-3xl text-gray-700 hover:text-black transition-all duration-300"
      >
        ›
      </button>
    </div>
  );
};

export default Carousel;
