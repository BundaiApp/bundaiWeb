'use client';

import { useEffect, useState } from 'react';
import { Menu, X, Download } from 'lucide-react';
import { AnimatedBackground } from '../components/AnimatedBackground';
import InteractiveSubtitleDemo from '../components/InteractiveSubtitleDemo';
import COLORS from '../theme/colors';
import posthog from '../lib/posthog';
import { getTrafficProperties } from '../lib/trafficAttribution';

const APP_STORE_URL = 'https://apps.apple.com/gb/app/bundai/id6751961361';

function trackLandingCtaClick(destination) {
  posthog.capture({
    event: 'landing cta clicked',
    properties: {
      destination,
      ...getTrafficProperties(),
    },
  });
}

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    posthog.capture({
      event: 'landing page viewed',
      properties: getTrafficProperties(),
    });
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

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
          boxShadow: '0 12px 30px rgba(28, 27, 26, 0.08)',
        }}
      >
        <div className="mx-auto px-6 py-4 max-w-6xl">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-3 z-10">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg"
                style={{
                  background: `linear-gradient(135deg, ${COLORS.brandPrimary} 0%, ${COLORS.brandPrimaryDark} 100%)`,
                }}
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

            {/* Desktop Download */}
            <div className="hidden md:flex items-center">
              <a
                href={APP_STORE_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackLandingCtaClick('ios_app_nav')}
                className="rounded-xl px-4 py-2 text-sm font-semibold hover:opacity-90 transition-opacity"
                style={{
                  backgroundColor: COLORS.brandPrimary,
                  color: COLORS.surface,
                }}
              >
                Download
              </a>
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
                <a
                  href={APP_STORE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackLandingCtaClick('ios_app_nav_mobile')}
                  className="rounded-xl px-4 py-3 text-sm font-semibold text-center hover:opacity-90 transition-opacity w-fit"
                  style={{
                    backgroundColor: COLORS.brandPrimary,
                    color: COLORS.surface,
                  }}
                >
                  Download on the App Store
                </a>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
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
            Learn{' '}
            <span style={{ color: COLORS.brandPrimary }}>Japanese</span>
            <br />
            through{' '}
            <span style={{ color: COLORS.brandPrimary }}>Anime</span>
          </h1>
          <p
            className="text-lg sm:text-xl mb-6 sm:mb-8 max-w-3xl mx-auto px-4 animate-fade-up animate-delay-300"
            style={{ color: COLORS.textSecondary }}
          >
            Master vocabulary, kanji, and pronunciation with the Bundai iOS app —
            SRS, anime word feeds, and on-device speech practice.
          </p>

          <figure
            className="mt-8 px-4 animate-fade-up animate-delay-450"
            aria-label="Bundai hero preview"
          >
            <img
              src="/hero-combined.jpg"
              alt="Bundai mobile app study views"
              width="1160"
              height="430"
              className="w-full max-w-6xl mx-auto rounded-[2rem] shadow-2xl"
              style={{
                border: `1px solid ${COLORS.outline}`,
                backgroundColor: COLORS.surface,
              }}
            />
          </figure>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mt-6 sm:mt-8 px-4 animate-fade-up animate-delay-450">
            <a
              href={APP_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackLandingCtaClick('ios_app')}
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
        className="relative py-10 sm:py-12 px-4 sm:px-6"
        style={{
          background: `linear-gradient(180deg, ${COLORS.background} 0%, ${COLORS.surfaceMuted} 100%)`,
        }}
      >
        <div className="mx-auto">
          {/* Interactive subtitle demo (video) — temporarily disabled
          <div className="text-center mb-4 sm:mb-5">
            <h2
              className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2 sm:mb-3 px-2"
              style={{ color: COLORS.textPrimary }}
            >
              See Bundai
              <span style={{ color: COLORS.brandPrimary }}> In Action</span>
            </h2>
          </div>

          <InteractiveSubtitleDemo colors={COLORS} />
          */}

          <div className="mb-12 sm:mb-14 px-4">
            <h3
              className="text-2xl sm:text-3xl font-bold text-center mb-3"
              style={{ color: COLORS.textPrimary }}
            >
              Mobile App Preview
            </h3>
            <figure
              className="mt-6 max-w-5xl mx-auto rounded-[2rem] p-4 sm:p-5 shadow-lg"
              style={{
                backgroundColor: COLORS.surface,
                border: `1px solid ${COLORS.outline}`,
              }}
            >
              <div
                className="rounded-[1.5rem] p-2 sm:p-3"
                style={{
                  backgroundColor: COLORS.surfaceMuted,
                  border: `1px solid ${COLORS.outline}`,
                }}
              >
                <img
                  src="/page-full.png"
                  alt="Bundai mobile app feature preview"
                  loading="lazy"
                  width="1280"
                  height="720"
                  className="w-full max-w-4xl mx-auto"
                />
              </div>
            </figure>
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
                  style={{
                    background: `linear-gradient(135deg, ${COLORS.brandPrimary} 0%, ${COLORS.brandPrimaryDark} 100%)`,
                  }}
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
                  href="https://www.facebook.com/profile.php?id=61580724227681"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 sm:w-10 h-8 sm:h-10 rounded-lg flex items-center justify-center hover:transition-colors"
                  style={{
                    backgroundColor: COLORS.surfaceElevated,
                    color: '#1877F2',
                  }}
                >
                  <span className="text-sm sm:text-base">f</span>
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
                    href={APP_STORE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:transition-colors"
                    style={{ color: COLORS.textSecondary }}
                  >
                    iOS App
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
                  <a
                    href={APP_STORE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:transition-colors"
                    style={{ color: COLORS.textSecondary }}
                  >
                    Help Center
                  </a>
                </li>
                <li>
                  <a
                    href="mailto:tech@bundai.app"
                    className="hover:transition-colors"
                    style={{ color: COLORS.textSecondary }}
                  >
                    Contact Us
                  </a>
                </li>
                <li>
                  <a
                    href="/privacy"
                    className="hover:transition-colors"
                    style={{ color: COLORS.textSecondary }}
                  >
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a
                    href="/terms"
                    className="hover:transition-colors"
                    style={{ color: COLORS.textSecondary }}
                  >
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a
                    href="/refund"
                    className="hover:transition-colors"
                    style={{ color: COLORS.textSecondary }}
                  >
                    Refund Policy
                  </a>
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
