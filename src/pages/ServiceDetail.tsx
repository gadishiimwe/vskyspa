import { useParams, Link, useNavigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, DollarSign, Star, Sparkles, Flower2, Droplets, Flame } from "lucide-react";
import serviceSkincare from "@/assets/service-skincare.jpg";
import serviceFacial from "@/assets/service-facial.jpg";
import beds from "@/assets/beds.jpeg";
import serviceNails from "@/assets/service-nails.jpg";
import braidinghair from "@/assets/braidinghair.png";
import SEO from "@/components/SEO";
import { allKeywords, siteUrl } from "@/seo/seoConfig";

const serviceData: Record<string, any> = {
  "skin-care": {
    icon: Sparkles,
    title: "Professional Skin Care",
    image: serviceSkincare,
    heroImage: serviceSkincare,
    shortDesc: "Professional skincare treatments using organic and premium products.",
    price: "From 40,000RWF",
    duration: "60-90 minutes",
    description: "Experience transformative skincare treatments designed to rejuvenate and restore your skin's natural radiance. Our expert estheticians use only the finest organic and premium products tailored to your unique skin type and concerns.",
    benefits: [
      "Deep cleansing and pore refinement",
      "Improved skin texture and tone",
      "Enhanced collagen production",
      "Reduction of fine lines and wrinkles",
      "Hydration and nourishment",
      "Brighter, more youthful complexion"
    ],
    treatments: [
      {
        name: "Deep Cleaning for Full Body",
        description: "Thorough cleansing and rejuvenation for the entire body",
        duration: "60 min",
        price: "45,000RWF",
        image: "https://i.pinimg.com/1200x/33/63/1b/33631b63e678b23935d8ee4a59ec9fc6.jpg"
      },
      {
        name: "Face Cleaning & Moisturizing",
        description: "Deep cleansing and moisturizing treatment to refresh your facial skin",
        duration: "60 min",
        price: "40,000RWF",
        image: "https://i.pinimg.com/1200x/89/0e/82/890e823af192c2484a33a2ba2a051cca.jpg"
      }
    ],
    process: [
      "Consultation and skin analysis",
      "Deep cleansing and exfoliation",
      "Custom treatment application",
      "Relaxing facial massage",
      "Hydrating mask and serums",
      "Final moisturizing and sun protection"
    ]
  },
  "hair-care": {
    icon: Flame,
    title: "Hair Care",
    image: braidinghair,
    heroImage: "https://i.pinimg.com/1200x/a1/cd/4d/a1cd4df78e566fe2c49d1517e30bc802.jpg",
    shortDesc: "Complete beauty packages combining multiple services at special rates.",
    price: "From 20K - 35K",
    description: "Our professional hair care services include treatments and styling designed to promote hair health and enhance your look. Experience personalized care and expert techniques for vibrant, healthy hair.",
    benefits: [
      "Improved scalp health",
      "Enhanced hair strength and shine",
      "Customized treatment plans",
      "Professional styling and care",
      "Relaxing and rejuvenating experience"
    ],
    treatments: [
      {
        name: "Braiding Hair",
        description: "Traditional and modern braiding styles tailored to your preferences",
        duration: "20,000RWF, 25,000RWF, 30,000RWF, 35,000RWF",
        price: "From 20K-25K",
        image: "https://images.pexels.com/photos/8091024/pexels-photo-8091024.jpeg",
        imagePosition: "top"
      },
    ],
    process: [
      "Consultation and hair analysis",
      "Customized treatment application",
      "Styling and finishing",
      "Hair care advice",
      "Follow-up recommendations"
    ]
  },
  "body-massage": {
    icon: Flower2,
    title: "Body Massage",
    image: beds,
    heroImage: "https://images.pexels.com/photos/6187848/pexels-photo-6187848.jpeg",
    shortDesc: "Therapeutic massage services for ultimate relaxation and wellness.",
    price: "From 20,000RWF",
    duration: "30-120 minutes",
    description: "Discover the healing power of touch with our body massage services. Our certified therapists combine traditional techniques with modern approaches to relieve tension, reduce stress, and promote overall wellness.",
    benefits: [
      "Relief from muscle tension and pain",
      "Improved blood circulation",
      "Stress and anxiety reduction",
      "Enhanced flexibility and mobility",
      "Better sleep quality",
      "Overall physical and mental relaxation"
    ],
    treatments: [
      {
        name: "Full Body Relax Massage (Oil)",
        description: "Classic relaxation massage with long, flowing strokes",
        duration: "60 min - 90 min",
        price: "30K - 40K",
        image: "https://images.pexels.com/photos/6629555/pexels-photo-6629555.jpeg"
      },
      {
        name: "Hot Stone Massage (Oil)",
        description: "Targeted pressure to release chronic muscle tension",
        duration: "90 min - 120 min",
        price: "50K - 70K",
        image: "https://images.pexels.com/photos/6187657/pexels-photo-6187657.jpeg"
      },
      {
        name: "Deep Tissue Massage (Oil)",
        description: "Essential oils combined with therapeutic touch",
        duration: "60 min - 90 min",
        price: "30k - 40k",
        image: "https://i.pinimg.com/1200x/c2/8f/e4/c28fe48cf7a895c94b17e2bb278d7546.jpg"
      },
      {
        name: "Four Hands Massage (Oil)",
        description: "Relaxing massage with essential oils for stress relief",
        duration: "30 min",
        price: "30K",
        image: "https://i.pinimg.com/736x/09/31/eb/0931ebab4602ec51313b49b72bb10c1e.jpg"
      },
      {
        name: "Head Massage & Hair Wash",
        description: "Relaxing massage with aromatic oils for stress relief",
        duration: "30 min",
        price: "20K",
        image: "https://images.pexels.com/photos/8834067/pexels-photo-8834067.jpeg"
      },
      {
        name: "Professional Foot Bath Massage",
        description: "Relaxing massage with aromatic oils for stress relief",
        duration: "60 min",
        price: "40K",
        image: "https://i.pinimg.com/1200x/8d/a7/09/8da7090e9a07de2a8280f189fc9935a3.jpg"
      },
      {
        name: "Shoulder, Back, Head & Leg Massage",
        description: "Relaxing massage with aromatic oils for stress relief",
        duration: "30 min",
        price: "20K",
        image: "https://i.pinimg.com/1200x/48/4f/02/484f028304c14e880e32975275b69fec.jpg"
      }
    ],
    process: [
      "Consultation and preference discussion",
      "Comfortable positioning",
      "Warm-up and preparation",
      "Targeted massage techniques",
      "Focus on problem areas",
      "Cool-down and relaxation time"
    ]
  },
};
//   "nail-services": {
//     icon: Droplets,
//     title: "Complete Nail Services",
//     image: serviceNails,
//     heroImage: serviceNails,
//     shortDesc: "Complete nail care including manicures, pedicures, and artistic designs.",
//     price: "From $45",
//     duration: "45-90 minutes",
//     description: "Pamper your hands and feet with our comprehensive nail services. From classic manicures to intricate nail art, our skilled technicians ensure your nails look immaculate and feel healthy.",
//     benefits: [
//       "Professionally shaped and polished nails",
//       "Improved nail health and strength",
//       "Smooth, soft cuticles",
//       "Relaxing hand and foot massage",
//       "Long-lasting gel or regular polish",
//       "Beautiful, customized nail art options"
//     ],
//     treatments: [
//       {
//         name: "Classic Manicure",
//         description: "Essential nail care with polish of your choice",
//         duration: "45 min",
//         price: "$45"
//       },
//       {
//         name: "Gel Manicure",
//         description: "Long-lasting gel polish with chip-free shine",
//         duration: "60 min",
//         price: "$65"
//       },
//       {
//         name: "Spa Pedicure",
//         description: "Complete foot care with massage and polish",
//         duration: "75 min",
//         price: "$70"
//       },
//       {
//         name: "Nail Art Design",
//         description: "Custom artistic designs by our skilled technicians",
//         duration: "90 min",
//         price: "$95"
//       }
//     ],
//     process: [
//       "Nail assessment and consultation",
//       "Shaping and filing",
//       "Cuticle care and treatment",
//       "Exfoliation and massage",
//       "Polish or gel application",
//       "Final touches and care instructions"
//     ]
//   }
// };

const ServiceDetail = () => {
  const { serviceId } = useParams();
  const navigate = useNavigate();

  const service = serviceId ? serviceData[serviceId] : null;

  if (!service) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 py-32 text-center">
          <h1 className="text-4xl font-bold mb-4">Service Not Found</h1>
          <Link to="/services">
            <Button variant="hero">Back to Services</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const ServiceIcon = service.icon;
  const heroImageCandidate =
    typeof service.heroImage === "string"
      ? service.heroImage
      : Array.isArray(service.heroImage)
      ? service.heroImage[0]
      : "";
  const heroImage = heroImageCandidate || service.image;
  const detailUrl = `${siteUrl}/services/${serviceId}`;
  const serviceTitle = `${service.title} Kigali | V&SKY SPA`;
  const serviceDescription =
    (service.shortDesc || service.description || "").slice(0, 155);
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: `${service.title} at V&SKY SPA Kigali`,
    serviceType: service.title,
    provider: {
      "@type": "Spa",
      name: "V&SKY SPA",
      url: siteUrl,
    },
    areaServed: "Kigali, Rwanda",
    description: service.description,
    offers: {
      "@type": "Offer",
      price: service.price,
      priceCurrency: service.price.toLowerCase().includes("k") ? "RWF" : "USD",
      availability: "https://schema.org/InStock",
      url: detailUrl,
    },
  };
  const serviceKeywords = Array.from(
    new Set([
      ...allKeywords,
      `${service.title} Kigali`,
      `${service.title} Rwanda`,
      `${service.title} wellness`,
    ])
  );

  return (
    <div className="min-h-screen">
      <SEO
        title={serviceTitle}
        description={serviceDescription}
        url={detailUrl}
        canonical={detailUrl}
        image={typeof service.image === "string" ? service.image : undefined}
        keywords={serviceKeywords}
        jsonLd={[serviceSchema]}
        additionalMetaTags={
          <>
            <meta
              property="og:image:alt"
              content={`${service.title} treatment at V&SKY SPA Kigali`}
            />
            <meta
              name="twitter:image:alt"
              content={`${service.title} treatment at V&SKY SPA Kigali`}
            />
          </>
        }
      />
      <Navbar />

      {/* Hero Section with Background Image */}
      <section
        className="relative mt-[116px] pt-32 md:pt-24 pb-24 overflow-hidden"
        aria-labelledby="service-detail-hero-heading"
      >
        <div className="absolute inset-0">
          <img
            src={heroImage}
            srcSet={heroImage ? `${heroImage} 1x, ${heroImage} 2x` : undefined}
            loading="lazy"
            decoding="async"
            alt={`${service.title} treatment suite at V&SKY SPA Kigali`}
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
            <h1
              id="service-detail-hero-heading"
              className="text-5xl md:text-6xl font-bold mb-6"
            >
              {service.title}
            </h1>
            <p className="text-xl text-muted-foreground mb-8">{service.description}</p>
            <div className="flex flex-wrap gap-6">
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
        aria-labelledby="service-benefits-heading"
      >
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <h2 id="service-benefits-heading" className="text-4xl font-bold mb-6">
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
                  src={service.image}
                  srcSet={
                    typeof service.image === "string"
                      ? `${service.image} 1x, ${service.image} 2x`
                      : undefined
                  }
                  loading="lazy"
                  decoding="async"
                  alt={`${service.title} benefits imagery at V&SKY SPA Kigali`}
                  className="w-full transform hover:scale-105 transition-smooth duration-500 mb-16"
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
        aria-labelledby="service-treatments-heading"
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 id="service-treatments-heading" className="text-4xl font-bold mb-4">
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
          alt={`${treatment.name} treatment at V&SKY SPA Kigali`}
          className="w-full h-48 rounded-lg mb-4 group-hover:scale-105 transition-smooth duration-500"
          style={{ objectFit: 'cover', objectPosition: treatment.imagePosition || "center" }}
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
        aria-labelledby="service-process-heading"
      >
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 id="service-process-heading" className="text-4xl font-bold mb-4">
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
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 gradient-primary opacity-10" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Book This Service?</h2>
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

export default ServiceDetail;
