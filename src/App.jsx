import { lazy, Suspense, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

// Public pages (eager — small, always needed)
import LandingPage from './pages/landingPage.screen';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import Refund from './pages/Refund';
import PricingPage from './pages/pricing.screen';

// Auth pages (lazy)
const Login = lazy(() => import('./pages/login.screen'));
const SignUp = lazy(() => import('./pages/signup.screen'));
const ForgotPassword = lazy(() => import('./pages/forgotPassword.screen'));

// Dashboard layout (lazy)
const DashboardLayout = lazy(() => import('./layouts/DashboardLayout'));

// Dashboard pages (lazy — these pull in heavy JSON/GraphQL deps)
const Dashboard = lazy(() => import('./pages/dashboard.screen'));
const LocalQuiz = lazy(() => import('./pages/localQuiz.screen'));
const QuizEngine = lazy(() => import('./pages/quizEngine.screen'));
const SRS = lazy(() => import('./pages/srs.screen'));
const SRSEngine = lazy(() => import('./pages/srsEngine.screen'));
const StudyEngine = lazy(() => import('./pages/studyEngine.screen'));
const SRSReview = lazy(() => import('./pages/srsReview.screen'));
const KanjiTemplate = lazy(() => import('./pages/kanjiTemplate.screen'));
const KanjiDetails = lazy(() => import('./pages/kanjiDetails.screen'));
const Levels = lazy(() => import('./pages/levels.screen'));
const LevelDetails = lazy(() => import('./pages/levelDetails.screen'));
const LevelTest = lazy(() => import('./pages/levelTest.screen'));
const AnimeWords = lazy(() => import('./pages/animeWords.screen'));
const Settings = lazy(() => import('./pages/settings.screen'));
const DeleteAccount = lazy(() => import('./pages/deleteAccount.screen'));

import posthog from './lib/posthog';
import { getTrafficProperties } from './lib/trafficAttribution';

function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-screen" style={{ backgroundColor: '#f7f5ff' }}>
      <div className="w-10 h-10 rounded-full border-4 border-t-4 animate-spin" style={{ borderColor: '#7f53f5', borderTopColor: 'transparent' }} />
    </div>
  );
}

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

function DashboardRoute({ children }) {
  return (
    <Suspense fallback={<PageLoader />}>
      <DashboardLayout>{children}</DashboardLayout>
    </Suspense>
  );
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

        {/* Auth routes */}
        <Route path="/login" element={<Suspense fallback={<PageLoader />}><Login /></Suspense>} />
        <Route path="/signup" element={<Suspense fallback={<PageLoader />}><SignUp /></Suspense>} />
        <Route path="/forgot-password" element={<Suspense fallback={<PageLoader />}><ForgotPassword /></Suspense>} />

        {/* Dashboard routes (lazy loaded) */}
        <Route path="/dashboard" element={<DashboardRoute><Dashboard /></DashboardRoute>} />
        <Route path="/dashboard/quiz" element={<DashboardRoute><LocalQuiz /></DashboardRoute>} />
        <Route path="/dashboard/quiz-engine" element={<DashboardRoute><QuizEngine /></DashboardRoute>} />
        <Route path="/dashboard/srs" element={<DashboardRoute><SRS /></DashboardRoute>} />
        <Route path="/dashboard/srs-engine" element={<DashboardRoute><SRSEngine /></DashboardRoute>} />
        <Route path="/dashboard/study-engine" element={<DashboardRoute><StudyEngine /></DashboardRoute>} />
        <Route path="/dashboard/srs-review" element={<DashboardRoute><SRSReview /></DashboardRoute>} />
        <Route path="/dashboard/kanji-template" element={<DashboardRoute><KanjiTemplate /></DashboardRoute>} />
        <Route path="/dashboard/kanji-detail" element={<DashboardRoute><KanjiDetails /></DashboardRoute>} />
        <Route path="/dashboard/levels" element={<DashboardRoute><Levels /></DashboardRoute>} />
        <Route path="/dashboard/level-details" element={<DashboardRoute><LevelDetails /></DashboardRoute>} />
        <Route path="/dashboard/level-test" element={<DashboardRoute><LevelTest /></DashboardRoute>} />
        <Route path="/dashboard/anime-words" element={<DashboardRoute><AnimeWords /></DashboardRoute>} />
        <Route path="/dashboard/settings" element={<DashboardRoute><Settings /></DashboardRoute>} />
        <Route path="/dashboard/delete-account" element={<DashboardRoute><DeleteAccount /></DashboardRoute>} />

        {/* Fallback */}
        <Route path="*" element={<LandingPage />} />
      </Routes>
    </Router>
  );
}
