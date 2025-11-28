import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import ScrollToTop from "./components/ScrollToTop";
import "./lib/i18n"; // Initialize i18n
import Home from "./pages/Home";
import About from "./pages/About";
import Services from "./pages/Services";
import ServiceDetail from "./pages/ServiceDetail";
import CoffeeServices from "./pages/CoffeeServices";
import Pricing from "./pages/Pricing";
import Menu from "./pages/Menu";
import Booking from "./pages/Booking";

import Admin from "./pages/Admin";
import AdminAvailability from "./pages/AdminAvailability";
import Gallery from "./pages/Gallery";
import Testimonials from "./pages/Testimonials";
import Contact from "./pages/Contact";

import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <HelmetProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/services/:serviceId" element={<ServiceDetail />} />
            <Route path="/coffee-services" element={<CoffeeServices />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/booking" element={<Booking />} />

            <Route path="/gallery" element={<Gallery />} />
            <Route path="/testimonials" element={<Testimonials />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </HelmetProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
