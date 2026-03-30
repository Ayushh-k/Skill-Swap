"use client";

import LegalPageLayout from "@/components/layout/LegalPageLayout";
import { Shield, Eye, Lock, Database, Globe, UserCheck } from "lucide-react";

export default function PrivacyPage() {
  return (
    <LegalPageLayout
      title="Privacy Policy"
      subtitle="Your data privacy is at the core of our platform's trust system."
      icon={Shield}
      lastUpdated="March 30, 2026"
    >
      <div className="space-y-12">
        <section>
          <div className="flex items-center gap-3 mb-4">
            <div className="h-8 w-8 rounded-lg bg-accent-teal/10 flex items-center justify-center border border-accent-teal/20">
              <Eye className="w-4 h-4 text-accent-teal" />
            </div>
            <h2 className="!mt-0 !mb-0 text-2xl font-bold">1. Information We Collect</h2>
          </div>
          <p>
            When you join Skill-Swap, we collect information that allows us to provide you with the best possible experience:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-foreground/70">
            <li><strong>Account Information:</strong> Name, email address, and hashed password.</li>
            <li><strong>Profile Information:</strong> Bio, skills you offer, skills you want to learn, and optional avatar.</li>
            <li><strong>Interaction Data:</strong> Swap request history and real-time chat messages.</li>
            <li><strong>Technical Data:</strong> IP address and device information for security and performance monitoring.</li>
          </ul>
        </section>

        <section>
          <div className="flex items-center gap-3 mb-4">
            <div className="h-8 w-8 rounded-lg bg-accent-indigo/10 flex items-center justify-center border border-accent-indigo/20">
              <Lock className="w-4 h-4 text-accent-indigo" />
            </div>
            <h2 className="!mt-0 !mb-0 text-2xl font-bold">2. How We Use Data</h2>
          </div>
          <p>
            The information we collect is strictly used to <strong>facilitate skill exchanges</strong> and maintain platform security.
          </p>
          <ul className="list-disc pl-6 space-y-2 text-foreground/70">
            <li>Matching you with relevant skill partners on the Explore page.</li>
            <li>Providing real-time communication tools via Socket.io.</li>
            <li>Securing your account sessions with JSON Web Tokens (JWT).</li>
            <li>Improving our platform's algorithms and user experience.</li>
          </ul>
        </section>

        <section>
          <div className="flex items-center gap-3 mb-4">
            <div className="h-8 w-8 rounded-lg bg-accent-teal/10 flex items-center justify-center border border-accent-teal/20">
              <Database className="w-4 h-4 text-accent-teal" />
            </div>
            <h2 className="!mt-0 !mb-0 text-2xl font-bold">3. Data Security & Storage</h2>
          </div>
          <p>
            Skill-Swap uses <strong>industry-level encryption</strong> and security practices to keep your data safe.
          </p>
          <ul className="list-disc pl-6 space-y-2 text-foreground/70">
            <li>All personal data is stored securely in our MongoDB Atlas cloud infrastructure.</li>
            <li>Passwords are hashed using Bcrypt before storage to ensure they are never readable by anyone.</li>
            <li>Communications are secured with HTTPS and real-time encryption protocols.</li>
          </ul>
        </section>

        <section>
          <div className="flex items-center gap-3 mb-4">
            <div className="h-8 w-8 rounded-lg bg-accent-indigo/10 flex items-center justify-center border border-accent-indigo/20">
              <Globe className="w-4 h-4 text-accent-indigo" />
            </div>
            <h2 className="!mt-0 !mb-0 text-2xl font-bold">4. Third-Party Services</h2>
          </div>
          <p>
            To provide our premium services, we integrate with these trusted third-party providers:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-foreground/70">
            <li><strong>MongoDB Atlas:</strong> Secure cloud database storage.</li>
            <li><strong>Vercel / Render:</strong> Scalable application hosting.</li>
            <li><strong>Jitsi Meet:</strong> Encrypted, peer-to-peer video conferencing.</li>
          </ul>
        </section>

        <section>
          <div className="flex items-center gap-3 mb-4">
            <div className="h-8 w-8 rounded-lg bg-accent-teal/10 flex items-center justify-center border border-accent-teal/20">
              <UserCheck className="w-4 h-4 text-accent-teal" />
            </div>
            <h2 className="!mt-0 !mb-0 text-2xl font-bold">5. Your Data Rights</h2>
          </div>
          <p>
            You have full control over your information in the Skill-Swap community:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-foreground/70">
            <li><strong>Access & Correction:</strong> You can view and edit your profile and account details at any time.</li>
            <li><strong>Data Portability:</strong> Request a copy of your personal data stored on our platform.</li>
            <li><strong>Right to Erasure:</strong> You can request the permanent deletion of your account and all associated data.</li>
          </ul>
          <p className="mt-4">
            If you have any questions or concern regarding your privacy, please contact us at <strong>privacy@skillswap.app</strong>.
          </p>
        </section>
      </div>
    </LegalPageLayout>
  );
}
