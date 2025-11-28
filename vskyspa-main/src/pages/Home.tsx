import HeroSection from "@/components/home/HeroSection";
import ServicesSection from "@/components/home/ServicesSection";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import CountUp from "react-countup";
import { Card, CardContent } from "@/components/ui/card";
import { Link, useLocation } from "react-router-dom";
import {
  Sparkles,
  Clock,
  Users,
  Award,
  CheckCircle,
  TrendingUp,
  Shield,
  Heart,
} from "lucide-react";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";
import bgSpaLuxury from "@/assets/bg-spa-luxury.jpg";
import beds from "@/assets/beds.jpeg";
import VSKYSPA from "@/assets/VSKYSPA.jpeg";
import barco_sits from "@/assets/barco_sits.jpeg";
import { Check } from "lucide-react";
import SEO from "@/components/SEO";
import {
  pageSEO,
  breadcrumbEntries,
  localBusinessSchema,
  siteSearchSchema,
  siteUrl,
} from "@/seo/seoConfig";

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: breadcrumbEntries.map((entry, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: entry.name,
    item: `${siteUrl}${entry.path === "/" ? "/" : entry.path}`,
  })),
};

const homeStructuredData = [localBusinessSchema, siteSearchSchema, breadcrumbSchema];

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

const Home = () => {
  const location = useLocation();
  const { t } = useTranslation();
  const homeSEO = pageSEO.home;

  const stats = [
    { icon: Sparkles, value: "500+", label: t("achievements.clients") },
    { icon: Clock, value: "5+", label: t("achievements.experience") },
    { icon: Users, value: "10+", label: t("achievements.staff") },
  ];

  // State to hold carousel api instance
  const [carouselApi, setCarouselApi] = useState(null);

  useEffect(() => {
    if (!carouselApi) return;

    const interval = setInterval(() => {
      if (carouselApi.canScrollNext()) {
        carouselApi.scrollNext();
      } else {
        carouselApi.scrollTo(0);
      }
    }, 5000); // auto slide every 5 seconds

    return () => clearInterval(interval);
  }, [carouselApi]);

  // Handle scroll restoration on back navigation
  useEffect(() => {
    const handleScrollRestoration = () => {
      const scrollPosition = sessionStorage.getItem('homeScrollPosition');
      if (scrollPosition) {
        window.scrollTo(0, parseInt(scrollPosition, 10));
        sessionStorage.removeItem('homeScrollPosition');
      }
    };

    // Check if user navigated back
    const nav = performance.getEntriesByType("navigation")[0] as any;

    if (nav?.type === "back_forward") {
      setTimeout(handleScrollRestoration, 100);
    }

  }, [location]);

  // Save scroll position before navigating away
  useEffect(() => {
    const handleBeforeUnload = () => {
      sessionStorage.setItem('homeScrollPosition', window.scrollY.toString());
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  return (
    <div className="min-h-screen">
      <SEO
        title={homeSEO.title}
        description={homeSEO.description}
        url={homeSEO.url}
        canonical={homeSEO.canonical}
        image={homeSEO.image}
        type={homeSEO.type}
        keywords={homeSEO.keywords}
        jsonLd={homeStructuredData}
        additionalMetaTags={
          <>
            <meta property="og:image:alt" content="V&SKY SPA Kigali luxury wellness and massage suites" />
            <meta name="twitter:image:alt" content="V&SKY SPA Kigali luxury wellness and massage suites" />
          </>
        }
      />
      <Navbar />
      <HeroSection />

      <section className="py-20 relative overflow-hidden" aria-label="V&SKY SPA Kigali impact metrics">
        {/* Optional floating pink elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute w-40 h-40 bg-pink-200 rounded-full opacity-20 animate-pulse-slow top-10 left-5"></div>
          <div className="absolute w-32 h-32 bg-pink-300/30 rounded-full animate-pulse-slow bottom-20 right-10"></div>
          <div className="absolute w-24 h-24 bg-pink-100/40 rounded-full animate-pulse-slow top-1/3 left-1/2"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-extrabold mb-4 text-primary">{t("home.achievements.title")}</h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              {t("home.achievements.subtitle")}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: Sparkles, value: "500+", label: t("achievements.clients"), color: "from-pink-300 to-pink-500" },
              { icon: Clock, value: "5+", label: t("achievements.experience"), color: "from-pink-200 to-pink-400" },
              { icon: Users, value: "10+", label: t("achievements.staff"), color: "from-pink-300 to-pink-500" },
            ].map((stat, index) => (
              <div
                key={index}
                className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg p-8 flex flex-col items-center animate-fade-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`w-16 h-16 mb-4 rounded-full bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-md`}>
                  <stat.icon className="h-8 w-8 text-white" />
                </div>
                <div className="text-4xl md:text-5xl font-extrabold text-pink-600 mb-2">{stat.value}</div>
                <div className="text-gray-600 text-lg">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>


      <ServicesSection />

      {/* Why Choose Us - Offsetting Images */}
      <section className="py-20 overflow-hidden" aria-labelledby="why-vsky-spa-heading">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
            <div className="order-2 lg:order-1 relative">
              <div className="relative">
                <img
                  src={VSKYSPA}
                  srcSet={`${VSKYSPA} 1x, ${VSKYSPA} 2x`}
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  loading="lazy"
                  decoding="async"
                  alt="Luxury spa interior at V&SKY SPA Kigali with relaxation lounges and premium spa ambiance"
                  className="rounded-3xl shadow-strong w-full transform hover:scale-105 transition-smooth duration-500"
                />
                <div className="absolute -bottom-8 -right-8 w-64 h-64 rounded-3xl overflow-hidden shadow-strong hidden lg:block">
                  <img
                    src={barco_sits}
                    srcSet={`${barco_sits} 1x, ${barco_sits} 2x`}
                    sizes="256px"
                    loading="lazy"
                    decoding="async"
                    alt="Organic Kigali spa treatments prepared at V&SKY SPA Kigali with natural and luxurious care"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
            <div className="order-1 lg:order-2 animate-fade-up">
              <p className="text-primary text-lg font-semibold mb-2">{t("home.why.title")}</p>
              <h2 id="why-vsky-spa-heading" className="text-4xl md:text-5xl font-bold mb-6">
                {t("home.why.subtitle")}
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                {t("home.why.description")}
              </p>
              <div className="grid gap-4">
                {[
                  { icon: CheckCircle, title: t("why.premium"), desc: t("why.premium.desc") },
                  { icon: TrendingUp, title: t("why.experts"), desc: t("why.experts.desc") },
                  { icon: Shield, title: t("why.safety"), desc: t("why.safety.desc") },
                  { icon: Heart, title: t("why.care"), desc: t("why.care.desc") },
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-4 p-4 rounded-xl hover:bg-muted/30 transition-smooth">
                    <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center flex-shrink-0">
                      <item.icon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-1">{item.title}</h3>
                      <p className="text-muted-foreground">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial Highlight */}
      <section className="py-20 relative overflow-hidden" aria-label="Kigali spa testimonial highlight">
        <div className="absolute inset-0 bg-fixed" style={{ backgroundImage: `url(https://i.pinimg.com/736x/3f/95/6c/3f956cd4163b4764b750b21919cec5ba.jpg)` }}>
          <div className="absolute inset-0 bg-black bg-opacity-80" />
        </div>
        <div className="container mx-auto px-4 relative z-10 max-w-4xl">
          <Carousel opts={{ loop: true }} setApi={setCarouselApi} className="relative">
            <CarouselContent className="overflow-visible">
              {[{
                quote: t("home.testimonial1.quote"),
                authorName: "Anitha UMUKUNDWA",
                authorDescription: "Happy Client",
                authorImage: "https://i.pinimg.com/1200x/8b/c2/9c/8bc29c19486affd11426c4bb43adf0d5.jpg",
                authorImageAlt: "Spa guest enjoying body massage Kigali experience"
              }, {
                quote: t("home.testimonial2.quote"),
                authorName: "Japhet KARENZI",
                authorDescription: t("testimonial2.desc"),
                authorImage: "https://i.pinimg.com/736x/f9/0e/1a/f90e1ac9e5f0ba68f8f800de051eec57.jpg",
                authorImageAlt: "Spa guest John relaxing at V&SKY SPA"
              }, {
                quote: t("home.testimonial3.quote"),
                authorName: "Angela MICK",
                authorDescription: "Happy Client",
                authorImage: "https://i.pinimg.com/736x/c3/30/d7/c330d752f6b3a3a9fe99665f596c2386.jpg",
                authorImageAlt: "Spa guest Sophie enjoying her facial"
              }].map((testimonial, index) => (
                <CarouselItem key={index} className="text-white text-center px-8">
                  <div className="text-6xl mb-6 select-none">"</div>
                  <blockquote className="text-2xl md:text-3xl font-bold mb-6 max-w-3xl mx-auto">
                    {testimonial.quote}
                  </blockquote>
                  <div className="flex items-center justify-center gap-4">
                    <div className="w-16 h-16 rounded-full overflow-hidden">
                      <img
                        src={testimonial.authorImage}
                        alt={testimonial.authorImageAlt}
                        className="w-full h-full object-cover"
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                    <div className="text-left text-white/90 max-w-xs">
                      <p className="font-bold text-lg">{testimonial.authorName}</p>
                      <p className="text-muted-foreground">{testimonial.authorDescription}</p>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious aria-label="Previous testimonial" />
            <CarouselNext aria-label="Next testimonial" />
          </Carousel>
        </div>
      </section>

      {/* Membership Offers */}
      <section className="py-24 bg-gradient-to-b from-pink-50/60 to-white" aria-label="Kigali spa membership cards">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-16 animate-fade-up">
            <h2 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">
              {t("home.membership.title")}
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              {t("home.membership.subtitle")}
            </p>
          </div>

          {/* Cards Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10 max-w-7xl mx-auto">
            {[
              {
                title: t("home.membership.vip1.title"),
                pay: t("home.membership.vip1.pay"),
                get: t("home.membership.vip1.value"),
                bookingService: `VIP 1 Card (${t("home.membership.vip1.pay")} → ${t("home.membership.vip1.value")})`,
                popular: false,
                features: [
                  t("home.membership.vip1.feature1"),
                  t("home.membership.vip1.feature2"),
                  t("home.membership.vip1.feature3"),
                ],
              },
              {
                title: t("home.membership.vip2.title"),
                pay: t("home.membership.vip2.pay"),
                get: t("home.membership.vip2.value"),
                bookingService: `VIP 2 Card (${t("home.membership.vip2.pay")} → ${t("home.membership.vip2.value")})`,
                popular: true,
                features: [
                  t("home.membership.vip2.feature1"),
                  t("home.membership.vip2.feature2"),
                  t("home.membership.vip2.feature3"),
                ],
              },
              {
                title: t("home.membership.vip3.title"),
                pay: t("home.membership.vip3.pay"),
                get: t("home.membership.vip3.value"),
                bookingService: `VIP 3 Card (${t("home.membership.vip3.pay")} → ${t("home.membership.vip3.value")})`,
                popular: false,
                features: [
                  t("home.membership.vip3.feature1"),
                  t("home.membership.vip3.feature2"),
                  t("home.membership.vip3.feature3"),
                ],
              },
              {
                title: t("home.membership.vip4.title"),
                pay: t("home.membership.vip4.pay"),
                get: t("home.membership.vip4.value"),
                bookingService: `VIP 4 Card (${t("home.membership.vip4.pay")} → ${t("home.membership.vip4.value")})`,
                popular: false,
                features: [
                  t("home.membership.vip4.feature1"),
                  t("home.membership.vip4.feature2"),
                  t("home.membership.vip4.feature3"),
                ],
              },
            ].map((card, i) => (
              <Card
                key={i}
                className={`
            relative rounded-3xl border-none shadow-lg hover:shadow-2xl 
            transition-transform duration-300 hover:-translate-y-2 
            overflow-hidden bg-white/90 backdrop-blur-sm group
            ${card.popular ? "ring-2 ring-primary" : ""}
          `}
              >
                {/* Popular Tag */}
                {card.popular && (
                  <div className="absolute top-0 right-0 bg-primary text-white text-xs px-3 py-1 rounded-bl-xl font-semibold">
                    {t("home.membership.popular")}
                  </div>
                )}

                {/* Top Decorative Gradient */}
                <div className="h-2 bg-gradient-to-r from-primary to-secondary" />

                <CardContent className="p-8">
                  {/* Title */}
                  <h3 className="text-3xl font-extrabold mb-4 text-primary tracking-tight">
                    {card.title}
                  </h3>

                  {/* Pay → Get Price Display */}
                  <div className="flex flex-col items-center mb-6">
                    <div className="flex items-center space-x-3 text-lg">
                      <span className="font-semibold text-gray-600">{t("home.membership.pay")}</span>
                      <span className="text-2xl font-bold text-gray-800">{card.pay}</span>
                    </div>

                    <div className="my-1 text-primary font-bold">{t("home.membership.bonusLabel")}</div>

                    <div className="flex items-center space-x-3 text-lg">
                      <span className="font-semibold text-gray-600">{t("home.membership.get")}</span>
                      <span className="text-3xl font-extrabold text-primary">
                        {card.get}
                      </span>
                    </div>
                  </div>

                  {/* Features List */}
                  <ul className="space-y-3 text-left mb-8">
                    {card.features.map((f, idx) => (
                      <li key={idx} className="flex items-start">
                        <Check className="h-5 w-5 text-primary mr-2 mt-0.5" />
                        <span className="text-sm leading-snug">{f}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA Button */}
                  <Link
                    to={`/booking?service=${encodeURIComponent(card.bookingService)}`}
                    aria-label={`Book ${card.title} card`}
                  >
                    <Button
                      className="w-full rounded-xl py-5 text-base font-semibold
                group-hover:bg-primary group-hover:text-white transition"
                      variant={card.popular ? "hero" : "outline"}
                    >
                      {t("home.membership.cta")}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>



      {/* Wellness Tips Section */}
      <section className="py-20 bg-white" aria-labelledby="wellness-tips-heading">
        <div className="container mx-auto px-4 max-w-7xl">
          <h2 id="wellness-tips-heading" className="text-4xl font-bold mb-10 text-center">{t("wellness.title")}</h2>
          <div className="grid md:grid-cols-3 gap-8 text-muted-foreground">
            <Card className="group overflow-hidden border-none shadow-soft hover:shadow-strong transition-smooth bg-card max-w-sm mx-auto">
              <CardContent className="p-0">
                <div>
                  <div className="overflow-hidden rounded-t-lg">
                    <img
                      src={"https://i.pinimg.com/736x/98/7b/55/987b553501f0c706a840e7f3e43935c8.jpg"}
                      srcSet={`${"https://i.pinimg.com/736x/98/7b/55/987b553501f0c706a840e7f3e43935c8.jpg"} 1x, ${"https://i.pinimg.com/736x/98/7b/55/987b553501f0c706a840e7f3e43935c8.jpg"} 2x`}
                      sizes="(max-width: 768px) 100vw, 33vw"
                      loading="lazy"
                      decoding="async"
                      alt="Wellness Rwanda hydration ritual at V&SKY SPA Kigali for skin health and spa wellness"
                      className="w-full h-48 object-cover group-hover:scale-110 transition-smooth duration-500"
                    />
                  </div>
                  <div className="p-6 flex flex-col justify-center">
                    <h3 className="text-foreground text-2xl font-bold mb-4">{t("wellness.tip1.title")}</h3>
                    <p className="text-muted-foreground mb-6 leading-relaxed">
                      {t("wellness.tip1.desc")}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="group overflow-hidden border-none shadow-soft hover:shadow-strong transition-smooth bg-card max-w-sm mx-auto">
              <CardContent className="p-0">
                <div>
                  <div className="overflow-hidden rounded-t-lg">
                    <img
                      src={"https://i.pinimg.com/1200x/4d/d6/3c/4dd63c99c417256b034d5bc4e2143eea.jpg"}
                      srcSet={`${"https://i.pinimg.com/1200x/4d/d6/3c/4dd63c99c417256b034d5bc4e2143eea.jpg"} 1x, ${"https://i.pinimg.com/1200x/4d/d6/3c/4dd63c99c417256b034d5bc4e2143eea.jpg"} 2x`}
                      sizes="(max-width: 768px) 100vw, 33vw"
                      loading="lazy"
                      decoding="async"
                      alt="Massage in Kigali self-care session at V&SKY SPA Kigali wellness center"
                      className="w-full h-48 object-cover group-hover:scale-110 transition-smooth duration-500"
                    />
                  </div>
                  <div className="p-6 flex flex-col justify-center">
                    <h3 className="text-foreground text-2xl font-bold mb-4">{t("wellness.tip2.title")}</h3>
                    <p className="text-muted-foreground mb-6 leading-relaxed">
                      {t("wellness.tip2.desc")}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="group overflow-hidden border-none shadow-soft hover:shadow-strong transition-smooth bg-card max-w-sm mx-auto">
              <CardContent className="p-0">
                <div>
                  <div className="overflow-hidden rounded-t-lg">
                    <img
                      src={beds}
                      srcSet={`${beds} 1x, ${beds} 2x`}
                      sizes="(max-width: 768px) 100vw, 33vw"
                      loading="lazy"
                      decoding="async"
                      alt="Premium relaxation Kigali spa suites prepared for sleep therapy at V&SKY SPA"
                      className="w-full h-48 object-cover group-hover:scale-110 transition-smooth duration-500"
                    />
                  </div>
                  <div className="p-6 flex flex-col justify-center">
                    <h3 className="text-foreground text-2xl font-bold mb-4">{t("wellness.tip3.title")}</h3>
                    <p className="text-muted-foreground mb-6 leading-relaxed">
                      {t("wellness.tip3.desc")}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-muted/30" aria-label="Spa booking call to action">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto animate-fade-up">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              {t("home.cta.title")}
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              {t("home.cta.subtitle")}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link to="/booking">
                <Button variant="hero" size="lg">
                  {t("home.cta.book")}
                </Button>
              </Link>
              <Link to="/services">
                <Button variant="outline" size="lg">
                  {t("home.cta.explore")}
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

export default Home;
