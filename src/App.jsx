import { useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import LandingPage from './pages/landingPage.screen';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import Refund from './pages/Refund';
import PricingPage from './pages/pricing.screen';
import posthog from './lib/posthog';
import { getTrafficProperties } from './lib/trafficAttribution';

function SiteEntryTracker() {
  const location = useLocation();
  const hasTrackedEntry = useRef(false);

  useEffect(() => {
    if (hasTrackedEntry.current) {
      return;
    }

    hasTrackedEntry.current = true;

    posthog.capture({
      event: 'site entry viewed',
      properties: getTrafficProperties(location.pathname),
    });
  }, [location.pathname]);

  return null;
}

export default function App() {
  return (
    <Router>
      <SiteEntryTracker />
      <Routes>
        {/* Public, frontend-only routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/refund" element={<Refund />} />
        <Route path="*" element={<LandingPage />} />
      </Routes>
    </Router>
  );
}
