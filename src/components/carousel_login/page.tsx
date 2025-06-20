'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

const images = [
  '/xyz (1).jpeg',
  '/xyz (2).jpeg',
  '/xyz (3).jpeg',
  '/xyz (4).jpeg',
];

const Carousel = () => {
  const [current, setCurrent] = useState(0);
  const [loaded, setLoaded] = useState(false);

  // Autoplay effect
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 3000);

    return () => clearInterval(interval); // Cleanup on unmount
  }, [current]); // Depend on `current` so it updates properly

  const nextSlide = () => {
    setLoaded(false); // Reset animation
    setCurrent((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setLoaded(false); // Reset animation
    setCurrent((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  return (
    <div className="relative h-[80vh] mx-auto rounded-l-2xl overflow-hidden bg-gray-100">
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

      {/* Navigation Buttons */}
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
