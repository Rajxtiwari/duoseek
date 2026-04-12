import GamerCard from "@/components/GamerCard";
import LobbyReels from "@/components/LobbyReels";

export default function LobbyPage() {
  return (
    <main className="min-h-screen pt-28 pb-16 px-6 md:px-12">
      <section className="max-w-7xl mx-auto">
        <div className="mb-8">
          <p className="text-xs uppercase tracking-[0.18em] text-cyan-300">Public Route</p>
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-white mt-2">Lobby</h1>
          <p className="text-zinc-400 mt-3 max-w-2xl">
            Ghost mode is active for guests. You can browse profiles and reels, but restricted actions will open the auth overlay.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
          <div className="flex justify-center lg:justify-start">
            <GamerCard />
          </div>
          <LobbyReels />
        </div>
      </section>
    </main>
  );
}
