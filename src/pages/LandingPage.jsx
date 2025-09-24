"use client";

import { useState } from "react";
import {
  Menu,
  X,
  Languages,
  RotateCcw,
  BookOpen,
  Brain,
  Eye,
  MonitorSmartphone,
  Monitor,
  Globe,
  Smartphone,
  Play,
  Star,
  CheckCircle,
  ArrowRight,
  Download,
} from "lucide-react";
import { Button } from "../components/Button";
import { AnimatedBackground } from "../components/AnimatedBackground";



// Glass card component
const GlassCard = ({ children, className = "", hover = true }) => {
  return (
    <div
      className={`backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl shadow-xl ${
        hover ? "hover:bg-white/20 transition-all duration-300 hover:scale-105" : ""
      } ${className}`}
    >
      {children}
    </div>
  );
};


export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [email, setEmail] = useState("");

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const scrollToSection = (sectionId) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
    setIsMenuOpen(false);
  };

  const handleSubscribe = (e) => {
    e.preventDefault();
    alert(`Welcome to Bundai! We'll keep you updated at: ${email}`);
    setEmail("");
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white" >
      <AnimatedBackground />

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 backdrop-blur-lg bg-black/20 border-b border-white/10">
        <div className="mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-3 z-10">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">文</span>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Bundai
              </span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <a onClick={() => scrollToSection("home")} className="cursor-pointer text-gray-300 hover:text-white transition-colors">
                Home
              </a>
              <a onClick={() => scrollToSection("pricing")} className="cursor-pointer text-gray-300 hover:text-white transition-colors">
                Pricing
              </a>
              <a onClick={() => scrollToSection("features")} className="cursor-pointer text-gray-300 hover:text-white transition-colors">
                Features
              </a>
              <a onClick={() => scrollToSection("demo")} className="cursor-pointer text-gray-300 hover:text-white transition-colors">
                Demo
              </a>
              <a onClick={() => scrollToSection("testimonials")} className="cursor-pointer text-gray-300 hover:text-white transition-colors">
                Reviews
              </a>
              <Button size="sm" variant="primary">
                Get Started
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMenu}
              className="md:hidden p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden mt-4 pb-6 border-t border-white/10">
              <div className="flex flex-col space-y-4 pt-4">
                <a onClick={() => scrollToSection("home")} className="cursor-pointer text-gray-300 hover:text-white transition-colors">
                  Home
                </a>
                <a onClick={() => scrollToSection("pricing")} className="cursor-pointer text-gray-300 hover:text-white transition-colors">
                  Pricing
                </a>
                <a onClick={() => scrollToSection("features")} className="cursor-pointer text-gray-300 hover:text-white transition-colors">
                  Features
                </a>
                <a onClick={() => scrollToSection("demo")} className="cursor-pointer text-gray-300 hover:text-white transition-colors">
                  Demo
                </a>
                <a onClick={() => scrollToSection("testimonials")} className="cursor-pointer text-gray-300 hover:text-white transition-colors">
                  Reviews
                </a>
                <Button size="sm" variant="primary" className="w-fit">
                  Get Started
                </Button>
              </div>
            </div>
          )}
        </div>
      </nav>

{/* Hero Section */}
<section id="home" className="relative min-h-screen flex items-center justify-center px-6 pt-20">
        <div className="w-full mx-auto">
          <div className="text-center relative z-10">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30 mb-8">
              <span className="text-orange-300 text-sm font-medium">Master Japanese in 90 Days</span>
            </div>
            
            <h1 className="text-4xl sm:text-6xl lg:text-8xl font-black mb-8 leading-tight max-w-5xl mx-auto">
              Start Watching{" "}
              <span className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
                YouTube
              </span>
              <br />
              in{" "}
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Japanese
              </span>{" "}
              in{" "}
              <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                3 Months
              </span>
            </h1>

            <p className="text-lg sm:text-xl lg:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
              Stop struggling with boring textbooks and ineffective apps. 
              <span className="text-emerald-400 font-semibold"> Bundai </span>
              uses immersive learning with real Japanese content to get you fluent fast.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-16">
              <Button size="xl" variant="primary" className="group">
                Start Learning Now
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button size="xl" onClick={()=>scrollToSection('demo')} variant="secondary">
                <Play className="w-5 h-5 mr-2" />
                Watch Demo
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="text-center p-6 bg-white/5 rounded-2xl backdrop-blur-sm">
                <div className="text-3xl font-bold text-emerald-400 mb-2">2000+</div>
                <div className="text-gray-300">Kanji Characters</div>
              </div>
              <div className="text-center p-6 bg-white/5 rounded-2xl backdrop-blur-sm">
                <div className="text-3xl font-bold text-blue-400 mb-2">10,000+</div>
                <div className="text-gray-300">Happy Learners</div>
              </div>
              <div className="text-center p-6 bg-white/5 rounded-2xl backdrop-blur-sm">
                <div className="text-3xl font-bold text-purple-400 mb-2">90 Days</div>
                <div className="text-gray-300">Average to Fluency</div>
              </div>
            </div>
          </div>

          {/* Floating phone mockup - repositioned */}
          <div className="absolute top-20 right-4 lg:right-10 hidden lg:block opacity-30 hover:opacity-60 transition-opacity">
            <div className="relative animate-float">
              <div className="w-48 h-80 bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl border-2 border-gray-700 shadow-2xl">
                <div className="p-3 h-full bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-3xl flex items-center justify-center">
                  <div className="text-center">
                    <Languages className="w-8 h-8 text-blue-400 mx-auto mb-3" />
                    <div className="text-white text-xs">Learning Japanese</div>
                    <div className="text-gray-300 text-xs mt-1">漢字 Practice</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="relative py-20 px-6 bg-black/20">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Choose Your
              <span className="bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent"> Learning Path</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Start free and upgrade when you're ready to accelerate your Japanese mastery.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {/* Free Plan */}
            <GlassCard className="p-8 text-center">
              <div className="mb-6">
                <h3 className="text-2xl font-bold mb-2">Free</h3>
                <div className="text-4xl font-black mb-2">$0</div>
                <div className="text-gray-400">Forever</div>
              </div>
              <ul className="text-left space-y-3 mb-8">
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                  <span className="text-gray-300">50 Kanji characters</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                  <span className="text-gray-300">Basic vocabulary (100 words)</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                  <span className="text-gray-300">Daily practice sessions</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                  <span className="text-gray-300">Mobile app access</span>
                </li>
              </ul>
              <Button variant="outline" className="w-full">
                Get Started Free
              </Button>
            </GlassCard>

            {/* Premium Plan */}
            <GlassCard className="p-8 text-center relative scale-105 border-2 border-gradient-to-r from-blue-500 to-purple-500">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-blue-500 to-purple-500 px-4 py-1 rounded-full text-white text-sm font-medium">
                Most Popular
              </div>
              <div className="mb-6">
                <h3 className="text-2xl font-bold mb-2">Premium</h3>
                <div className="text-4xl font-black mb-2">$19</div>
                <div className="text-gray-400">per month</div>
              </div>
              <ul className="text-left space-y-3 mb-8">
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                  <span className="text-gray-300">All 2000 Kanji characters</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                  <span className="text-gray-300">Complete vocabulary (10,000+ words)</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                  <span className="text-gray-300">YouTube extension</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                  <span className="text-gray-300">AI-powered SRS system</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                  <span className="text-gray-300">Progress analytics</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                  <span className="text-gray-300">Unlimited practice sessions</span>
                </li>
              </ul>
              <Button variant="primary" className="w-full">
                Start Premium Trial
              </Button>
            </GlassCard>

            {/* Lifetime Plan */}
            <GlassCard className="p-8 text-center">
              <div className="mb-6">
                <h3 className="text-2xl font-bold mb-2">Lifetime</h3>
                <div className="text-4xl font-black mb-2">$199</div>
                <div className="text-gray-400">One-time payment</div>
                <div className="text-sm text-green-400 mt-1">Save $429!</div>
              </div>
              <ul className="text-left space-y-3 mb-8">
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                  <span className="text-gray-300">Everything in Premium</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                  <span className="text-gray-300">Lifetime updates</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                  <span className="text-gray-300">Priority support</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                  <span className="text-gray-300">Exclusive features</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                  <span className="text-gray-300">No monthly fees ever</span>
                </li>
              </ul>
              <Button variant="success" className="w-full">
                Get Lifetime Access
              </Button>
            </GlassCard>
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-400 mb-4">🎯 30-day money-back guarantee • 🔒 Secure payment • 📱 Instant access</p>
          </div>
        </div>
      </section>

{/* Features Section */}
<section id="features" className="relative py-20 px-6">
  <div className="mx-auto">
    <div className="text-center mb-16">
      <h2 className="text-4xl md:text-5xl font-bold mb-6">
        Revolutionary Learning
        <span className="bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent"> Features</span>
      </h2>
      <p className="text-xl text-gray-300 max-w-3xl mx-auto">
        Powered by AI and designed for real-world fluency, not just test scores.
      </p>
    </div>

    {/* Feature grid */}
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
      
      {/* Highlighted (most important) card */}
      <GlassCard className="p-8 text-center transform transition-all hover:scale-105 hover:shadow-xl bg-gradient-to-br from-blue-500 to-purple-500 hover:bg-gradient-to-br hover:from-blue-600 hover:to-purple-600">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <MonitorSmartphone className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-2xl font-bold mb-4">Cross-Platform Sync</h3>
        <p className="text-white leading-relaxed">
          Learn seamlessly across desktop, mobile, and browser extension. Your progress syncs everywhere instantly.
        </p>
      </GlassCard>

      {/* Other cards */}
      <GlassCard className="p-8 text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Languages className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-2xl font-bold mb-4">2000 Essential Kanji</h3>
        <p className="text-gray-300 leading-relaxed">
          Master every kanji you need with our scientifically-ordered curriculum and visual memory techniques.
        </p>
      </GlassCard>

      <GlassCard className="p-8 text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Brain className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-2xl font-bold mb-4">AI-Powered SRS</h3>
        <p className="text-gray-300 leading-relaxed">
          Our intelligent spaced repetition adapts to your learning speed and optimizes retention automatically.
        </p>
      </GlassCard>

      <GlassCard className="p-8 text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Globe className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-2xl font-bold mb-4">YouTube Integration</h3>
        <p className="text-gray-300 leading-relaxed">
          Learn from real Japanese content. Our extension provides instant translations and vocabulary building.
        </p>
      </GlassCard>

      <GlassCard className="p-8 text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <BookOpen className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-2xl font-bold mb-4">1000 Core Words</h3>
        <p className="text-gray-300 leading-relaxed">
          Immersive vocabulary learning with audio-first approach and contextual understanding.
        </p>
      </GlassCard>

      <GlassCard className="p-8 text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Eye className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-2xl font-bold mb-4">Similar Kanji Training</h3>
        <p className="text-gray-300 leading-relaxed">
          Never confuse similar-looking characters again with our specialized recognition training system.
        </p>
      </GlassCard>
      
    </div>

  </div>
</section>


      {/* Demo Section */}
      <section id="demo" className="relative py-20 px-6 bg-black/20">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-8">
            See Bundai in
            <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent"> Action</span>
          </h2>
          <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto">
            Watch how our revolutionary approach transforms Japanese learning from boring to brilliant.
          </p>

          {/* Video player mockup */}
          <div className="relative mx-auto max-w-2xl">
            <div className="aspect-video bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-2xl overflow-hidden">
              <div className="relative h-full flex items-center justify-center bg-gradient-to-br from-blue-600/20 to-purple-600/20">
                <Button size="lg" variant="accent" className="group">
                  <Play className="w-6 h-6 mr-3 group-hover:scale-110 transition-transform" />
                  Watch Demo Video
                </Button>
                
                {/* Floating UI elements */}
                <div className="absolute top-4 left-4 bg-black/40 backdrop-blur-sm px-3 py-1 rounded-full text-sm text-white">
                  🎌 Learning Japanese
                </div>
                <div className="absolute bottom-4 right-4 bg-gradient-to-r from-emerald-500 to-cyan-500 px-3 py-1 rounded-full text-sm text-white font-medium">
                  Progress: 67%
                </div>
              </div>
            </div>
            
            {/* Floating elements */}
            <div className="absolute -top-6 -right-6 w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center animate-bounce delay-300">
              <Languages className="w-6 h-6 text-white" />
            </div>
            <div className="absolute -bottom-6 -left-6 w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center animate-pulse">
              <Brain className="w-6 h-6 text-white" />
            </div>
          </div>

              {/* Platform showcase */}
              <section id="platforms" className="mt-12">
    <div className="text-center mb-12">
      <h3 className="text-3xl font-bold mb-8">Learn Anywhere, Anytime</h3>
    </div>
    
    <div className="grid lg:grid-cols-2 gap-16 items-center">
      {/* Desktop mockup */}
      <div className="relative">
        <div className="relative mx-auto" style={{width: "500px", height: "300px"}}>
          <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-2xl">
            <div className="p-6 h-full">
              <div className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 h-full rounded-xl flex items-center justify-center relative overflow-hidden">
                <div className="absolute top-4 left-4 flex space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <div className="text-center">
                  <Monitor className="w-16 h-16 text-blue-400 mx-auto mb-4" />
                  <div className="text-white font-semibold">Chrome Extension Active</div>
                  <div className="text-gray-300 text-sm mt-2">Learning from YouTube</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute -bottom-4 -right-4 w-12 h-12 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-full flex items-center justify-center animate-bounce">
          <Globe className="w-6 h-6 text-white" />
        </div>
      </div>

      {/* Mobile mockups */}
      <div className="flex justify-center space-x-8">
        <div className="relative">
          <div className="w-48 h-96 bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl border-4 border-gray-700 shadow-2xl">
            <div className="p-4 h-full">
              <div className="bg-gradient-to-br from-orange-600/20 to-red-600/20 h-full rounded-2xl flex items-center justify-center">
                <div className="text-center">
                  <Smartphone className="w-12 h-12 text-orange-400 mx-auto mb-4" />
                  <div className="text-white text-sm font-semibold">Quiz Mode</div>
                  <div className="text-gray-300 text-xs mt-2">漢字: 学習</div>
                  <div className="mt-4 space-y-2">
                    <div className="w-20 h-2 bg-white/20 rounded mx-auto"></div>
                    <div className="w-16 h-2 bg-white/20 rounded mx-auto"></div>
                    <div className="w-24 h-2 bg-orange-400 rounded mx-auto"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="absolute -top-4 -left-4 w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center animate-pulse">
            <Star className="w-4 h-4 text-white" />
          </div>
        </div>
      </div>
    </div>

          {/* App store buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-12">
            
            <div className="bg-black rounded-2xl p-3 hover:scale-105 transition-transform cursor-pointer">
              <div className="flex items-center space-x-3 px-4">
                <Globe className="w-8 h-8 text-white" />
                <div className="text-left">
                  <div className="text-xs text-gray-400">Available in</div>
                  <div className="text-lg font-semibold text-white">Chrome Web Store</div>
                </div>
              </div>
            </div>

            <div className="bg-black rounded-2xl p-3 hover:scale-105 transition-transform cursor-pointer">
              <div className="flex items-center space-x-3 px-4">
                <Download className="w-8 h-8 text-white" />
                <div className="text-left">
                  <div className="text-xs text-gray-400">Download on the</div>
                  <div className="text-lg font-semibold text-white">App Store</div>
                </div>
              </div>
            </div>
            
            <div className="bg-black rounded-2xl p-3 hover:scale-105 transition-transform cursor-pointer">
              <div className="flex items-center space-x-3 px-4">
                <Download className="w-8 h-8 text-white" />
                <div className="text-left">
                  <div className="text-xs text-gray-400">Get it on</div>
                  <div className="text-lg font-semibold text-white">Google Play</div>
                </div>
              </div>
            </div>
          </div>
              </section>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="relative py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              What Learners
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"> Say</span>
            </h2>
            <div className="flex items-center justify-center space-x-2 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-6 h-6 text-yellow-400 fill-current" />
              ))}
              <span className="text-gray-300 ml-2">4.9/5 from 2,847 reviews</span>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <GlassCard className="p-6">
              <div className="flex items-center space-x-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-300 mb-4 italic">
                "I went from zero Japanese to watching anime without subtitles in just 4 months. Bundai's approach actually works!"
              </p>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">SK</span>
                </div>
                <div>
                  <div className="text-white font-medium">Sarah Kim</div>
                  <div className="text-gray-400 text-sm">Software Engineer</div>
                </div>
              </div>
            </GlassCard>

            <GlassCard className="p-6">
              <div className="flex items-center space-x-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-300 mb-4 italic">
                "The YouTube integration is genius. I'm learning from real Japanese content instead of boring textbook examples."
              </p>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">MR</span>
                </div>
                <div>
                  <div className="text-white font-medium">Mike Rodriguez</div>
                  <div className="text-gray-400 text-sm">Marketing Manager</div>
                </div>
              </div>
            </GlassCard>

            <GlassCard className="p-6">
              <div className="flex items-center space-x-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-300 mb-4 italic">
                "Finally passed JLPT N2 after struggling for years with other apps. The kanji recognition training is incredible."
              </p>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">AL</span>
                </div>
                <div>
                  <div className="text-white font-medium">Alex Liu</div>
                  <div className="text-gray-400 text-sm">College Student</div>
                </div>
              </div>
            </GlassCard>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="relative py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Master
            <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent"> Japanese?</span>
          </h2>
          <p className="text-xl text-gray-300 mb-12">
            Join thousands of learners who chose the fast track to fluency. Start your journey today!
          </p>

          <form onSubmit={handleSubscribe} className="max-w-md mx-auto mb-8">
            <div className="flex gap-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 px-6 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm"
                required
              />
              <Button type="submit" size="lg" variant="primary">
                Start Free
              </Button>
            </div>
          </form>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Button size="xl" onClick={()=>scrollToSection("platforms")} variant="primary" className="group">
              Download Bundai Now
              <Download className="w-5 h-5 ml-2 group-hover:translate-y-1 transition-transform" />
            </Button>
            <Button size="xl" variant="secondary">
              Try Chrome Extension
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-white/10 py-12 px-6 bg-black/30">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            {/* Logo and description */}
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-lg">文</span>
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  Bundai
                </span>
              </div>
              <p className="text-gray-400 max-w-md leading-relaxed">
                The fastest way to learn Japanese through immersive, real-world content. 
                Join thousands of learners mastering Japanese in record time.
              </p>
              <div className="flex space-x-4 mt-6">
                {/* Social media icons */}
                <a href="#" className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors">
                  <span className="text-blue-400">𝕏</span>
                </a>
                <a href="#" className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors">
                  <span className="text-red-400">▶</span>
                </a>
                <a href="#" className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors">
                  <span className="text-blue-600">f</span>
                </a>
                <a href="#" className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors">
                  <span className="text-pink-400">📷</span>
                </a>
              </div>
            </div>

            {/* Links */}
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Mobile App</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Chrome Extension</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Support</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="/privacy" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="/terms" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="/refund" className="text-gray-400 hover:text-white transition-colors">Refund Policy</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between">
            <p className="text-gray-400 text-sm">
              © 2025 Bundai. All rights reserved. Made with ❤️ for Japanese learners worldwide.
            </p>
            <div className="flex items-center space-x-6 mt-4 md:mt-0">
              <span className="text-gray-400 text-sm">🌟 4.9/5 rating</span>
              <span className="text-gray-400 text-sm">📱 10k+ downloads</span>
              <span className="text-gray-400 text-sm">🎯 90-day guarantee</span>
            </div>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(3deg); }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
        }
        
        ::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.1);
        }
        
        ::-webkit-scrollbar-thumb {
          background: linear-gradient(45deg, #3b82f6, #8b5cf6);
          border-radius: 4px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(45deg, #2563eb, #7c3aed);
        }
        
        /* Smooth scroll behavior */
        html {
          scroll-behavior: smooth;
        }
          .text-shadow {
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
}
      `}</style>

    </div>
  );
}