import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import SEO from "@/components/SEO";
import { pageSEO } from "@/seo/seoConfig";
import { useTranslation } from "react-i18next";

function generateTitle(filename: string) {
  // Remove folder path & extension, replace - and _ with spaces, capitalize words
  const name = filename
    .replace(/^.*[\\/]/, "") // remove path
    .replace(/\.[^/.]+$/, "") // remove extension
    .replace(/[-_]+/g, " "); // replace - and _ with spaces
  return name
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

import vskyspa from "@/assets/VSKYSPA.jpeg";
import barco_sits from "@/assets/barco_sits.jpeg";
import beds from "@/assets/beds.jpeg";
import upstairs from "@/assets/upstairs.jpeg";
import upsits from "@/assets/up_sitts.jpeg";
import vskyGateBanner from "@/assets/V&SKY Gate Banner.jpg";
import reception from "@/assets/reception.png";
import sittingroom from "@/assets/sitting_room.jpeg";
import flowersdecoration from "@/assets/flowers_decoration.jpeg";
import vskyvideo from "@/assets/vskyvideo.mp4";


const manualGalleryItems = [
  { image: vskyGateBanner, title: "V&SKY Gate Banner", category: "Gallery" },
  { image: flowersdecoration, title: "Beautiful Flowers", category: "Gallery" },
  { image: vskyvideo },
  { image: vskyspa, title: "V&SKY SPA", category: "Gallery" },
  { image: reception, title: "Reception", category: "Gallery" },
  { image: sittingroom, title: "Sitting Room", category: "Gallery" },
  { image: barco_sits, title: "Relaxing Place", category: "Gallery" },
  { image: beds, title: "V&SKY Beds", category: "Gallery" },
  { image: upstairs, title: "Decorations", category: "Gallery" },
  { image: upsits, title: "Up Sits", category: "Gallery" },
];

const Gallery = () => {
  const { t } = useTranslation();
  const [loadedImages, setLoadedImages] = React.useState<Record<number, boolean>>({});

  // Preload first few critical images
  React.useEffect(() => {
    const preloadImages = manualGalleryItems.slice(0, 6).map(item => item.image);
    preloadImages.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  const handleImageLoad = (index: number) => {
    setLoadedImages(prev => ({ ...prev, [index]: true }));
  };

  const galleryItems = manualGalleryItems;

  const gallerySEO = pageSEO.gallery;
  const gallerySchema = {
    "@context": "https://schema.org",
    "@type": "ImageGallery",
    name: "V&SKY SPA Kigali Gallery",
    url: gallerySEO.url,
    image: galleryItems.map((item) => item.image),
  };

  return (
    <div className="min-h-screen">
      <SEO
        title={gallerySEO.title}
        description={gallerySEO.description}
        url={gallerySEO.url}
        canonical={gallerySEO.canonical}
        image={gallerySEO.image}
        type={gallerySEO.type}
        keywords={gallerySEO.keywords}
        jsonLd={[gallerySchema]}
        additionalMetaTags={
          <>
            <meta property="og:image:alt" content="V&SKY SPA Kigali gallery" />
            <meta name="twitter:image:alt" content="V&SKY SPA Kigali gallery" />
          </>
        }
      />
      <Navbar />

      {/* Hero Section */}
      <section className="mt-[116px] pt-32 md:pt-24 pb-16 gradient-soft" aria-labelledby="gallery-hero-heading">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto animate-fade-up">
            <h1 id="gallery-hero-heading" className="text-5xl md:text-6xl font-bold mb-6">{t("gallery.hero.title")}</h1>
            <p className="text-xl text-muted-foreground">
              {t("gallery.hero.subtitle")}
            </p>
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-20 relative" aria-label="Spa gallery grid">
        <div className="absolute inset-0 bg-gradient-soft" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {galleryItems.map((item, index) => (
              <div
                key={index}
                className="group relative overflow-hidden rounded-2xl shadow-soft hover:shadow-strong transition-smooth animate-fade-up cursor-pointer"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="aspect-square relative">
                  {!loadedImages[index] && (
                    <div className="absolute inset-0 bg-muted animate-pulse rounded-2xl" />
                  )}
                  {item.image.endsWith(".mp4") ? (
  <video
    src={item.image}
    className="w-full h-full object-cover rounded-2xl"
    controls
    autoPlay={false}
    preload="metadata"
  />
) : (
  <img
    src={item.image}
    srcSet={`${item.image} 1x, ${item.image} 2x`}
    loading="lazy"
    decoding="async"
    alt={`${item.title} at V&SKY SPA Kigali`}
    className={`w-full h-full object-cover group-hover:scale-110 transition-smooth duration-500 ${
      loadedImages[index] ? "opacity-100" : "opacity-0"
    }`}
    onLoad={() => handleImageLoad(index)}
  />
)}

                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-smooth pointer-events-none">
  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
    <p className="text-sm font-semibold text-primary-light mb-1">{item.category}</p>
    <h3 className="text-xl font-bold">{item.title}</h3>
  </div>
</div>

              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-muted/30" aria-labelledby="gallery-cta-heading">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 id="gallery-cta-heading" className="text-4xl font-bold mb-6">{t("gallery.cta.title")}</h2>
            <p className="text-xl text-muted-foreground mb-8">
              {t("gallery.cta.subtitle")}
            </p>
            <Link to="/booking">
              <Button variant="hero" size="lg" aria-label="Book Kigali spa visit">
                {t("gallery.cta.button")}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Gallery;
