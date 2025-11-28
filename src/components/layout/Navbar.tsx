import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { NavLink } from "@/components/NavLink";
import { Button } from "@/components/ui/button";
import { Menu, Search, Phone, Mail, MapPin } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import SearchModal from "@/components/SearchModal";
import LanguageSelector from "@/components/LanguageSelector";
import { useTranslation } from "react-i18next";

const Navbar = () => {
  const location = useLocation();
  const isMobile = useIsMobile();
  const { t } = useTranslation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState<number | null>(
    null
  );

  const navItems = [
    { path: "/", label: "Home" },
    { path: "/about", label: "About" },
    { path: "/services", label: "Services" },
    {
      label: "Pricing",
      children: [
        { path: "/pricing", label: "Pricing" },
        { path: "/menu", label: "Menu" },
      ],
    },
    { path: "/gallery", label: "Gallery" },
    { path: "/contact", label: "Contact" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border shadow-soft">
      {/* Top Bar */}
      <div className="gradient-primary text-white py-2 text-sm block">
        <div className="container mx-auto px-4 flex flex-wrap items-center justify-between gap-4">
          <div className="hidden md:flex flex-wrap items-center gap-4 md:gap-6">
            <a
              href="tel:+250781262272"
              className="flex items-center gap-2 hover:opacity-80 transition-smooth"
            >
              <Phone className="h-4 w-4" />
              <span>+250781262272 / +250796584614</span>
            </a>
            <a
              href="mailto:vskyyspa@gmail.com"
              className="flex items-center gap-2 hover:opacity-80 transition-smooth"
            >
              <Mail className="h-4 w-4" />
              <span>vskyyspa@gmail.com</span>
            </a>
          </div>

          <div className="flex md:hidden items-center gap-2">
            <MapPin className="h-4 w-4" />
            <span>Kibagabaga, Kigali, Rwanda</span>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex flex-col">
            <span className="text-3xl font-bold text-gradient">V&SKY SPA</span>
            <span className="text-xs text-muted-foreground">
              {t("nav.tagline")}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navItems.map((item, i) =>
              item.children ? (
                <div
                  key={`dropdown-${i}`}
                  className="relative group"
                >
                  <button className="px-4 py-2 rounded-md hover:text-primary transition-smooth">
                    {item.label}
                  </button>
                  <div className="absolute left-0 mt-2 bg-white shadow-lg rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 min-w-[160px]">
                    {item.children.map((child, c) => (
                      <NavLink
                        key={`submenu-${i}-${c}`}
                        to={child.path}
                        className="block px-4 py-2 whitespace-nowrap hover:bg-accent hover:text-primary"
                        activeClassName="text-primary font-semibold"
                      >
                        {child.label}
                      </NavLink>
                    ))}
                  </div>
                </div>
              ) : (
                <NavLink
                  key={`nav-${i}`}
                  to={item.path}
                  end={item.path === "/"}
                  className="px-4 py-2 rounded-md hover:text-primary transition-smooth"
                  activeClassName="text-primary font-semibold"
                >
                  {item.label}
                </NavLink>
              )
            )}
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-3">
            {/* Language Selector */}
            <LanguageSelector />

            {/* Search button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSearchOpen(!searchOpen)}
              className="rounded-full"
            >
              <Search className="h-5 w-5" />
            </Button>

            {/* Booking */}
            <Link to="/booking">
              <Button variant="hero" className="hidden md:inline-flex">
                {t("nav.booking")}
              </Button>
            </Link>

            {/* Mobile Menu */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild className="lg:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>

              <SheetContent side="right" className="w-[300px]">
                <SheetHeader>
                  <SheetTitle className="text-2xl font-bold text-gradient">
                    V&SKY SPA
                  </SheetTitle>
                </SheetHeader>

                <div className="flex flex-col gap-4 mt-8">
                  {navItems.map((item, i) =>
                    item.children ? (
                      <div key={`mobile-dropdown-${i}`}>
                        <button
                          className="flex justify-between w-full px-4 py-2 font-semibold text-primary"
                          onClick={() =>
                            setMobileDropdownOpen(
                              mobileDropdownOpen === i ? null : i
                            )
                          }
                        >
                          {item.label}
                          <span className="ml-2">
                            {mobileDropdownOpen === i ? "▲" : "▼"}
                          </span>
                        </button>
                        {mobileDropdownOpen === i && (
                          <div className="pl-6 mt-2 flex flex-col gap-2">
                            {item.children.map((child, c) => (
                              <NavLink
                                key={`mobile-sub-${i}-${c}`}
                                to={child.path}
                                onClick={() => setMobileMenuOpen(false)}
                                className="px-4 py-2 rounded-md hover:bg-accent"
                                activeClassName="text-primary font-semibold"
                              >
                                {child.label}
                              </NavLink>
                            ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      <NavLink
                        key={`mobile-nav-${i}`}
                        to={item.path}
                        onClick={() => setMobileMenuOpen(false)}
                        className="px-4 py-3 rounded-md hover:bg-accent transition-smooth"
                        activeClassName="text-primary font-semibold"
                      >
                        {item.label}
                      </NavLink>
                    )
                  )}

                  <Link to="/booking" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="hero" className="w-full mt-4">
                      {t("nav.booking")}
                    </Button>
                  </Link>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        <SearchModal
          isOpen={searchOpen}
          onClose={() => setSearchOpen(false)}
        />
      </nav>
    </header>
  );
};

export default Navbar;
