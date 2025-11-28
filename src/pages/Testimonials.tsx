import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Star, Quote } from "lucide-react";
import SEO from "@/components/SEO";
import { pageSEO, siteUrl } from "@/seo/seoConfig";

const Testimonials = () => {
  const testimonials = [
    {
      name: "Aline Uwase",
      location: "Kibagabaga, Kigali",
      rating: 5,
      image: "https://i.pinimg.com/1200x/fc/2d/30/fc2d303e12e85ca56f678c44f2d1014e.jpg",
      text: "Absolutely incredible body massage Kigali experience. The therapist listened to my needs and blended aromatherapy massage Kigali oils that left me floating.",
      service: "Deep Tissue Massage",
    },
    {
      name: "Eric Ndayisaba",
      location: "Nyarutarama, Kigali",
      rating: 5,
      image: "https://i.pinimg.com/1200x/17/a3/1f/17a31fa8505aab036f30ddf657af1f4e.jpg",
      text: "Our couples spa Kigali package felt like a luxury staycation. The steam, facial treatment Kigali upgrade, and private suite were exceptional.",
      service: "Premium Package",
    },
    {
      name: "Sandrine Ingabire",
      location: "Gacuriro, Kigali",
      rating: 5,
      image: "https://i.pinimg.com/1200x/80/a3/f8/80a3f873199c990dc8ab5f75c2227efb.jpg",
      text: "V&SKY SPA is the only place I trust for skin rejuvenation Rwanda facials. My complexion glows for weeks after every visit.",
      service: "Radiance Facial",
    },
    {
      name: "Kevin Mugisha",
      location: "Kiyovu, Kigali",
      rating: 5,
      image: "https://i.pinimg.com/736x/93/c7/96/93c796f36f6c3e86c6fdbac74ec3f946.jpg",
      text: "From the reception tea to the hot stone massage, everything screams best spa in Kigali. The attention to detail is world-class.",
      service: "Hot Stone Massage",
    },
    {
      name: "Gloria Umutesi",
      location: "Remera, Kigali",
      rating: 5,
      image: "https://i.pinimg.com/1200x/85/bb/8a/85bb8a68b23d631d376e8121379c7a63.jpg",
      text: "I surprised my mom with V&SKY SPA VIP Card in Rwanda and she loved the Ultimate Package. We both felt renewed and cared for.",
      service: "Ultimate Package",
    },
    {
      name: "Patrick Habimana",
      location: "Kimironko, Kigali",
      rating: 5,
      image: "https://i.pinimg.com/736x/d4/af/41/d4af412ab61d9d6833201513be2f50ac.jpg",
      text: "Deep tissue massage Kigali sessions here keep me performing at my best. The therapists are knowledgeable and professional.",
      service: "Body Scrub & Wrap",
    },
  ];

  const stats = [
    { value: "500+", label: "Happy Clients" },
    { value: "4.9/5", label: "Average Rating" },
    { value: "98%", label: "Would Recommend" },
    { value: "5+", label: "Years Experience" },
  ];

  const testimonialsSEO = pageSEO.testimonials;
  const reviewSchema = testimonials.map((testimonial) => ({
    "@context": "https://schema.org",
    "@type": "Review",
    itemReviewed: {
      "@type": "Spa",
      name: "V&SKY SPA",
      url: siteUrl,
    },
    author: {
      "@type": "Person",
      name: testimonial.name,
    },
    reviewBody: testimonial.text,
    reviewRating: {
      "@type": "Rating",
      ratingValue: testimonial.rating,
      bestRating: 5,
    },
  }));

  return (
    <div className="min-h-screen">
      <SEO
        title={testimonialsSEO.title}
        description={testimonialsSEO.description}
        url={testimonialsSEO.url}
        canonical={testimonialsSEO.canonical}
        image={testimonialsSEO.image}
        type={testimonialsSEO.type}
        keywords={testimonialsSEO.keywords}
        jsonLd={reviewSchema}
        additionalMetaTags={
          <>
            <meta property="og:image:alt" content="Kigali spa testimonials" />
            <meta name="twitter:image:alt" content="Kigali spa testimonials" />
          </>
        }
      />
      <Navbar />
      
      {/* Hero Section */}
      <section className="mt-[116px] pt-32 md:pt-24 pb-16 gradient-soft" aria-labelledby="testimonials-hero-heading">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto animate-fade-up">
            <h1 id="testimonials-hero-heading" className="text-5xl md:text-6xl font-bold mb-6">Client Testimonials</h1>
            <p className="text-xl text-muted-foreground">
              Discover why Kigali locals choose V&SKY SPA for wellness Rwanda rituals, luxury spa Rwanda packages, and organic spa treatments Kigali.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 gradient-primary" aria-label="Client satisfaction stats">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center text-white animate-fade-up" style={{ animationDelay: `${index * 100}ms` }}>
                <div className="text-4xl font-bold mb-2">{stat.value}</div>
                <div className="text-white/90">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Grid */}
      <section className="py-20 relative" aria-label="Client reviews">
        <div className="absolute inset-0 bg-gradient-soft" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card
                key={index}
                className="border-none shadow-soft hover:shadow-strong transition-smooth animate-fade-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-6">
                  {/* Quote Icon */}
                  <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center mb-4">
                    <Quote className="h-6 w-6 text-white" />
                  </div>

                  {/* Rating */}
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-primary text-primary" />
                    ))}
                  </div>

                  {/* Testimonial Text */}
                  <p className="text-muted-foreground mb-4 italic">{testimonial.text}</p>

                  {/* Service Badge */}
                  <div className="inline-block px-3 py-1 rounded-full bg-accent text-accent-foreground text-sm font-medium mb-4">
                    {testimonial.service}
                  </div>

                  {/* Client Info */}
                  <div className="flex items-center gap-3 pt-4 border-t">
                    <img
                      src={testimonial.image}
                      srcSet={`${testimonial.image} 1x, ${testimonial.image} 2x`}
                      loading="lazy"
                      decoding="async"
                      alt={`${testimonial.name} testimonial`}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-semibold">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-muted/30" aria-labelledby="testimonials-cta-heading">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 id="testimonials-cta-heading" className="text-4xl font-bold mb-6">Ready to Experience V&SKY SPA?</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join hundreds of satisfied clients who trust us for body massage Kigali, facial treatment Kigali, and premium relaxation Kigali services.
            </p>
            <Link to="/booking">
              <Button variant="hero" size="lg" aria-label="Book spa appointment in Kigali">
                Book Your Appointment
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Testimonials;
