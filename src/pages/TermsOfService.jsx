import React from 'react';
import { FileText, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link 
            to="/"
            className="p-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <ArrowLeft size={20} />
          </Link>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-100 rounded-xl">
              <FileText className="text-green-600" size={28} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Terms of Service</h1>
              <p className="text-gray-600">Last updated: December 2024</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <div className="prose prose-lg max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Acceptance of Terms</h2>
              <p className="text-gray-700">
                By accessing and using LocalTravel, you accept and agree to be bound by the terms 
                and provision of this agreement. If you do not agree to these terms, please do not use our services.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. User Responsibilities</h2>
              <p className="text-gray-700 mb-4">As a user of our platform, you agree to:</p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>Provide accurate and truthful information</li>
                <li>Respect other users and their content</li>
                <li>Not post harmful, illegal, or offensive content</li>
                <li>Not misuse the platform for any unauthorized purposes</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Content Guidelines</h2>
              <p className="text-gray-700">
                All reviews and content submitted must be genuine and respectful. We reserve the 
                right to remove any content that violates our community guidelines.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Service Modifications</h2>
              <p className="text-gray-700">
                LocalTravel reserves the right to modify or discontinue any service at any time 
                without prior notice. We are not liable for any modification or suspension of services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Contact</h2>
              <p className="text-gray-700">
                For any questions regarding these terms, please contact us at:
              </p>
              <p className="text-blue-600 font-medium mt-2">legal@localtravel.com</p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;