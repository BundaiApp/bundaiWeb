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
              <h2 className="text-2xl font-semibold text-white mb-4">1. Information We Collect</h2>
              <p className="mb-4">
                We collect information you provide directly to us and information we obtain automatically when you use Bundai.
              </p>
              
              <h3 className="text-xl font-semibold text-white mb-2">Information You Provide:</h3>
              <ul className="list-disc list-inside ml-4 space-y-2">
                <li>Account information (email address, username, password)</li>
                <li>Profile information (learning preferences, native language)</li>
                <li>Payment information (processed securely by third-party providers)</li>
                <li>Communications with customer support</li>
                <li>Feedback and survey responses</li>
              </ul>

              <h3 className="text-xl font-semibold text-white mb-2 mt-4">Information We Collect Automatically:</h3>
              <ul className="list-disc list-inside ml-4 space-y-2">
                <li>Learning progress and performance data</li>
                <li>Device and browser information</li>
                <li>IP address and location data</li>
                <li>Usage patterns and feature interactions</li>
                <li>Crash reports and error logs</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">2. How We Use Your Information</h2>
              <p className="mb-4">We use the collected information to:</p>
              <ul className="list-disc list-inside ml-4 space-y-2">
                <li>Provide and improve our language learning services</li>
                <li>Personalize your learning experience with AI-powered recommendations</li>
                <li>Process payments and manage your subscription</li>
                <li>Send you service updates and educational content</li>
                <li>Provide customer support and respond to inquiries</li>
                <li>Analyze usage patterns to improve our platform</li>
                <li>Ensure security and prevent fraud</li>
                <li>Comply with legal obligations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">3. Information Sharing</h2>
              <p className="mb-4">We do not sell your personal information. We may share your information in the following circumstances:</p>
              
              <h3 className="text-xl font-semibold text-white mb-2">Service Providers:</h3>
              <p className="mb-2">We work with trusted third-party providers for:</p>
              <ul className="list-disc list-inside ml-4 space-y-2">
                <li>Payment processing (Stripe, PayPal)</li>
                <li>Email delivery (SendGrid, Mailchimp)</li>
                <li>Analytics (Google Analytics, Mixpanel)</li>
                <li>Cloud hosting (AWS, Google Cloud)</li>
                <li>Customer support (Zendesk, Intercom)</li>
              </ul>

              <h3 className="text-xl font-semibold text-white mb-2 mt-4">Legal Requirements:</h3>
              <p>We may disclose your information if required by law or to protect our rights and safety.</p>

              <h3 className="text-xl font-semibold text-white mb-2 mt-4">Business Transfers:</h3>
              <p>In the event of a merger, acquisition, or sale, your information may be transferred as part of the transaction.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">4. Data Security</h2>
              <p className="mb-4">We implement industry-standard security measures to protect your information:</p>
              <ul className="list-disc list-inside ml-4 space-y-2">
                <li>Encryption of data in transit and at rest</li>
                <li>Regular security audits and vulnerability assessments</li>
                <li>Access controls and authentication requirements</li>
                <li>Secure development practices</li>
                <li>Employee training on data protection</li>
              </ul>
              <p className="mt-4">
                However, no method of transmission over the internet is 100% secure. While we strive to protect 
                your information, we cannot guarantee its absolute security.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">5. Your Rights and Choices</h2>
              <p className="mb-4">You have the following rights regarding your personal information:</p>
              
              <h3 className="text-xl font-semibold text-white mb-2">Access and Correction:</h3>
              <p className="mb-2">You can view and update your account information through your profile settings.</p>

              <h3 className="text-xl font-semibold text-white mb-2 mt-4">Data Portability:</h3>
              <p className="mb-2">You can request a copy of your learning data in a machine-readable format.</p>

              <h3 className="text-xl font-semibold text-white mb-2 mt-4">Deletion:</h3>
              <p className="mb-2">You can delete your account and associated data through your account settings or by contacting support.</p>

              <h3 className="text-xl font-semibold text-white mb-2 mt-4">Marketing Communications:</h3>
              <p className="mb-2">You can opt out of marketing emails by clicking the unsubscribe link or updating your preferences.</p>

              <h3 className="text-xl font-semibold text-white mb-2 mt-4">Cookies:</h3>
              <p className="mb-2">You can control cookie preferences through your browser settings.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">6. International Data Transfers</h2>
              <p>
                Your information may be transferred to and processed in countries other than your own. We ensure 
                appropriate safeguards are in place to protect your data in accordance with applicable privacy laws, 
                including GDPR for European users.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">7. Data Retention</h2>
              <p className="mb-4">We retain your information for as long as necessary to:</p>
              <ul className="list-disc list-inside ml-4 space-y-2">
                <li>Provide our services and maintain your account</li>
                <li>Comply with legal obligations</li>
                <li>Resolve disputes and enforce our agreements</li>
                <li>Improve our services through analytics</li>
              </ul>
              <p className="mt-4">
                Learning progress data may be retained longer to provide continuity in your language learning journey, 
                even if you temporarily deactivate your account.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">8. Children's Privacy</h2>
              <p>
                Bundai is not directed to children under 13. We do not knowingly collect personal information from 
                children under 13. If you are a parent or guardian and believe your child has provided us with personal 
                information, please contact us so we can delete such information.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">9. Third-Party Services</h2>
              <p className="mb-4">
                Our service may contain links to third-party websites or integrate with third-party services (like YouTube). 
                This privacy policy does not apply to such third-party services. We encourage you to review their privacy policies.
              </p>
              
              <h3 className="text-xl font-semibold text-white mb-2">YouTube Integration:</h3>
              <p>
                Our YouTube extension helps you learn from Japanese content. When you use this feature, YouTube's 
                privacy policy also applies to your interactions with YouTube content.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">10. Changes to This Privacy Policy</h2>
              <p>
                We may update this privacy policy from time to time. We will notify you of any material changes 
                via email or through our service. Your continued use of Bundai after the changes take effect 
                constitutes acceptance of the updated policy.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">11. Contact Us</h2>
              <p className="mb-4">
                If you have any questions about this Privacy Policy or our data practices, please contact us:
              </p>
              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <p><strong>Email:</strong> <a href="mailto:privacy@bundai.app" className="text-blue-400 hover:text-blue-300 underline">privacy@bundai.app</a></p>
                <p><strong>Support:</strong> <a href="mailto:support@bundai.app" className="text-blue-400 hover:text-blue-300 underline">support@bundai.app</a></p>
                <p><strong>Data Protection Officer:</strong> <a href="mailto:dpo@bundai.app" className="text-blue-400 hover:text-blue-300 underline">dpo@bundai.app</a></p>
              </div>
            </section>

            <div className="border-t border-white/10 pt-8 mt-12">
              <p className="text-sm text-gray-400">
                By using Bundai, you acknowledge that you have read and understood this Privacy Policy and consent 
                to the collection, use, and sharing of your information as described herein.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}