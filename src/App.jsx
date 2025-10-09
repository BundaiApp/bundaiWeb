import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/landingPage.screen';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import Refund from './pages/Refund';
import Login from './pages/login.screen';
import ForgotPassword from './pages/forgotPassword.screen';
import DashboardLayout from './layouts/DashboardLayout';
import Dashboard from './pages/dashboard.screen';
import KanjiTemplate from './pages/kanjiTemplate.screen';
import KanjiDetails from './pages/kanjiDetails.screen';
import LocalQuiz from './pages/localQuiz.screen';
import QuizEngine from './pages/quizEngine.screen';
import SRS from './pages/srs.screen';
import Similars from './pages/similars.screen';
import Settings from './pages/settings.screen';

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/refund" element={<Refund />} />

        {/* Protected Dashboard Routes */}
        <Route path="/dashboard" element={<DashboardLayout><Dashboard /></DashboardLayout>} />
        <Route path="/dashboard/kanji-template" element={<DashboardLayout><KanjiTemplate /></DashboardLayout>} />
        <Route path="/dashboard/kanji-detail" element={<DashboardLayout><KanjiDetails /></DashboardLayout>} />
        <Route path="/dashboard/quiz" element={<DashboardLayout><LocalQuiz /></DashboardLayout>} />
        <Route path="/dashboard/quiz-engine" element={<DashboardLayout><QuizEngine /></DashboardLayout>} />
        <Route path="/dashboard/srs" element={<DashboardLayout><SRS /></DashboardLayout>} />
        <Route path="/dashboard/similars" element={<DashboardLayout><Similars /></DashboardLayout>} />
        <Route path="/dashboard/settings" element={<DashboardLayout><Settings /></DashboardLayout>} />
      </Routes>
    </Router>
  );
}
