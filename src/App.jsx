"use client";

import { useState } from "react";
import {
  Menu,
  X,
  Code,
  Languages,
  RotateCcw,
  BookOpen,
  Brain,
  Eye,
  MonitorSmartphone,
  Play,
  Monitor,
} from "lucide-react";
import colors from "./colors.js";

// Simple Button component
const Button = ({
  children,
  onClick,
  size = "md",
  variant = "primary",
  type = "button",
  className = "",
  ...props
}) => {
  const baseClasses =
    "inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";
  const sizeClasses = {
    sm: "h-9 px-3 text-sm",
    md: "h-10 px-4 py-2",
    lg: "h-11 px-8 text-lg",
  };
  const variantClasses = {
    primary: `bg-black text-white hover:bg-gray-800 focus:ring-gray-500`,
    secondary: `bg-white text-black border-2 hover:bg-gray-50 focus:ring-gray-500`,
    outline: `border-2 border-black bg-transparent text-black hover:bg-gray-50 focus:ring-gray-500`,
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      style={{
        backgroundColor:
          variant === "primary"
            ? colors.black
            : variant === "secondary"
            ? colors.ivory
            : "transparent",
        color: variant === "primary" ? colors.ivory : colors.black,
        borderColor: colors.black,
      }}
      {...props}
    >
      {children}
    </button>
  );
};

// Simple Input component
const Input = ({ className = "", ...props }) => {
  return (
    <input
      className={`flex h-10 w-full rounded-md border-2 px-3 py-2 text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      style={{
        backgroundColor: colors.ivory,
        borderColor: colors.border.medium,
        color: colors.text.primary,
        "--tw-ring-color": colors.black,
      }}
      {...props}
    />
  );
};

// Simple Card components
const Card = ({ children, style, className = "" }) => {
  return (
    <div
      className={`rounded-lg border-2 shadow-sm ${className}`}
      style={{
        backgroundColor: colors.ivory,
        borderColor: colors.border.light,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

const CardHeader = ({ children, className = "" }) => {
  return (
    <div className={`flex flex-col space-y-1.5 p-6 ${className}`}>
      {children}
    </div>
  );
};

const CardTitle = ({ children, className = "" }) => {
  return (
    <h3
      className={`text-2xl font-semibold leading-none tracking-tight ${className}`}
      style={{ color: colors.text.primary }}
    >
      {children}
    </h3>
  );
};

const CardDescription = ({ children, className = "" }) => {
  return (
    <p
      className={`text-sm ${className}`}
      style={{ color: colors.text.secondary }}
    >
      {children}
    </p>
  );
};

// Simple Badge component
const Badge = ({ children, variant = "primary", className = "" }) => {
  return (
    <div
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${className}`}
      style={{
        backgroundColor:
          variant === "primary" ? colors.honeydewDark : colors.ivoryDark,
        color: colors.text.primary,
      }}
    >
      {children}
    </div>
  );
};

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [email, setEmail] = useState("");

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsMenuOpen(false);
  };

  const handleSubscribe = (e) => {
    e.preventDefault();
    alert(`Thanks for subscribing with email: ${email}`);
    setEmail("");
  };

  return (
    <div
      className="min-h-screen min-w-screen"
      style={{
        background: `linear-gradient(to bottom right, ${colors.honeydew}, ${colors.ivory})`,
      }}
    >
      {/* Header */}
      <header
        className="fixed top-0 w-full backdrop-blur-md border-b-2 z-50"
        style={{
          backgroundColor: `${colors.honeydew}E6`, // Adding transparency
          borderColor: colors.border.light,
        }}
      >
        <div className="max-w-full mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {/* <Code className="h-8 w-8" style={{ color: colors.black }} /> */}
              <img
                className="w-8 aspect-square object-cover rounded-full"
                src="/bundai.svg"
              />
              <span
                className="text-xl font-bold"
                style={{ color: colors.black }}
              >
                Bundai
              </span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <a
                onClick={() => scrollToSection("home")}
                className="cursor-pointer transition-colors hover:opacity-80"
                style={{ color: colors.text.secondary }}
              >
                Home
              </a>
              <a
                onClick={() => scrollToSection("features")}
                className="cursor-pointer transition-colors hover:opacity-80"
                style={{ color: colors.text.secondary }}
              >
                Features
              </a>
              <a
                onClick={() => scrollToSection("demo")}
                className="cursor-pointer transition-colors hover:opacity-80"
                style={{ color: colors.text.secondary }}
              >
                Demo
              </a>
              <a
                onClick={() => scrollToSection("contact")}
                className="cursor-pointer transition-colors hover:opacity-80"
                style={{ color: colors.text.secondary }}
              >
                Contact
              </a>
              <Button size="sm">Get Started</Button>
            </nav>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMenu}
              className="md:hidden p-2 hover:opacity-80"
              style={{ color: colors.text.secondary }}
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <nav
              className="md:hidden mt-4 pb-4 border-t-2"
              style={{ borderColor: colors.border.light }}
            >
              <div className="flex flex-col space-y-4 pt-4">
                <a
                  onClick={() => scrollToSection("home")}
                  className="cursor-pointer text-left transition-colors hover:opacity-80"
                  style={{ color: colors.text.secondary }}
                >
                  Home
                </a>
                <a
                  onClick={() => scrollToSection("features")}
                  className="cursor-pointer text-left transition-colors hover:opacity-80"
                  style={{ color: colors.text.secondary }}
                >
                  Features
                </a>
                <a
                  onClick={() => scrollToSection("demo")}
                  className="cursor-pointer text-left transition-colors hover:opacity-80"
                  style={{ color: colors.text.secondary }}
                >
                  Demo
                </a>
                <a
                  onClick={() => scrollToSection("contact")}
                  className="cursor-pointer text-left transition-colors hover:opacity-80"
                  style={{ color: colors.text.secondary }}
                >
                  Contact
                </a>
                <Button size="sm" className="w-fit font-bold">
                  Get Started
                </Button>
              </div>
            </nav>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section id="home" className="pt-24 pb-16 px-4">
        <div className="max-w-[80vw] mx-auto text-center flex flex-col">
          <span
            className="text-5xl md:text-9xl font-[900] mb-12"
            style={{ color: colors.black }}
          >
            Start watching YouTube in{" "}
            <span style={{ color: "red" }}>Japanese</span> {" in "}
            <span style={{ color: "red" }}>3 months</span>
          </span>
          <p
            className="text-3xl mb-12 max-w-[60vw] mx-auto"
            style={{ color: colors.text.secondary }}
          >
            Ever wondered if you'll progress past ineffective apps and textbooks
            and start learning the real living language?{" "}
            <span style={{ fontWeight: "bolder", color: "yellowgreen" }}>
              Bundai
            </span>{" "}
            has tools and concrete steps that will get you there fast.
          </p>
          <span className="bg-[#FFFDD0] hover:bg-[#FFFFF0] text-black text-4xl font-extrabold py-4 px-8 rounded-lg shadow-md transition duration-300 self-center">
            Get Started
          </span>
        </div>
      </section>

      {/* Showcase Section */}
      <section
        className="py-16 px-4"
        style={{ backgroundColor: colors.honeydew }}
      >
        <div className="w-full mx-auto">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2
                className="text-3xl md:text-4xl font-bold mb-4"
                style={{ color: colors.black }}
              >
                Complete Learning Ecosystem
              </h2>
              <p
                className="text-lg max-w-2xl mx-auto"
                style={{ color: colors.text.secondary }}
              >
                Seamlessly learn across all your devices with our Chrome
                extension and mobile app
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-16 items-center">
              {/* PC Mockup - Left Side */}
              <div className="flex justify-center">
                <div className="relative">
                  {/* Laptop Frame */}
                  <div
                    className="relative w-96 h-64 rounded-t-2xl border-4 shadow-2xl"
                    style={{
                      backgroundColor: colors.black,
                      borderColor: colors.black,
                    }}
                  >
                    {/* Screen */}
                    <div
                      className="absolute inset-2 rounded-t-xl overflow-hidden"
                      style={{ backgroundColor: colors.ivory }}
                    >
                      {/* Extension Demo Image Placeholder */}
                      {/* Extension Demo Image - Replace the entire div with this */}
                      <img
                        src={"/assets/images/extension.jpg"}
                        alt="Chrome Extension Demo"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  {/* Laptop Base */}
                  <div
                    className="w-[420px] h-6 rounded-b-2xl border-4 border-t-0 relative"
                    style={{
                      backgroundColor: colors.black,
                      borderColor: colors.black,
                    }}
                  >
                    {/* Trackpad */}
                    <div
                      className="absolute top-1 left-1/2 transform -translate-x-1/2 w-16 h-3 rounded"
                      style={{ backgroundColor: colors.text.muted }}
                    ></div>
                  </div>

                  {/* Floating Extension Icon */}
                  <div
                    className="absolute -top-4 -right-4 w-12 h-12 rounded-full flex items-center justify-center animate-pulse"
                    style={{ backgroundColor: "#FFFDD0" }}
                  >
                    <Monitor
                      className="w-6 h-6"
                      style={{ color: colors.black }}
                    />
                  </div>
                </div>
              </div>

              {/* iPhone Scissor Mockups - Right Side */}
              <div className="flex justify-center">
                <div className="relative w-80 h-80 scissor-container">
                  {/* First iPhone */}
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 scissor-phone-1 transition-all duration-500 ease-in-out">
                    <div
                      className="relative w-40 h-80 rounded-[2rem] border-4 shadow-xl"
                      style={{
                        backgroundColor: colors.black,
                        borderColor: colors.black,
                        transformOrigin: "bottom center",
                      }}
                    >
                      {/* Screen */}
                      <div
                        className="absolute inset-2 rounded-[1.5rem] overflow-hidden"
                        style={{ backgroundColor: colors.black }}
                      >
                        {/* Quiz Mode Screenshot */}
                        <img
                          src="/assets/images/phone1.jpg"
                          alt="Quiz Mode Screenshot"
                          className="w-full h-full object-cover rounded-[1.5rem]"
                        />
                      </div>

                      {/* iPhone Details */}
                      <div
                        className="absolute top-3 left-1/2 transform -translate-x-1/2 w-8 h-0.5 rounded-full"
                        style={{ backgroundColor: colors.text.muted }}
                      ></div>
                      <div
                        className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-16 h-0.5 rounded-full"
                        style={{ backgroundColor: colors.text.muted }}
                      ></div>
                    </div>
                  </div>

                  {/* Second iPhone */}
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 scissor-phone-2 transition-all duration-500 ease-in-out">
                    <div
                      className="relative w-40 h-80 rounded-[2rem] border-4 shadow-xl"
                      style={{
                        backgroundColor: colors.black,
                        borderColor: colors.black,
                        transformOrigin: "bottom center",
                      }}
                    >
                      {/* Screen */}
                      <div
                        className="absolute inset-2 rounded-[1.5rem] overflow-hidden"
                        style={{ backgroundColor: colors.black }}
                      >
                        {/* Kanji Study Screenshot */}
                        <img
                          src="/assets/images/phone2.jpg"
                          alt="Kanji Study Screenshot"
                          className="w-full h-full object-cover rounded-[1.5rem]"
                        />
                      </div>

                      {/* iPhone Details */}
                      <div
                        className="absolute top-3 left-1/2 transform -translate-x-1/2 w-8 h-0.5 rounded-full"
                        style={{ backgroundColor: colors.text.muted }}
                      ></div>
                      <div
                        className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-16 h-0.5 rounded-full"
                        style={{ backgroundColor: colors.text.muted }}
                      ></div>
                    </div>
                  </div>

                  {/* Floating Elements */}
                  <div
                    className="absolute -top-6 -left-6 w-10 h-10 rounded-full flex items-center justify-center animate-bounce"
                    style={{ backgroundColor: colors.honeydew }}
                  >
                    <Eye className="w-5 h-5" style={{ color: colors.black }} />
                  </div>

                  <div
                    className="absolute -bottom-6 -right-6 w-10 h-10 rounded-full flex items-center justify-center animate-pulse"
                    style={{ backgroundColor: "#FFFDD0" }}
                  >
                    <RotateCcw
                      className="w-5 h-5"
                      style={{ color: colors.black }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Feature Highlights */}
            <div className="grid md:grid-cols-2 gap-8 mt-16">
              <div className="text-center">
                <h3
                  className="text-xl font-bold mb-3"
                  style={{ color: colors.black }}
                >
                  Web Extension
                </h3>
                <p style={{ color: colors.text.secondary }}>
                  Learn Japanese while watching YouTube videos with real-time
                  translations and vocabulary building
                </p>
              </div>
              <div className="text-center">
                <h3
                  className="text-xl font-bold mb-3"
                  style={{ color: colors.black }}
                >
                  Mobile App
                </h3>
                <p style={{ color: colors.text.secondary }}>
                  Practice on-the-go with interactive quizzes, kanji
                  recognition, and spaced repetition system
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        .scissor-container:hover .scissor-phone-1 {
          transform: translateX(-50%) rotate(-15deg);
        }

        .scissor-container:hover .scissor-phone-2 {
          transform: translateX(-50%) rotate(15deg);
        }

        .scissor-phone-1 {
          transform: translateX(-50%) rotate(-5deg);
          z-index: 2;
        }

        .scissor-phone-2 {
          transform: translateX(-50%) rotate(5deg);
          z-index: 1;
        }
      `}</style>

      {/* Features Section */}
      <section
        id="features"
        className="py-16 px-4"
        style={{ backgroundColor: colors.honeydew }}
      >
        <div className="w-full mx-auto">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2
                className="text-3xl md:text-4xl font-bold mb-4"
                style={{ color: colors.black }}
              >
                Powerful Features
              </h2>
              <p
                className="text-lg max-w-2xl mx-auto"
                style={{ color: colors.text.secondary }}
              >
                Built with modern technologies to deliver exceptional user
                experience
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* 2000 Japanese Kanjis List*/}
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <Languages
                    className="h-12 w-12 mb-4"
                    style={{ color: colors.black }}
                  />
                  <CardTitle>2000 Kanjis</CardTitle>
                  <CardDescription>
                    Master kanjis with our comprehensive kanji database and
                    learning system
                  </CardDescription>
                </CardHeader>
              </Card>

              {/* App and Chrome Extension Sync */}
              <Card
                style={{
                  backgroundColor: "#FFFDD0",
                }}
                className="hover:shadow-lg transition-shadow"
              >
                <CardHeader>
                  <MonitorSmartphone
                    className="h-12 w-12 mb-4"
                    style={{ color: colors.black }}
                  />
                  <CardTitle>App and Extension Sync</CardTitle>
                  <CardDescription>
                    Seamlessly sync your progress between mobile app and Chrome
                    extension for continuous learning
                  </CardDescription>
                </CardHeader>
              </Card>

              {/* SRS - Spaced Repetition System */}
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <RotateCcw
                    className="h-12 w-12 mb-4"
                    style={{ color: colors.text.secondary }}
                  />
                  <CardTitle>SRS</CardTitle>
                  <CardDescription>
                    Intelligent spaced repetition system that optimizes your
                    learning schedule for maximum retention
                  </CardDescription>
                </CardHeader>
              </Card>

              {/* 1000 Immersion words */}
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <BookOpen
                    className="h-12 w-12 mb-4"
                    style={{ color: colors.text.muted }}
                  />
                  <CardTitle>1000 immersion words</CardTitle>
                  <CardDescription>
                    Immersion based learning with only sound and roumaji
                  </CardDescription>
                </CardHeader>
              </Card>

              {/* Instant Quiz */}
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <Brain
                    className="h-12 w-12 mb-4"
                    style={{ color: colors.text.muted }}
                  />
                  <CardTitle>Instant Quiz</CardTitle>
                  <CardDescription>
                    Quick knowledge checks and practice sessions to reinforce
                    your learning progress
                  </CardDescription>
                </CardHeader>
              </Card>

              {/* Similar Looking Kanji */}
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <Eye
                    className="h-12 w-12 mb-4"
                    style={{ color: colors.text.muted }}
                  />
                  <CardTitle>Similar Looking Kanjis</CardTitle>
                  <CardDescription>
                    Learn to distinguish between commonly confused kanji
                    characters with targeted practice
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* App Demo Section */}
      <section
        id="demo"
        className="py-16 px-4"
        style={{ backgroundColor: colors.ivory }}
      >
        <div className="w-full mx-auto">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2
                className="text-3xl md:text-4xl font-bold mb-4"
                style={{ color: colors.black }}
              >
                See Bundai in Action
              </h2>
              <p
                className="text-lg max-w-2xl mx-auto"
                style={{ color: colors.text.secondary }}
              >
                Watch how our app transforms your Japanese learning experience
              </p>
            </div>

            <div className="flex justify-center items-center">
              {/* iPhone Mockup */}
              <div className="relative">
                {/* iPhone Frame */}
                <div
                  className="relative w-80 h-[640px] rounded-[3rem] border-8 shadow-2xl"
                  style={{
                    backgroundColor: colors.black,
                    borderColor: colors.black,
                  }}
                >
                  {/* Screen */}
                  <div
                    className="absolute inset-4 rounded-[2.5rem] overflow-hidden"
                    style={{ backgroundColor: colors.black }}
                  >
                    {/* Video Container */}
                    <div className="relative w-full h-full bg-gray-900 rounded-[2.5rem] overflow-hidden">
                      {/* Placeholder for video - you can replace this with an actual video element */}
                      {/* <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
                        <div className="text-center">
                          <div
                            className="w-20 h-20 rounded-full flex items-center justify-center mb-4 mx-auto cursor-pointer hover:scale-110 transition-transform"
                            style={{ backgroundColor: colors.honeydew }}
                          >
                            <Play
                              className="w-8 h-8 ml-1"
                              style={{ color: colors.black }}
                            />
                          </div>
                          <p
                            className="text-sm font-medium"
                            style={{ color: colors.ivory }}
                          >
                            Watch App Demo
                          </p>
                        </div>
                      </div> */}

                      {/* You can replace the above div with an actual video element like this: */}

                      <video
                        className="w-full h-full object-cover"
                        controls
                        poster="/bundai.svg"
                      >
                        <source
                          src="/assets/videos/sample.mp4"
                          type="video/mp4"
                        />
                        Your browser does not support the video tag.
                      </video>
                    </div>
                  </div>

                  {/* iPhone Details */}
                  <div
                    className="absolute top-6 left-1/2 transform -translate-x-1/2 w-16 h-1 rounded-full"
                    style={{ backgroundColor: colors.text.muted }}
                  ></div>

                  {/* Home Indicator */}
                  <div
                    className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 rounded-full"
                    style={{ backgroundColor: colors.text.muted }}
                  ></div>
                </div>

                {/* Floating Elements */}
                <div
                  className="absolute -top-4 -left-4 w-12 h-12 rounded-full flex items-center justify-center animate-bounce"
                  style={{ backgroundColor: colors.honeydew }}
                >
                  <Languages
                    className="w-6 h-6"
                    style={{ color: colors.black }}
                  />
                </div>

                <div
                  className="absolute -top-8 -right-8 w-16 h-16 rounded-full flex items-center justify-center animate-pulse"
                  style={{ backgroundColor: "#FFFDD0" }}
                >
                  <Brain className="w-8 h-8" style={{ color: colors.black }} />
                </div>

                <div
                  className="absolute -bottom-4 -right-4 w-12 h-12 rounded-full flex items-center justify-center animate-bounce"
                  style={{ backgroundColor: colors.honeydew }}
                >
                  <Eye className="w-6 h-6" style={{ color: colors.black }} />
                </div>
              </div>
            </div>

            {/* Call to Action */}
            <div className="text-center mt-12">
              <Button size="lg" className="text-xl px-8 py-4">
                Try Bundai Now
              </Button>
              <p
                className="mt-4 text-sm"
                style={{ color: colors.text.secondary }}
              >
                Available on iOS and Android
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section
        id="contact"
        className="py-16 px-4"
        style={{ backgroundColor: colors.honeydew }}
      >
        <div className="w-full mx-auto">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2
                className="text-3xl md:text-4xl font-bold mb-4"
                style={{ color: colors.black }}
              >
                Get In Touch
              </h2>
              <p
                className="text-lg max-w-2xl mx-auto"
                style={{ color: colors.text.secondary }}
              >
                Connect with us on social media for updates, tips, and community
                support
              </p>
            </div>

            {/* Social Links Only */}
            <div className="flex flex-wrap justify-center gap-8 max-w-4xl mx-auto">
              <a
                href="https://twitter.com/bundaiapp"
                target="_blank"
                rel="noopener noreferrer"
                title="https://twitter.com/bundaiapp"
                className="flex flex-col items-center p-8 rounded-lg border-2 hover:shadow-xl transition-all duration-300 group"
                style={{
                  backgroundColor: colors.ivory,
                  borderColor: colors.border.light,
                }}
              >
                <svg
                  className="h-16 w-16 mb-4 group-hover:scale-110 transition-transform"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  style={{ color: colors.black }}
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
                <h3
                  className="text-2xl font-bold"
                  style={{ color: colors.text.primary }}
                >
                  Twitter
                </h3>
              </a>

              <a
                href="https://youtube.com/@bundaiapp"
                target="_blank"
                rel="noopener noreferrer"
                title="https://youtube.com/@bundaiapp"
                className="flex flex-col items-center p-8 rounded-lg border-2 hover:shadow-xl transition-all duration-300 group"
                style={{
                  backgroundColor: colors.ivory,
                  borderColor: colors.border.light,
                }}
              >
                <svg
                  className="h-16 w-16 mb-4 group-hover:scale-110 transition-transform"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  style={{ color: colors.black }}
                >
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
                <h3
                  className="text-2xl font-bold"
                  style={{ color: colors.text.primary }}
                >
                  YouTube
                </h3>
              </a>
              {/* facebook social icon */}
              <a
                href="https://facebook.com/bundaiapp"
                target="_blank"
                rel="noopener noreferrer"
                title="Facebook"
                className="flex flex-col items-center p-8 rounded-lg border-2 hover:shadow-xl transition-all duration-300 group"
                style={{
                  backgroundColor: colors.ivory,
                  borderColor: colors.border.light,
                }}
              >
                <svg
                  className="h-16 w-16 mb-4 group-hover:scale-110 transition-transform"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  style={{ color: colors.black }}
                >
                  <path d="M22.675 0h-21.35C.597 0 0 .597 0 1.333v21.333C0 23.403.597 24 1.325 24H12.82v-9.294H9.692V11.12h3.128V8.413c0-3.1 1.894-4.788 4.659-4.788 1.325 0 2.463.099 2.794.143v3.24l-1.917.001c-1.504 0-1.795.715-1.795 1.763v2.312h3.59l-.467 3.586h-3.123V24h6.127C23.403 24 24 23.403 24 22.667V1.333C24 .597 23.403 0 22.675 0z" />
                </svg>
                <h3
                  className="text-2xl font-bold"
                  style={{ color: colors.text.primary }}
                >
                  Facebook
                </h3>
              </a>

              {/* instagram social icon */}
              <a
                href="https://instagram.com/bundaiapp"
                target="_blank"
                rel="noopener noreferrer"
                title="Instagram"
                className="flex flex-col items-center p-8 rounded-lg border-2 hover:shadow-xl transition-all duration-300 group"
                style={{
                  backgroundColor: colors.ivory,
                  borderColor: colors.border.light,
                }}
              >
                <svg
                  className="h-16 w-16 mb-4 group-hover:scale-110 transition-transform"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  style={{ color: colors.black }}
                >
                  <path d="M7.5 2h9A5.5 5.5 0 0 1 22 7.5v9a5.5 5.5 0 0 1-5.5 5.5h-9A5.5 5.5 0 0 1 2 16.5v-9A5.5 5.5 0 0 1 7.5 2zm0 2A3.5 3.5 0 0 0 4 7.5v9A3.5 3.5 0 0 0 7.5 20h9a3.5 3.5 0 0 0 3.5-3.5v-9A3.5 3.5 0 0 0 16.5 4h-9zm4.5 3a5.5 5.5 0 1 1 0 11 5.5 5.5 0 0 1 0-11zm0 2a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7z" />
                </svg>
                <h3
                  className="text-2xl font-bold"
                  style={{ color: colors.text.primary }}
                >
                  Instagram
                </h3>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        className="w-full backdrop-blur-md border-t-2"
        style={{
          backgroundColor: `${colors.honeydew}E6`,
          borderColor: colors.border.light,
        }}
      >
        <div className="w-full mx-auto">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex items-center space-x-2 mb-4 md:mb-0">
                <img
                  className="w-8 aspect-square object-cover rounded-full"
                  src="/bundai.svg"
                />
                <span
                  className="text-xl font-bold"
                  style={{ color: colors.black }}
                >
                  Bundai
                </span>
              </div>
              <nav className="flex space-x-6">
                <a
                  className="cursor-pointer transition-colors hover:opacity-80"
                  style={{ color: colors.text.secondary }}
                >
                  Privacy
                </a>
                <a
                  className="cursor-pointer transition-colors hover:opacity-80"
                  style={{ color: colors.text.secondary }}
                >
                  Terms
                </a>
                <a
                  className="cursor-pointer transition-colors hover:opacity-80"
                  style={{ color: colors.text.secondary }}
                >
                  Support
                </a>
              </nav>
            </div>
            <div
              className="border-t mt-4 pt-4 text-center text-sm"
              style={{
                borderColor: colors.border.light,
                color: colors.text.secondary,
              }}
            >
              <p>&copy; 2024 Bundai. Built with Vite + React + JavaScript.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
