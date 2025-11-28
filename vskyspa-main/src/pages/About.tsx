import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Heart, Target, Eye, Award, Users, Zap, Leaf, Crown } from "lucide-react";
import nobg from "@/assets/nobg.png";
import beds from "@/assets/beds.jpeg";
import aboutHeroBg from "@/assets/about-hero-bg.jpg";
import aboutMissionBg from "@/assets/about-mission-bg.jpg";
import SEO from "@/components/SEO";
import { pageSEO } from "@/seo/seoConfig";
import { useTranslation } from "react-i18next";

const About = () => {
  const { t } = useTranslation();
  const aboutSEO = pageSEO.about;
  const aboutSchema = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: "About V&SKY SPA Kigali",
    description: aboutSEO.description,
    url: aboutSEO.url,
    mainEntity: {
      "@type": "Spa",
      name: "V&SKY SPA",
      address: "Kibagabaga, Kigali, Rwanda",
    },
  };

  // Preload critical images
  React.useEffect(() => {
    const preloadImages = [aboutHeroBg, beds, nobg, aboutMissionBg];
    preloadImages.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  return (
    <div className="min-h-screen">
      <SEO
        title={aboutSEO.title}
        description={aboutSEO.description}
        url={aboutSEO.url}
        canonical={aboutSEO.canonical}
        image={aboutSEO.image}
        type={aboutSEO.type}
        keywords={aboutSEO.keywords}
        jsonLd={[aboutSchema]}
        additionalMetaTags={
          <>
            <meta property="og:image:alt" content="About V&SKY SPA Kigali wellness experts" />
            <meta name="twitter:image:alt" content="About V&SKY SPA Kigali wellness experts" />
          </>
        }
      />
      <Navbar />
      
      {/* Hero Section */}
      <section className="mt-[116px] pt-32 md:pt-24 pb-16 relative overflow-hidden" aria-labelledby="about-hero-heading">
        <div className="absolute inset-0">
          <img
            src={aboutHeroBg}
            alt="Luxury spa Rwanda background"
            className="w-full h-full object-cover opacity-35"
            loading="eager"
            decoding="async"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/70 to-background/50" />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-3xl mx-auto animate-fade-up">
            <h1 id="about-hero-heading" className="text-5xl md:text-6xl font-bold mb-6">{t("about.hero.title")}</h1>
            <p className="text-xl text-muted-foreground">
              {t("about.hero.subtitle")}
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20" aria-labelledby="our-story-heading">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-up">
              <img
                src={beds}
                srcSet={`${beds} 1x, ${beds} 2x`}
                loading="lazy"
                decoding="async"
                alt="Spa lounge and relaxation area in Kigali"
                className="rounded-2xl shadow-strong w-full h-full object-cover"
              />
            </div>
            <div className="animate-fade-up">
              <p className="text-primary text-lg font-semibold mb-2">{t("about.story.title")}</p>
              <h2 id="our-story-heading" className="text-4xl font-bold mb-6">{t("about.story.subtitle")}</h2>
              <p className="text-muted-foreground mb-4">
                {t("about.story.description1")}
              </p>
              <p className="text-muted-foreground mb-6">
                {t("about.story.description2")}
              </p>
              <Link to="/services">
                <Button variant="hero" aria-label="Explore Kigali spa services">{t("about.story.cta")}</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-muted/30" aria-labelledby="values-heading">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 id="values-heading" className="text-4xl font-bold mb-4">{t("about.values.title")}</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {t("about.values.subtitle")}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Heart,
                title: t("about.values.passion"),
                description: t("about.values.passion.desc"),
              },
              {
                icon: Target,
                title: t("about.values.excellence"),
                description: t("about.values.excellence.desc"),
              },
              {
                icon: Eye,
                title: t("about.values.vision"),
                description: t("about.values.vision.desc"),
              },
              {
                icon: Award,
                title: t("about.values.quality"),
                description: t("about.values.quality.desc"),
              },
            ].map((value, index) => (
              <div
                key={index}
                className="text-center p-8 bg-card rounded-2xl shadow-soft hover:shadow-strong transition-smooth animate-fade-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-16 h-16 rounded-full gradient-primary flex items-center justify-center mx-auto mb-4">
                  <value.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">{value.title}</h3>
                <p className="text-muted-foreground">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Difference - Offset Design */}
      <section className="py-20 overflow-hidden" aria-labelledby="difference-heading">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="animate-fade-up">
              <p className="text-primary text-lg font-semibold mb-2">{t("about.difference.title")}</p>
              <h2 id="difference-heading" className="text-4xl font-bold mb-6">{t("about.difference.subtitle")}</h2>
              <p className="text-lg text-muted-foreground mb-8">
                {t("about.difference.description")}
              </p>
              <div className="grid gap-6">
                {[
                  { icon: Users, title: t("about.difference.experts"), desc: t("about.difference.experts.desc") },
                  { icon: Zap, title: t("about.difference.technology"), desc: t("about.difference.technology.desc") },
                  { icon: Leaf, title: t("about.difference.products"), desc: t("about.difference.products.desc") },
                  { icon: Crown, title: t("about.difference.treatment"), desc: t("about.difference.treatment.desc") },
                ].map((item, index) => (
                  <Card key={index} className="border-none shadow-soft hover:shadow-strong transition-smooth">
                    <CardContent className="flex items-start gap-4 p-6">
                      <div className="w-12 h-12 rounded-lg gradient-primary flex items-center justify-center flex-shrink-0">
                        <item.icon className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg mb-1">{item.title}</h3>
                        <p className="text-muted-foreground">{item.desc}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
            <div className="relative lg:pl-12">
              <div className="relative transform lg:translate-y-8">
                <div className="relative">
                  {/* Main large image */}
                  <img
                    src={nobg}
                    srcSet={`${nobg} 1x, ${nobg} 2x`}
                    loading="lazy"
                    decoding="async"
                    alt="Spa excellence team at V&SKY SPA Kigali"
                    className="w-full h-116 object-cover"
                  />
                </div>
              </div>
              <div className="absolute -top-8 -left-8 w-48 h-68 rounded-full gradient-primary opacity-10 blur-3xl" />
              <div className="absolute -bottom-8 -right-8 w-48 h-48 rounded-full gradient-primary opacity-10 blur-3xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 relative overflow-hidden " aria-labelledby="mission-vision-heading">
        <div className="absolute inset-0 bg-fixed bg-cover bg-center" style={{ backgroundImage: `url(${aboutMissionBg})` }}>
          <div className="absolute inset-0 bg-gradient-to-r from-background/98 via-background/95 to-background/90" />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto">
            <h2 id="mission-vision-heading" className="sr-only">{t("about.mission.title")} and {t("about.vision.title")}</h2>
            <div className="grid md:grid-cols-2 gap-12">
              <Card className="border-none shadow-strong bg-card/95 backdrop-blur">
                <CardContent className="p-8">
                  <div className="w-16 h-16 rounded-full gradient-primary flex items-center justify-center mb-6">
                    <Target className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-3xl font-bold mb-4">{t("about.mission.title")}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {t("about.mission.description")}
                  </p>
                </CardContent>
              </Card>
              <Card className="border-none shadow-strong bg-card/95 backdrop-blur">
                <CardContent className="p-8">
                  <div className="w-16 h-16 rounded-full gradient-primary flex items-center justify-center mb-6">
                    <Eye className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-3xl font-bold mb-4">{t("about.vision.title")}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {t("about.vision.description")}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20" aria-labelledby="about-cta-heading">
        <div className="container mx-auto px-4">
          <div className="gradient-primary rounded-3xl p-12 text-center text-white">
            <h2 id="about-cta-heading" className="text-4xl font-bold mb-6">{t("about.cta.title")}</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              {t("about.cta.subtitle")}
            </p>
            <Link to="/booking">
              <Button variant="outline" size="lg" className="bg-white text-primary hover:bg-white/90" aria-label="Book your first Kigali spa appointment">
                {t("about.cta.button")}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
