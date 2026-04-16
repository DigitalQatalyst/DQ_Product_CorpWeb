import type { Metadata } from "next";
import { LegalPage } from "@/features/legal/LegalPage";

export const metadata: Metadata = { title: "Privacy Policy | DigitalQatalyst" };

export default function Page() {
  return (
    <LegalPage
      title="Privacy Policy"
      lastUpdated="February 10, 2025"
      sections={[
        {
          title: "Introduction",
          content: (
            <>
              <p className="mb-4 leading-relaxed">
                At DigitalQatalyst <strong className="text-foreground">("DQ," "we," "us," or "our")</strong>, we prioritize the privacy and security of our users <strong className="text-foreground">("you," "your")</strong>. This Privacy Policy outlines how we collect, use, and protect your personal information when you interact with our website <strong className="text-foreground">("Site")</strong>.
              </p>
              <p className="leading-relaxed">By using the Site, you consent to the practices described in this policy.</p>
            </>
          ),
        },
        {
          title: "Information We Collect",
          content: (
            <>
              <p className="mb-4 leading-relaxed">We may collect the following types of information:</p>
              <ul className="list-disc pl-6 space-y-3 leading-relaxed">
                <li><strong className="text-foreground">Personal Information:</strong> Includes your name, email address, phone number, and other details you provide when filling out forms or contacting us.</li>
                <li><strong className="text-foreground">Usage Data:</strong> Includes information about how you access and interact with the Site, such as IP addresses, browser type, and pages visited.</li>
                <li><strong className="text-foreground">Cookies and Tracking Technologies:</strong> We use cookies to enhance your browsing experience and gather analytics.</li>
              </ul>
            </>
          ),
        },
        {
          title: "How We Use Your Information",
          content: (
            <>
              <p className="mb-4 leading-relaxed">We use the information collected for the following purposes:</p>
              <ul className="list-disc pl-6 space-y-2 leading-relaxed">
                <li>To provide, operate, and improve our Site and services.</li>
                <li>To respond to your inquiries and communicate with you.</li>
                <li>To personalize your experience and display relevant content.</li>
                <li>To analyze website performance and usage trends.</li>
                <li>To ensure security and prevent fraudulent activities.</li>
              </ul>
            </>
          ),
        },
        {
          title: "Sharing Your Information",
          content: (
            <>
              <p className="mb-4 leading-relaxed">We do not sell, rent, or trade your personal information. However, we may share your information with:</p>
              <ul className="list-disc pl-6 space-y-3 leading-relaxed">
                <li><strong className="text-foreground">Service Providers:</strong> Third-party vendors who assist us in operating our Site or providing services, subject to confidentiality agreements.</li>
                <li><strong className="text-foreground">Legal Compliance:</strong> Authorities or organizations when required to comply with legal obligations or enforce our rights.</li>
                <li><strong className="text-foreground">Business Transfers:</strong> In case of mergers, acquisitions, or sales of assets, your information may be transferred to the relevant parties.</li>
              </ul>
            </>
          ),
        },
        {
          title: "Cookies and Tracking Technologies",
          content: (
            <>
              <p className="mb-4 leading-relaxed">We use cookies and similar technologies to:</p>
              <ul className="list-disc pl-6 space-y-2 leading-relaxed">
                <li>Recognize returning visitors.</li>
                <li>Understand and save user preferences for future visits.</li>
                <li>Compile aggregate data about Site traffic and interactions for optimization.</li>
              </ul>
              <p className="mt-4 leading-relaxed">You can manage your cookie preferences through your browser settings.</p>
            </>
          ),
        },
        {
          title: "Data Security",
          content: (
            <p className="leading-relaxed">
              We implement appropriate technical and organizational measures to protect your personal information from unauthorized access, disclosure, or alteration. However, no method of transmission over the Internet is completely secure, and we cannot guarantee absolute security.
            </p>
          ),
        },
        {
          title: "Third-Party Links",
          content: (
            <p className="leading-relaxed">
              Our Site may contain links to third-party websites. We are not responsible for the privacy practices or content of those websites. We encourage you to review their privacy policies.
            </p>
          ),
        },
        {
          title: "Changes to This Policy",
          content: (
            <p className="leading-relaxed">
              We reserve the right to update this Privacy Policy at any time. Changes will be effective upon posting to the Site. Your continued use of the Site after changes are posted constitutes your acceptance of the revised policy.
            </p>
          ),
        },
      ]}
    />
  );
}
