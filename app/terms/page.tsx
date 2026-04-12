import LegalLayout from "@/components/LegalLayout";

const sections = [
  { id: "agreement", title: "Agreement to Terms" },
  { id: "conduct", title: "Gamer Conduct" },
  { id: "accounts", title: "Accounts" },
  { id: "content", title: "User Content" },
  { id: "termination", title: "Termination" },
  { id: "liability", title: "Liability" },
];

export default function TermsPage() {
  return (
    <LegalLayout title="Terms & Conditions" lastUpdated="April 2026" sections={sections}>
      <div className="space-y-10 text-zinc-300 leading-[1.618]">
        <section id="agreement">
          <h2 className="font-heading text-2xl font-bold text-white mb-4">Agreement to Terms</h2>
          <div className="divider-purple mb-6" />
          <p>
            By creating an account on DuoSeek, you agree to be bound by these Terms and our Privacy Policy. If you disagree with any part, you may not access the service. These Terms apply to all users, including registered users and visitors.
          </p>
        </section>

        <section id="conduct">
          <h2 className="font-heading text-2xl font-bold text-white mb-4">Gamer Conduct</h2>
          <div className="divider-purple mb-6" />
          <p className="mb-6 font-medium text-white/90">
            DuoSeek has zero tolerance for toxic behavior. The following are strictly prohibited:
          </p>
          <div className="space-y-3">
            {[
              { title: "Smurfing", desc: "Creating secondary accounts to play below your actual skill level is strictly banned. Smurfs detected via API rank discrepancies will have all accounts permanently suspended." },
              { title: "Harassment & Toxicity", desc: "Verbal abuse, slurs, sexual harassment, or intimidation of any kind will result in immediate suspension. Zero tolerance, no exceptions." },
              { title: "Impersonation", desc: "Impersonating another player, streamer, or DuoSeek staff is grounds for permanent ban." },
              { title: "Cheating & Exploiting", desc: "Using aimbots, wall-hacks, or any third-party cheat software is a permanent ban. We cross-reference Riot and Valve ban data." },
              { title: "Scamming", desc: "Attempting to deceive matched players for financial gain, account credentials, or in-game items is prohibited and may be reported to law enforcement." },
            ].map(({ title, desc }) => (
              <div key={title} className="bg-glass border border-red-500/10 hover:border-red-500/20 rounded-xl p-4 transition-all">
                <p className="font-semibold text-red-400 mb-1">✕ {title}</p>
                <p className="text-sm text-zinc-400">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="accounts">
          <h2 className="font-heading text-2xl font-bold text-white mb-4">Accounts</h2>
          <div className="divider-purple mb-6" />
          <p className="mb-4">You are responsible for maintaining the security of your account. You must:</p>
          <ul className="space-y-2 ml-4">
            <li className="flex gap-3"><span className="text-purple-400 mt-1">→</span><span>Use a strong, unique password and enable two-factor authentication on your linked Discord.</span></li>
            <li className="flex gap-3"><span className="text-purple-400 mt-1">→</span><span>Not share account credentials with any third party.</span></li>
            <li className="flex gap-3"><span className="text-purple-400 mt-1">→</span><span>Notify us immediately at security@duoseek.gg if you suspect unauthorized access.</span></li>
          </ul>
        </section>

        <section id="content">
          <h2 className="font-heading text-2xl font-bold text-white mb-4">User Content</h2>
          <div className="divider-purple mb-6" />
          <p className="mb-4">
            By uploading gameplay clips or other content, you grant DuoSeek a non-exclusive, royalty-free license to display that content to matched users within the platform. You retain full ownership. You may not upload content that is: pornographic, depicts real violence, infringes copyright, or reveals personal information of others without consent.
          </p>
        </section>

        <section id="termination">
          <h2 className="font-heading text-2xl font-bold text-white mb-4">Termination</h2>
          <div className="divider-purple mb-6" />
          <p>
            DuoSeek reserves the right to suspend or terminate any account at our discretion, with or without notice, for violations of these Terms. You may delete your account at any time via Settings → Account → Delete Account.
          </p>
        </section>

        <section id="liability">
          <h2 className="font-heading text-2xl font-bold text-white mb-4">Limitation of Liability</h2>
          <div className="divider-purple mb-6" />
          <p>
            DuoSeek is provided &quot;as is&quot; without warranties of any kind. We are not liable for any indirect, incidental, or consequential damages arising from your use of the service. Our total liability shall not exceed the amount you paid us in the past 12 months (if any).
          </p>
        </section>
      </div>
    </LegalLayout>
  );
}
