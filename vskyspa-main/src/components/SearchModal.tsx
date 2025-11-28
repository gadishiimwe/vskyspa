import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { X, Search, Sparkles, Heart, Flower2, Droplets, Coffee } from "lucide-react";
import serviceSkincare from "@/assets/service-skincare.jpg";
import serviceFacial from "@/assets/service-facial.jpg";
import serviceMassage from "@/assets/service-massage.jpg";
import serviceNails from "@/assets/service-nails.jpg";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SearchModal = ({ isOpen, onClose }: SearchModalProps) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);

  const allServices = [
    {
      icon: Sparkles,
      title: "Skin Care",
      slug: "skin-care",
      image: serviceSkincare,
      description: "Professional skincare treatments using organic and premium products.",
      treatments: ["Deep Cleansing", "Anti-Aging Treatment", "Hydration Therapy", "Acne Treatment"],
      price: "From 40K",
      keywords: ["skin", "care", "skincare", "facial", "cleansing", "anti-aging", "hydration", "acne"],
    },
    {
      icon: Flower2,
      title: "Body Massage",
      slug: "body-massage",
      image: serviceMassage,
      description: "Therapeutic massage services for ultimate relaxation and wellness.",
      treatments: ["Swedish Massage", "Deep Tissue", "Hot Stone", "Aromatherapy"],
      price: "From 20K",
      keywords: ["massage", "body", "therapeutic", "swedish", "deep tissue", "hot stone", "aromatherapy", "relaxation"],
    },
    {
      icon: Droplets,
      title: "Nail Services",
      slug: "nail-services",
      image: serviceNails,
      description: "Complete nail care including manicures, pedicures, and artistic designs.",
      treatments: ["Classic Manicure", "Gel Nails", "Spa Pedicure", "Nail Art"],
      price: "From 15K",
      keywords: ["nail", "manicure", "pedicure", "gel", "spa", "art", "nails"],
    },
    {
      icon: Coffee,
      title: "Coffee Services",
      slug: "coffee-services",
      image: "https://images.pexels.com/photos/2638019/pexels-photo-2638019.jpeg",
      description: "Premium coffee selection expertly brewed to complement your spa experience.",
      treatments: ["Espresso", "Cappuccino", "Latte", "Cold Brew"],
      price: "From 3K",
      keywords: ["coffee", "espresso", "cappuccino", "latte", "cold brew", "beverage", "drink"],
    },
  ];

  const pages = [
    { title: "Home", path: "/", keywords: ["home", "main", "welcome"] },
    { title: "About", path: "/about", keywords: ["about", "story", "company", "v&sky"] },
    { title: "Services", path: "/services", keywords: ["services", "treatments", "massage", "facial", "nails"] },
    { title: "Pricing", path: "/pricing", keywords: ["pricing", "packages", "rates", "cost", "price"] },
    { title: "Gallery", path: "/gallery", keywords: ["gallery", "photos", "images", "facilities"] },
    { title: "Team", path: "/team", keywords: ["team", "staff", "therapists", "professionals"] },
    { title: "Testimonials", path: "/testimonials", keywords: ["testimonials", "reviews", "feedback", "clients"] },
    { title: "Contact", path: "/contact", keywords: ["contact", "phone", "email", "location", "address"] },
    { title: "Booking", path: "/booking", keywords: ["booking", "appointment", "schedule", "reserve"] },
  ];

  useEffect(() => {
    if (query.length > 0) {
      const searchTerm = query.toLowerCase();

      // Search services
      const serviceResults = allServices.filter(service =>
        service.title.toLowerCase().includes(searchTerm) ||
        service.description.toLowerCase().includes(searchTerm) ||
        service.keywords.some(keyword => keyword.toLowerCase().includes(searchTerm)) ||
        service.treatments.some(treatment => treatment.toLowerCase().includes(searchTerm))
      ).map(service => ({ ...service, type: "service" }));

      // Search pages
      const pageResults = pages.filter(page =>
        page.title.toLowerCase().includes(searchTerm) ||
        page.keywords.some(keyword => keyword.toLowerCase().includes(searchTerm))
      ).map(page => ({ ...page, type: "page" }));

      setResults([...serviceResults, ...pageResults]);
    } else {
      setResults([]);
    }
  }, [query]);

  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setResults([]);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-background rounded-2xl shadow-strong p-6 animate-fade-up">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Search</h2>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Search Input */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search services, treatments, pages..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-10 text-lg"
              autoFocus
            />
          </div>

          {/* Results */}
          {query.length > 0 && (
            <div className="max-h-96 overflow-y-auto">
              {results.length > 0 ? (
                <div className="space-y-4">
                  {results.map((result, index) => (
                    <Card key={index} className="border-none shadow-soft hover:shadow-strong transition-smooth">
                      <CardContent className="p-4">
                        {result.type === "service" ? (
                          <Link to={result.slug === "coffee-services" ? `/${result.slug}` : `/services/${result.slug}`} onClick={onClose} className="block">
                            <div className="flex items-start gap-4">
                              <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center flex-shrink-0">
                                <result.icon className="h-6 w-6 text-white" />
                              </div>
                              <div className="flex-1">
                                <h3 className="font-bold text-lg mb-1">{result.title}</h3>
                                <p className="text-muted-foreground text-sm mb-2">{result.description}</p>
                                <div className="flex items-center gap-2 text-sm">
                                  <span className="text-primary font-semibold">{result.price}</span>
                                  <span className="text-muted-foreground">•</span>
                                  <span className="text-muted-foreground">{result.treatments.slice(0, 2).join(", ")}</span>
                                </div>
                              </div>
                            </div>
                          </Link>
                        ) : (
                          <Link to={result.path} onClick={onClose} className="block">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                                <Search className="h-6 w-6 text-muted-foreground" />
                              </div>
                              <div>
                                <h3 className="font-bold text-lg">{result.title}</h3>
                                <p className="text-muted-foreground text-sm">Page</p>
                              </div>
                            </div>
                          </Link>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No results found for "{query}"</p>
                  <p className="text-sm text-muted-foreground mt-2">Try searching for services, treatments, or pages</p>
                </div>
              )}
            </div>
          )}

          {/* Suggestions when no query */}
          {query.length === 0 && (
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Popular Searches</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {["massage", "facial", "nails", "coffee", "pricing", "booking", "gallery"].map((suggestion) => (
                  <Button
                    key={suggestion}
                    variant="outline"
                    onClick={() => setQuery(suggestion)}
                    className="justify-start"
                  >
                    {suggestion}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchModal;
