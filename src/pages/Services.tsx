import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Sparkles, Heart, Flower2, Flame, Coffee } from "lucide-react";
import React from "react";
import serviceSkincare from "@/assets/service-skincare.jpg";
import serviceFacial from "@/assets/service-facial.jpg";
import serviceMassage from "@/assets/service-massage.jpg";
import servicesBodyMassage from "@/assets/services-body-massage.jpg";
import servicesHairCare from "@/assets/services-hair-care.jpg";
import servicesCoffee from "@/assets/services-coffee.jpg";
import servicesHeroBg from "@/assets/services-hero-bg.jpg";
import SEO from "@/components/SEO";
import { pageSEO, siteUrl } from "@/seo/seoConfig";
import { useTranslation } from "react-i18next";

const Services = () => {
  const { t } = useTranslation();
  // Preload critical images
  React.useEffect(() => {
    const preloadImages = [
      servicesHeroBg,
      servicesBodyMassage,
      serviceSkincare,
      servicesHairCare,
      servicesCoffee,
      serviceSkincare
    ];
    preloadImages.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  const services = [
    {
      icon: Flower2,
      title: t("services.body-massage.title"),
      slug: "body-massage",
      image: "https://images.pexels.com/photos/6187644/pexels-photo-6187644.jpeg",
      description: t("services.body-massage.description"),
      treatments: ["Full Body Relax Massage (Oil)",
        "Hot Stone Massage (Oil)",
        "Deep Tissue Massage (Oil)",
        "Four Hands Massage (Oil)",
        "Head Massage & Hair Wash",
        "Professional Foot Bath Massage",
        "Shoulder, Back, Head & Leg Massage"],
      price: "From 20,000RWF",
    },
    {
      icon: Sparkles,
      title: t("services.skin-care.title"),
      slug: "skin-care",
      image: serviceSkincare,
      description: t("services.skin-care.description"),
      treatments: ["Deep Cleaning for Full Body", "Face Cleaning & Moisturizing"],
      price: "From 40,000RWF",
    },
    // {
    //   icon: Heart,
    //   title: "Face Masking",
    //   slug: "face-masking",
    //   image: serviceFacial,
    //   description: "Specialized facial masks tailored to your unique skin needs.",
    //   treatments: ["Clay Mask", "Sheet Mask", "Peel-Off Mask", "Overnight Mask"],
    //   price: "From $60",
    // },

    {
      icon: Flame,
      title: t("services.hair-care.title"),
      slug: "hair-care",
      image: "https://i.pinimg.com/1200x/78/90/b2/7890b2405adb6fb2117fdd403d316f09.jpg",
      description: t("services.hair-care.description"),
      treatments: ["Braiding Hair"],
      price: "From 20,000RWF",
    },
    {
      icon: Coffee,
      title: t("services.coffee-services.title"),
      slug: "coffee-services",
      image: "https://images.pexels.com/photos/2638019/pexels-photo-2638019.jpeg",
      description: t("services.coffee-services.description"),
      treatments: ["Cappuccino Coffee", "Café Latte", "Americano Coffee", "Hot Chocolate", "Black Coffee", "African Tea", "African Coffee", "Spicy Tea", "Fruit Tea", "Iced Cappuccino", "Iced Café Mocha", "Iced Café Latte", "Iced Americano"],
      price: "From 3,000RWF",
    },
  ];

  const servicesSchema = services.map((service, index) => ({
    "@context": "https://schema.org",
    "@type": "Service",
    name: `${service.title} at V&SKY SPA Kigali`,
    serviceType: service.title,
    provider: {
      "@type": "Spa",
      name: "V&SKY SPA",
      url: siteUrl,
    },
    description: service.description,
    areaServed: "Kigali, Rwanda",
    offers: {
      "@type": "Offer",
      price: service.price,
      priceCurrency: "RWF",
      availability: "https://schema.org/InStock",
      url: `${siteUrl}${service.slug ? `/services/${service.slug}` : "/coffee-services"}`,
    },
    position: index + 1,
  }));

  const servicesSEO = pageSEO.services;

  return (
    <div className="min-h-screen">
      <SEO
        title={servicesSEO.title}
        description={servicesSEO.description}
        url={servicesSEO.url}
        canonical={servicesSEO.canonical}
        image={servicesSEO.image}
        type={servicesSEO.type}
        keywords={servicesSEO.keywords}
        jsonLd={servicesSchema}
        additionalMetaTags={
          <>
            <meta property="og:image:alt" content="V&SKY SPA Kigali massage and skincare services" />
            <meta name="twitter:image:alt" content="V&SKY SPA Kigali massage and skincare services" />
          </>
        }
      />
      <Navbar />
      
      {/* Hero Section */}
      <section className="mt-[116px] pt-32 md:pt-24 pb-16 relative overflow-hidden" aria-labelledby="services-hero-heading">
        <div className="absolute inset-0">
          <img
            src={servicesHeroBg}
            alt="Luxurious spa treatment room in Kigali"
            className="w-full h-full object-cover opacity-35"
            loading="eager"
            decoding="async"
          />
          <div className="absolute inset-0" />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-3xl mx-auto animate-fade-up">
            <h1 id="services-hero-heading" className="text-5xl md:text-6xl font-bold mb-6">{t("services.hero.title")}</h1>
            <p className="text-xl text-muted-foreground">
              {t("services.hero.subtitle")}
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 relative" aria-labelledby="service-categories-heading">
        <div className="absolute inset-0 bg-muted/20" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-12">
            <h2 id="service-categories-heading" className="text-4xl font-bold mb-4">{t("services.categories.title")}</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {t("services.categories.subtitle")}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <Card
                key={index}
                className="group overflow-hidden border-none shadow-soft hover:shadow-strong transition-smooth animate-fade-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-0">
                  {/* Image */}
                  <Link to={service.slug ? `/services/${service.slug}` : "/coffee-services"}>
                    <div className="overflow-hidden relative h-48 cursor-pointer">
                      <img
                        src={service.image}
                        srcSet={`${service.image} 1x, ${service.image} 2x`}
                        sizes="(max-width: 768px) 100vw, 33vw"
                        loading="lazy"
                        decoding="async"
                        alt={`${service.title} experience at V&SKY SPA Kigali`}
                        className="w-full h-full object-cover group-hover:scale-110 transition-smooth duration-500"
                      />
                      <div className="absolute top-4 right-4 w-12 h-12 rounded-full gradient-primary flex items-center justify-center">
                        <service.icon className="h-6 w-6 text-white" />
                      </div>
                    </div>
                  </Link>

                  {/* Content */}
                  <div className="p-6">
                    <Link to={service.slug ? `/services/${service.slug}` : "/coffee-services"}>
                      <h3 className="text-xl font-bold mb-2 hover:text-primary transition-smooth cursor-pointer">
                        {t(`services.${service.slug}.title`)}
                      </h3>
                    </Link>
                    <p className="text-muted-foreground mb-4">
                      {service.description}
                    </p>

                    {/* Treatments List */}
                    <div className="mb-4">
                      <p className="font-semibold mb-2">{t("services.treatments.include")}</p>
                      <ul className="space-y-1">
                        {service.treatments.map((treatment, idx) => (
                          <li key={idx} className="text-sm text-muted-foreground flex items-center">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary mr-2" />
                            {treatment}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Price and Button */}
                    <div className="flex items-center justify-between pt-4 border-t">
                      <span className="text-lg font-bold text-primary">{service.price}</span>
                      <Link to={service.slug ? `/services/${service.slug}` : "/coffee-services"}>
                        <Button variant="outline" size="sm" aria-label={`Learn more about ${service.title}`}>
                          {t("services.learnMore")}
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 bg-muted/30 relative overflow-hidden" aria-labelledby="why-choose-services-heading">
        <div className="absolute inset-0 bg-fixed">
          <img src={serviceSkincare} alt="Serene Kigali spa background" className="w-full h-full object-cover bg-fixed opacity-10" loading="lazy" decoding="async" />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-12">
            <h2 id="why-choose-services-heading" className="text-4xl font-bold mb-4">{t("services.why.title")}</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {t("services.why.subtitle")}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="text-center p-8 border-none shadow-soft">
              <div className="w-20 h-20 rounded-full gradient-primary flex items-center justify-center mx-auto mb-4">
                <Sparkles className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">{t("services.why.experts.title")}</h3>
              <p className="text-muted-foreground">
                {t("services.why.experts.desc")}
              </p>
            </Card>

            <Card className="text-center p-8 border-none shadow-soft">
              <div className="w-20 h-20 rounded-full gradient-primary flex items-center justify-center mx-auto mb-4">
                <Heart className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">{t("services.why.products.title")}</h3>
              <p className="text-muted-foreground">
                {t("services.why.products.desc")}
              </p>
            </Card>

            <Card className="text-center p-8 border-none shadow-soft">
              <div className="w-20 h-20 rounded-full gradient-primary flex items-center justify-center mx-auto mb-4">
                <Flower2 className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">{t("services.why.environment.title")}</h3>
              <p className="text-muted-foreground">
                {t("services.why.environment.desc")}
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-muted/30" aria-labelledby="service-cta-heading">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 id="service-cta-heading" className="text-4xl font-bold mb-6">{t("services.cta.title")}</h2>
            <p className="text-xl text-muted-foreground mb-8">
              {t("services.cta.subtitle")}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link to="/contact">
                <Button variant="hero" size="lg" aria-label="Contact V&SKY SPA Kigali">
                  {t("services.cta.contact")}
                </Button>
              </Link>
              <Link to="/booking">
                <Button variant="outline" size="lg" aria-label="Book spa consultation in Kigali">
                  {t("services.cta.book")}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Services;
