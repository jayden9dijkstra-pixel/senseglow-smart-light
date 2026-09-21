import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import { useEffect, useRef, lazy, Suspense } from "react";
import { useScrollToTop } from "@/hooks/useScrollToTop";
import { captureClickIds, initializeAnalytics, trackPageView } from "@/lib/adsTracking";
import { trackSiteEvent } from "@/lib/siteAnalytics";
// Kernpad blijft direct geladen: dit zijn de pagina's waar advertentieverkeer
// op landt en waar geconverteerd wordt. Alles daarbuiten wordt pas opgehaald
// zodra iemand er echt naartoe navigeert — dat houdt de eerste download klein
// op mobiel, zonder de prerender-headscripts te raken (die lezen alleen
// routepaden en metadata, niet de componenten zelf).
import Index from "./pages/Index";
import ProductDetail from "./pages/ProductDetail";
import Catalog from "./pages/Catalog";
import NotFound from "./pages/NotFound";
const AdminDashboard = lazy(() => import("./pages/admin/Dashboard"));
const Quiz = lazy(() => import("./pages/Quiz"));
const Contact = lazy(() => import("./pages/Contact"));
const Shipping = lazy(() => import("./pages/Shipping"));
const OrderTracking = lazy(() => import("./pages/OrderTracking"));
const Returns = lazy(() => import("./pages/Returns"));
const About = lazy(() => import("./pages/About"));
const Sustainability = lazy(() => import("./pages/Sustainability"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Terms = lazy(() => import("./pages/Terms"));
const Login = lazy(() => import("./pages/Login"));
const OAuthConsent = lazy(() => import("./pages/OAuthConsent"));
const BundleBuilder = lazy(() => import("./pages/BundleBuilder"));
const WhySenseGlow = lazy(() => import("./pages/WhySenseGlow"));
import { LegacyRedirect, DutchPrefixRedirect } from "@/components/LegacyRedirect";
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
    initializeAnalytics();
  }, []);

  useEffect(() => {
    // Eigen meting telt elke weergave, ook de eerste.
    void trackSiteEvent("page_view", { path: pathname });
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
  <>
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
          <Suspense fallback={null}>
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
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/.lovable/oauth/consent" element={<OAuthConsent />} />
            {(["en", "fr"] as const).flatMap((locale) => [
              <Route key={`${locale}-home`} path={`/${locale}`} element={<Index />} />,
              <Route key={`${locale}-quiz`} path={`/${locale}/quiz`} element={<Quiz />} />,
              <Route key={`${locale}-product`} path={`/${locale}/product/:handle`} element={<ProductDetail />} />,
              <Route key={`${locale}-producten`} path={`/${locale}/producten`} element={<Catalog />} />,
              <Route key={`${locale}-catalogus`} path={`/${locale}/catalogus`} element={<Catalog />} />,
              <Route key={`${locale}-contact`} path={`/${locale}/contact`} element={<Contact />} />,
              <Route key={`${locale}-verzending`} path={`/${locale}/verzending`} element={<Shipping />} />,
              <Route key={`${locale}-tracking`} path={`/${locale}/volg-je-bestelling`} element={<OrderTracking />} />,
              <Route key={`${locale}-track`} path={`/${locale}/track`} element={<OrderTracking />} />,
              <Route key={`${locale}-legacy-track`} path={`/${locale}/bestelling-volgen`} element={<OrderTracking />} />,
              <Route key={`${locale}-returns`} path={`/${locale}/retourneren`} element={<Returns />} />,
              <Route key={`${locale}-about`} path={`/${locale}/over`} element={<About />} />,
              <Route key={`${locale}-builder`} path={`/${locale}/stel-je-bundel-samen`} element={<BundleBuilder />} />,
              <Route key={`${locale}-bundles`} path={`/${locale}/bundels`} element={<BundleBuilder />} />,
              <Route key={`${locale}-why`} path={`/${locale}/waarom-senseglow`} element={<WhySenseGlow />} />,
              <Route key={`${locale}-sustainability`} path={`/${locale}/duurzaamheid`} element={<Sustainability />} />,
              <Route key={`${locale}-privacy`} path={`/${locale}/privacy`} element={<Privacy />} />,
              <Route key={`${locale}-terms`} path={`/${locale}/voorwaarden`} element={<Terms />} />,
              <Route key={`${locale}-login`} path={`/${locale}/login`} element={<Login />} />,
            ])}
            {/* Shopify-adressen uit de advertenties en de feed opvangen */}
            <Route path="/products/:handle" element={<LegacyRedirect />} />
            <Route path="/collections/*" element={<LegacyRedirect />} />
            <Route path="/pages/*" element={<LegacyRedirect />} />
            {(["en", "fr"] as const).flatMap((locale) => [
              <Route key={`${locale}-legacy-product`} path={`/${locale}/products/:handle`} element={<LegacyRedirect />} />,
              <Route key={`${locale}-legacy-collections`} path={`/${locale}/collections/*`} element={<LegacyRedirect />} />,
              <Route key={`${locale}-legacy-pages`} path={`/${locale}/pages/*`} element={<LegacyRedirect />} />,
            ])}
            <Route path="/nl/*" element={<DutchPrefixRedirect />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          </Suspense>
          </I18nProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </>
);

export default App;
