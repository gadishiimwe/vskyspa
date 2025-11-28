import { Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, DollarSign, Star, Heart } from "lucide-react";
import serviceFacial from "@/assets/service-facial.jpg";
import SEO from "@/components/SEO";
import { allKeywords, siteUrl } from "@/seo/seoConfig";

const CoffeeServices = () => {
  const service = {
    icon: Heart,
    title: "Premium Coffee Services",
    image: serviceFacial,
    heroImage: "https://images.pexels.com/photos/6663455/pexels-photo-6663455.jpeg",
    shortDesc: "Specialized coffee services tailored to complement your spa experience.",
    price: "From $3",
    duration: "5-15 minutes",
    description: "Indulge in our luxurious coffee services that deliver instant results. Each coffee is carefully selected to address your specific preferences, from espresso to cold brew, using premium beans and expert brewing techniques.",
    benefits: [
      "Premium, ethically sourced beans",
      "Expertly brewed specialty drinks",
      "Aromatic blends to enhance relaxation",
      "Customizable options for all preferences",
      "Complements spa treatments perfectly",
      "Wide variety of brewing methods"
    ],
    treatments: [
      {
        name: "Cappuccino Coffee",
        description: "Classic cappuccino with steamed milk and a perfect layer of foam.",
        duration: "10 min",
        price: "4000 RWF",
        image: "https://i.pinimg.com/736x/f0/65/5f/f0655f2737da76be9b4ac435c65e3d9b.jpg"
      },
      {
        name: "Café Latte",
        description: "Smooth latte with your choice of flavors, expertly crafted.",
        duration: "10 min",
        price: "4000 RWF",
        image: "https://i.pinimg.com/736x/e3/83/f9/e383f9aba12fcabbffd116323690fb57.jpg"
      },
      {
        name: "Americano Coffee",
        description: "Rich and bold Americano coffee brewed fresh.",
        duration: "5 min",
        price: "3000 RWF",
        image: "https://i.pinimg.com/736x/88/d4/b5/88d4b53cde22374261b39a695647cf92.jpg"
      },
      {
        name: "Hot Chocolate",
        description: "Delicious hot chocolate perfect to warm you up.",
        duration: "5 min",
        price: "4500 RWF",
        image: "https://i.pinimg.com/736x/ae/55/17/ae5517f67a2bda89a5168f0930e4660c.jpg"
      },
      {
        name: "Black Coffee",
        description: "Simple and strong black coffee for a classic experience.",
        duration: "5 min",
        price: "2500 RWF",
        image: "https://i.pinimg.com/1200x/a8/98/97/a898974dbf885f2f0d6987a85c150324.jpg"
      },
      {
        name: "African Tea",
        description: "Traditional African tea with rich flavors.",
        duration: "5 min",
        price: "3000 RWF",
        image: "https://i.pinimg.com/736x/7a/6e/24/7a6e2482073780545e48c06c3690ef86.jpg"
      },
      {
        name: "African Coffee",
        description: "Authentic African coffee with unique taste.",
        duration: "5 min",
        price: "4000 RWF",
        image: "https://i.pinimg.com/736x/e5/25/b6/e525b6989b664940405910df23f50f8a.jpg"
      },
      {
        name: "Spice Tea",
        description: "Spiced tea blend for a warming experience.",
        duration: "5 min",
        price: "4500 RWF",
        image: "https://i.pinimg.com/1200x/30/6f/c4/306fc4ce4b8819d91c952044e5b3e413.jpg"
      },
      {
        name: "Fruit Tea / Fruit Juice",
        description: "Refreshing fruit-infused tea/juice.",
        duration: "5 min",
        price: "4500 RWF",
        image: "https://i.pinimg.com/736x/1b/78/e6/1b78e61cdec0a91d152578500dbc7867.jpg"
      },
      {
        name: "Iced Cappuccino",
        description: "Chilled cappuccino served over ice.",
        duration: "5 min",
        price: "4000 RWF",
        image: "https://i.pinimg.com/736x/a4/a1/7b/a4a17bf478e22fb93a138e3c87c62f8b.jpg"
      },
      {
        name: "Iced Café Mocha",
        description: "Iced mocha with chocolate and coffee flavors.",
        duration: "5 min",
        price: "4000 RWF",
        image: "https://i.pinimg.com/1200x/d4/5b/b4/d45bb4f46d1a12760c9b55f26a5b7da5.jpg"
      },
      {
        name: "Iced Café Latte",
        description: "Smooth iced latte with milk and coffee.",
        duration: "5 min",
        price: "4000 RWF",
        image: "https://i.pinimg.com/736x/8c/79/14/8c7914fd444376555ab0de073f082144.jpg"
      },
      {
        name: "Iced Americano",
        description: "Iced Americano for a cool coffee experience.",
        duration: "5 min",
        price: "4000 RWF",
        image: "https://i.pinimg.com/1200x/bc/0c/ff/bc0cffc8b21c24b4b571e98b9ab5da12.jpg"
      }
    ],
    process: [
      "Bean selection and grinding",
      "Expert brewing technique",
      "Custom preparation",
      "Presentation and serving",
      "Enjoy with your spa experience"
    ]
  };

  const ServiceIcon = service.icon;
  const detailUrl = `${siteUrl}/coffee-services`;
  const serviceKeywords = Array.from(
    new Set([
      ...allKeywords,
      "Coffee bar Kigali",
      "Spa coffee Rwanda",
      "Specialty coffee Kigali spa",
    ])
  );
  const coffeeSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Premium Coffee Services at V&SKY SPA Kigali",
    serviceType: "Coffee Experience",
    provider: {
      "@type": "Spa",
      name: "V&SKY SPA",
      url: siteUrl,
    },
    areaServed: "Kigali, Rwanda",
    offers: {
      "@type": "Offer",
      price: service.price,
      priceCurrency: service.price.includes("$") ? "USD" : "RWF",
      availability: "https://schema.org/InStock",
      url: detailUrl,
    },
  };

  return (
    <div className="min-h-screen">
      <SEO
        title="Premium Coffee Services Kigali | V&SKY SPA"
        description="Sip barista-crafted coffee pairings at V&SKY SPA in Kigali. Elevate each treatment with espresso, cappuccino, latte, or cold brew rituals."
        url={detailUrl}
        canonical={detailUrl}
        image={service.heroImage}
        keywords={serviceKeywords}
        jsonLd={[coffeeSchema]}
        additionalMetaTags={
          <>
            <meta
              property="og:image:alt"
              content="Specialty coffee bar at V&SKY SPA Kigali"
            />
            <meta
              name="twitter:image:alt"
              content="Specialty coffee bar at V&SKY SPA Kigali"
            />
          </>
        }
      />
      <Navbar />

      {/* Hero Section with Background Image */}
      <section
        className="relative mt-[116px] pt-32 md:pt-24 pb-24 overflow-hidden"
        aria-labelledby="coffee-hero-heading"
      >
        <div className="absolute inset-0">
          <img
            src={service.heroImage}
            srcSet={`${service.heroImage} 1x, ${service.heroImage} 2x`}
            loading="lazy"
            decoding="async"
            alt="Coffee concierge service at V&SKY SPA Kigali"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-background/60" />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl animate-fade-up">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-16 h-16 rounded-full gradient-primary flex items-center justify-center">
                <ServiceIcon className="h-8 w-8 text-white" />
              </div>
              <Link to="/services" className="text-primary hover:underline">
                ← Back to Services
              </Link>
            </div>
            <h1 id="coffee-hero-heading" className="text-5xl md:text-6xl font-bold mb-6">
              {service.title}
            </h1>
            <p className="text-xl text-muted-foreground mb-8">{service.description}</p>
            <div className="flex flex-wrap gap-6">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                <span className="font-semibold">{service.duration}</span>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-primary" />
                <span className="font-semibold">{service.price}</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 text-primary fill-primary" />
                <span className="font-semibold">5.0 Rating</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section with Offset Image */}
      <section
        className="py-20 bg-muted/30"
        aria-labelledby="coffee-benefits-heading"
      >
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <h2 id="coffee-benefits-heading" className="text-4xl font-bold mb-6">
                Benefits You'll Experience
              </h2>
              <div className="grid gap-4">
                {service.benefits.map((benefit: string, index: number) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-4 bg-card rounded-lg shadow-soft hover:shadow-strong transition-smooth"
                  >
                    <div className="w-6 h-6 rounded-full gradient-primary flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-white text-sm font-bold">{index + 1}</span>
                    </div>
                    <p className="text-lg">{benefit}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="order-1 lg:order-2 relative">
              <div className="relative lg:ml-12 lg:-mt-12">
                <img
                  src={"https://images.pexels.com/photos/6443361/pexels-photo-6443361.jpeg"}
                  srcSet={"https://images.pexels.com/photos/6443361/pexels-photo-6443361.jpeg 1x, https://images.pexels.com/photos/6443361/pexels-photo-6443361.jpeg 2x"}
                  loading="lazy"
                  decoding="async"
                  alt="Coffee pairing benefits within V&SKY SPA Kigali lounge"
                  className="rounded-2xl shadow-strong w-full transform hover:scale-105 transition-smooth duration-500"
                />
                <div className="absolute -bottom-6 -left-6 w-32 h-32 rounded-full gradient-primary opacity-20 blur-3xl" />
                <div className="absolute -top-6 -right-6 w-32 h-32 rounded-full gradient-primary opacity-20 blur-3xl" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Treatment Options */}
      <section
        className="py-20"
        aria-labelledby="coffee-treatments-heading"
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 id="coffee-treatments-heading" className="text-4xl font-bold mb-4">
              Available Treatments
            </h2>
            <p className="text-xl text-muted-foreground">Choose the perfect treatment for your needs</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {service.treatments.map((treatment: any, index: number) => (
              <Card
                key={index}
                className="border-none shadow-soft hover:shadow-strong transition-smooth group"
              >
                <CardContent className="p-6">
                  {treatment.image && (
                    <img
                      src={treatment.image}
                      srcSet={`${treatment.image} 1x, ${treatment.image} 2x`}
                      loading="lazy"
                      decoding="async"
                      alt={`${treatment.name} coffee ritual at V&SKY SPA Kigali`}
                      className="w-full h-48 object-cover rounded-lg mb-4"
                    />
                  )}
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-bold group-hover:text-primary transition-smooth">{treatment.name}</h3>
                    <span className="text-2xl font-bold text-primary">{treatment.price}</span>
                  </div>
                  <p className="text-muted-foreground mb-4">{treatment.description}</p>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-primary" />
                    <span className="font-semibold">{treatment.duration}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section
        className="py-20 gradient-soft"
        aria-labelledby="coffee-process-heading"
      >
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 id="coffee-process-heading" className="text-4xl font-bold mb-4">
                What to Expect
              </h2>
              <p className="text-xl text-muted-foreground">Your treatment journey, step by step</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {service.process.map((step: string, index: number) => (
                <div
                  key={index}
                  className="bg-card p-6 rounded-xl shadow-soft hover:shadow-strong transition-smooth text-center"
                >
                  <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center mx-auto mb-4 text-white font-bold text-lg">
                    {index + 1}
                  </div>
                  <p className="font-semibold">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        className="py-20 relative overflow-hidden"
        aria-labelledby="coffee-cta-heading"
      >
        <div className="absolute inset-0 gradient-primary opacity-10" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 id="coffee-cta-heading" className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Book This Service?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Schedule your appointment today and experience the difference
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link to="/booking">
                <Button variant="hero" size="lg">
                  Book Appointment
                </Button>
              </Link>
              <Link to="/contact">
                <Button variant="outline" size="lg">
                  Ask Questions
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

export default CoffeeServices;
