import React, { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SEO from "@/components/SEO";
import { pageSEO } from "@/seo/seoConfig";

const Terms = () => {
  const seo = {
    ...pageSEO.terms,
    title: "Terms of Service | V&SKY SPA Kigali",
    description:
      "Read the terms of service that govern the use of V&SKY SPA Kigali website and services, including booking and payments.",
    path: "/terms",
    image: "terms-of-service.jpg",
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
            <h1 className="text-5xl font-extrabold mb-4 drop-shadow-lg pt-12">Terms of Service</h1>
            <p className="text-lg md:text-xl opacity-90 max-w-3xl mx-auto">
              Welcome to V&SKY SPA Kigali. By accessing or using our website and services, you agree to comply with the following terms and conditions:
            </p>
          </div>
        </section>

        {/* Content Section */}
        <main className="container mx-auto px-4 py-12 max-w-5xl">
          <section className="bg-white rounded-xl shadow-lg p-8 text-gray-800 dark:text-gray-100">
            <h2 className="text-3xl font-semibold mb-6">Use of Services</h2>
            <p className="mb-6 leading-relaxed">
              Our spa services are for personal use only. You agree not to misuse our services or disrupt the experience of others.
            </p>
            <h2 className="text-3xl font-semibold mb-6">Booking and Payments</h2>
            <p className="mb-6 leading-relaxed">
              Bookings require accurate information and payment according to pricing. Cancellation policies apply as stated on the booking page.
            </p>
            <h2 className="text-3xl font-semibold mb-6">Limitation of Liability</h2>
            <p className="mb-6 leading-relaxed">
              We strive to provide the best experience but are not liable for damages arising from use of the services.
            </p>
            <h2 className="text-3xl font-semibold mb-6">Changes to Terms</h2>
            <p className="mb-6 leading-relaxed">
              We may update these terms periodically. Continued use constitutes acceptance of such changes.
            </p>
            <h2 className="text-3xl font-semibold mb-6">Contact Us</h2>
            <p>
              For questions about these terms, contact us at <a href="mailto:vskyyspa@gmail.com" className="text-primary underline hover:text-secondary">vskyyspa@gmail.com</a>.
            </p>
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Terms;
