"use client";

import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../components/Button";
import { AnimatedBackground } from "../components/AnimatedBackground";

export default function Refund() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white">
      <AnimatedBackground/>
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
          <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
            Refund Policy
          </h1>
          
          <div className="text-gray-300 space-y-6 leading-relaxed">
            <p className="text-sm text-gray-400">
              <strong>Last updated:</strong> January 2025
            </p>

            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 mb-6">
              <h2 className="text-lg font-semibold text-green-400 mb-2">30-Day Money-Back Guarantee</h2>
              <p className="text-green-300">
                If you're not satisfied with your Premium or Lifetime subscription, you can request a full refund within 30 days of purchase.
              </p>
            </div>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">How to Request a Refund</h2>
              <p className="mb-4">
                Email us at <a href="mailto:tech@bundai.app" className="text-blue-400 hover:text-blue-300 underline">tech@bundai.app</a> with your account email and order confirmation number.
              </p>
              <p>
                Refunds are processed to your original payment method within 5-7 business days.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Contact</h2>
              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <p><strong>Support:</strong> <a href="mailto:tech@bundai.app" className="text-blue-400 hover:text-blue-300 underline">tech@bundai.app</a></p>
                <p><strong>Business Hours:</strong> Monday-Friday, 9 AM - 6 PM PST</p>
                <p><strong>Response Time:</strong> Within 24 hours</p>
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