'use client';

import { useEffect, useState } from 'react';
import {
  Menu,
  X,
  Globe,
  Star,
  Download,
} from 'lucide-react';
import { AnimatedBackground } from '../components/AnimatedBackground';
import { Button } from '../components/Button';
import InteractiveSubtitleDemo from '../components/InteractiveSubtitleDemo';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@apollo/client/react';
import {
  hasAuthToken,
  clearAuthToken,
  redirectToDashboard,
  shouldSkipAuthRedirects
} from '../lib/auth';
import logOutMutation from '../graphql/mutations/logOut.mutation';
import COLORS from '../theme/colors';

export default function App() {
  const skipAuthRedirects = shouldSkipAuthRedirects();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const [executeLogOut, { loading: logoutLoading }] =
    useMutation(logOutMutation);

  useEffect(() => {
    const syncAuthState = () => {
      const loggedIn = hasAuthToken();
      setIsLoggedIn(loggedIn);
      if (loggedIn && !skipAuthRedirects) {
        redirectToDashboard();
      }
    };

    syncAuthState();
    window.addEventListener('storage', syncAuthState);
    window.addEventListener('bundai:auth-change', syncAuthState);

    return () => {
      window.removeEventListener('storage', syncAuthState);
      window.removeEventListener('bundai:auth-change', syncAuthState);
    };
  }, [skipAuthRedirects]);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleLoginClick = () => {
    if (isLoggedIn && !skipAuthRedirects) {
      redirectToDashboard();
      return;
    }

    navigate('/login');
  };

  const handleLogout = async () => {
    try {
      // Call the backend logout mutation
      await executeLogOut();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear local token regardless of backend response
      clearAuthToken();
      setIsLoggedIn(false);
    }
  };

  const mobileShowcaseShots = [
    { src: '/instant QUiz.png', label: 'Instant Quiz' },
    { src: '/animeWords.png', label: 'Anime Vocabulary' },
    { src: '/apple.png', label: 'Top 1000 Words' },
    { src: '/50Levels.png', label: 'Level System' },
  ];

  return (
    <div
      className="min-h-screen w-full"
      style={{ backgroundColor: COLORS.background, color: COLORS.textPrimary }}
    >
      <AnimatedBackground />

      {/* Navigation */}
      <nav
        className="fixed top-0 w-full z-50 backdrop-blur-lg"
        style={{
          backgroundColor: COLORS.surface + 'E6',
          borderBottom: `1px solid ${COLORS.divider}`,
          boxShadow: "0 12px 30px rgba(28, 27, 26, 0.08)",
        }}
      >
        <div className="mx-auto px-6 py-4 max-w-6xl">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-3 z-10">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg"
                style={{ background: `linear-gradient(135deg, ${COLORS.brandPrimary} 0%, ${COLORS.brandPrimaryDark} 100%)` }}
              >
                <span className="text-white font-bold text-lg">文</span>
              </div>
              <span
                className="text-2xl font-bold"
                style={{ color: COLORS.textPrimary }}
              >
                Bundai
              </span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center">
              {isLoggedIn ? (
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={handleLogout}
                  disabled={logoutLoading}
                >
                  {logoutLoading ? 'Logging Out...' : 'Log Out'}
                </Button>
              ) : (
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={handleLoginClick}
                >
                  Log In
                </Button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMenu}
              className="md:hidden p-2 rounded-lg transition-colors"
              style={{
                backgroundColor: COLORS.surfaceMuted,
                color: COLORS.textPrimary,
              }}
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div
              className="md:hidden mt-4 pb-6 border-t"
              style={{ borderColor: COLORS.divider }}
            >
              <div className="flex flex-col space-y-4 pt-4">
                {isLoggedIn ? (
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={handleLogout}
                    disabled={logoutLoading}
                    className="w-fit"
                  >
                    {logoutLoading ? 'Logging Out...' : 'Log Out'}
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={handleLoginClick}
                    className="w-fit"
                  >
                    Log In
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Demo Section */}
      <section
        id="home"
        className="relative py-12 sm:py-16 px-4 sm:px-6"
        style={{
          background: `linear-gradient(180deg, ${COLORS.surfaceMuted} 0%, ${COLORS.background} 100%)`,
        }}
      >
        <div className="max-w-5xl mx-auto text-center">
          <h1
            className="text-3xl sm:text-4xl md:text-6xl lg:text-8xl font-black mb-5 sm:mb-6 leading-tight max-w-5xl mx-auto px-2 animate-fade-up animate-delay-150"
            style={{ color: COLORS.textPrimary }}
          >
            Start Watching{' '}
            <span style={{ color: COLORS.brandPrimary }}>Anime</span>
            <br />
            in <span style={{ color: COLORS.brandPrimary }}>Japanese</span>{' '}
            <span style={{ color: COLORS.accentSuccess }}>effortlessly !</span>
          </h1>
          <p
            className="text-lg sm:text-xl mb-6 sm:mb-8 max-w-3xl mx-auto px-4 animate-fade-up animate-delay-300"
            style={{ color: COLORS.textSecondary }}
          >
            Pick up words by sound as you watch anime, with or without kanji.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-12 items-center px-4 mt-8 animate-fade-up animate-delay-450">
            {/* Chrome Extension */}
            <div className="relative order-1">
              <div
                className="rounded-2xl shadow-2xl overflow-hidden"
                style={{ backgroundColor: COLORS.surface }}
              >
                <img
                  src="/dual-subtitle-loader-capture.png"
                  alt="Dual Subtitle Loader extension capture"
                  onError={(event) => {
                    event.currentTarget.onerror = null;
                    event.currentTarget.src = '/hell.png';
                  }}
                  className="w-full h-auto"
                />
              </div>
              <div
                className="absolute -bottom-2 sm:-bottom-4 -right-2 sm:-right-4 w-8 sm:w-12 h-8 sm:h-12 rounded-full flex items-center justify-center animate-bounce"
                style={{ backgroundColor: COLORS.accentSuccess }}
              >
                <Globe className="w-4 sm:w-6 h-4 sm:h-6 text-white" />
              </div>
            </div>

            {/* Mobile mockup */}
            <div className="flex justify-center order-2">
              <div className="relative w-full max-w-[420px] sm:max-w-[500px] h-[340px] sm:h-[470px]">
                <div
                  className="absolute inset-10 rounded-[3rem] blur-3xl opacity-45"
                  style={{
                    background: `radial-gradient(circle, ${COLORS.brandPrimaryLight} 0%, ${COLORS.surfaceMuted} 70%)`,
                  }}
                />
                <img
                  src="/hero-mobile-stack.png"
                  alt="Bundai mobile app feature stack"
                  width="960"
                  height="780"
                  className="absolute left-1/2 top-1/2 w-full max-w-[420px] sm:max-w-[500px] -translate-x-1/2 -translate-y-1/2"
                />
                <div
                  className="absolute -top-2 sm:-top-4 -left-2 sm:-left-4 w-6 sm:w-8 h-6 sm:h-8 rounded-full flex items-center justify-center animate-pulse"
                  style={{ backgroundColor: COLORS.brandSecondary }}
                >
                  <Star className="w-3 sm:w-4 h-3 sm:h-4 text-white" />
                </div>
              </div>
            </div>
          </div>

          <p
            className="mt-4 sm:mt-6 text-sm sm:text-base font-semibold px-4 animate-fade-up animate-delay-450"
            style={{ color: COLORS.textSecondary }}
          >
            Capture in Dual Subtitle Loader
            <span style={{ color: COLORS.brandPrimary }}> {'\u2192'} </span>
            Revise in Mobile App
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mt-6 sm:mt-8 px-4 animate-fade-up animate-delay-450">
            <a
              href="https://chromewebstore.google.com/detail/bundai-extension-plasmo/aoencglmiihcheldbcpjlnlfnemcglfe?authuser=1&hl=en"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-2xl p-2 sm:p-3 hover:scale-105 transition-transform cursor-pointer w-full sm:w-auto"
              style={{ backgroundColor: COLORS.textPrimary }}
            >
              <div className="flex items-center space-x-2 sm:space-x-3 px-2 sm:px-4">
                <Globe
                  className="w-6 sm:w-8 h-6 sm:h-8"
                  style={{ color: COLORS.surface }}
                />
                <div className="text-left">
                  <div className="text-xs" style={{ color: COLORS.textMuted }}>
                    Available in
                  </div>
                  <div
                    className="text-sm sm:text-lg font-semibold"
                    style={{ color: COLORS.surface }}
                  >
                    Chrome Web Store
                  </div>
                </div>
              </div>
            </a>

            <a
              href="https://apps.apple.com/gb/app/bundai/id6751961361"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-2xl p-2 sm:p-3 hover:scale-105 transition-transform cursor-pointer w-full sm:w-auto"
              style={{ backgroundColor: COLORS.textPrimary }}
            >
              <div className="flex items-center space-x-2 sm:space-x-3 px-2 sm:px-4">
                <Download
                  className="w-6 sm:w-8 h-6 sm:h-8"
                  style={{ color: COLORS.surface }}
                />
                <div className="text-left">
                  <div className="text-xs" style={{ color: COLORS.textMuted }}>
                    Download on
                  </div>
                  <div
                    className="text-sm sm:text-lg font-semibold"
                    style={{ color: COLORS.surface }}
                  >
                    App Store
                  </div>
                </div>
              </div>
            </a>

            <div
              className="rounded-2xl p-2 sm:p-3 w-full sm:w-auto opacity-70 cursor-not-allowed"
              style={{ backgroundColor: COLORS.surfaceElevated }}
            >
              <div className="flex items-center space-x-2 sm:space-x-3 px-2 sm:px-4">
                <Download
                  className="w-6 sm:w-8 h-6 sm:h-8"
                  style={{ color: COLORS.textMuted }}
                />
                <div className="text-left">
                  <div className="text-xs" style={{ color: COLORS.textMuted }}>
                    Get it on
                  </div>
                  <div
                    className="text-sm sm:text-lg font-semibold"
                    style={{ color: COLORS.textMuted }}
                  >
                    Google Play
                  </div>
                  <div
                    className="text-xs font-semibold"
                    style={{ color: COLORS.brandPrimary }}
                  >
                    Coming Soon!
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        className="relative py-16 sm:py-20 px-4 sm:px-6"
        style={{
          background: `linear-gradient(180deg, ${COLORS.background} 0%, ${COLORS.surfaceMuted} 100%)`,
        }}
      >
        <div className="mx-auto">
          <div className="text-center mb-8 sm:mb-10">
            <h2
              className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 px-2"
              style={{ color: COLORS.textPrimary }}
            >
              See The Extension
              <span style={{ color: COLORS.brandPrimary }}> In Action</span>
            </h2>
            <p
              className="text-lg sm:text-xl max-w-3xl mx-auto px-4"
              style={{ color: COLORS.textSecondary }}
            >
              A real scene with local subtitle overlays and hover interactions,
              so visitors can understand the product before installing it.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-8 sm:mb-10 px-4">
            {[
              'Dual Subtitle Loader extension',
              'Mobile app training',
              'Web sync continuation',
            ].map((pill) => (
              <span
                key={pill}
                className="inline-flex items-center rounded-full px-4 py-2 text-xs sm:text-sm font-semibold"
                style={{
                  backgroundColor: COLORS.surface,
                  color: COLORS.textSecondary,
                  border: `1px solid ${COLORS.outline}`,
                }}
              >
                {pill}
              </span>
            ))}
          </div>

          <InteractiveSubtitleDemo colors={COLORS} />

          <div className="mb-12 sm:mb-14 px-4">
            <h3
              className="text-2xl sm:text-3xl font-bold text-center mb-3"
              style={{ color: COLORS.textPrimary }}
            >
              Mobile App Screens
            </h3>
            <p
              className="text-center text-sm sm:text-base max-w-3xl mx-auto"
              style={{ color: COLORS.textSecondary }}
            >
              Current product views from the app, shown as real UI examples.
            </p>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mt-6">
              {mobileShowcaseShots.map((shot) => (
                <figure
                  key={shot.src}
                  className="rounded-2xl p-3 sm:p-4 shadow-lg"
                  style={{
                    backgroundColor: COLORS.surface,
                    border: `1px solid ${COLORS.outline}`,
                  }}
                >
                  <div
                    className="rounded-2xl p-2"
                    style={{
                      backgroundColor: COLORS.surfaceMuted,
                      border: `1px solid ${COLORS.outline}`,
                    }}
                  >
                    <img
                      src={shot.src}
                      alt={`${shot.label} screenshot`}
                      loading="lazy"
                      className="w-full aspect-[9/19] rounded-[1rem] object-cover object-top"
                    />
                  </div>
                  <figcaption
                    className="text-center text-xs sm:text-sm font-semibold mt-3"
                    style={{ color: COLORS.textSecondary }}
                  >
                    {shot.label}
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>

          <div className="max-w-4xl mx-auto px-4">
            <div
              className="rounded-2xl p-5 sm:p-6 text-center"
              style={{
                backgroundColor: COLORS.surface,
                border: `1px solid ${COLORS.outline}`,
              }}
            >
              <p
                className="text-base sm:text-lg leading-relaxed"
                style={{ color: COLORS.textSecondary }}
              >
                Prefer studying on desktop? The web app already includes
                <span
                  className="font-bold"
                  style={{ color: COLORS.brandPrimary }}
                >
                  {' '}
                  60% to 70% feature parity
                </span>{' '}
                with the mobile app, with synced progress and core review
                workflows.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer
        className="relative py-16 sm:py-20 px-4 sm:px-6"
        style={{
          background: `linear-gradient(180deg, ${COLORS.background} 0%, ${COLORS.surface} 100%)`,
        }}
      >
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Logo and description */}
            <div className="sm:col-span-2 text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start space-x-3 mb-4">
                <div
                  className="w-8 sm:w-10 h-8 sm:h-10 rounded-xl flex items-center justify-center shadow-lg"
                  style={{ background: `linear-gradient(135deg, ${COLORS.brandPrimary} 0%, ${COLORS.brandPrimaryDark} 100%)` }}
                >
                  <span className="text-white font-bold text-base sm:text-lg">
                    文
                  </span>
                </div>
                <span
                  className="text-xl sm:text-2xl font-bold"
                  style={{ color: COLORS.textPrimary }}
                >
                  Bundai
                </span>
              </div>
              <p
                className="max-w-md leading-relaxed text-sm sm:text-base mx-auto sm:mx-0"
                style={{ color: COLORS.textSecondary }}
              >
                The fastest way to learn Japanese through immersive, real-world
                content. Join thousands of learners mastering Japanese in record
                time.
              </p>
              <div className="flex justify-center sm:justify-start space-x-4 mt-4 sm:mt-6">
                {/* Social media icons */}
                <a
                  href="https://x.com/bundaiapp"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 sm:w-10 h-8 sm:h-10 rounded-lg flex items-center justify-center hover:transition-colors"
                  style={{
                    backgroundColor: COLORS.surfaceElevated,
                    color: COLORS.brandPrimary,
                  }}
                >
                  <span className="text-sm sm:text-base">𝕏</span>
                </a>
                <a
                  href="https://www.youtube.com/channel/UChZ7BBgEhuDs7PhcxcwMYcQ"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 sm:w-10 h-8 sm:h-10 rounded-lg flex items-center justify-center hover:transition-colors"
                  style={{
                    backgroundColor: COLORS.surfaceElevated,
                    color: COLORS.accentDanger,
                  }}
                >
                  <span className="text-sm sm:text-base">▶</span>
                </a>
              </div>
            </div>

            {/* Links */}
            <div className="text-center sm:text-left">
              <h4
                className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base"
                style={{ color: COLORS.textPrimary }}
              >
                Product
              </h4>
              <ul className="space-y-2 text-sm sm:text-base">
                <li>
                  <a
                    href="https://apps.apple.com/gb/app/bundai/id6751961361"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:transition-colors"
                    style={{ color: COLORS.textSecondary }}
                  >
                    iOS App
                  </a>
                </li>
                <li>
                  <a
                    href="https://chromewebstore.google.com/detail/bundai-extension-plasmo/aoencglmiihcheldbcpjlnlfnemcglfe?authuser=1&hl=en"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:transition-colors"
                    style={{ color: COLORS.textSecondary }}
                  >
                    Chrome Extension
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4
                className="font-semibold mb-4"
                style={{ color: COLORS.textPrimary }}
              >
                Support
              </h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    to="#"
                    className="hover:transition-colors"
                    style={{ color: COLORS.textSecondary }}
                  >
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link
                    to="#"
                    className="hover:transition-colors"
                    style={{ color: COLORS.textSecondary }}
                  >
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link
                    to="/privacy"
                    className="hover:transition-colors"
                    style={{ color: COLORS.textSecondary }}
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    to="/terms"
                    className="hover:transition-colors"
                    style={{ color: COLORS.textSecondary }}
                  >
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link
                    to="/refund"
                    className="hover:transition-colors"
                    style={{ color: COLORS.textSecondary }}
                  >
                    Refund Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div
            className="border-t pt-6 sm:pt-8 flex flex-col md:flex-row items-center justify-between text-center md:text-left"
            style={{ borderColor: COLORS.divider }}
          >
            <p
              className="text-xs sm:text-sm mb-4 md:mb-0"
              style={{ color: COLORS.textMuted }}
            >
              © 2025 Bundai. All rights reserved. Made with ❤️ for Japanese
              learners worldwide.
            </p>
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4 md:space-x-6">
              <span
                className="text-xs sm:text-sm"
                style={{ color: COLORS.textMuted }}
              >
                🌟 4.9/5 rating
              </span>
              <span
                className="text-xs sm:text-sm"
                style={{ color: COLORS.textMuted }}
              >
                📱 10k+ downloads
              </span>
              <span
                className="text-xs sm:text-sm"
                style={{ color: COLORS.textMuted }}
              >
                🎯 90-day guarantee
              </span>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
