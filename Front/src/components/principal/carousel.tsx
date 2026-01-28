import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Autoplay, Navigation, Pagination, EffectFade } from 'swiper/modules';
import 'swiper/css/effect-fade';
import slide1 from '/img/carousel/slide1.jpg';
import slide2 from '/img/carousel/slide2.jpg';
import slide3 from '/img/carousel/slide3.jpg';
import slide4 from '/img/carousel/slide4.jpg';
import slide5 from '/img/carousel/slide5.jpg';
import slide6 from '/img/carousel/slide6.jpg';
import slide7 from '/img/carousel/slide7.jpg';
import slide8 from '/img/carousel/slide8.jpg';

export default function Carousel() {
    const slides = [
        { slide: slide1, alt: "Slide 1" },
        { slide: slide2, alt: "Slide 2" },
        { slide: slide3, alt: "Slide 3" },
        { slide: slide4, alt: "Slide 4" },
        { slide: slide5, alt: "Slide 5" },
        { slide: slide6, alt: "Slide 6" },
        { slide: slide7, alt: "Slide 7" },
        { slide: slide8, alt: "Slide 8" },
    ];

    return (
        <Swiper
            modules={[Autoplay, Navigation, Pagination, EffectFade]}
            effect="fade"
            fadeEffect={{ crossFade: true }}
            spaceBetween={0}
            slidesPerView={1}
            loop={true}
            autoplay={{
                delay: 5000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
            }}
            speed={2000}
            navigation={true}
            pagination={{ clickable: true }}
        >
            {slides.map((slide, index) => (
                <SwiperSlide key={index}>
                    <img src={slide.slide} alt={slide.alt} className="w-full" />
                </SwiperSlide>
            ))}
        </Swiper>
    );
};
