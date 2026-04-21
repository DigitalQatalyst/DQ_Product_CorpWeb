import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "@/features/legal/LegalPage";

export const metadata: Metadata = { title: "Terms of Use | DigitalQatalyst" };

export default function Page() {
  return (
    <LegalPage
      title="Terms of Use"
      lastUpdated="February 10, 2025"
      sections={[
        {
          title: "About These Terms",
          content: (
            <p className="leading-relaxed">
              These Terms of Use govern your access to and use of the Digital Qatalyst website (the <strong className="text-foreground">"Site"</strong>). By using the Site, you agree to these Terms. If you do not agree, please do not use the Site.
            </p>
          ),
        },
        {
          title: "About Us",
          content: (
            <p className="leading-relaxed">
              This Site is operated by Digital Qatalyst (<strong className="text-foreground">"Digital Qatalyst", "DQ", "we", "us", or "our"</strong>).
            </p>
          ),
        },
        {
          title: "Use of the Site",
          content: (
            <>
              <p className="mb-4 leading-relaxed">
                You may use the Site only for lawful purposes and in accordance with these Terms.
              </p>
              <p className="mb-4 leading-relaxed">You must not:</p>
              <ul className="list-disc pl-6 space-y-2 leading-relaxed">
                <li>use the Site in any way that violates applicable law or regulation;</li>
                <li>attempt to gain unauthorized access to the Site or related systems;</li>
                <li>interfere with the Site's operation or security;</li>
                <li>upload or transmit malware, harmful code, or disruptive material;</li>
                <li>copy, misuse, or exploit Site content without permission.</li>
              </ul>
            </>
          ),
        },
        {
          title: "Intellectual Property",
          content: (
            <>
              <p className="mb-4 leading-relaxed">
                All content on this Site, including text, graphics, branding, logos, reports, downloads, and design elements, is owned by or licensed to Digital Qatalyst unless otherwise stated.
              </p>
              <p className="leading-relaxed">
                You may use Site content for personal or internal business reference only. You may not reproduce, distribute, modify, or reuse Site content without our prior written permission.
              </p>
            </>
          ),
        },
        {
          title: "Disclaimer",
          content: (
            <>
              <p className="mb-4 leading-relaxed">
                This Site and its content are provided for general information only and on an <strong className="text-foreground">"as is"</strong> and <strong className="text-foreground">"as available"</strong> basis.
              </p>
              <p className="leading-relaxed">
                We do not guarantee that the Site will always be available, secure, error-free, or fully accurate.
              </p>
            </>
          ),
        },
        {
          title: "Limitation of Liability",
          content: (
            <p className="leading-relaxed">
              To the fullest extent permitted by law, Digital Qatalyst shall not be liable for any indirect, incidental, special, or consequential loss or damage arising from or related to your use of, or inability to use, the Site.
            </p>
          ),
        },
        {
          title: "Third-Party Links",
          content: (
            <p className="leading-relaxed">
              The Site may contain links to third-party websites or services. We are not responsible for their content, availability, or privacy practices.
            </p>
          ),
        },
        {
          title: "Privacy",
          content: (
            <p className="leading-relaxed">
              Our use of personal data is described in our{" "}
              <Link href="/privacy-policy" className="text-primary hover:underline font-medium">Privacy Notice</Link>.
            </p>
          ),
        },
        {
          title: "Changes to These Terms",
          content: (
            <p className="leading-relaxed">
              We may update these Terms from time to time. Any changes will be posted on this page with an updated date.
            </p>
          ),
        },
        {
          title: "Governing Law and Jurisdiction",
          content: (
            <>
              <p className="mb-4 leading-relaxed">
                These Terms shall be governed by and construed in accordance with the laws of the United Arab Emirates and, where applicable, the laws of the Emirate of Dubai.
              </p>
              <p className="leading-relaxed">
                Any dispute arising out of or in connection with these Terms or your use of the Site shall be subject to the exclusive jurisdiction of the courts of the Emirate of Dubai, unless otherwise required by mandatory applicable law.
              </p>
            </>
          ),
        },
        {
          title: "Contact Us",
          content: (
            <>
              <p className="mb-4 leading-relaxed">
                If you have any questions about these Terms, please contact us at:
              </p>
              <p className="leading-relaxed">
                <strong className="text-foreground">Email:</strong>{" "}
                <a href="mailto:digital.support@DigitalQatalyst.com" className="text-primary hover:underline font-medium">
                  digital.support@DigitalQatalyst.com
                </a>
              </p>
            </>
          ),
        },
      ]}
    />
  );
}
