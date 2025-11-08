import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import MainLayout from "@/components/MainLayout";
import Visualization3D from "./pages/Visualization3D";
import Derivatives from "./pages/Derivatives";
import Optimization from "./pages/Optimization";
import Integrals from "./pages/Integrals";
import DomainLimits from "./pages/DomainLimits";
import LinesPlanes3D from "./pages/LinesPlanes3D";
import QuadricSurfaces from "./pages/QuadricSurfaces";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="light" storageKey="multicalc-theme">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<MainLayout />}>
              <Route index element={<Navigate to="/3d-visualization" replace />} />
              <Route path="3d-visualization" element={<Visualization3D />} />
              <Route path="lines-planes-3d" element={<LinesPlanes3D />} />
              <Route path="quadric-surfaces" element={<QuadricSurfaces />} />
              <Route path="derivatives" element={<Derivatives />} />
              <Route path="optimization" element={<Optimization />} />
              <Route path="integrals" element={<Integrals />} />
              <Route path="domain-limits" element={<DomainLimits />} />
            </Route>
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
