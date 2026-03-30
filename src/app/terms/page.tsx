"use client";

import LegalPageLayout from "@/components/layout/LegalPageLayout";
import { FileText, Scale, UserCheck, AlertOctagon, Gavel, ShieldAlert } from "lucide-react";

export default function TermsPage() {
  return (
    <LegalPageLayout
      title="Terms of Service"
      subtitle="The formal agreements that ensure a safe and professional environment for all members."
      icon={FileText}
      lastUpdated="March 30, 2026"
    >
      <div className="space-y-12">
        <section>
          <div className="flex items-center gap-3 mb-4">
            <div className="h-8 w-8 rounded-lg bg-accent-teal/10 flex items-center justify-center border border-accent-teal/20">
              <Scale className="w-4 h-4 text-accent-teal" />
            </div>
            <h2 className="!mt-0 !mb-0 text-2xl font-bold">1. Acceptance of Terms</h2>
          </div>
          <p>
            By accessing or using the Skill-Swap platform, you agree to be bound by these <strong>Terms of Service</strong> and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
          </p>
        </section>

        <section>
          <div className="flex items-center gap-3 mb-4">
            <div className="h-8 w-8 rounded-lg bg-accent-indigo/10 flex items-center justify-center border border-accent-indigo/20">
              <UserCheck className="w-4 h-4 text-accent-indigo" />
            </div>
            <h2 className="!mt-0 !mb-0 text-2xl font-bold">2. Use License & Account</h2>
          </div>
          <p>
            Skill-Swap grants you a personal, non-commercial, non-transferable license to use the platform for the sole purpose of <strong>peer-to-peer skill exchange</strong>.
          </p>
          <ul className="list-disc pl-6 space-y-2 text-foreground/70">
            <li>You must be at least 18 years old to create an account.</li>
            <li>You are responsible for maintaining the confidentiality of your account password.</li>
            <li>You agree to notify us immediately of any unauthorized use of your account.</li>
            <li>You may only maintain one active account on the platform.</li>
          </ul>
        </section>

        <section>
          <div className="flex items-center gap-3 mb-4">
            <div className="h-8 w-8 rounded-lg bg-accent-teal/10 flex items-center justify-center border border-accent-teal/20">
              <AlertOctagon className="w-4 h-4 text-accent-teal" />
            </div>
            <h2 className="!mt-0 !mb-0 text-2xl font-bold">3. Prohibited Conduct</h2>
          </div>
          <p>
            To maintain our premium community standards, users are explicitly prohibited from:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-foreground/70">
            <li>Solociting payments or selling services outside the skill-swap model.</li>
            <li>Impersonating any person or entity.</li>
            <li>Uploading malicious code, viruses, or disruptive software.</li>
            <li>Scraping platform data for commercial use or competition.</li>
            <li>Spaming or harassing other community members.</li>
          </ul>
        </section>

        <section>
          <div className="flex items-center gap-3 mb-4">
            <div className="h-8 w-8 rounded-lg bg-accent-indigo/10 flex items-center justify-center border border-accent-indigo/20">
              <Gavel className="w-4 h-4 text-accent-indigo" />
            </div>
            <h2 className="!mt-0 !mb-0 text-2xl font-bold">4. Limitation of Liability</h2>
          </div>
          <p>
            The materials on Skill-Swap are provided on an 'as is' basis. Skill-Swap makes <strong>no warranties</strong>, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability.
          </p>
          <p className="mt-4">
            In no event shall Skill-Swap or its developers be liable for any damages (including, without limitation, damages for loss of data or profit) arising out of the use or inability to use the platform.
          </p>
        </section>

        <section>
          <div className="flex items-center gap-3 mb-4">
            <div className="h-8 w-8 rounded-lg bg-accent-teal/10 flex items-center justify-center border border-accent-teal/20">
              <ShieldAlert className="w-4 h-4 text-accent-teal" />
            </div>
            <h2 className="!mt-0 !mb-0 text-2xl font-bold">5. Termination</h2>
          </div>
          <p>
            We reserve the right to <strong>terminate or suspend</strong> your account and access to the platform immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms of Service.
          </p>
          <p className="mt-4">
            Upon termination, your right to use the platform will cease immediately. If you wish to terminate your account, you may simply discontinue using the Service.
          </p>
        </section>

        <section className="pt-8 border-t border-white/5 text-center">
          <p className="text-foreground/50 italic text-sm">
            Skill-Swap reserves the right to update these terms at any time. Your continued use of the platform after updates indicates your acceptance of the revised Terms of Service.
          </p>
        </section>
      </div>
    </LegalPageLayout>
  );
}
