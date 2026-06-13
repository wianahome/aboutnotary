import type { Metadata } from "next";
import { SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `Privacy Policy for ${SITE_NAME}. Learn how we collect, use, and protect your data.`,
};

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
          Privacy Policy
        </h1>
        <p className="mt-4 text-sm text-zinc-500">
          Last updated: {new Date().toLocaleDateString("en-US")}
        </p>

        <div className="article-content mt-10 space-y-8 text-zinc-700">
          <section>
            <h2>Introduction</h2>
            <p>
              {SITE_NAME} (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;)
              operates this website and is committed to protecting your privacy.
              This Privacy Policy explains how we collect, use, disclose, and
              safeguard your information when you visit our website.
            </p>
          </section>

          <section>
            <h2>Information We Collect</h2>
            <p>
              We may collect information that your browser sends automatically,
              including your IP address, browser type, operating system, access
              times, and pages viewed. We use cookies and similar technologies
              to analyze traffic and improve user experience.
            </p>
          </section>

          <section>
            <h2>Google AdSense</h2>
            <p>
              We use Google AdSense to display advertisements. Google and its
              partners may use cookies to serve ads based on your prior visits
              to this website or other websites. You may opt out of personalized
              advertising by visiting{" "}
              <a
                href="https://www.google.com/settings/ads"
                target="_blank"
                rel="noopener noreferrer"
              >
                Google Ads Settings
              </a>
              .
            </p>
            <p>
              Third-party vendors, including Google, use cookies to serve ads.
              Google&apos;s use of advertising cookies enables it and its
              partners to serve ads to users based on their visit to our site
              and/or other sites on the Internet.
            </p>
          </section>

          <section>
            <h2>How We Use Your Information</h2>
            <p>We use collected information to:</p>
            <ul>
              <li>Operate and maintain our website</li>
              <li>Improve content, performance, and user experience</li>
              <li>Analyze usage trends and measure audience engagement</li>
              <li>Display relevant advertisements through Google AdSense</li>
            </ul>
          </section>

          <section>
            <h2>Third-Party Services</h2>
            <p>
              We may use third-party analytics and advertising services that
              collect, monitor, and analyze information to increase our
              site&apos;s functionality. These third parties have their own
              privacy policies addressing how they use such information.
            </p>
          </section>

          <section>
            <h2>Data Security</h2>
            <p>
              We implement reasonable administrative, technical, and physical
              security measures to protect your personal information. However, no
              method of transmission over the Internet is 100% secure.
            </p>
          </section>

          <section>
            <h2>Children&apos;s Privacy</h2>
            <p>
              Our website is not intended for children under 13 years of age. We
              do not knowingly collect personal information from children under
              13.
            </p>
          </section>

          <section>
            <h2>Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. Changes will
              be posted on this page with an updated revision date.
            </p>
          </section>

          <section>
            <h2>Contact Us</h2>
            <p>
              If you have questions about this Privacy Policy, please contact us
              through the contact information provided on this website.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
