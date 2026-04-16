import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "@/features/legal/LegalPage";

export const metadata: Metadata = { title: "Terms of Service | DigitalQatalyst" };

export default function Page() {
  return (
    <LegalPage
      title="Terms of Service"
      lastUpdated="February 10, 2025"
      sections={[
        {
          title: "About DigitalQatalyst.com",
          content: (
            <>
              <p className="mb-4 leading-relaxed">
                DigitalQatalyst.com <strong className="text-foreground">("DQ," "we," "us," or "our")</strong> is a premier platform dedicated to empowering businesses through digital transformation. We provide cutting-edge tools, resources, and frameworks designed to help organizations thrive in the digital age by accelerating their digital transformation journeys and unlocking a wealth of insights and solutions tailored to meet the demands of the modern business landscape.
              </p>
              <p className="leading-relaxed">
                By accessing or using our website <strong className="text-foreground">("Site")</strong>, you agree to comply with and be bound by these Terms of Service <strong className="text-foreground">("Terms")</strong>. If you do not agree to these Terms, please refrain from using the Site.
              </p>
            </>
          ),
        },
        {
          title: "Use of the Site",
          content: (
            <>
              <p className="mb-4 leading-relaxed">
                You agree to use the <strong className="text-foreground">Site</strong> solely for lawful purposes and in compliance with all applicable laws and regulations. You may not:
              </p>
              <ul className="list-disc pl-6 space-y-2 leading-relaxed">
                <li>Use the Site in any manner that disrupts, damages, or impairs the Site&apos;s functionality.</li>
                <li>Engage in unauthorized access, interference, or reverse engineering of the Site.</li>
                <li>Upload, transmit, or distribute malicious software or unauthorized content.</li>
              </ul>
            </>
          ),
        },
        {
          title: "Intellectual Property",
          content: (
            <p className="leading-relaxed">
              All content on the <strong className="text-foreground">Site</strong>, including but not limited to text, graphics, logos, images, and software, is the property of DigitalQatalyst or its licensors and is protected by copyright, trademark, and other intellectual property laws. Unauthorized use of any content is strictly prohibited.
            </p>
          ),
        },
        {
          title: "User Submissions",
          content: (
            <p className="leading-relaxed">
              By submitting content to the <strong className="text-foreground">Site</strong>, including inquiries or feedback, you grant us a non-exclusive, worldwide, royalty-free license to use, reproduce, and modify such content for our business purposes. You warrant that your submissions do not infringe on any third-party rights.
            </p>
          ),
        },
        {
          title: "Privacy Policy",
          content: (
            <p className="leading-relaxed">
              Your use of the <strong className="text-foreground">Site</strong> is subject to our Privacy Policy, which outlines how we collect, use, and protect your personal information. Please review our{" "}
              <Link href="/privacy-policy" className="text-primary hover:underline font-medium">Privacy Policy</Link>{" "}
              for more details.
            </p>
          ),
        },
        {
          title: "Third-Party Links",
          content: (
            <p className="leading-relaxed">
              The <strong className="text-foreground">Site</strong> may include links to third-party websites or services. DigitalQatalyst is not responsible for the content, policies, or practices of any third-party websites. Access and use of such websites are at your own risk.
            </p>
          ),
        },
        {
          title: "Disclaimers",
          content: (
            <p className="leading-relaxed">
              The <strong className="text-foreground">Site</strong> and its content are provided <strong className="text-foreground">"as is"</strong> without warranties of any kind, either express or implied. DigitalQatalyst does not warrant that the Site will be error-free, secure, or available at all times. We disclaim all liability for any loss or damage arising from your use of the Site.
            </p>
          ),
        },
        {
          title: "Termination",
          content: (
            <p className="leading-relaxed">
              We reserve the right to terminate or suspend your access to the Site without notice if you violate these Terms or engage in any conduct that harms DigitalQatalyst or its users.
            </p>
          ),
        },
        {
          title: "Governing Law",
          content: (
            <p className="leading-relaxed">
              These Terms are governed by and construed in accordance with the laws of the United Arab Emirates (UAE), without regard to its conflict of law principles. Any disputes arising from these Terms shall be resolved exclusively in the courts located in the United Arab Emirates (UAE).
            </p>
          ),
        },
      ]}
    />
  );
}
