import React, { useState } from 'react';
import { Heart, MapPin, Mail, Phone, X } from 'lucide-react';

const Footer = () => {
  const [activeModal, setActiveModal] = useState(null);

  const openModal = (modalName) => setActiveModal(modalName);
  const closeModal = () => setActiveModal(null);

  // Modal components
  const PrivacyModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Privacy Policy</h2>
            <button 
              onClick={closeModal}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={24} />
            </button>
          </div>
          
          <div className="space-y-4 text-gray-700">
            <section>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Information We Collect</h3>
              <p>We collect information you provide directly to us, including your name, email address, and any content you submit to our platform.</p>
            </section>
            
            <section>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">How We Use Your Information</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>Provide and maintain our services</li>
                <li>Personalize your experience</li>
                <li>Communicate with you about updates</li>
                <li>Ensure platform security</li>
              </ul>
            </section>
            
            <section>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Data Protection</h3>
              <p>We implement appropriate security measures to protect your personal information against unauthorized access or disclosure.</p>
            </section>
            
            <div className="mt-6 pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-500">Last updated: September 2025</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const TermsModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Terms of Service</h2>
            <button 
              onClick={closeModal}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={24} />
            </button>
          </div>
          
          <div className="space-y-4 text-gray-700">
            <section>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Acceptance of Terms</h3>
              <p>By accessing and using LocalTravel, you accept and agree to be bound by the terms and provision of this agreement.</p>
            </section>
            
            <section>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">User Responsibilities</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>Provide accurate information when creating an account</li>
                <li>Maintain the security of your password</li>
                <li>Use the service in compliance with all applicable laws</li>
                <li>Respect other users and their content</li>
              </ul>
            </section>
            
            <section>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Content Guidelines</h3>
              <p>Users are responsible for the content they post. We reserve the right to remove any content that violates our community guidelines.</p>
            </section>
            
            <section>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Service Modifications</h3>
              <p>We reserve the right to modify or discontinue the service at any time with or without notice.</p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );

  const ContactModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Contact Us</h2>
            <button 
              onClick={closeModal}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={24} />
            </button>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
              <Mail className="text-blue-600" size={20} />
              <div>
                <p className="font-semibold text-gray-900">Email</p>
                <p className="text-blue-600">hello@localtravel.com</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
              <Phone className="text-green-600" size={20} />
              <div>
                <p className="font-semibold text-gray-900">Phone</p>
                <p className="text-green-600">+91 81022-63889</p>
              </div>
            </div>
            
            <div className="p-3 bg-purple-50 rounded-lg">
              <p className="font-semibold text-gray-900 mb-2">Office Hours</p>
              <p className="text-purple-600">Monday - Friday: 9:00 AM - 6:00 PM EST</p>
            </div>
            
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">
                We typically respond to all inquiries within 24 hours during business days.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <footer className="bg-gray-900 text-white mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Brand */}
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded flex items-center justify-center">
                <MapPin className="text-white" size={12} />
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                LocalTravel
              </span>
            </div>

            {/* Copyright */}
            <p className="text-gray-400 text-sm flex items-center gap-1">
              © 2025 LocalTravel. Made with <Heart className="text-red-500" size={12} fill="currentColor" /> for travelers
            </p>

            {/* Links - Changed from <a> to <button> */}
            <div className="flex gap-4 text-sm text-gray-400">
              <button 
                onClick={() => openModal('privacy')}
                className="hover:text-white transition-colors duration-200 hover:underline"
              >
                Privacy
              </button>
              <button 
                onClick={() => openModal('terms')}
                className="hover:text-white transition-colors duration-200 hover:underline"
              >
                Terms
              </button>
              <button 
                onClick={() => openModal('contact')}
                className="hover:text-white transition-colors duration-200 hover:underline"
              >
                Contact
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* Render active modal */}
      {activeModal === 'privacy' && <PrivacyModal />}
      {activeModal === 'terms' && <TermsModal />}
      {activeModal === 'contact' && <ContactModal />}
    </>
  );
};

export default Footer;