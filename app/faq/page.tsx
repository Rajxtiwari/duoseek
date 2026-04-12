import GlassContainer from "@/components/GlassContainer";
import GlassAccordion from "@/components/GlassAccordion";

const faqData = [
  {
    category: "Account & Safety",
    items: [
      {
        question: "How does DuoSeek verify my gaming accounts?",
        answer: "We use official OAuth integrations with Discord, Riot Games, and Steam. When you connect an account, we authenticate directly with their APIs—we never store your passwords. Your Riot ID, Steam ID, and rank data are pulled in real time.",
      },
      {
        question: "How do I block or report another player?",
        answer: "On any user profile or after a match session, tap the three-dot menu and select 'Block & Report.' The player is immediately removed from your match pool. Our moderation team reviews all reports within 24 hours.",
      },
      {
        question: "Is my age verified? Can minors use DuoSeek?",
        answer: "DuoSeek requires users to be 16+. During sign-up, we collect date of birth and cross-reference with Discord age verification where possible. Accounts flagged as underage are suspended pending verification.",
      },
    ],
  },
  {
    category: "Gaming APIs",
    items: [
      {
        question: "How do you fetch my Valorant or CS2 rank?",
        answer: "We use the official Riot Games API for Valorant, VALORANT-API for detailed act rank data, and the Steam Web API for CS2 stats. Your rank is refreshed every 12 hours or when you manually trigger a sync.",
      },
      {
        question: "Does DuoSeek access my match history?",
        answer: "We pull aggregate statistics (win rate, KDA average, most-played agents) via Riot's API. We do not store individual match details—only summary data used for matchmaking compatibility scoring.",
      },
      {
        question: "What games are supported?",
        answer: "Currently: Valorant, CS2, League of Legends, Apex Legends, and Overwatch 2. We're adding Fortnite, Warzone, and Rocket League in Q3 2026.",
      },
    ],
  },
  {
    category: "Matchmaking",
    items: [
      {
        question: "How does the Shuffle algorithm pick my partner?",
        answer: "The Shuffle algorithm considers: (1) Rank proximity within ±1 full tier, (2) Preferred games and roles, (3) Schedule overlap, (4) Communication preferences (mic or text), and (5) Prior block/report history. It runs in <200ms.",
      },
      {
        question: "Can I rematch with someone I liked?",
        answer: "Yes! After a session, you can 'Favorite' a player. Favorited players appear at the top of your potential match pool in future shuffles. You can also send a direct invite if both parties have favorited each other.",
      },
      {
        question: "What if I keep matching with incompatible players?",
        answer: "After three consecutive 'Skip' actions in a session, DuoSeek enters 'Precision Mode'—a stricter matching filter. You can also manually set hard filters (rank floor/ceiling, specific games) in your profile settings.",
      },
    ],
  },
];

export default function FAQPage() {
  return (
    <div className="min-h-screen pt-20 pb-24 px-6 md:px-12 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-purple-950/15 via-zinc-950 to-transparent pointer-events-none" />

      <div className="max-w-3xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <span className="text-cyan-400 text-sm font-medium tracking-widest uppercase">Support</span>
          <h1 className="font-heading text-5xl md:text-6xl font-bold text-white mt-3 mb-5">
            Frequently Asked{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
              Questions
            </span>
          </h1>
          <p className="text-zinc-400 text-lg leading-[1.618]">
            Everything you need to know about DuoSeek. Can&apos;t find the answer?{" "}
            <a href="mailto:support@duoseek.gg" className="text-purple-400 hover:text-purple-300 transition-colors">
              Email support@duoseek.gg
            </a>
          </p>
        </div>

        <GlassContainer dark className="p-8 md:p-10 space-y-10">
          {faqData.map((section) => (
            <GlassAccordion key={section.category} category={section.category} items={section.items} />
          ))}
        </GlassContainer>
      </div>
    </div>
  );
}
