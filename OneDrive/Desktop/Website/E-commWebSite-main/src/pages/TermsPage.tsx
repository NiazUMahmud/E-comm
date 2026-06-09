import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Helmet>
        <title>Terms of Service — EComm</title>
        <meta name="description" content="Read EComm's Terms of Service to understand your rights and responsibilities when using our platform." />
        <link rel="canonical" href="https://ecommnexora.netlify.app/terms" />
      </Helmet>

      <nav className="text-sm text-gray-500 mb-8">
        <Link to="/" className="hover:text-blue-600">Home</Link>
        <span className="mx-2">/</span>
        <span>Terms of Service</span>
      </nav>

      <h1 className="text-4xl font-bold text-gray-900 mb-2">Terms of Service</h1>
      <p className="text-gray-500 mb-10">Last updated: June 2025</p>

      <div className="prose prose-gray max-w-none space-y-8 text-gray-700 leading-relaxed">
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Acceptance of Terms</h2>
          <p>By accessing or using EComm ("the Site"), you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any part of these terms, you may not use our services.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">2. Use of the Site</h2>
          <p>You may use the Site only for lawful purposes and in accordance with these Terms. You agree not to:</p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>Use the Site in any way that violates applicable laws or regulations.</li>
            <li>Attempt to gain unauthorized access to any part of the Site or its servers.</li>
            <li>Transmit any unsolicited or unauthorized advertising or promotional material.</li>
            <li>Impersonate any person or entity or misrepresent your affiliation with any person or entity.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">3. Account Registration</h2>
          <p>To access certain features you must create an account. You are responsible for maintaining the confidentiality of your credentials and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Orders and Payments</h2>
          <p>All prices are in US dollars and exclude applicable taxes unless stated otherwise. We reserve the right to refuse or cancel any order at our discretion. Payment is processed securely via Stripe. By placing an order, you represent that you are authorized to use the payment method provided.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Shipping and Returns</h2>
          <p>We offer free standard shipping on all orders. Delivery times are estimates and not guaranteed. You may return eligible items within 30 days of receipt in their original, unused condition. Refunds are issued to the original payment method within 5–10 business days of receiving the returned item.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">6. Intellectual Property</h2>
          <p>All content on the Site — including text, graphics, logos, and software — is the property of EComm or its content suppliers and is protected by applicable intellectual property laws. You may not reproduce, distribute, or create derivative works without our express written permission.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">7. Disclaimer of Warranties</h2>
          <p>The Site is provided "as is" without warranty of any kind. We disclaim all warranties, express or implied, including but not limited to implied warranties of merchantability and fitness for a particular purpose.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">8. Limitation of Liability</h2>
          <p>To the fullest extent permitted by law, EComm shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the Site or services, even if we have been advised of the possibility of such damages.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">9. Changes to Terms</h2>
          <p>We reserve the right to modify these Terms at any time. Changes become effective when posted to this page. Continued use of the Site after changes constitutes acceptance of the new Terms.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">10. Contact</h2>
          <p>For questions about these Terms, please contact us at <a href="mailto:support@ecomm.com" className="text-blue-600 hover:text-blue-800">support@ecomm.com</a>.</p>
        </section>
      </div>

      <div className="mt-12 pt-8 border-t border-gray-200 text-sm text-gray-500">
        <Link to="/privacy" className="text-blue-600 hover:text-blue-800">Privacy Policy</Link>
        <span className="mx-2">·</span>
        <Link to="/" className="text-blue-600 hover:text-blue-800">Back to Home</Link>
      </div>
    </div>
  );
}
