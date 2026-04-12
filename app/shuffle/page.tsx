import ShufflePreview from "@/components/ShufflePreview";

export default function ShufflePage() {
  return (
    <main>
      <div className="pt-28 px-6 md:px-12 text-center">
        <p className="text-xs uppercase tracking-[0.18em] text-purple-300">Public Route</p>
        <h1 className="font-heading text-4xl md:text-5xl text-white font-bold mt-2">Shuffle Arena</h1>
        <p className="text-zinc-400 mt-3">Everyone can view. Only authenticated users can trigger Shuffle.</p>
      </div>
      <ShufflePreview />
    </main>
  );
}
