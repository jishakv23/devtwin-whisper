import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import AppPage from './pages/App';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import FeatureSummary from './pages/FeatureSummary';
import AddFeature from './pages/AddFeature';
import FeatureDetail from './pages/FeatureDetail';
import NotFound from './pages/NotFound';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/app" element={<AppPage />} />
          <Route path="/chat/new" element={<AppPage />} />
          <Route path="/chat/:id" element={<AppPage />} />
          <Route path="/features" element={<FeatureSummary />} />
          <Route path="/features/add" element={<AddFeature />} />
          <Route path="/features/:id" element={<FeatureDetail />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
