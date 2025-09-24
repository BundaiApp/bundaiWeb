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
                We stand behind Bundai with a 30-day money-back guarantee. If you're not satisfied with your 
                Premium or Lifetime subscription, you can request a full refund within 30 days of purchase.
              </p>
            </div>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">1. Refund Eligibility</h2>
              
              <h3 className="text-xl font-semibold text-white mb-2">Premium Monthly Subscription ($19/month):</h3>
              <ul className="list-disc list-inside ml-4 space-y-2 mb-4">
                <li>Full refund available within 30 days of initial subscription</li>
                <li>Partial refunds may be considered for unused portions of the current billing cycle</li>
                <li>Refunds processed to original payment method within 5-7 business days</li>
              </ul>

              <h3 className="text-xl font-semibold text-white mb-2">Lifetime Plan ($199 one-time):</h3>
              <ul className="list-disc list-inside ml-4 space-y-2 mb-4">
                <li>Full refund available within 30 days of purchase</li>
                <li>No questions asked policy for the first 30 days</li>
                <li>After 30 days, refunds considered on a case-by-case basis</li>
              </ul>

              <h3 className="text-xl font-semibold text-white mb-2">Free Plan:</h3>
              <p className="ml-4 mb-4">
                Our free plan requires no payment, so refunds are not applicable. You can cancel anytime 
                without any charges.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">2. How to Request a Refund</h2>
              <p className="mb-4">To request a refund, you can:</p>
              
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mb-4">
                <h3 className="text-lg font-semibold text-blue-400 mb-2">Email Support:</h3>
                <p className="text-blue-300 mb-2">
                  Send an email to <a href="mailto:refunds@bundai.app" className="underline hover:text-blue-200">refunds@bundai.app</a> with:
                </p>
                <ul className="list-disc list-inside ml-4 space-y-1 text-blue-300">
                  <li>Your account email address</li>
                  <li>Order confirmation number or transaction ID</li>
                  <li>Reason for refund request (optional but helpful)</li>
                  <li>Preferred refund method</li>
                </ul>
              </div>

              <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4 mb-4">
                <h3 className="text-lg font-semibold text-purple-400 mb-2">Account Settings:</h3>
                <p className="text-purple-300">
                  Log in to your Bundai account and navigate to "Billing & Subscriptions" where you can 
                  find the "Request Refund" option for eligible purchases.
                </p>
              </div>

              <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-orange-400 mb-2">Live Chat Support:</h3>
                <p className="text-orange-300">
                  Use our in-app chat feature during business hours (Monday-Friday, 9 AM - 6 PM PST) 
                  for immediate assistance with refund requests.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">3. Processing Times</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <h3 className="text-lg font-semibold text-white mb-2">Credit/Debit Cards</h3>
                  <p className="text-gray-300">3-5 business days after approval</p>
                </div>
                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <h3 className="text-lg font-semibold text-white mb-2">PayPal</h3>
                  <p className="text-gray-300">1-3 business days after approval</p>
                </div>
                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <h3 className="text-lg font-semibold text-white mb-2">Bank Transfers</h3>
                  <p className="text-gray-300">5-7 business days after approval</p>
                </div>
                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <h3 className="text-lg font-semibold text-white mb-2">Digital Wallets</h3>
                  <p className="text-gray-300">1-2 business days after approval</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">4. What Happens After Cancellation</h2>
              <ul className="list-disc list-inside ml-4 space-y-2">
                <li>Your premium features will remain active until the end of your current billing period</li>
                <li>Your learning progress and data will be preserved for 90 days</li>
                <li>You can reactivate your subscription anytime during this period</li>
                <li>After 90 days, your account will revert to the free plan permanently</li>
                <li>You'll receive a confirmation email once the refund is processed</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">5. Non-Refundable Situations</h2>
              <p className="mb-4">Refunds may not be available in the following cases:</p>
              <ul className="list-disc list-inside ml-4 space-y-2">
                <li>Violation of our Terms of Service</li>
                <li>Fraudulent or abusive account activity</li>
                <li>Requests made after the 30-day guarantee period (except exceptional circumstances)</li>
                <li>Third-party charges or fees imposed by payment processors</li>
                <li>Purchases made through third-party app stores (subject to their refund policies)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">6. Partial Refunds</h2>
              <p className="mb-4">In some cases, we may offer partial refunds:</p>
              <ul className="list-disc list-inside ml-4 space-y-2">
                <li>Prorated refunds for unused portions of monthly subscriptions</li>
                <li>Service disruptions lasting more than 24 hours</li>
                <li>Feature changes that significantly impact your learning experience</li>
                <li>Technical issues that prevent normal use of the service</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">7. App Store Purchases</h2>
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-yellow-400 mb-2">Important Note:</h3>
                <p className="text-yellow-300 mb-2">
                  If you purchased your subscription through the Apple App Store or Google Play Store, 
                  refund requests must be processed through their respective platforms:
                </p>
                <ul className="list-disc list-inside ml-4 space-y-1 text-yellow-300">
                  <li><strong>Apple App Store:</strong> Request refunds through your Apple ID account or iTunes</li>
                  <li><strong>Google Play Store:</strong> Request refunds through Google Play Console</li>
                </ul>
                <p className="text-yellow-300 mt-2">
                  We cannot process direct refunds for app store purchases, but our support team can 
                  assist you with the app store refund process.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">8. Dispute Resolution</h2>
              <p className="mb-4">
                If you're not satisfied with our refund decision, you can:
              </p>
              <ul className="list-disc list-inside ml-4 space-y-2">
                <li>Request a review from our customer service manager</li>
                <li>Provide additional documentation supporting your refund request</li>
                <li>Escalate to our dispute resolution team</li>
                <li>Contact your credit card company or payment provider</li>
              </ul>
              <p className="mt-4">
                We're committed to fair and reasonable resolutions for all refund disputes.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">9. Alternative Solutions</h2>
              <p className="mb-4">
                Before requesting a refund, consider these alternatives that might resolve your concerns:
              </p>
              <ul className="list-disc list-inside ml-4 space-y-2">
                <li><strong>Account Issues:</strong> Our support team can help with technical problems</li>
                <li><strong>Learning Difficulties:</strong> We offer personalized learning path adjustments</li>
                <li><strong>Feature Requests:</strong> We regularly update Bundai based on user feedback</li>
                <li><strong>Temporary Break:</strong> You can pause your subscription instead of canceling</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">10. Contact Information</h2>
              <p className="mb-4">
                For refund requests or questions about this policy, contact us:
              </p>
              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <p><strong>Refunds Team:</strong> <a href="mailto:refunds@bundai.app" className="text-blue-400 hover:text-blue-300 underline">refunds@bundai.app</a></p>
                <p><strong>General Support:</strong> <a href="mailto:support@bundai.app" className="text-blue-400 hover:text-blue-300 underline">support@bundai.app</a></p>
                <p><strong>Business Hours:</strong> Monday-Friday, 9 AM - 6 PM PST</p>
                <p><strong>Response Time:</strong> Within 24 hours for refund requests</p>
              </div>
            </section>

            <div className="border-t border-white/10 pt-8 mt-12">
              <p className="text-sm text-gray-400">
                This refund policy is designed to be fair to both our users and our business. We reserve 
                the right to update this policy, and any changes will be communicated via email and posted 
                on our website with an updated effective date.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}