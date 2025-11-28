import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Check } from "lucide-react";
import SEO from "@/components/SEO";
import { pageSEO } from "@/seo/seoConfig";
import { useTranslation } from "react-i18next";

const Pricing = () => {
  const { t } = useTranslation();

  const membershipCards = [
    {
      name: t("pricing.membership.vip1.name"),
      description: t("pricing.membership.vip1.description"),
      pay: t("pricing.membership.vip1.pay"),
      value: t("pricing.membership.vip1.value"),
      bonus: t("pricing.membership.vip1.bonus"),
      period: t("pricing.membership.vip1.period"),
      popular: false,
      features: [
        t("pricing.membership.vip1.feature1"),
        t("pricing.membership.vip1.feature2"),
        t("pricing.membership.vip1.feature3"),
        t("pricing.membership.vip1.feature4"),
      ],
    },
    {
      name: t("pricing.membership.vip2.name"),
      description: t("pricing.membership.vip2.description"),
      pay: t("pricing.membership.vip2.pay"),
      value: t("pricing.membership.vip2.value"),
      bonus: t("pricing.membership.vip2.bonus"),
      period: t("pricing.membership.vip2.period"),
      popular: true,
      features: [
        t("pricing.membership.vip2.feature1"),
        t("pricing.membership.vip2.feature2"),
        t("pricing.membership.vip2.feature3"),
        t("pricing.membership.vip2.feature4"),
      ],
    },
    {
      name: t("pricing.membership.vip3.name"),
      description: t("pricing.membership.vip3.description"),
      pay: t("pricing.membership.vip3.pay"),
      value: t("pricing.membership.vip3.value"),
      bonus: t("pricing.membership.vip3.bonus"),
      period: t("pricing.membership.vip3.period"),
      popular: false,
      features: [
        t("pricing.membership.vip3.feature1"),
        t("pricing.membership.vip3.feature2"),
        t("pricing.membership.vip3.feature3"),
        t("pricing.membership.vip3.feature4"),
      ],
    },
    {
      name: t("pricing.membership.vip4.name"),
      description: t("pricing.membership.vip4.description"),
      pay: t("pricing.membership.vip4.pay"),
      value: t("pricing.membership.vip4.value"),
      bonus: t("pricing.membership.vip4.bonus"),
      period: t("pricing.membership.vip4.period"),
      popular: false,
      features: [
        t("pricing.membership.vip4.feature1"),
        t("pricing.membership.vip4.feature2"),
        t("pricing.membership.vip4.feature3"),
        t("pricing.membership.vip4.feature4"),
      ],
    },
  ];

  const categorizedServices = {
    [t("pricing.services.category.massage")]: [
      { service: t("pricing.services.massage1"), price: "30K" },
      { service: t("pricing.services.massage2"), price: "40K" },
      { service: t("pricing.services.massage3"), price: "50K" },
      { service: t("pricing.services.massage4"), price: "70K" },
      { service: t("pricing.services.massage5"), price: "30K" },
      { service: t("pricing.services.massage6"), price: "40K" },
      { service: t("pricing.services.massage7"), price: "30K" },
      { service: t("pricing.services.massage8"), price: "20K" },
      { service: t("pricing.services.massage9"), price: "40K" },
      { service: t("pricing.services.massage10"), price: "20K" },
    ],
    [t("pricing.services.category.skinCare")]: [
      { service: t("pricing.services.skin1"), price: "45K" },
      { service: t("pricing.services.skin2"), price: "40K" },
    ],
    [t("pricing.services.category.hair")]: [{ service: t("pricing.services.hair1"), price: "" }],
    [t("pricing.services.category.coffee")]: [
      { service: t("pricing.services.coffee1"), price: "4000 RWF" },
      { service: t("pricing.services.coffee2"), price: "4000 RWF" },
      { service: t("pricing.services.coffee3"), price: "3000 RWF" },
      { service: t("pricing.services.coffee4"), price: "4500 RWF" },
      { service: t("pricing.services.coffee5"), price: "2500 RWF" },
      { service: t("pricing.services.coffee6"), price: "3000 RWF" },
      { service: t("pricing.services.coffee7"), price: "4000 RWF" },
      { service: t("pricing.services.coffee8"), price: "4500 RWF" },
      { service: t("pricing.services.coffee9"), price: "4500 RWF" },
      { service: t("pricing.services.coffee10"), price: "4000 RWF" },
      { service: t("pricing.services.coffee11"), price: "4000 RWF" },
      { service: t("pricing.services.coffee12"), price: "4000 RWF" },
      { service: t("pricing.services.coffee13"), price: "4000 RWF" },
    ],
  };

  const pricingSEO = pageSEO.pricing;

  return (
    <div className="min-h-screen">
      <SEO
        title={pricingSEO.title}
        description={pricingSEO.description}
        url={pricingSEO.url}
        canonical={pricingSEO.canonical}
        image={pricingSEO.image}
        type={pricingSEO.type}
        keywords={pricingSEO.keywords}
      />

      <Navbar />

      {/* HERO */}
      <section className="mt-[116px] pt-32 pb-16 gradient-soft">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">{t("pricing.hero.title")}</h1>
          <p className="text-xl text-muted-foreground">
            {t("pricing.hero.subtitle")}
          </p>
        </div>
      </section>

      {/* MEMBERSHIP */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">{t("pricing.membership.title")}</h2>
            <p className="text-muted-foreground">{t("pricing.membership.subtitle")}</p>
          </div>

          <div className="grid md:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {membershipCards.map((pkg, i) => (
              <Card
  key={i}
  className={`relative overflow-hidden shadow-lg rounded-2xl border-none bg-pink-100 hover:shadow-2xl transition`}
>

                {pkg.popular && (
                  <div className="absolute top-0 right-0 bg-primary text-white px-4 py-1 text-sm font-semibold rounded-bl-xl shadow">
                    {t("pricing.membership.popular")}
                  </div>
                )}

                <CardHeader className="pt-10 text-center">
                  <h3 className="text-2xl font-bold">{pkg.name}</h3>
                  <p className="text-muted-foreground text-sm mt-1 mb-4">
                    {pkg.description}
                  </p>

                  {/* PRICE FIXED */}
                  <div className="mb-4 text-center">
                    <div className="flex justify-center items-center space-x-2">
                      <span className="text-3xl font-bold text-primary">{pkg.pay}</span>
                      <span className="text-xl">→</span>
                      <span className="text-3xl font-extrabold text-green-600">{pkg.value}</span>
                    </div>

                    <div className="mt-2 inline-block bg-green-100 text-green-700 text-sm px-3 py-1 rounded-full font-medium">
                      +{pkg.bonus} Bonus Value
                    </div>

                    <div className="text-muted-foreground text-xs mt-1">
                      ({pkg.period})
                    </div>
                  </div>

                </CardHeader>

                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {pkg.features.map((f, idx) => (
                      <li key={idx} className="flex items-start">
                        <Check className="h-4 w-4 text-primary mr-2 mt-1" />
                        <span className="text-sm">{f}</span>
                      </li>
                    ))}
                  </ul>

                  <Link
                    to={`/booking?service=${encodeURIComponent(`${pkg.name} ${pkg.value}`)}`}
                  >

                    <Button
                      variant={pkg.popular ? "hero" : "outline"}
                      className="w-full rounded-xl"
                    >
                      {t("pricing.membership.get")}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* INDIVIDUAL SERVICES */}
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">{t("pricing.services.title")}</h2>
            <p className="text-muted-foreground">
              {t("pricing.services.subtitle")}
            </p>
          </div>

          <Card className="shadow-lg border-none rounded-2xl">
            <CardContent className="p-8">
              {Object.entries(categorizedServices).map(([cat, list]) => (
                <div key={cat} className="mb-10">
                  <h3 className="text-2xl font-semibold mb-4">{cat}</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {list.map((s, idx) => (
                      <div
                        key={idx}
                        className="flex justify-between items-center p-4 bg-muted/20 rounded-lg hover:bg-muted/40 transition"
                      >
                        <span className="font-medium">{s.service}</span>
                        <span className="text-primary font-bold">{s.price}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="gradient-primary p-12 rounded-3xl text-center text-black shadow-xl">
            <h2 className="text-4xl font-bold mb-6">{t("pricing.cta.title")}</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              {t("pricing.cta.subtitle")}
            </p>

            <Link to="/booking">
              <Button size="lg" className="bg-white text-primary hover:bg-white/90 rounded-xl">
                {t("pricing.cta.button")}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Pricing;
