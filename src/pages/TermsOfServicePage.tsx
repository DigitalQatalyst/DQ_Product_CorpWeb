import { Header } from '../components/Header/Header';
import { Footer } from '../components/Footer/Footer';

export function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      
      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        {/* Title */}
        <h1 className="text-4xl font-bold text-gray-900 text-center mb-2">
          Terms of Service
        </h1>
        <p className="text-sm text-gray-600 text-center mb-12">
          Last Updated: February 10, 2025
        </p>

        {/* Content */}
        <div className="space-y-8 text-gray-700">
          {/* About Section */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              About DigitalQatalyst.com
            </h2>
            <p className="mb-4 leading-relaxed">
              DigitalQatalyst.com <span className="font-medium">("DQ," "we," "us," or "our")</span> is a premier platform dedicated to empowering businesses 
              through digital transformation. We provide cutting-edge tools, resources, and frameworks designed to help 
              organizations thrive in the digital age by accelerating their digital transformation journeys and unlocking a 
              wealth of insights and solutions tailored to meet the demands of the modern business landscape.
            </p>
            <p className="leading-relaxed">
              By accessing or using our website <span className="font-medium">("Site")</span>, you agree to comply with and be bound by these Terms of Service 
              <span className="font-medium">("Terms")</span>. If you do not agree to these Terms, please refrain from using the Site.
            </p>
          </section>

          {/* Use of the Site */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Use of the Site
            </h2>
            <p className="mb-4 leading-relaxed">
              You agree to use the <span className="font-medium">Site</span> solely for lawful purposes and in compliance with all applicable laws and regulations. 
              You may not:
            </p>
            <ul className="list-disc pl-6 space-y-2 leading-relaxed">
              <li>Use the Site in any manner that disrupts, damages, or impairs the Site's functionality.</li>
              <li>Engage in unauthorized access, interference, or reverse engineering of the Site.</li>
              <li>Upload, transmit, or distribute malicious software or unauthorized content.</li>
            </ul>
          </section>

          {/* Intellectual Property */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Intellectual Property
            </h2>
            <p className="leading-relaxed">
              All content on the <span className="font-medium">Site</span>, including but not limited to text, graphics, logos, images, and software, is the property of 
              DigitalQatalyst or its licensors and is protected by copyright, trademark, and other intellectual property laws. 
              Unauthorized use of any content is strictly prohibited.
            </p>
          </section>

          {/* User Submissions */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              User Submissions
            </h2>
            <p className="leading-relaxed">
              By submitting content to the <span className="font-medium">Site</span>, including inquiries or feedback, you grant us a non-exclusive, worldwide, 
              royalty-free license to use, reproduce, and modify such content for our business purposes. You warrant that your 
              submissions do not infringe on any third-party rights.
            </p>
          </section>

          {/* Privacy Policy */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Privacy Policy
            </h2>
            <p className="leading-relaxed">
              Your use of the <span className="font-medium">Site</span> is subject to our Privacy Policy, which outlines how we collect, use, and protect your 
              personal information. Please review our{' '}
              <a href="/privacy-policy" className="text-primary hover:underline font-medium">
                Privacy Policy
              </a>{' '}
              for more details.
            </p>
          </section>

          {/* Third-Party Links */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Third-Party Links
            </h2>
            <p className="leading-relaxed">
              The <span className="font-medium">Site</span> may include links to third-party websites or services. DigitalQatalyst is not responsible for the content, 
              policies, or practices of any third-party websites. Access and use of such websites are at your own risk.
            </p>
          </section>

          {/* Disclaimers */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Disclaimers
            </h2>
            <p className="leading-relaxed">
              The <span className="font-medium">Site</span> and its content are provided <span className="font-medium">"as is"</span> without warranties of any kind, either express or implied. 
              DigitalQatalyst does not warrant that the Site will be error-free, secure, or available at all times. We disclaim all 
              liability for any loss or damage arising from your use of the Site.
            </p>
          </section>

          {/* Termination */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Termination
            </h2>
            <p className="leading-relaxed">
              We reserve the right to terminate or suspend your access to the Site without notice if you violate these Terms or 
              engage in any conduct that harms DigitalQatalyst or its users.
            </p>
          </section>

          {/* Governing Law */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Governing Law
            </h2>
            <p className="leading-relaxed">
              These Terms are governed by and construed in accordance with the laws of the United Arab Emirates (UAE), without regard to 
              its conflict of law principles. Any disputes arising from these Terms shall be resolved exclusively in the courts 
              located in the United Arab Emirates (UAE).
            </p>
          </section>
        </div>
      </main>

      <Footer isLoggedIn={false} />
    </div>
  );
}
