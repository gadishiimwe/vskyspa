import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter, Linkedin, Phone, Mail, MapPin } from "lucide-react";
import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t } = useTranslation();
  return (
    <footer className="bg-muted/30 pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* About Section */}
          <div>
            <h3 className="text-2xl font-bold text-gradient mb-4">V&SKY SPA</h3>
            <p className="text-muted-foreground mb-6">
              Your premier destination for relaxation, rejuvenation, and beauty treatments. 
              Experience luxury spa services in a serene environment.
            </p>
            <div className="flex gap-3">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-white hover:shadow-glow transition-smooth"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-white hover:shadow-glow transition-smooth"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-white hover:shadow-glow transition-smooth"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-white hover:shadow-glow transition-smooth"
              >
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold mb-4">{t("footer.quick")}</h4>
            <ul className="space-y-2">
              {[
                { path: "/", label: "Home" },
                { path: "/about", label: "About Us" },
                { path: "/services", label: "Services" },
                { path: "/pricing", label: "Pricing" },
                { path: "/booking", label: "Book Now" },
              ].map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className="text-muted-foreground hover:text-primary transition-smooth"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-bold mb-4">Our Services</h4>
            <ul className="space-y-2">
              {[
                { name: "Massage Therapy", slug: "body-massage" },
                { name: "Skin Care", slug: "skin-care" },
                { name: "Hair Care", slug: "hair-care" },
                { name: "Coffee Services", slug: "coffee-services", isDirect: true },
                { name: "Beauty Packages", slug: null },
              ].map((service) => (
                <li key={service.name}>
                  <Link
                    to={service.slug ? (service.isDirect ? `/${service.slug}` : `/services/${service.slug}`) : "/services"}
                    className="text-muted-foreground hover:text-primary transition-smooth"
                  >
                    {service.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-bold mb-4">{t("footer.contact")}</h4>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                <span className="text-muted-foreground">
                  Kibagabaga, Kigali, Rwanda
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-primary flex-shrink-0" />
                <div className="text-muted-foreground">
                  <a href="tel:+250781262272" className="hover:text-primary transition-smooth">
                    +250781262272
                  </a>
                  {" / "}
                  <a href="tel:+250796584614" className="hover:text-primary transition-smooth">
                    +250796584614
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-primary flex-shrink-0" />
                <a
                  href="mailto:vskyyspa@gmail.com"
                  className="text-muted-foreground hover:text-primary transition-smooth"
                >
                  vskyyspa@gmail.com
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-muted-foreground text-sm">
              {t("footer.rights")}
            </p>
            <div className="flex gap-6 text-sm">
              <Link to="/privacy" className="text-muted-foreground hover:text-primary transition-smooth">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-muted-foreground hover:text-primary transition-smooth">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
