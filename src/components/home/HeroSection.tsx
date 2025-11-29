import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";



import VSKYGateBanner from "@/assets/V&SKY Gate Banner.jpg";
import massageTreatment from "@/assets/massage-treatment.jpg";
import facialTreatment from "@/assets/facial-treatment.jpg";
import wellnessTreatment from "@/assets/wellness-treatment.jpg";



const HeroSection = () => {
  const { t } = useTranslation();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState<Record<number, boolean>>({});

  const slides = [
    {
      image: VSKYGateBanner,
      title: t("hero.slide1.title"),
      subtitle: t("hero.slide1.subtitle"),
      description: t("hero.slide1.description"),
    },
    {
      image: massageTreatment,
      title: t("hero.slide2.title"),
      subtitle: t("hero.slide2.subtitle"),
      description: t("hero.slide2.description"),
    },
    {
      image: facialTreatment,
      title: t("hero.slide3.title"),
      subtitle: t("hero.slide3.subtitle"),
      description: t("hero.slide3.description"),
    },
    {
      image: wellnessTreatment,
      title: t("hero.slide4.title"),
      subtitle: t("hero.slide4.subtitle"),
      description: t("hero.slide4.description"),
    },
  ];

  const preloadImages = () => {
    slides.forEach((slide, index) => {
      const img = new Image();
      img.src = slide.image;
      img.onload = () => {
        setImagesLoaded(prev => ({ ...prev, [index]: true }));
      };
    });
  };

  useEffect(() => {
    // Preload all slide images for faster loading
    preloadImages();

    // Check if user has visited before
    const hasVisited = localStorage.getItem('hasVisitedVSKYSPA');
    let loadingTimer: NodeJS.Timeout | undefined;

    if (!hasVisited) {
      // First visit - show loading screen
      setIsLoading(true);
      loadingTimer = setTimeout(() => {
        setIsLoading(false);
        localStorage.setItem('hasVisitedVSKYSPA', 'true');
      }, 2000);
    }

    // Carousel timer (always runs)
    const carouselTimer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => {
      clearInterval(carouselTimer);
      if (loadingTimer) {
        clearTimeout(loadingTimer);
      }
    };
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <section className="relative h-screen mt-[116px] overflow-hidden" aria-label="V&SKY SPA Kigali hero banner">
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? "opacity-100" : "opacity-0"
          }`}
        >
          {/* Background Image */}
          <div
            className="absolute inset-0 bg-cover bg-fixed"
            style={{
              backgroundImage: imagesLoaded[index] ? `url(${slide.image})` : 'none',
              backgroundPosition: index === 1 ? 'right center' : 'center center'
            }}
          >
            <div className={`absolute inset-0 ${index === 0 ? 'bg-black/60' : 'bg-black/20'}`} />
          </div>

          {/* Content */}
          <div className="relative h-full flex items-center justify-center text-center">
            <div className="container mx-auto px-4 max-w-4xl animate-fade-up">
            <p className="text-primary-light text-lg md:text-xl font-semibold mb-4 tracking-wider">
                {slide.subtitle}
              </p>
              <h1 className="text-white text-4xl md:text-6xl lg:text-7xl font-bold mb-6">
                {slide.title}
              </h1>
              <p className="text-white/90 text-lg md:text-xl mb-8 max-w-2xl mx-auto">
                {slide.description}
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Link to="/services">
                  <Button
                    variant="outline"
                    size="lg"
                    className="bg-white/10 backdrop-blur-sm border-white text-white hover:bg-white hover:text-primary"
                    aria-label="View Kigali spa services"
                  >
                    {t("hero.cta.services")}
                  </Button>
                </Link>
                <Link to="/booking">
                  <Button variant="hero" size="lg" aria-label="Book V&SKY SPA appointment">
                    {t("hero.cta.book")}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 border border-white/20 hover:border-white/30 flex items-center justify-center text-white transition-all duration-300 hover:scale-110 shadow-lg z-10"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-5 w-5 md:h-6 md:w-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 border border-white/20 hover:border-white/30 flex items-center justify-center text-white transition-all duration-300 hover:scale-110 shadow-lg z-10"
        aria-label="Next slide"
      >
        <ChevronRight className="h-5 w-5 md:h-6 md:w-6" />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-smooth ${
              index === currentSlide
                ? "bg-primary w-8"
                : "bg-white/50 hover:bg-white/70"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSection;
