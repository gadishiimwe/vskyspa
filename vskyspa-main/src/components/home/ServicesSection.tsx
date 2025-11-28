import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Sparkles, Flower, Star } from "lucide-react";
import { useTranslation } from "react-i18next";
import serviceSkincare from "@/assets/service-skincare.jpg";
import serviceFacial from "@/assets/service-facial.jpg";
import serviceMassage from "@/assets/service-massage.jpg";
import serviceNails from "@/assets/service-nails.jpg";

const ServicesSection = () => {
  const { t } = useTranslation();

  const services = [
    {
      title: t("services.body-massage.title"),
      slug: "body-massage",
      description: t("services.body-massage.description"),
      image: "https://images.pexels.com/photos/6187644/pexels-photo-6187644.jpeg",
      icon: Flower,
    },
    {
      title: t("services.skin-care.title"),
      slug: "skin-care",
      description: t("services.skin-care.description"),
      image: "https://images.pexels.com/photos/5240367/pexels-photo-5240367.jpeg",
      icon: Heart,
    },
    {
      title: t("services.hair-care.title"),
      slug: "hair-care",
      description: t("services.hair-care.description"),
      image: "https://i.pinimg.com/736x/c4/b2/08/c4b2089bf4b5e8e98eebcb94e2eb742f.jpg",
      icon: Sparkles,
    },
    {
      title: t("services.coffee-services.title"),
      slug: null,
      description: t("services.coffee-services.description"),
      image: "https://images.pexels.com/photos/2638019/pexels-photo-2638019.jpeg",
      icon: Star,
    },
  ];

  return (
    <section className="py-20 gradient-soft" aria-labelledby="home-services-heading">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12 animate-fade-up">
          <div className="sparkle p-6 rounded-2xl backdrop-blur-elegant border-gradient shadow-elegant inline-block">
            <p className="text-gold text-lg font-semibold mb-2 animate-pulse-soft">{t("home.services.section.title")}</p>
            <h2 id="home-services-heading" className="text-rose text-4xl md:text-5xl font-bold mb-4 animate-glow">{t("home.services.section.subtitle")}</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              {t("home.services.section.description")}
            </p>
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {services.map((service, index) => (
            <Card
              key={index}
              className="group overflow-hidden border-none shadow-soft hover:shadow-strong transition-smooth bg-card"
            >
              <CardContent className="p-0">
                <div className="flex flex-col md:flex-row">
                  {/* Image */}
                  <div className="md:w-1/2 overflow-hidden">
                    <img
                      src={service.image}
                      srcSet={`${service.image} 1x, ${service.image} 2x`}
                      loading="lazy"
                      decoding="async"
                      alt={`${service.title} experience at V&SKY SPA Kigali`}
                      className="w-full h-64 md:h-full object-cover group-hover:scale-110 transition-smooth duration-500"
                    />
                  </div>

                  {/* Content */}
                  <div className="md:w-1/2 p-8 flex flex-col justify-center">
                    <h3 className="text-foreground text-2xl font-bold mb-4 animate-pulse-soft">{service.title}</h3>
                    <p className="text-muted-foreground mb-6 leading-relaxed">{service.description}</p>
                    <Link to={service.slug ? `/services/${service.slug}` : "/coffee-services"}>
                      <Button variant="outline" className="w-fit hover-lift transition-smooth" aria-label={`Learn more about ${service.title}`}>
                        Learn More
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA Button */}
        <div className="text-center animate-fade-up">
          <Link to="/services">
            <Button variant="hero" size="lg" aria-label="View all Kigali spa services">
              {t("services.title")}
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
