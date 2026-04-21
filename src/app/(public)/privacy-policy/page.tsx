import type { Metadata } from "next";
import { LegalPage } from "@/features/legal/LegalPage";

export const metadata: Metadata = { title: "Privacy Notice | DigitalQatalyst" };

export default function Page() {
  return (
    <LegalPage
      title="Privacy Notice"
      lastUpdated="February 10, 2025"
      sections={[
        {
          title: "Overview",
          content: (
            <p className="leading-relaxed">
              This Privacy Notice explains how Digital Qatalyst collects, uses, and protects personal data when you use our website, contact us, submit a form, or interact with us online.
            </p>
          ),
        },
        {
          title: "Who We Are",
          content: (
            <p className="leading-relaxed">
              Digital Qatalyst is responsible for personal data collected through this website.
            </p>
          ),
        },
        {
          title: "Data We Collect",
          content: (
            <>
              <p className="mb-4 leading-relaxed">We may collect:</p>
              <ul className="list-disc pl-6 space-y-3 leading-relaxed">
                <li>your name, company name, job title, email address, phone number, and any information you submit through forms or emails;</li>
                <li>technical information such as IP address, browser type, device data, and website usage information;</li>
                <li>cookie and analytics data, where applicable.</li>
              </ul>
            </>
          ),
        },
        {
          title: "How We Use Your Data",
          content: (
            <>
              <p className="mb-4 leading-relaxed">We may use your personal data to:</p>
              <ul className="list-disc pl-6 space-y-2 leading-relaxed">
                <li>respond to your inquiries or requests;</li>
                <li>provide information about our services, products, content, or events;</li>
                <li>operate, maintain, and improve our website;</li>
                <li>manage communications and business relationships;</li>
                <li>comply with legal or regulatory obligations.</li>
              </ul>
            </>
          ),
        },
        {
          title: "Legal Basis",
          content: (
            <>
              <p className="mb-4 leading-relaxed">Where applicable, we process personal data on the basis of:</p>
              <ul className="list-disc pl-6 space-y-2 leading-relaxed">
                <li>your consent;</li>
                <li>our legitimate interests;</li>
                <li>contractual necessity;</li>
                <li>legal obligations.</li>
              </ul>
            </>
          ),
        },
        {
          title: "Cookies",
          content: (
            <p className="leading-relaxed">
              We may use cookies and similar technologies to operate the website, understand usage, and improve performance. Where required by law, we will request consent for non-essential cookies.
            </p>
          ),
        },
        {
          title: "Sharing of Data",
          content: (
            <>
              <p className="mb-4 leading-relaxed">We may share personal data with:</p>
              <ul className="list-disc pl-6 space-y-2 leading-relaxed">
                <li>our affiliates;</li>
                <li>service providers supporting our website, systems, communications, or analytics;</li>
                <li>professional advisers or authorities where required by law.</li>
              </ul>
            </>
          ),
        },
        {
          title: "International Transfers",
          content: (
            <p className="leading-relaxed">
              Because we operate across multiple locations and may use international service providers, personal data may be transferred outside your country. Where required, we apply appropriate safeguards.
            </p>
          ),
        },
        {
          title: "Retention",
          content: (
            <p className="leading-relaxed">
              We retain personal data only for as long as necessary for the purposes described in this Notice, or as required by law.
            </p>
          ),
        },
        {
          title: "Your Rights",
          content: (
            <>
              <p className="mb-4 leading-relaxed">Depending on applicable law, you may have the right to:</p>
              <ul className="list-disc pl-6 space-y-2 leading-relaxed">
                <li>access your personal data;</li>
                <li>correct inaccurate data;</li>
                <li>request deletion of data;</li>
                <li>object to or restrict certain processing;</li>
                <li>withdraw consent where applicable.</li>
              </ul>
              <p className="mt-4 leading-relaxed">
                To exercise your rights, contact us at: <a href="mailto:digital.support@DigitalQatalyst.com" className="text-blue-600 hover:text-blue-800 underline font-semibold">digital.support@DigitalQatalyst.com</a>
              </p>
            </>
          ),
        },
        {
          title: "Security",
          content: (
            <p className="leading-relaxed">
              We take reasonable technical and organizational measures to protect personal data, but no system can be completely secure.
            </p>
          ),
        },
        {
          title: "Changes to This Notice",
          content: (
            <p className="leading-relaxed">
              We may update this Privacy Notice from time to time. Any changes will be posted on this page with an updated date.
            </p>
          ),
        },
        {
          title: "Contact Us",
          content: (
            <>
              <p className="mb-4 leading-relaxed">
                If you have questions about this Privacy Notice or our handling of personal data, please contact:
              </p>
              <p className="leading-relaxed">
                <strong className="text-foreground">Digital Qatalyst</strong><br />
                <strong className="text-foreground">Email:</strong> <a href="mailto:digital.support@DigitalQatalyst.com" className="text-blue-600 hover:text-blue-800 underline font-semibold">digital.support@DigitalQatalyst.com</a>
              </p>
            </>
          ),
        },
      ]}
    />
  );
}
