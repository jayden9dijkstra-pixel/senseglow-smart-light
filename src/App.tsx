import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { useScrollToTop } from "@/hooks/useScrollToTop";
import Index from "./pages/Index";
import Quiz from "./pages/Quiz";
import ProductDetail from "./pages/ProductDetail";
import Catalog from "./pages/Catalog";
import Contact from "./pages/Contact";
import Shipping from "./pages/Shipping";
import Tracking from "./pages/Tracking";
import Returns from "./pages/Returns";
import About from "./pages/About";
import Sustainability from "./pages/Sustainability";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Component to handle scroll to top on route change
const ScrollToTopHandler = () => {
  useScrollToTop();
  return null;
};

const App = () => (
  <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTopHandler />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/quiz" element={<Quiz />} />
            <Route path="/product/:handle" element={<ProductDetail />} />
            <Route path="/producten" element={<Catalog />} />
            <Route path="/catalogus" element={<Catalog />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/verzending" element={<Shipping />} />
            <Route path="/bestelling-volgen" element={<Tracking />} />
            <Route path="/retourneren" element={<Returns />} />
            <Route path="/over" element={<About />} />
            <Route path="/duurzaamheid" element={<Sustainability />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/voorwaarden" element={<Terms />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
