'use client';

import { useEffect, useState } from 'react';
import {
  Menu,
  X,
  Globe,
  Star,
  CheckCircle,
  Download,
} from 'lucide-react';
import { AnimatedBackground } from '../components/AnimatedBackground';
import { Button } from '../components/Button';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@apollo/client/react';
import { hasAuthToken, clearAuthToken, redirectToDashboard } from '../lib/auth';
import logOutMutation from '../graphql/mutations/logOut.mutation';
import COLORS from '../theme/colors';

export default function App() {
  const isDevMode = Boolean(import.meta?.env?.DEV);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const [executeLogOut, { loading: logoutLoading }] =
    useMutation(logOutMutation);

  useEffect(() => {
    const syncAuthState = () => {
      const loggedIn = hasAuthToken();
      setIsLoggedIn(loggedIn);
      if (loggedIn && !isDevMode) {
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
  }, [isDevMode]);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const scrollToSection = (sectionId) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
    setIsMenuOpen(false);
  };

  const handleLoginClick = () => {
    if (isLoggedIn && !isDevMode) {
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

  const transformationCards = [
    {
      stage: 'Capture',
      platform: 'Dual Subtitle Loader',
      title: 'Catch new words while watching',
      description:
        'Use dual subtitles to instantly save unknown words and sentence context from real Japanese content.',
      outcome: 'Passive watching becomes active vocabulary collection.',
      accent: COLORS.brandPrimary,
    },
    {
      stage: 'Understand',
      platform: 'Mobile App',
      title: 'Break down meaning quickly',
      description:
        'Open saved words in the app, study examples, and connect each term to usage patterns you can remember.',
      outcome: 'New words move from recognition to real understanding.',
      accent: COLORS.accentDanger,
    },
    {
      stage: 'Retain',
      platform: 'Mobile App',
      title: 'Lock it in with daily review',
      description:
        'Train with SRS and targeted review sessions so high-value words stay available when you need them.',
      outcome: 'Less forgetting and faster long-term retention.',
      accent: COLORS.accentSuccess,
    },
    {
      stage: 'Continue anywhere',
      platform: '',
      title: 'Keep momentum on desktop',
      description:
        'Switch to web at your desk without breaking flow. Progress and review data stay in sync across products.',
      outcome: 'Consistent practice even when your device changes.',
      accent: COLORS.accentWarning,
    },
  ];

  const mobileShowcaseShots = [
    { src: '/instant QUiz.png', label: 'Instant Quiz' },
    { src: '/animeWords.png', label: 'Anime Vocabulary' },
    { src: '/apple.png', label: 'Top 1000 Words' },
    { src: '/50Levels.png', label: 'Level System' },
  ];

  const heroMobileStackCards = [
    {
      id: 'anime',
      src: '/animeWords.png',
      alt: 'Bundai anime vocabulary screen',
      label: 'Anime Vocabulary',
      accent: COLORS.accentDanger,
      positionClass: 'left-0 sm:left-2 top-12 sm:top-20 -rotate-[12deg] z-10',
      sizeClass: 'w-32 sm:w-40 md:w-44',
    },
    {
      id: 'quiz',
      src: '/instant QUiz.png',
      alt: 'Bundai instant quiz screen',
      label: 'Instant Quiz',
      accent: COLORS.brandPrimary,
      positionClass:
        'left-1/2 -translate-x-1/2 top-2 sm:top-8 rotate-[2deg] z-20',
      sizeClass: 'w-32 sm:w-40 md:w-44',
    },
    {
      id: 'levels',
      src: '/50Levels.png',
      alt: 'Bundai level tracking screen',
      label: 'Level Tracking',
      accent: COLORS.accentWarning,
      positionClass: 'right-0 sm:right-2 top-10 sm:top-16 rotate-[11deg] z-30',
      sizeClass: 'w-32 sm:w-40 md:w-44',
    },
    {
      id: 'top1000',
      src: '/apple.png',
      alt: 'Bundai top 1000 words screen',
      label: 'Top 1000 Words',
      accent: COLORS.accentSuccess,
      positionClass:
        'left-1/2 -translate-x-1/2 bottom-0 sm:bottom-2 -rotate-[3deg] z-40',
      sizeClass: 'w-36 sm:w-44 md:w-48',
    },
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
            <div className="hidden md:flex items-center space-x-8">
              <a
                onClick={() => scrollToSection('home')}
                className="cursor-pointer transition-colors"
                style={{ color: COLORS.textSecondary }}
                onMouseEnter={(e) =>
                  (e.target.style.color = COLORS.brandPrimary)
                }
                onMouseLeave={(e) =>
                  (e.target.style.color = COLORS.textSecondary)
                }
              >
                Home
              </a>
              <a
                onClick={() => scrollToSection('pricing')}
                className="cursor-pointer transition-colors"
                style={{ color: COLORS.textSecondary }}
                onMouseEnter={(e) =>
                  (e.target.style.color = COLORS.brandPrimary)
                }
                onMouseLeave={(e) =>
                  (e.target.style.color = COLORS.textSecondary)
                }
              >
                Pricing
              </a>
              <a
                onClick={() => scrollToSection('features')}
                className="cursor-pointer transition-colors"
                style={{ color: COLORS.textSecondary }}
                onMouseEnter={(e) =>
                  (e.target.style.color = COLORS.brandPrimary)
                }
                onMouseLeave={(e) =>
                  (e.target.style.color = COLORS.textSecondary)
                }
              >
                Features
              </a>
              <a
                onClick={() => scrollToSection('home')}
                className="cursor-pointer transition-colors"
                style={{ color: COLORS.textSecondary }}
                onMouseEnter={(e) =>
                  (e.target.style.color = COLORS.brandPrimary)
                }
                onMouseLeave={(e) =>
                  (e.target.style.color = COLORS.textSecondary)
                }
              >
                Demo
              </a>
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
                <a
                  onClick={() => scrollToSection('home')}
                  className="cursor-pointer transition-colors"
                  style={{ color: COLORS.textSecondary }}
                  onMouseEnter={(e) =>
                    (e.target.style.color = COLORS.brandPrimary)
                  }
                  onMouseLeave={(e) =>
                    (e.target.style.color = COLORS.textSecondary)
                  }
                >
                  Home
                </a>
                <a
                  onClick={() => scrollToSection('pricing')}
                  className="cursor-pointer transition-colors"
                  style={{ color: COLORS.textSecondary }}
                  onMouseEnter={(e) =>
                    (e.target.style.color = COLORS.brandPrimary)
                  }
                  onMouseLeave={(e) =>
                    (e.target.style.color = COLORS.textSecondary)
                  }
                >
                  Pricing
                </a>
                <a
                  onClick={() => scrollToSection('features')}
                  className="cursor-pointer transition-colors"
                  style={{ color: COLORS.textSecondary }}
                  onMouseEnter={(e) =>
                    (e.target.style.color = COLORS.brandPrimary)
                  }
                  onMouseLeave={(e) =>
                    (e.target.style.color = COLORS.textSecondary)
                  }
                >
                  Features
                </a>
                <a
                  onClick={() => scrollToSection('home')}
                  className="cursor-pointer transition-colors"
                  style={{ color: COLORS.textSecondary }}
                  onMouseEnter={(e) =>
                    (e.target.style.color = COLORS.brandPrimary)
                  }
                  onMouseLeave={(e) =>
                    (e.target.style.color = COLORS.textSecondary)
                  }
                >
                  Demo
                </a>
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
        className="relative py-16 sm:py-20 px-4 sm:px-6"
        style={{
          background: `linear-gradient(180deg, ${COLORS.surfaceMuted} 0%, ${COLORS.background} 100%)`,
        }}
      >
        <div className="max-w-5xl mx-auto text-center">
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold mb-6 animate-fade-up"
            style={{
              backgroundColor: COLORS.surface,
              border: `1px solid ${COLORS.divider}`,
              color: COLORS.textSecondary,
            }}
          >
            <span>Audio-first immersion</span>
            <span style={{ color: COLORS.brandPrimary }}>•</span>
            <span>Built for anime + real content</span>
          </div>
          <h1
            className="text-3xl sm:text-4xl md:text-6xl lg:text-8xl font-black mb-6 sm:mb-8 leading-tight max-w-5xl mx-auto px-2 animate-fade-up animate-delay-150"
            style={{ color: COLORS.textPrimary }}
          >
            Start Watching{' '}
            <span style={{ color: COLORS.brandPrimary }}>Anime</span>
            <br />
            in <span style={{ color: COLORS.brandPrimary }}>Japanese</span>{' '}
            <span style={{ color: COLORS.accentSuccess }}>effortlessly !</span>
          </h1>
          <p
            className="text-lg sm:text-xl mb-8 sm:mb-12 max-w-3xl mx-auto px-4 animate-fade-up animate-delay-300"
            style={{ color: COLORS.textSecondary }}
          >
            Pick up words by sound as you watch anime, with or without kanji.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-16 items-center px-4 mt-12 animate-fade-up animate-delay-450">
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
                {heroMobileStackCards.map((card) => (
                  <div
                    key={card.id}
                    className={`absolute ${card.positionClass} ${card.sizeClass} rounded-2xl p-2 sm:p-3 shadow-2xl`}
                    style={{
                      backgroundColor: COLORS.surface,
                      border: `1px solid ${COLORS.outline}`,
                    }}
                  >
                    <div
                      className="rounded-xl p-1"
                      style={{
                        backgroundColor: COLORS.surfaceMuted,
                        border: `1px solid ${COLORS.outline}`,
                      }}
                    >
                      <img
                        src={card.src}
                        alt={card.alt}
                        className="w-full aspect-[9/19] rounded-lg object-cover object-top"
                      />
                    </div>
                    <div
                      className="mt-2 text-[11px] sm:text-xs font-semibold text-center"
                      style={{ color: card.accent }}
                    >
                      {card.label}
                    </div>
                  </div>
                ))}
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
            className="mt-6 sm:mt-8 text-sm sm:text-base font-semibold px-4 animate-fade-up animate-delay-450"
            style={{ color: COLORS.textSecondary }}
          >
            Capture in Dual Subtitle Loader
            <span style={{ color: COLORS.brandPrimary }}> {'\u2192'} </span>
            Revise in Mobile App
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mt-8 sm:mt-12 px-4 animate-fade-up animate-delay-450">
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
          <div className="text-center mb-12 sm:mb-16">
            <h2
              className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 px-2"
              style={{ color: COLORS.textPrimary }}
            >
              From Exposure to
              <span style={{ color: COLORS.brandPrimary }}> Fluency</span>
            </h2>
            <p
              className="text-lg sm:text-xl max-w-3xl mx-auto px-4"
              style={{ color: COLORS.textSecondary }}
            >
              One connected workflow across two products: Dual Subtitle Loader
              for capture, mobile app for mastery, and web sync for everyday
              consistency.
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

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 sm:gap-8 mb-12 sm:mb-14 px-4">
            {transformationCards.map((card, index) => (
              <article
                key={card.title}
                className="rounded-3xl p-4 sm:p-5 shadow-lg transition-transform hover:-translate-y-1"
                style={{
                  backgroundColor: COLORS.surface,
                  border: `1px solid ${COLORS.outline}`,
                }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black"
                    style={{
                      backgroundColor: COLORS.surfaceMuted,
                      color: card.accent,
                    }}
                  >
                    {index + 1}
                  </div>
                  <div
                    className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold"
                    style={{
                      backgroundColor: COLORS.surfaceMuted,
                      color: card.accent,
                    }}
                  >
                    {card.stage}
                    {card.platform ? ` • ${card.platform}` : ''}
                  </div>
                </div>

                <h3
                  className="text-lg sm:text-xl font-bold mb-2"
                  style={{ color: COLORS.textPrimary }}
                >
                  {card.title}
                </h3>
                <p
                  className="text-sm sm:text-base leading-relaxed mb-3"
                  style={{ color: COLORS.textSecondary }}
                >
                  {card.description}
                </p>
                <p
                  className="text-sm font-semibold"
                  style={{ color: card.accent }}
                >
                  {card.outcome}
                </p>
              </article>
            ))}
          </div>

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

      {/* Pricing Section */}
      <section
        id="pricing"
        className="relative py-16 sm:py-20 px-4 sm:px-6"
        style={{
          background: `linear-gradient(180deg, ${COLORS.surfaceMuted} 0%, ${COLORS.background} 100%)`,
        }}
      >
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <div
              className="inline-block px-4 sm:px-6 py-2 sm:py-3 rounded-full mb-6 sm:mb-8"
              style={{
                backgroundColor: COLORS.successSoft,
                border: `1px solid ${COLORS.accentSuccess}`,
              }}
            >
              <span
                className="text-sm sm:text-base font-semibold"
                style={{ color: COLORS.accentSuccess }}
              >
                🔥 Lifetime free for first 100 users
              </span>
            </div>
            <h2
              className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 px-2"
              style={{ color: COLORS.textPrimary }}
            >
              Choose Your
              <span style={{ color: COLORS.brandPrimary }}> Learning Path</span>
            </h2>
            <p
              className="text-lg sm:text-xl max-w-3xl mx-auto px-4"
              style={{ color: COLORS.textSecondary }}
            >
              Start free and upgrade when you're ready to accelerate your
              Japanese mastery.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-3xl mx-auto px-4">
            {/* Weekly Plan */}
            <div
              className="p-6 sm:p-8 text-center rounded-2xl shadow-lg"
              style={{ backgroundColor: COLORS.surface }}
            >
              <div className="mb-6">
                <h3
                  className="text-xl sm:text-2xl font-bold mb-2"
                  style={{ color: COLORS.textPrimary }}
                >
                  Weekly
                </h3>
                <div
                  className="text-3xl sm:text-4xl font-black mb-2"
                  style={{ color: COLORS.textPrimary }}
                >
                  $1.99
                </div>
                <div style={{ color: COLORS.textMuted }}>per week</div>
              </div>
              <ul className="text-left space-y-3 mb-8 text-sm sm:text-base">
                <li className="flex items-center">
                  <CheckCircle
                    className="w-4 sm:w-5 h-4 sm:h-5 mr-3 flex-shrink-0"
                    style={{ color: COLORS.accentSuccess }}
                  />
                  <span style={{ color: COLORS.textSecondary }}>
                    All 2000 Kanji characters
                  </span>
                </li>
                <li className="flex items-center">
                  <CheckCircle
                    className="w-4 sm:w-5 h-4 sm:h-5 mr-3 flex-shrink-0"
                    style={{ color: COLORS.accentSuccess }}
                  />
                  <span style={{ color: COLORS.textSecondary }}>
                    Complete vocabulary (10,000+ words)
                  </span>
                </li>
                <li className="flex items-center">
                  <CheckCircle
                    className="w-4 sm:w-5 h-4 sm:h-5 mr-3 flex-shrink-0"
                    style={{ color: COLORS.accentSuccess }}
                  />
                  <span style={{ color: COLORS.textSecondary }}>
                    YouTube extension
                  </span>
                </li>
                <li className="flex items-center">
                  <CheckCircle
                    className="w-4 sm:w-5 h-4 sm:h-5 mr-3 flex-shrink-0"
                    style={{ color: COLORS.accentSuccess }}
                  />
                  <span style={{ color: COLORS.textSecondary }}>
                    AI-powered SRS system
                  </span>
                </li>
                <li className="flex items-center">
                  <CheckCircle
                    className="w-4 sm:w-5 h-4 sm:h-5 mr-3 flex-shrink-0"
                    style={{ color: COLORS.accentSuccess }}
                  />
                  <span style={{ color: COLORS.textSecondary }}>
                    Progress analytics
                  </span>
                </li>
                <li className="flex items-center">
                  <CheckCircle
                    className="w-4 sm:w-5 h-4 sm:h-5 mr-3 flex-shrink-0"
                    style={{ color: COLORS.accentSuccess }}
                  />
                  <span style={{ color: COLORS.textSecondary }}>
                    Unlimited practice sessions
                  </span>
                </li>
              </ul>
              <Button
                variant="outline"
                className="w-full"
                onClick={handleLoginClick}
                style={{ backgroundColor: 'transparent' }}
              >
                Start Weekly
              </Button>
            </div>

            {/* Yearly Plan */}
            <div
              className="p-6 sm:p-8 text-center relative md:scale-105 rounded-2xl shadow-xl"
              style={{
                backgroundColor: COLORS.surface,
                border: `2px solid ${COLORS.brandPrimary}`,
              }}
            >
              <div
                className="absolute -top-4 left-1/2 transform -translate-x-1/2 px-3 sm:px-4 py-1 rounded-full text-xs sm:text-sm font-medium text-white"
                style={{ backgroundColor: COLORS.brandPrimary }}
              >
                Best Value
              </div>
              <div className="mb-6">
                <h3
                  className="text-xl sm:text-2xl font-bold mb-2"
                  style={{ color: COLORS.textPrimary }}
                >
                  Yearly
                </h3>
                <div
                  className="text-3xl sm:text-4xl font-black mb-2"
                  style={{ color: COLORS.textPrimary }}
                >
                  $29.99
                </div>
                <div style={{ color: COLORS.textMuted }}>per year</div>
                <div
                  className="text-sm mt-1"
                  style={{ color: COLORS.accentSuccess }}
                >
                  Save $125!
                </div>
              </div>
              <ul className="text-left space-y-3 mb-8 text-sm sm:text-base">
                <li className="flex items-center">
                  <CheckCircle
                    className="w-4 sm:w-5 h-4 sm:h-5 mr-3 flex-shrink-0"
                    style={{ color: COLORS.accentSuccess }}
                  />
                  <span style={{ color: COLORS.textSecondary }}>
                    All 2000 Kanji characters
                  </span>
                </li>
                <li className="flex items-center">
                  <CheckCircle
                    className="w-4 sm:w-5 h-4 sm:h-5 mr-3 flex-shrink-0"
                    style={{ color: COLORS.accentSuccess }}
                  />
                  <span style={{ color: COLORS.textSecondary }}>
                    Complete vocabulary (10,000+ words)
                  </span>
                </li>
                <li className="flex items-center">
                  <CheckCircle
                    className="w-4 sm:w-5 h-4 sm:h-5 mr-3 flex-shrink-0"
                    style={{ color: COLORS.accentSuccess }}
                  />
                  <span style={{ color: COLORS.textSecondary }}>
                    YouTube extension
                  </span>
                </li>
                <li className="flex items-center">
                  <CheckCircle
                    className="w-4 sm:w-5 h-4 sm:h-5 mr-3 flex-shrink-0"
                    style={{ color: COLORS.accentSuccess }}
                  />
                  <span style={{ color: COLORS.textSecondary }}>
                    AI-powered SRS system
                  </span>
                </li>
                <li className="flex items-center">
                  <CheckCircle
                    className="w-4 sm:w-5 h-4 sm:h-5 mr-3 flex-shrink-0"
                    style={{ color: COLORS.accentSuccess }}
                  />
                  <span style={{ color: COLORS.textSecondary }}>
                    Progress analytics
                  </span>
                </li>
                <li className="flex items-center">
                  <CheckCircle
                    className="w-4 sm:w-5 h-4 sm:h-5 mr-3 flex-shrink-0"
                    style={{ color: COLORS.accentSuccess }}
                  />
                  <span style={{ color: COLORS.textSecondary }}>
                    Unlimited practice sessions
                  </span>
                </li>
                <li className="flex items-center">
                  <CheckCircle
                    className="w-4 sm:w-5 h-4 sm:h-5 mr-3 flex-shrink-0"
                    style={{ color: COLORS.accentSuccess }}
                  />
                  <span style={{ color: COLORS.textSecondary }}>
                    Priority support
                  </span>
                </li>
                <li className="flex items-center">
                  <CheckCircle
                    className="w-4 sm:w-5 h-4 sm:h-5 mr-3 flex-shrink-0"
                    style={{ color: COLORS.accentSuccess }}
                  />
                  <span style={{ color: COLORS.textSecondary }}>
                    Exclusive features
                  </span>
                </li>
              </ul>
              <Button
                variant="primary"
                className="w-full"
                onClick={handleLoginClick}
              >
                Start Yearly
              </Button>
            </div>
          </div>

          <div className="text-center mt-8 sm:mt-12 px-4">
            <p
              className="mb-4 text-sm sm:text-base"
              style={{ color: COLORS.textMuted }}
            >
              🎯 30-day money-back guarantee • 🔒 Secure payment • 📱 Instant
              access
            </p>
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
                    href="#features"
                    className="hover:transition-colors"
                    style={{ color: COLORS.textSecondary }}
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="#pricing"
                    className="hover:transition-colors"
                    style={{ color: COLORS.textSecondary }}
                  >
                    Pricing
                  </a>
                </li>
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
