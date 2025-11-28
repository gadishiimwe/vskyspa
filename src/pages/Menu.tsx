import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SEO from "@/components/SEO";
import { pageSEO } from "@/seo/seoConfig";
import menu1 from "@/assets/menu1.png";
import menu2 from "@/assets/menu2.png";
import { useTranslation } from "react-i18next";

const Menu = () => {
  const { t } = useTranslation();
  const menuSEO = {
    title: "V&SKY MENU - Spa Services Menu",
    description: "Explore our comprehensive spa services menu at V&SKY SPA. View our detailed menu with all available treatments and services.",
    url: "https://vskyspa.com/menu",
    canonical: "https://vskyspa.com/menu",
    image: "/V&SKY Gate Banner.jpg",
    type: "website",
    keywords: [
      "spa menu",
      "V&SKY menu",
      "spa services",
      "massage menu",
      "facial menu",
      "hair services menu"
    ]

  };

  return (
    <div className="min-h-screen">
      <SEO
        title={menuSEO.title}
        description={menuSEO.description}
        url={menuSEO.url}
        canonical={menuSEO.canonical}
        image={menuSEO.image}
        type={menuSEO.type}
        keywords={menuSEO.keywords}
      />

      <Navbar />

      {/* Hero Section */}
      <section className="mt-[116px] pt-32 md:pt-24 pb-16 gradient-soft">
        <div className="container mx-auto px-4 text-center max-w-3xl animate-fade-up">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">{t("menu.hero.title")}</h1>
          <p className="text-xl text-muted-foreground">
            {t("menu.hero.subtitle")}
          </p>
        </div>
      </section>

      {/* Menu Images */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Menu 1 */}
              <div className="w-full">
                <img
                  src={menu1}
                  alt={t("menu.image1.alt")}
                  className="w-full h-auto rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300"
                />
              </div>

              {/* Menu 2 */}
              <div className="w-full">
                <img
                  src={menu2}
                  alt={t("menu.image2.alt")}
                  className="w-full h-auto rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Menu;
