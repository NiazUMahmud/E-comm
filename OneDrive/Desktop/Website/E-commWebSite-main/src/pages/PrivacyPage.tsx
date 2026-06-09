import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Helmet>
        <title>Privacy Policy — EComm</title>
        <meta name="description" content="Learn how EComm collects, uses, and protects your personal information." />
        <link rel="canonical" href="https://ecommnexora.netlify.app/privacy" />
      </Helmet>

      <nav className="text-sm text-gray-500 mb-8">
        <Link to="/" className="hover:text-blue-600">Home</Link>
        <span className="mx-2">/</span>
        <span>Privacy Policy</span>
      </nav>

      <h1 className="text-4xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
      <p className="text-gray-500 mb-10">Last updated: June 2025</p>

      <div className="prose prose-gray max-w-none space-y-8 text-gray-700 leading-relaxed">
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Information We Collect</h2>
          <p>We collect information you provide directly, such as when you create an account or place an order:</p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li><strong>Account data:</strong> name, email address, password (hashed).</li>
            <li><strong>Order data:</strong> shipping address, order history, payment method details (processed by Stripe — we never store raw card numbers).</li>
            <li><strong>Usage data:</strong> pages visited, search queries, browser type, and IP address collected automatically via analytics.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">2. How We Use Your Information</h2>
          <p>We use the information we collect to:</p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>Process and fulfill your orders and send order confirmations.</li>
            <li>Manage your account and authenticate your identity.</li>
            <li>Send transactional emails (order updates, shipping notifications).</li>
            <li>Improve and personalize the shopping experience.</li>
            <li>Detect and prevent fraud or abuse.</li>
            <li>Comply with legal obligations.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">3. Sharing Your Information</h2>
          <p>We do not sell your personal data. We share information only with:</p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li><strong>Stripe</strong> — for secure payment processing.</li>
            <li><strong>Supabase</strong> — our database and authentication infrastructure.</li>
            <li><strong>Netlify</strong> — our hosting and serverless function provider.</li>
            <li>Law enforcement or government bodies when required by law.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Cookies</h2>
          <p>We use essential cookies to maintain your session and cart. We do not use tracking or advertising cookies. You can disable cookies in your browser settings, but doing so may affect core site functionality.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Data Retention</h2>
          <p>We retain your account data for as long as your account is active. Order records are retained for 7 years to comply with financial regulations. You may request deletion of your account data at any time (subject to legal retention requirements).</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">6. Security</h2>
          <p>We use industry-standard security measures including TLS encryption, hashed passwords, and row-level security on our database. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">7. Your Rights</h2>
          <p>Depending on your jurisdiction, you may have the right to access, correct, or delete your personal data; restrict or object to its processing; and data portability. To exercise these rights, contact us at <a href="mailto:support@ecomm.com" className="text-blue-600 hover:text-blue-800">support@ecomm.com</a>.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">8. Children's Privacy</h2>
          <p>Our Site is not directed to children under 13. We do not knowingly collect personal information from children. If you believe we have inadvertently collected such information, please contact us and we will delete it promptly.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">9. Changes to This Policy</h2>
          <p>We may update this Privacy Policy from time to time. We will notify you of significant changes by email or by posting a notice on the Site. Continued use after changes constitutes acceptance.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">10. Contact</h2>
          <p>For privacy-related questions or requests, contact us at <a href="mailto:support@ecomm.com" className="text-blue-600 hover:text-blue-800">support@ecomm.com</a>.</p>
        </section>
      </div>

      <div className="mt-12 pt-8 border-t border-gray-200 text-sm text-gray-500">
        <Link to="/terms" className="text-blue-600 hover:text-blue-800">Terms of Service</Link>
        <span className="mx-2">·</span>
        <Link to="/" className="text-blue-600 hover:text-blue-800">Back to Home</Link>
      </div>
    </div>
  );
}
