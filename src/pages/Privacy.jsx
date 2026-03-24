"use client";

import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../components/Button";
import { AnimatedBackground } from "../components/AnimatedBackground";


export default function Privacy() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white">
      <AnimatedBackground />
      {/* Header */}
      <nav className="border-b border-white/10 bg-black/20 backdrop-blur-lg">
        <div className="mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">文</span>
              </div>
              <span className="text-2xl font-bold">Bundai</span>
            </Link>
            <Link to="/">
              <Button variant="outline">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="mx-auto px-6 py-12">
        <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 p-8">
          <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
            Privacy Policy
          </h1>
          
          <div className="text-gray-300 space-y-6 leading-relaxed">
            <p className="text-sm text-gray-400">
              <strong>Last updated:</strong> January 2025
            </p>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">What We Collect</h2>
              <ul className="list-disc list-inside ml-4 space-y-2">
                <li>Account info (email, username, password)</li>
                <li>Learning progress and flashcard data</li>
                <li>Payment info (handled by Paddle, not us)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">How We Use Your Info</h2>
              <ul className="list-disc list-inside ml-4 space-y-2">
                <li>Provide and improve Bundai</li>
                <li>Personalize your learning experience</li>
                <li>Process payments</li>
                <li>Send service updates</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">We Don't Sell Your Data</h2>
              <p>We only share info with services we need to run Bundai (hosting, payments, analytics).</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Your Rights</h2>
              <ul className="list-disc list-inside ml-4 space-y-2">
                <li>View/update your account info anytime</li>
                <li>Delete your account and data</li>
                <li>Opt out of marketing emails</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Contact</h2>
              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <p><strong>Support:</strong> <a href="mailto:tech@bundai.app" className="text-blue-400 hover:text-blue-300 underline">tech@bundai.app</a></p>
              </div>
            </section>

            <div className="border-t border-white/10 pt-8 mt-12">
              <p className="text-sm text-gray-400">
                We reserve the right to update this policy. Changes will be posted on this page with an updated effective date.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}