import Link from "next/link";

export default function MatchmakingPage() {
  return (
    <main className="min-h-screen pt-28 pb-16 px-6 md:px-12">
      <section className="max-w-5xl mx-auto">
        <div className="rounded-2xl border border-white/10 bg-glass p-8 md:p-10">
          <p className="text-sm uppercase tracking-[0.16em] text-cyan-300">Private Queue</p>
          <h1 className="mt-3 font-heading text-4xl md:text-5xl font-bold text-white">Matchmaking Lobby</h1>
          <p className="mt-4 text-zinc-300 max-w-2xl leading-relaxed">
            You are signed in and ready to shuffle. This route is protected at the edge, so only authenticated users can access the lobby.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-purple-500/30 bg-purple-900/20 p-5">
              <h2 className="font-heading text-xl text-white">Queue Status</h2>
              <p className="mt-2 text-zinc-300 text-sm">No active queue yet. Tap start to begin matchmaking.</p>
              <button className="mt-4 rounded-lg border border-purple-400/40 px-4 py-2 text-sm text-white hover:bg-purple-900/40 transition-colors">
                Start Queue
              </button>
            </div>
            <div className="rounded-xl border border-cyan-500/30 bg-cyan-900/20 p-5">
              <h2 className="font-heading text-xl text-white">Preferences</h2>
              <p className="mt-2 text-zinc-300 text-sm">Set game mode, role, and rank range before matching.</p>
              <button className="mt-4 rounded-lg border border-cyan-400/40 px-4 py-2 text-sm text-white hover:bg-cyan-900/40 transition-colors">
                Edit Preferences
              </button>
            </div>
          </div>

          <Link
            href="/"
            className="inline-flex mt-8 text-sm text-zinc-300 hover:text-white transition-colors"
          >
            ← Back to home
          </Link>
        </div>
      </section>
    </main>
  );
}
