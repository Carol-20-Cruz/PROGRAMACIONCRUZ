"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Navigation, Autoplay } from "swiper/modules";

// Importar estilos de Swiper
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";

import "./slideshow.css";
import Image from "next/image";

interface Props {
  images: string[];
  title: string;
  className?: string;
}

export const SlideShowProductMobile = ({ images, title, className }: Props) => {
  return (
    <div className={className}>
      <Swiper
        style={{
          width: "100vw",
          height: "500px",
        }}
        slidesPerView={1}
        spaceBetween={10}
        freeMode
        navigation
        autoplay={{
          delay: 3500,
          disableOnInteraction: false,
        }}
        modules={[FreeMode, Navigation, Autoplay]}
        className="mySwiper"
      >
        {images.map((image, index) => (
          <SwiperSlide key={index}>
            <Image
              src={`/products/${image}`}
              alt={title}
              width={600}
              height={500}
              className="object-cover w-full h-full"
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};
