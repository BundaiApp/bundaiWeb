"use client";

import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../components/Button";
import { AnimatedBackground } from "../components/AnimatedBackground";


export default function Terms() {
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
          <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Terms of Service
          </h1>
          
          <div className="text-gray-300 space-y-6 leading-relaxed">
            <p className="text-sm text-gray-400">
              <strong>Last updated:</strong> January 2025
            </p>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">1. Agreement to Terms</h2>
              <p>
                By accessing and using Bundai ("we," "our," or "us"), you accept and agree to be bound by the terms 
                and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">2. Description of Service</h2>
              <p>
                Bundai is a Japanese language learning platform that provides:
              </p>
              <ul className="list-disc list-inside ml-4 space-y-2 mt-2">
                <li>Kanji and vocabulary learning tools</li>
                <li>Spaced repetition system (SRS) for memory retention</li>
                <li>YouTube integration for immersive learning</li>
                <li>Mobile applications and browser extensions</li>
                <li>Progress tracking and analytics</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">3. User Accounts</h2>
              <p>
                To access certain features, you must create an account. You are responsible for:
              </p>
              <ul className="list-disc list-inside ml-4 space-y-2 mt-2">
                <li>Maintaining the confidentiality of your account credentials</li>
                <li>All activities that occur under your account</li>
                <li>Providing accurate and current information</li>
                <li>Notifying us immediately of any unauthorized use</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">4. Subscription and Payments</h2>
              <p>
                Bundai offers both free and premium subscription services:
              </p>
              <ul className="list-disc list-inside ml-4 space-y-2 mt-2">
                <li><strong>Free Plan:</strong> Limited access to basic features</li>
                <li><strong>Premium Plan:</strong> $19/month with full feature access</li>
                <li><strong>Lifetime Plan:</strong> $199 one-time payment</li>
              </ul>
              <p className="mt-4">
                Subscription fees are charged in advance and are non-refundable except as outlined in our Refund Policy.
                You may cancel your subscription at any time through your account settings.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">5. Acceptable Use</h2>
              <p>You agree not to:</p>
              <ul className="list-disc list-inside ml-4 space-y-2 mt-2">
                <li>Use the service for any illegal or unauthorized purpose</li>
                <li>Share your account credentials with others</li>
                <li>Attempt to reverse engineer or copy our software</li>
                <li>Distribute malware or engage in any form of cyber attack</li>
                <li>Violate any applicable laws or regulations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">6. Intellectual Property</h2>
              <p>
                All content, features, and functionality of Bundai, including but not limited to text, graphics, 
                logos, icons, images, audio clips, and software, are the exclusive property of Bundai and are 
                protected by copyright, trademark, and other intellectual property laws.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">7. Privacy Policy</h2>
              <p>
                Your privacy is important to us. Please review our Privacy Policy, which also governs your use 
                of the service, to understand our practices.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">8. Disclaimers and Limitation of Liability</h2>
              <p>
                Bundai is provided "as is" without any representations or warranties. We do not guarantee that:
              </p>
              <ul className="list-disc list-inside ml-4 space-y-2 mt-2">
                <li>The service will be uninterrupted or error-free</li>
                <li>All information will be accurate or up-to-date</li>
                <li>You will achieve specific learning outcomes</li>
              </ul>
              <p className="mt-4">
                Our total liability shall not exceed the amount you paid for the service in the 12 months 
                preceding the claim.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">9. Termination</h2>
              <p>
                We may terminate or suspend your account and access to the service immediately, without prior 
                notice, for conduct that we believe violates these Terms or is harmful to other users, us, or third parties.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">10. Changes to Terms</h2>
              <p>
                We reserve the right to modify these terms at any time. We will provide notice of significant 
                changes via email or through the service. Your continued use constitutes acceptance of the new terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">11. Governing Law</h2>
              <p>
                These Terms shall be governed by and construed in accordance with the laws of the jurisdiction 
                where Bundai is incorporated, without regard to conflict of law principles.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">12. Contact Information</h2>
              <p>
                If you have any questions about these Terms of Service, please contact us at:
              </p>
              <div className="mt-2">
                <p>Email: <a href="mailto:legal@bundai.app" className="text-blue-400 hover:text-blue-300 underline">legal@bundai.app</a></p>
                <p>Support: <a href="mailto:support@bundai.app" className="text-blue-400 hover:text-blue-300 underline">support@bundai.app</a></p>
              </div>
            </section>

            <div className="border-t border-white/10 pt-8 mt-12">
              <p className="text-sm text-gray-400">
                By using Bundai, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}