import { Header } from '../components/Header/Header';
import { Footer } from '../components/Footer/Footer';

export function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      
      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        {/* Title */}
        <h1 className="text-4xl font-bold text-gray-900 text-center mb-2">
          Privacy Policy
        </h1>
        <p className="text-sm text-gray-600 text-center mb-12">
          Last Updated: February 10, 2025
        </p>

        {/* Content */}
        <div className="space-y-8 text-gray-700">
          {/* Introduction */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Introduction
            </h2>
            <p className="mb-4 leading-relaxed">
              At DigitalQatalyst <span className="font-medium">("DQ," "we," "us," or "our")</span>, we prioritize the privacy and security of our users <span className="font-medium">("you," "your")</span>. 
              This Privacy Policy outlines how we collect, use, and protect your personal information when you interact with 
              our website <span className="font-medium">("Site")</span>.
            </p>
            <p className="leading-relaxed">
              By using the Site, you consent to the practices described in this policy.
            </p>
          </section>

          {/* Information We Collect */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Information We Collect
            </h2>
            <p className="mb-4 leading-relaxed">
              We may collect the following types of information:
            </p>
            <ul className="list-disc pl-6 space-y-3 leading-relaxed">
              <li>
                <span className="font-medium">Personal Information:</span> Includes your name, email address, phone number, and other details you provide when 
                filling out forms or contacting us.
              </li>
              <li>
                <span className="font-medium">Usage Data:</span> Includes information about how you access and interact with the Site, such as IP addresses, 
                browser type, and pages visited.
              </li>
              <li>
                <span className="font-medium">Cookies and Tracking Technologies:</span> We use cookies to enhance your browsing experience and gather 
                analytics.
              </li>
            </ul>
          </section>

          {/* How We Use Your Information */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              How We Use Your Information
            </h2>
            <p className="mb-4 leading-relaxed">
              We use the information collected for the following purposes:
            </p>
            <ul className="list-disc pl-6 space-y-2 leading-relaxed">
              <li>To provide, operate, and improve our Site and services.</li>
              <li>To respond to your inquiries and communicate with you.</li>
              <li>To personalize your experience and display relevant content.</li>
              <li>To analyze website performance and usage trends.</li>
              <li>To ensure security and prevent fraudulent activities.</li>
            </ul>
          </section>

          {/* Sharing Your Information */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Sharing Your Information
            </h2>
            <p className="mb-4 leading-relaxed">
              We do not sell, rent, or trade your personal information. However, we may share your information with:
            </p>
            <ul className="list-disc pl-6 space-y-3 leading-relaxed">
              <li>
                <span className="font-medium">Service Providers:</span> Third-party vendors who assist us in operating our Site or providing services, subject to 
                confidentiality agreements.
              </li>
              <li>
                <span className="font-medium">Legal Compliance:</span> Authorities or organizations when required to comply with legal obligations or enforce our 
                rights.
              </li>
              <li>
                <span className="font-medium">Business Transfers:</span> In case of mergers, acquisitions, or sales of assets, your information may be transferred 
                to the relevant parties.
              </li>
            </ul>
          </section>

          {/* Cookies and Tracking Technologies */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Cookies and Tracking Technologies
            </h2>
            <p className="mb-4 leading-relaxed">
              We use cookies and similar technologies to:
            </p>
            <ul className="list-disc pl-6 space-y-2 leading-relaxed">
              <li>Recognize returning visitors.</li>
              <li>Understand and save user preferences for future visits.</li>
              <li>Compile aggregate data about Site traffic and interactions for optimization.</li>
            </ul>
            <p className="mt-4 leading-relaxed">
              You can manage your cookie preferences through your browser settings.
            </p>
          </section>

          {/* Data Security */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Data Security
            </h2>
            <p className="leading-relaxed">
              We implement appropriate technical and organizational measures to protect your personal information from 
              unauthorized access, disclosure, or alteration. However, no method of transmission over the Internet is 
              completely secure, and we cannot guarantee absolute security.
            </p>
          </section>

          {/* Third-Party Links */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Third-Party Links
            </h2>
            <p className="leading-relaxed">
              Our Site may contain links to third-party websites. We are not responsible for the privacy practices or content of 
              those websites. We encourage you to review their privacy policies.
            </p>
          </section>

          {/* Changes to This Policy */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Changes to This Policy
            </h2>
            <p className="leading-relaxed">
              We reserve the right to update this Privacy Policy at any time. Changes will be effective upon posting to the Site. 
              Your continued use of the Site after changes are posted constitutes your acceptance of the revised policy.
            </p>
          </section>
        </div>
      </main>

      <Footer isLoggedIn={false} />
    </div>
  );
}
