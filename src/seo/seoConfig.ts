const siteUrl = "https://vskyspa.com";

const createAssetUrl = (assetName: string) =>
  new URL(`../assets/${assetName}`, import.meta.url).href;

export const primaryKeywords = [
  "V&SKY SPA Kigali",
  "V&SKY SPA Rwanda",
  "Vskyspa Kigali",
  "V sky spa Kigali",
  "V sky spa Rwanda",
  "Vsky spa Kigali",
  "Spa in Kigali",
  "Spa Kigali",
  "Spa Rwanda",
  "Best spa Kigali",
  "Spa therapy Kigali",
  "Spa therapy Rwanda",
  "Best Spa in Kigali",
  "Best Spa in Rwanda",
  "Top Best Spa in Kigali",
  "Top Best Spa in Rwanda",
  "Top Spa in Kigali",
  "Top Spa in Rwanda",
  "Spa Kigali Rwanda",
  "Massage in Kigali",
  "Wellness Rwanda",
  "Facial treatment Kigali",
  "Luxury spa Rwanda",
  "Body massage Kigali",
  "Best spa in Kigali",
  "Professional therapists Rwanda",
  "Organic spa treatments Kigali",
  "Premium relaxation Kigali",
  "Aromatherapy massage Kigali",
  "Deep tissue massage Kigali",
  "Spa packages Kigali",
  "Relaxation massage Kigali",

  "Spa therapy Kigali",

  "Full body massage Rwanda",

  "Hot stone massage Kigali",

  "Aromatherapy Kigali",

  "Massage spa near me Kigali",

  "Kigali spa center",

  "Kigali beauty spa",

  "Spa treatments Rwanda",

  "Professional massage Kigali",

  "Kigali skincare treatments",
];

export const supplementaryKeywords = [
  "Kigali wellness retreat",
  "Kigali spa deals",
  "Couples spa Kigali",
  "Holistic healing Rwanda",
  "Detox spa Kigali",
  "Skin rejuvenation Rwanda",
  "Thai massage Kigali",
  "Spa gift vouchers Rwanda",
  "Spa VIP cards Rwanda",
  "Spa packages Rwanda",
  "Aromatherapy spa Kigali",
  "Spa packages Kigali",
  "Spa packages Rwanda",
  "Spa packages Kigali",
  "VIP spa Kigali",

  "Corporate wellness Kigali",
  "Luxury day spa Rwanda",
  // Newly targeted high-value keywords
  "Wellness spa Kigali",
  "Holistic wellness Kigali",
  "Spa detox Rwanda",
  "Couples massage Rwanda",
  "Signature spa Rwanda",
  "Hydrotherapy Kigali",
  "Luxury day spa Kigali",
  "Rejuvenating facial Rwanda",
  "Stress relief massage Kigali",
  "Wellness retreat Rwanda",
  "Therapeutic massage Kigali",

  "Wellness center Kigali",

  "Day spa Kigali",

  "Deep relaxation Rwanda",

  "Kigali detox therapy",

  "Anti-stress massage Kigali",

  "Swedish massage Kigali",

  "Beauty and wellness Kigali",

  "Luxury massage Kigali",

  "Healing massage Rwanda",

  "Kigali pampering services",

  "Spa relaxation Kigali",

  "Massage recovery Rwanda",

  "Premium spa Kigali",

  "Rejuvenation spa Rwanda",

  "Massage lounge Kigali",

  "Skin therapy Kigali",

  "Holistic facial Rwanda",

  "Relax lounge Kigali",

  "Massage Kigali near Kibagabaga",

  "Spa near Kibagabaga",

  "Massage near Kigali hospital",

  "Affordable massage Kigali",
];

export const allKeywords = Array.from(
  new Set([...primaryKeywords, ...supplementaryKeywords])
);

type PageMetaInput = {
  title: string;
  description: string;
  path: string;
  image: string;
  type?: string;
  extraKeywords?: string[];
};

const buildPageMeta = ({
  title,
  description,
  path,
  image,
  type = "website",
  extraKeywords = [],
}: PageMetaInput) => ({
  title,
  description,
  path,
  url: `${siteUrl}${path}`,
  canonical: `${siteUrl}${path}`,
  image: createAssetUrl(image),
  type,
  keywords: Array.from(new Set([...allKeywords, ...extraKeywords])),
});

export const pageSEO = {
  home: buildPageMeta({
    title: "V&SKY SPA Kigali | Luxury Wellness & Massages",
    description:
      "Experience premium massages, facials, and spa rituals at V&SKY SPA in Kigali. Recharge with organic treatments, expert therapists, and serene spaces.",
    path: "/",
    image: "hero-massage.jpg",
    extraKeywords: ["Luxury wellness Kigali", "Spa lounge Kigali"],
  }),
  booking: buildPageMeta({
    title: "Book Spa Treatments in Kigali | V&SKY SPA",
    description:
      "Reserve Kigali spa appointments for massages, facials, and wellness packages. Fast confirmation via MTN Mobile Money.",
    path: "/booking",
    image: "bg-spa-luxury.jpg",
    extraKeywords: ["Spa appointment Kigali", "Online spa booking Rwanda"],
  }),
  services: buildPageMeta({
    title: "Spa Services Kigali | Massages, Facials, Hair Care",
    description:
      "Explore Kigali spa services: deep tissue massage, aromatherapy, facials, hair care, and coffee lounge rituals at V&SKY SPA.",
    path: "/services",
    image: "service-massage.jpg",
    extraKeywords: ["Holistic spa Kigali", "Massage therapy Rwanda"],
  }),
  pricing: buildPageMeta({
    title: "Kigali Spa Packages & Pricing | V&SKY SPA",
    description:
      "Review V&SKY SPA pricing for body massage, skincare, hair care, and luxury spa packages in Kigali, Rwanda.",
    path: "/pricing",
    image: "bg-treatment-room.jpg",
    extraKeywords: ["Affordable spa Kigali", "Wellness packages Rwanda"],
  }),
  about: buildPageMeta({
    title: "About V&SKY SPA Kigali | Wellness Experts",
    description:
      "Learn how V&SKY SPA blends Rwandan hospitality with luxury wellness, expert therapists, and organic skincare in Kigali.",
    path: "/about",
    image: "about-spa.jpg",
    extraKeywords: ["Spa heritage Kigali", "Wellness experts Rwanda"],
  }),
  contact: buildPageMeta({
    title: "Contact V&SKY SPA Kigali | Book or Visit",
    description:
      "Call, WhatsApp, or visit V&SKY SPA in Kibagabaga, Kigali for bookings, directions, and personalized wellness guidance.",
    path: "/contact",
    image: "bg-wellness-retreat.jpg",
    extraKeywords: ["Spa directions Kigali", "Kigali spa phone"],
  }),
  gallery: buildPageMeta({
    title: "V&SKY SPA Gallery | Kigali Wellness Retreat",
    description:
      "Tour the V&SKY SPA gallery featuring relaxation lounges, treatment rooms, and Kigali’s most serene wellness retreat.",
    path: "/gallery",
    image: "gallery-lounge.jpg",
    extraKeywords: ["Spa interiors Kigali", "Wellness design Rwanda"],
  }),
  team: buildPageMeta({
    title: "Meet V&SKY SPA Therapists | Kigali Experts",
    description:
      "Meet the expert Kigali massage therapists, estheticians, and wellness specialists who personalize every V&SKY SPA visit.",
    path: "/team",
    image: "hero-wellness.jpg",
    extraKeywords: ["Spa therapists Kigali", "Professional estheticians Kigali"],
  }),
  testimonials: buildPageMeta({
    title: "Client Reviews | Best Spa in Kigali",
    description:
      "Read Kigali client testimonials about V&SKY SPA’s massages, facials, and award-winning wellness rituals.",
    path: "/testimonials",
    image: "bg-wellness-retreat.jpg",
    extraKeywords: ["Spa reviews Kigali", "Wellness ratings Rwanda"],
  }),
  privacy: buildPageMeta({
    title: "Privacy Policy | V&SKY SPA Kigali",
    description:
      "Read the privacy policy of V&SKY SPA Kigali explaining how we collect, use, and protect your personal information.",
    path: "/privacy",
    image: "privacy-policy.jpg",
    extraKeywords: ["Privacy policy Kigali", "Data protection Rwanda"],
  }),
  terms: buildPageMeta({
    title: "Terms of Service | V&SKY SPA Kigali",
    description:
      "Read the terms of service that govern the use of V&SKY SPA Kigali website and services, including booking and payments.",
    path: "/terms",
    image: "terms-of-service.jpg",
    extraKeywords: ["Terms of service Kigali", "Booking terms Rwanda"],
  }),
  notfound: buildPageMeta({
    title: "404 Not Found | V&SKY SPA Kigali",
    description:
      "The page you are looking for does not exist. Explore premium spa services, wellness treatments, and bookings at V&SKY SPA Kigali.",
    path: "/404",
    image: "notspecific-image.jpg",
    extraKeywords: ["404 page", "Page not found Kigali spa", "V&SKY SPA 404"],
  }),
};

export type PageKey = keyof typeof pageSEO;

export const breadcrumbEntries = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
  { name: "Services", path: "/services" },
  { name: "Pricing", path: "/pricing" },
  { name: "Booking", path: "/booking" },
  { name: "Gallery", path: "/gallery" },
  { name: "Team", path: "/team" },
  { name: "Testimonials", path: "/testimonials" },
  { name: "Contact", path: "/contact" },
];

export const faqContent = {
  booking: [
    {
      question: "How do I confirm a V&SKY SPA appointment in Kigali?",
      answer:
        "Complete the online form, choose your preferred massage or facial, then confirm payment via MTN Mobile Money for instant scheduling.",
    },
    {
      question: "Can I book couples or group spa packages?",
      answer:
        "Yes, we schedule couples spa rituals, bridal parties, and corporate wellness sessions—share your group size in the special requests field.",
    },
    {
      question: "What is the cancellation policy?",
      answer:
        "Please give at least 24 hours’ notice to reschedule without fees so we can reopen the slot for other Kigali guests.",
    },
  ],
  contact: [
    {
      question: "Where is V&SKY SPA located in Kigali?",
      answer:
        "You can find us in Kibagabaga, Kigali, close to major residential and business districts with private parking available on-site.",
    },
    {
      question: "What are the operating hours?",
      answer:
        "We welcome guests Monday to Friday from 10 AM to 10 PM and weekends from 9 AM to 10 PM for massages, facials, and spa packages.",
    },
    {
      question: "Do you offer vip memberships or corporate wellness plans?",
      answer:
        "Yes, request digital spa vip membership card or tailored corporate wellness packages through our contact form or WhatsApp.",
    },
  ],
};

export const siteSearchSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  url: siteUrl,
  potentialAction: {
    "@type": "SearchAction",
    target: `${siteUrl}/?s={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
};

export const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "Spa",
  name: "V&SKY SPA",
  image: createAssetUrl("VSKYSPA.jpeg"),
  address: {
    "@type": "PostalAddress",
    streetAddress: "Kibagabaga",
    addressLocality: "Kigali",
    addressCountry: "RW",
  },
  telephone: ["+250781262272", "+250796584614"],
  url: siteUrl,
  priceRange: "$$",
  geo: {
    "@type": "GeoCoordinates",
    latitude: -1.936,
    longitude: 30.108,
  },
  description:
    "Premium massages, facial treatments, skincare, wellness and luxury spa services in Kigali, Rwanda.",
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
      ],
      opens: "09:00",
      closes: "20:00",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Saturday", "Sunday"],
      opens: "10:00",
      closes: "18:00",
    },
  ],
  sameAs: [
    "https://www.facebook.com/vskyspa",
    "https://www.instagram.com/vskyspa",
  ],
};

export const getCanonicalUrl = (path: string) => {
  const normalizedPath = path === "/" ? "/" : path.startsWith("/") ? path : `/${path}`;
  return `${siteUrl}${normalizedPath}`;
};

export { siteUrl };

