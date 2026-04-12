import LegalLayout from "@/components/LegalLayout";

const sections = [
  { id: "collection", title: "Information Collection" },
  { id: "usage", title: "How We Use Data" },
  { id: "retention", title: "Data Retention" },
  { id: "sharing", title: "Data Sharing" },
  { id: "rights", title: "Your Rights" },
  { id: "contact", title: "Contact Us" },
];

export default function PrivacyPage() {
  return (
    <LegalLayout title="Privacy Policy" lastUpdated="April 2026" sections={sections}>
      <div className="space-y-10 text-zinc-300 leading-[1.618]">
        <section id="collection">
          <h2 className="font-heading text-2xl font-bold text-white mb-4">Information Collection</h2>
          <div className="divider-purple mb-6" />
          <p className="mb-4">
            DuoSeek collects only the information necessary to provide our gaming matchmaking service. This includes:
          </p>
          <ul className="space-y-3 ml-4">
            {[
              { label: "Riot ID & Valorant Data:", desc: "Your in-game username, rank, win rate, and most-played agents, fetched via the official Riot Games API." },
              { label: "Steam ID & CS2 Stats:", desc: "Your Steam display name, public match stats, and CS2 skill group, fetched via the Steam Web API." },
              { label: "Age & Date of Birth:", desc: "Collected at sign-up solely to enforce our 16+ age policy. Stored as a hashed age band, not a raw date." },
              { label: "Discord Profile:", desc: "Username, avatar, and discriminator for identity display. We do not access your Discord messages." },
              { label: "Gameplay Clips:", desc: "Video files you voluntarily upload to your profile showcase." },
            ].map((item, i) => (
              <li key={i} className="flex gap-3">
                <span className="text-purple-400 mt-1">→</span>
                <span><strong className="text-white">{item.label}</strong> {item.desc}</span>
              </li>
            ))}
          </ul>
        </section>

        <section id="usage">
          <h2 className="font-heading text-2xl font-bold text-white mb-4">How We Use Your Data</h2>
          <div className="divider-purple mb-6" />
          <p className="mb-4">Your data powers the core DuoSeek experience:</p>
          <div className="space-y-4">
            {[
              { title: "Matchmaking Logic", desc: "Rank, game preference, and schedule data feed our Shuffle algorithm to surface compatible duos." },
              { title: "Profile Display", desc: "Your Riot ID, Steam handle, rank, and clips are shown to other users you are matched with." },
              { title: "Safety & Moderation", desc: "Report data and block lists are used to prevent repeat toxic interactions." },
              { title: "Service Improvement", desc: "Anonymized, aggregated usage patterns help us improve match quality. No individual profiles are sold." },
            ].map(({ title, desc }) => (
              <div key={title} className="bg-glass rounded-xl p-4 border border-white/5">
                <p className="font-semibold text-white mb-1">{title}</p>
                <p className="text-sm text-zinc-400">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="retention">
          <h2 className="font-heading text-2xl font-bold text-white mb-4">Data Retention</h2>
          <div className="divider-purple mb-6" />
          <p className="mb-4">
            We retain your account data for as long as your account is active. If you delete your account:
          </p>
          <ul className="space-y-2 ml-4">
            <li className="flex gap-3"><span className="text-cyan-400 mt-1">→</span><span>Profile data is permanently deleted within 30 days.</span></li>
            <li className="flex gap-3"><span className="text-cyan-400 mt-1">→</span><span>Uploaded gameplay clips are purged from our CDN within 7 days.</span></li>
            <li className="flex gap-3"><span className="text-cyan-400 mt-1">→</span><span>Aggregated, anonymized match analytics may be retained indefinitely for service improvement.</span></li>
            <li className="flex gap-3"><span className="text-cyan-400 mt-1">→</span><span>Safety reports involving your account are retained for 2 years to protect the community.</span></li>
          </ul>
        </section>

        <section id="sharing">
          <h2 className="font-heading text-2xl font-bold text-white mb-4">Data Sharing</h2>
          <div className="divider-purple mb-6" />
          <p className="mb-4">
            <strong className="text-white">We do not sell your personal data.</strong> We share data only with trusted infrastructure partners (hosting, CDN, analytics) under strict data processing agreements. We may disclose data when required by law.
          </p>
        </section>

        <section id="rights">
          <h2 className="font-heading text-2xl font-bold text-white mb-4">Your Rights</h2>
          <div className="divider-purple mb-6" />
          <p className="mb-4">Depending on your jurisdiction, you may have the right to:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {["Access your data", "Correct inaccuracies", "Delete your account", "Export your data", "Object to processing", "Lodge a complaint"].map((right) => (
              <div key={right} className="bg-glass rounded-lg px-4 py-3 flex items-center gap-3 border border-white/5">
                <span className="text-purple-400">✓</span>
                <span className="text-sm">{right}</span>
              </div>
            ))}
          </div>
        </section>

        <section id="contact">
          <h2 className="font-heading text-2xl font-bold text-white mb-4">Contact Us</h2>
          <div className="divider-purple mb-6" />
          <p>
            For privacy inquiries, email{" "}
            <a href="mailto:privacy@duoseek.gg" className="text-purple-400 hover:text-purple-300 transition-colors">
              privacy@duoseek.gg
            </a>
            . We respond to all privacy requests within 30 days.
          </p>
        </section>
      </div>
    </LegalLayout>
  );
}
