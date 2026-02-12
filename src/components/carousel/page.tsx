'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

interface CarouselProps {
  divHeightNormal: string;
  divHeightMd: string;
  images: string[]; // md and above
  imagesMd: string[]; // below md
}

const Carousel = ({
  images,
  imagesMd,
  divHeightNormal,
  divHeightMd,
}: CarouselProps) => {
  const [current, setCurrent] = useState(0);
  const [isMdUp, setIsMdUp] = useState(false);

  // Detect screen size
  useEffect(() => {
    const checkScreen = () => {
      setIsMdUp(window.innerWidth >= 768); // Tailwind md breakpoint
    };

    checkScreen();
    window.addEventListener('resize', checkScreen);

    return () => window.removeEventListener('resize', checkScreen);
  }, []);

  const activeImages = isMdUp ? images : imagesMd;

  // Reset index if image set changes
  useEffect(() => {
    setCurrent(0);
  }, [isMdUp]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev === activeImages.length - 1 ? 0 : prev + 1));
    }, 3000);

    return () => clearInterval(interval);
  }, [activeImages.length]);

  const nextSlide = () => {
    setCurrent((prev) => (prev === activeImages.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev === 0 ? activeImages.length - 1 : prev - 1));
  };

  return (
    <div
      className={`relative md:h-[${divHeightMd}] h-[${divHeightNormal}] min-h-[40vh] w-full mx-auto rounded-l-2xl overflow-hidden`}
    >
      {activeImages.map((item, index) => (
        <Image
          unoptimized
          key={index}
          src={item}
          className={`absolute top-0 left-0 w-full h-full object-cover transition-all duration-500 rounded-l-2xl transform ${
            current === index
              ? 'translate-x-0 opacity-100'
              : 'translate-x-10 opacity-0'
          }`}
          alt="Carousel Image"
          width={450}
          height={500}
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
