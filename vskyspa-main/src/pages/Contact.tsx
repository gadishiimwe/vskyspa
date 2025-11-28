import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import SEO from "@/components/SEO";
import { pageSEO, faqContent } from "@/seo/seoConfig";

const Contact = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Message sent! We'll get back to you soon.");
  };

  const contactInfo = [
    {
      icon: Phone,
      title: "Phone",
      details: ["+250 781 262 272 / +250 796 584 614", "Available 10 AM - 10 PM"],
    },
    {
      icon: Mail,
      title: "Email",
      details: ["vskyyspa@gmail.com"],
    },
    {
      icon: MapPin,
      title: "Address",
      details: ["Kibagabaga", "Kigali, Rwanda"],
    },
    {
      icon: Clock,
      title: "Hours",
      details: ["Mon-Fri: 10 AM - 10 PM", "Sat-Sun: 9 AM - 10 PM"],
    },
  ];

  const contactSEO = pageSEO.contact;
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqContent.contact.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <div className="min-h-screen">
      <SEO
        title={contactSEO.title}
        description={contactSEO.description}
        url={contactSEO.url}
        canonical={contactSEO.canonical}
        image={contactSEO.image}
        type={contactSEO.type}
        keywords={contactSEO.keywords}
        jsonLd={[faqSchema]}
        additionalMetaTags={
          <>
            <meta property="og:image:alt" content="Contact V&SKY SPA Kigali" />
            <meta name="twitter:image:alt" content="Contact V&SKY SPA Kigali" />
          </>
        }
      />
      <Navbar />
      
      {/* Hero Section */}
      <section className="mt-[116px] pt-32 md:pt-24 pb-16 relative overflow-hidden" aria-labelledby="contact-hero-heading">
        <div className="absolute inset-0">
          <img
            src="https://i.pinimg.com/736x/c4/3a/fa/c43afa697bc3f322d269c0b4b449baef.jpg"
            alt="Kigali spa reception area"
            className="w-full h-full object-cover opacity-35"
            loading="lazy"
            decoding="async"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/70 to-background/50" />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-3xl mx-auto animate-fade-up">
            <h1 id="contact-hero-heading" className="text-5xl md:text-6xl font-bold mb-6">Contact V&SKY SPA Kigali</h1>
            <p className="text-xl text-muted-foreground">
              Have questions about massage in Kigali, spa vip cards Rwanda, or couples spa Kigali escapes? Send us a note and we’ll respond quickly.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-20 relative" aria-label="Contact options and form">
        <div className="absolute inset-0 bg-gradient-soft" />
        <div className="absolute inset-0 sparkle opacity-20" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {contactInfo.map((info, index) => (
              <Card
                key={index}
                className="text-center border-none shadow-soft hover:shadow-strong transition-smooth animate-fade-up hover-lift mobile-responsive"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="pt-8 pb-6">
                  <div className="w-16 h-16 rounded-full gradient-primary flex items-center justify-center mx-auto mb-4 animate-float shadow-glow">
                    <info.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-lg font-bold mb-3">{info.title}</h3>
                  {info.details.map((detail, idx) => (
                    <p key={idx} className="text-muted-foreground">
                      {detail}
                    </p>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Contact Form and Map */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Contact Form */}
            <Card className="border-none shadow-soft bg-card/95 backdrop-blur" aria-label="Contact form">
              <CardHeader>
                <CardTitle className="text-2xl">Send Us a Message</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input id="firstName" placeholder="John" required />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input id="lastName" placeholder="Doe" required />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input id="email" type="email" placeholder="john@example.com" required />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" type="tel" placeholder="+1 (555) 000-0000" />
                  </div>
                  <div>
                    <Label htmlFor="subject">Subject *</Label>
                    <Input id="subject" placeholder="How can we help you?" required />
                  </div>
                  <div>
                    <Label htmlFor="message">Message *</Label>
                    <Textarea
                      id="message"
                      placeholder="Tell us more about your inquiry..."
                      rows={6}
                      required
                    />
                  </div>
                  <Button type="submit" variant="hero" className="w-full" size="lg" aria-label="Send message to V&SKY SPA">
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Map */}
            <Card className="border-none shadow-soft overflow-hidden" aria-label="Map to V&SKY SPA Kigali">
              <CardContent className="p-0 h-full">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d837.2275851845797!2d30.119766611355715!3d-1.9364778208904077!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x19dca7ff55e19f1f%3A0x40d044c7535ea672!2sV%20%26%20SKY!5e1!3m2!1sen!2srw!4v1763722704661!5m2!1sen!2srw"
                  width="100%"
                  height="500"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full min-h-[500px]"
                ></iframe>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-muted/30" aria-labelledby="contact-faq-heading">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 id="contact-faq-heading" className="text-4xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-muted-foreground">Quick answers about our spa in Kigali, wellness Rwanda programs, and bookings.</p>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {[
              {
                q: "How do I book an appointment?",
                a: "You can book online through our booking page, call us, or send an email. We'll confirm your appointment within 24 hours.",
              },
              {
                q: "What is your cancellation policy?",
                a: "We require 24 hours notice for cancellations. Cancellations within 24 hours may incur a fee.",
              },
              {
                q: "Do you offer gift certificates?",
                a: "Yes! Gift certificates are available for any amount or specific service. Perfect for any occasion.",
              },
              {
                q: "What should I bring to my appointment?",
                a: "Just bring yourself! We provide robes, slippers, and all necessary amenities.",
              },
            ].map((faq, index) => (
              <Card key={index} className="border-none shadow-soft">
                <CardContent className="p-6">
                  <h3 className="font-bold text-lg mb-2">{faq.q}</h3>
                  <p className="text-muted-foreground">{faq.a}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Visit Us Section */}
      <section className="py-20 bg-muted/30 relative overflow-hidden" aria-labelledby="visit-heading">
        <div className="absolute inset-0 bg-fixed">
          <img src={"https://i.pinimg.com/736x/27/16/42/271642f027d77e4d4e5c053cb24084a5.jpg"} alt="Spa lounge and reception at V&SKY SPA Kigali" className="w-full h-full object-cover bg-fixed opacity-10" loading="lazy" decoding="async" />
        </div>
        <div className="absolute inset-0 sparkle opacity-20" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto">
            <h2 id="visit-heading" className="text-4xl font-bold text-center mb-8 text-gradient-rose">🌸 Visit V&SKY SPA 🌸</h2>
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="text-2xl font-bold mb-4">Our Location</h3>
                <p className="text-muted-foreground mb-4">
                  Conveniently located in Kibagabaga, one of Kigali's most accessible neighborhoods.
                  We offer ample parking, easy access to public transportation, and concierge assistance for corporate wellness Kigali groups.
                </p>
                <p className="text-muted-foreground">
                  <strong>Address:</strong><br />
                  Kibagabaga<br />
                  Kigali, Rwanda
                </p>
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-4">Operating Hours</h3>
                <div className="space-y-2 text-muted-foreground">
                  <p><strong>Monday - Friday:</strong> 9:00 AM - 8:00 PM</p>
                  <p><strong>Saturday - Sunday:</strong> 10:00 AM - 6:00 PM</p>
                  <p className="mt-4 text-sm">
                    <em>We recommend booking in advance to secure your preferred time slot, especially during weekends and holidays.</em>
                  </p>
                </div>
              </div>
            </div>
            <div className="text-center">
              <Link to="/booking">
                <Button variant="hero" size="lg" className="animate-bounce" aria-label="Book Kigali spa appointment">
                  Book Your Appointment
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

export default Contact;
