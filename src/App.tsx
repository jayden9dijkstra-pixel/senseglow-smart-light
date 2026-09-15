import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { useEffect, useRef } from "react";
import { useScrollToTop } from "@/hooks/useScrollToTop";
import { captureClickIds, trackPageView } from "@/lib/adsTracking";
import Index from "./pages/Index";
import Quiz from "./pages/Quiz";
import ProductDetail from "./pages/ProductDetail";
import Catalog from "./pages/Catalog";
import Contact from "./pages/Contact";
import Shipping from "./pages/Shipping";
import OrderTracking from "./pages/OrderTracking";
import Returns from "./pages/Returns";
import About from "./pages/About";
import Sustainability from "./pages/Sustainability";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Login from "./pages/Login";
import OAuthConsent from "./pages/OAuthConsent";
import BundleBuilder from "./pages/BundleBuilder";
import WhySenseGlow from "./pages/WhySenseGlow";
import NotFound from "./pages/NotFound";
import { I18nProvider } from "@/i18n/I18nProvider";
import { DomTranslator } from "@/i18n/DomTranslator";
import { LanguageChooser } from "@/components/LanguageChooser";

const queryClient = new QueryClient();

// Component to handle scroll to top on route change
const ScrollToTopHandler = () => {
  useScrollToTop();
  return null;
};

// Bewaart de Google Ads klik-informatie en meldt paginaweergaves bij routewissels.
const AdsTracking = () => {
  const { pathname, search } = useLocation();
  const isFirst = useRef(true);

  useEffect(() => {
    captureClickIds();
  }, []);

  useEffect(() => {
    if (isFirst.current) {
      // De eerste weergave stuurt gtag zelf al vanuit de <head>.
      isFirst.current = false;
      return;
    }
    trackPageView(`${pathname}${search}`);
  }, [pathname, search]);

  return null;
};

const App = () => (
  <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <I18nProvider>
          <ScrollToTopHandler />
          <AdsTracking />
          <DomTranslator />
          <LanguageChooser />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/quiz" element={<Quiz />} />
            <Route path="/product/:handle" element={<ProductDetail />} />
            <Route path="/producten" element={<Catalog />} />
            <Route path="/catalogus" element={<Catalog />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/verzending" element={<Shipping />} />
            <Route path="/volg-je-bestelling" element={<OrderTracking />} />
            <Route path="/track" element={<OrderTracking />} />
            <Route path="/bestelling-volgen" element={<OrderTracking />} />
            <Route path="/retourneren" element={<Returns />} />
            <Route path="/over" element={<About />} />
            <Route path="/stel-je-bundel-samen" element={<BundleBuilder />} />
            <Route path="/bundels" element={<BundleBuilder />} />
            <Route path="/waarom-senseglow" element={<WhySenseGlow />} />
            <Route path="/duurzaamheid" element={<Sustainability />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/voorwaarden" element={<Terms />} />
            <Route path="/login" element={<Login />} />
            <Route path="/.lovable/oauth/consent" element={<OAuthConsent />} />
            <Route path="/:locale(en|fr)" element={<Index />} />
            <Route path="/:locale(en|fr)/quiz" element={<Quiz />} />
            <Route path="/:locale(en|fr)/product/:handle" element={<ProductDetail />} />
            <Route path="/:locale(en|fr)/producten" element={<Catalog />} />
            <Route path="/:locale(en|fr)/catalogus" element={<Catalog />} />
            <Route path="/:locale(en|fr)/contact" element={<Contact />} />
            <Route path="/:locale(en|fr)/verzending" element={<Shipping />} />
            <Route path="/:locale(en|fr)/volg-je-bestelling" element={<OrderTracking />} />
            <Route path="/:locale(en|fr)/track" element={<OrderTracking />} />
            <Route path="/:locale(en|fr)/bestelling-volgen" element={<OrderTracking />} />
            <Route path="/:locale(en|fr)/retourneren" element={<Returns />} />
            <Route path="/:locale(en|fr)/over" element={<About />} />
            <Route path="/:locale(en|fr)/stel-je-bundel-samen" element={<BundleBuilder />} />
            <Route path="/:locale(en|fr)/bundels" element={<BundleBuilder />} />
            <Route path="/:locale(en|fr)/waarom-senseglow" element={<WhySenseGlow />} />
            <Route path="/:locale(en|fr)/duurzaamheid" element={<Sustainability />} />
            <Route path="/:locale(en|fr)/privacy" element={<Privacy />} />
            <Route path="/:locale(en|fr)/voorwaarden" element={<Terms />} />
            <Route path="/:locale(en|fr)/login" element={<Login />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          </I18nProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
