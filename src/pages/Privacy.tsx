import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SEO from "@/components/SEO";
import { pageSEO } from "@/seo/seoConfig";

const Privacy = () => {
  const seo = {
    ...pageSEO.privacy,
    title: "Privacy Policy | V&SKY SPA Kigali",
    description:
      "Read the privacy policy of V&SKY SPA Kigali explaining how we collect, use, and protect your personal information.",
    path: "/privacy",
    image: "privacy-policy.jpg",
  };

  return (
    <>
      <SEO
        title={seo.title}
        description={seo.description}
        url={seo.url}
        canonical={seo.canonical}
        image={seo.image}
        keywords={seo.keywords}
      />
      <div className="min-h-screen">
        <Navbar />
        {/* Hero Section */}
        <section className="relative bg-gradient-to-r from-primary to-secondary text-white py-28">
          <div className="container mx-auto px-4 text-center max-w-4xl">
            <h1 className="text-5xl font-extrabold mb-4 drop-shadow-lg pt-12">Privacy Policy</h1>
            <p className="text-lg md:text-xl opacity-90 max-w-3xl mx-auto">
              Your privacy is important to us at V&SKY SPA Kigali. Learn how we safeguard your data and respect your information.
            </p>
          </div>
        </section>

        {/* Content Section */}
        <main className="container mx-auto px-4 py-12 max-w-5xl">
          <section className="bg-white rounded-xl shadow-lg p-8 text-gray-800 dark:text-gray-100">
            <h2 className="text-3xl font-semibold mb-6">Information We Collect</h2>
            <ul className="list-disc list-inside mb-6 space-y-2">
              <li>Personal identification info like name, email, phone</li>
              <li>Usage data such as pages visited, interactions</li>
              <li>Payment details for bookings processed securely</li>
            </ul>

            <h2 className="text-3xl font-semibold mb-6">How We Use Your Information</h2>
            <ul className="list-disc list-inside mb-6 space-y-2">
              <li>To provide and manage spa and wellness services</li>
              <li>To communicate booking confirmations and updates</li>
              <li>To enhance website functionality and customer experience</li>
              <li>To comply with legal and regulatory requirements</li>
            </ul>

            <h2 className="text-3xl font-semibold mb-6">Security Measures</h2>
            <p className="mb-6 leading-relaxed">
              We implement industry-standard security protocols to protect your personal data from unauthorized access or breaches.
            </p>

            <h2 className="text-3xl font-semibold mb-6">Your Rights</h2>
            <p className="mb-6 leading-relaxed">
              You have the right to access, correct, or request deletion of your personal information at any time by contacting us.
            </p>

            <h2 className="text-3xl font-semibold mb-6">Contact Us</h2>
            <p className="mb-6">
              Questions or concerns? Reach out to us at <a href="mailto:vskyyspagmail.com" className="text-primary underline hover:text-secondary">vskyyspagmail.com</a>.
            </p>
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Privacy;
