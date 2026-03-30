"use client";

import LegalPageLayout from "@/components/layout/LegalPageLayout";
import { BookOpen, ShieldCheck, Heart, UserCheck, MessageSquare, AlertCircle } from "lucide-react";

export default function GuidelinesPage() {
  return (
    <LegalPageLayout
      title="Community Guidelines"
      subtitle="The foundation of every successful swap is mutual respect and a shared commitment to learning."
      icon={BookOpen}
      lastUpdated="March 30, 2026"
    >
      <div className="space-y-12">
        <section>
          <div className="flex items-center gap-3 mb-4">
            <div className="h-8 w-8 rounded-lg bg-accent-teal/10 flex items-center justify-center border border-accent-teal/20">
              <Heart className="w-4 h-4 text-accent-teal" />
            </div>
            <h2 className="!mt-0 !mb-0 text-2xl font-bold">1. Mutual Respect</h2>
          </div>
          <p>
            Skill-Swap is built on <strong>empathy and collaboration</strong>. Treat every member with the same professionalism and kindness you'd expect in return. 
            We maintain a zero-tolerance policy for harassment, discrimination, or hate speech of any kind.
          </p>
        </section>

        <section>
          <div className="flex items-center gap-3 mb-4">
            <div className="h-8 w-8 rounded-lg bg-accent-indigo/10 flex items-center justify-center border border-accent-indigo/20">
              <UserCheck className="w-4 h-4 text-accent-indigo" />
            </div>
            <h2 className="!mt-0 !mb-0 text-2xl font-bold">2. Authenticity & Accuracy</h2>
          </div>
          <p>
            Represent your skills and expertise <strong>honestly</strong>. Providing accurate information in your profile helps ensure successful matches and high-quality learning outcomes for both parties.
          </p>
          <ul className="list-disc pl-6 space-y-2 text-foreground/70">
            <li>Only list skills you are prepared to teach.</li>
            <li>Maintain an up-to-date and professional bio.</li>
            <li>Use a clear, identifiable avatar if possible.</li>
          </ul>
        </section>

        <section>
          <div className="flex items-center gap-3 mb-4">
            <div className="h-8 w-8 rounded-lg bg-accent-teal/10 flex items-center justify-center border border-accent-teal/20">
              <MessageSquare className="w-4 h-4 text-accent-teal" />
            </div>
            <h2 className="!mt-0 !mb-0 text-2xl font-bold">3. Communication & Commitment</h2>
          </div>
          <p>
            When you accept a swap request, you are making a <strong>commitment</strong> to another learner's growth. 
            Respond to messages promptly and follow through on agreed-upon learning sessions.
          </p>
          <div className="bg-white/5 p-6 rounded-2xl border border-white/5 mt-4">
            <div className="flex items-start gap-4">
              <AlertCircle className="w-5 h-5 text-accent-indigo shrink-0 mt-1" />
              <p className="text-sm italic text-foreground/60 leading-relaxed mb-0">
                If you need to cancel or postpone a session, please notify your partner as far in advance as possible. Repeated "no-shows" may lead to account review.
              </p>
            </div>
          </div>
        </section>

        <section>
          <div className="flex items-center gap-3 mb-4">
            <div className="h-8 w-8 rounded-lg bg-accent-indigo/10 flex items-center justify-center border border-accent-indigo/20">
              <ShieldCheck className="w-4 h-4 text-accent-indigo" />
            </div>
            <h2 className="!mt-0 !mb-0 text-2xl font-bold">4. Safety First</h2>
          </div>
          <p>
            Your safety is our priority. While we provide the platform for connection, we encourage you to follow these <strong>best practices</strong>:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-foreground/70">
            <li>Keep all initial communications within the Skill-Swap chat system.</li>
            <li>Use our integrated video call feature for remote sessions.</li>
            <li>Never share sensitive personal information (banking details, home addresses) with strangers.</li>
            <li>Report any suspicious behavior immediately via our support channels.</li>
          </ul>
        </section>

        <section className="pt-8 border-t border-white/5 text-center">
          <p className="text-foreground/50 italic">
            Failure to adhere to these guidelines may result in warnings, temporary suspensions, or permanent removal from the platform.
          </p>
        </section>
      </div>
    </LegalPageLayout>
  );
}
