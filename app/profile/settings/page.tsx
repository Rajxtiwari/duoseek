"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { useAuthOverlay } from "@/components/auth/AuthProvider";

type Step = 1 | 2 | 3;

const games = ["Valorant", "CS2", "League of Legends", "Apex Legends", "Dota 2", "Fortnite"];
const roles = ["IGL", "Entry", "Support", "Flex", "Anchor"];
const spring = { type: "spring" as const, stiffness: 260, damping: 20 };

function ageFromDate(date: string) {
  if (!date) return 0;
  const today = new Date();
  const birth = new Date(date);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDelta = today.getMonth() - birth.getMonth();
  if (monthDelta < 0 || (monthDelta === 0 && today.getDate() < birth.getDate())) {
    age -= 1;
  }
  return age;
}

export default function ProfileSettingsPage() {
  const { user, openAuthOverlay } = useAuthOverlay();
  const [step, setStep] = useState<Step>(1);
  const [name, setName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [gender, setGender] = useState("");
  const [bio, setBio] = useState("");
  const [preferredGames, setPreferredGames] = useState<string[]>([]);
  const [role, setRole] = useState("");
  const [hasMic, setHasMic] = useState(true);
  const [activeHours, setActiveHours] = useState("");
  const [riotId, setRiotId] = useState("");
  const [steamUrl, setSteamUrl] = useState("");
  const [idFile, setIdFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  const age = ageFromDate(birthDate);
  const avatar = useMemo(() => {
    const metadata = user?.user_metadata as { avatar_url?: string; picture?: string } | undefined;
    return metadata?.avatar_url || metadata?.picture || null;
  }, [user]);

  const progress = step === 1 ? 34 : step === 2 ? 67 : 100;

  const toggleGame = (game: string) => {
    setPreferredGames((current) =>
      current.includes(game) ? current.filter((entry) => entry !== game) : [...current, game],
    );
  };

  const saveLevelOne = async () => {
    if (!user) {
      openAuthOverlay("generic", "/profile/settings");
      return;
    }
    if (age < 18) {
      setMessage("You must be at least 18 years old.");
      return;
    }

    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({
      data: {
        full_name: name,
        birth_date: birthDate,
        gender,
        bio,
      },
    });

    if (error) {
      setMessage(error.message);
      return;
    }

    setMessage("Level 1 saved.");
    setStep(2);
  };

  const saveLevelTwo = async () => {
    if (!user) {
      openAuthOverlay("generic", "/profile/settings");
      return;
    }

    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({
      data: {
        preferred_games: preferredGames,
        role,
        has_mic: hasMic,
        active_hours: activeHours,
        riot_id: riotId,
        steam_url: steamUrl,
      },
    });

    if (error) {
      setMessage(error.message);
      return;
    }

    setMessage("Level 2 saved.");
    setStep(3);
  };

  const uploadSecureId = async () => {
    if (!user) {
      openAuthOverlay("generic", "/profile/settings");
      return;
    }
    if (!idFile) {
      setMessage("Choose a government ID file first.");
      return;
    }

    setUploading(true);
    setMessage("");
    const supabase = createClient();
    const safeName = idFile.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const path = `${user.id}/${Date.now()}-${safeName}`;

    const { error: uploadError } = await supabase.storage
      .from("secure_vault_ids")
      .upload(path, idFile, { cacheControl: "3600", upsert: false });

    if (uploadError) {
      setMessage(uploadError.message);
      setUploading(false);
      return;
    }

    const { error: metadataError } = await supabase.auth.updateUser({
      data: {
        verification_document_path: path,
        verification_status: "submitted",
      },
    });

    if (metadataError) {
      setMessage(metadataError.message);
      setUploading(false);
      return;
    }

    setUploading(false);
    setMessage("ID uploaded to secure vault. Verification submitted.");
  };

  if (!user) {
    return (
      <main className="min-h-screen pt-28 pb-16 px-6 md:px-12 flex items-center justify-center">
        <div className="max-w-lg w-full rounded-2xl border border-white/10 bg-glass p-8">
          <h1 className="font-heading text-3xl text-white font-bold">Profile Settings</h1>
          <p className="mt-2 text-zinc-400">Sign in to manage your verification tiers.</p>
          <motion.button
            type="button"
            whileTap={{ scale: 0.98 }}
            onClick={() => openAuthOverlay("generic", "/profile/settings")}
            className="mt-5 rounded-xl border border-purple-400/40 bg-purple-900/30 px-5 py-3 text-white hover:shadow-[0_0_18px_rgba(168,85,247,0.35)] transition-shadow"
          >
            Open Auth Overlay
          </motion.button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen pt-28 pb-16 px-6 md:px-12">
      <section className="max-w-5xl mx-auto rounded-2xl border border-white/10 bg-glass p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-cyan-300">Triple-Tier Verification</p>
            <h1 className="font-heading text-4xl text-white font-bold mt-2">Profile Settings</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative h-12 w-12 rounded-full overflow-hidden border border-white/15 bg-zinc-900/70">
              {avatar ? (
                <Image src={avatar} alt="Discord avatar" fill className="object-cover" />
              ) : (
                <div className="h-full w-full flex items-center justify-center text-white font-bold">{(user.email || "U").charAt(0).toUpperCase()}</div>
              )}
            </div>
            <p className="text-sm text-zinc-300">{user.email}</p>
          </div>
        </div>

        <div className="mt-6">
          <div className="h-2 rounded-full bg-zinc-800 overflow-hidden">
            <motion.div className="h-full rounded-full bg-gradient-to-r from-purple-500 to-cyan-500" animate={{ width: `${progress}%` }} transition={spring} />
          </div>
          <div className="flex items-center justify-between mt-3 text-xs text-zinc-400">
            <span>Level 1: Identity</span>
            <span>Level 2: Loadout</span>
            <span>Level 3: Vanguard</span>
          </div>
        </div>

        <div className="mt-6 flex gap-2 flex-wrap">
          {[1, 2, 3].map((item) => (
            <motion.button
              key={item}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={() => setStep(item as Step)}
              className={`rounded-lg px-4 py-2 text-sm transition-all ${step === item ? "border border-cyan-400/50 bg-cyan-900/30 text-white" : "border border-white/15 text-zinc-300"}`}
            >
              Level {item}
            </motion.button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="level-1" initial={{ x: 26, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -26, opacity: 0 }} transition={spring} className="mt-8 grid gap-4 md:grid-cols-2">
              <input value={name} onChange={(event) => setName(event.target.value)} placeholder="Name" className="rounded-xl border border-white/15 bg-zinc-900/70 px-4 py-3 text-white" />
              <input type="date" value={birthDate} onChange={(event) => setBirthDate(event.target.value)} className="rounded-xl border border-white/15 bg-zinc-900/70 px-4 py-3 text-white" />
              <input value={gender} onChange={(event) => setGender(event.target.value)} placeholder="Gender" className="rounded-xl border border-white/15 bg-zinc-900/70 px-4 py-3 text-white" />
              <textarea value={bio} onChange={(event) => setBio(event.target.value)} placeholder="Bio" className="md:col-span-2 rounded-xl border border-white/15 bg-zinc-900/70 px-4 py-3 text-white min-h-24" />
              <p className="md:col-span-2 text-sm text-zinc-400">Age detected: {age || "-"} {age > 0 && age < 18 ? "(must be 18+)" : ""}</p>
              <motion.button whileTap={{ scale: 0.98 }} type="button" onClick={() => void saveLevelOne()} className="md:col-span-2 rounded-xl border border-purple-400/45 bg-purple-900/30 px-4 py-3 text-white hover:shadow-[0_0_18px_rgba(168,85,247,0.35)] transition-shadow">Save Level 1</motion.button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="level-2" initial={{ x: 26, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -26, opacity: 0 }} transition={spring} className="mt-8 space-y-4">
              <div className="flex flex-wrap gap-2">
                {games.map((game) => (
                  <button key={game} type="button" onClick={() => toggleGame(game)} className={`rounded-full px-3 py-1 text-sm border ${preferredGames.includes(game) ? "border-cyan-400/50 bg-cyan-900/30 text-white" : "border-white/15 text-zinc-300"}`}>
                    {game}
                  </button>
                ))}
              </div>
              <select value={role} onChange={(event) => setRole(event.target.value)} className="w-full rounded-xl border border-white/15 bg-zinc-900/70 px-4 py-3 text-white">
                <option value="">Select role</option>
                {roles.map((entry) => (
                  <option key={entry} value={entry}>{entry}</option>
                ))}
              </select>
              <label className="flex items-center gap-3 text-zinc-300">
                <input type="checkbox" checked={hasMic} onChange={(event) => setHasMic(event.target.checked)} />
                Has Mic
              </label>
              <input value={activeHours} onChange={(event) => setActiveHours(event.target.value)} placeholder="Active Hours (e.g. 8pm - 1am IST)" className="w-full rounded-xl border border-white/15 bg-zinc-900/70 px-4 py-3 text-white" />
              <input value={riotId} onChange={(event) => setRiotId(event.target.value)} placeholder="Riot ID" className="w-full rounded-xl border border-white/15 bg-zinc-900/70 px-4 py-3 text-white" />
              <input value={steamUrl} onChange={(event) => setSteamUrl(event.target.value)} placeholder="Steam Profile URL" className="w-full rounded-xl border border-white/15 bg-zinc-900/70 px-4 py-3 text-white" />
              <motion.button whileTap={{ scale: 0.98 }} type="button" onClick={() => void saveLevelTwo()} className="rounded-xl border border-cyan-400/45 bg-cyan-900/30 px-4 py-3 text-white hover:shadow-[0_0_18px_rgba(34,211,238,0.35)] transition-shadow">Save Level 2</motion.button>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="level-3" initial={{ x: 26, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -26, opacity: 0 }} transition={spring} className="mt-8 rounded-2xl border border-cyan-500/30 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.15),rgba(10,10,10,0.9)_60%)] p-6">
              <h2 className="font-heading text-2xl font-bold text-white">Secure Vault</h2>
              <p className="text-zinc-300 text-sm mt-2">
                Upload a government-issued ID. File is stored in the private Supabase bucket secure_vault_ids and linked to your account metadata for review.
              </p>
              <input type="file" accept="image/*,.pdf" onChange={(event) => setIdFile(event.target.files?.[0] ?? null)} className="mt-4 block w-full text-sm text-zinc-300" />
              <motion.button whileTap={{ scale: 0.98 }} type="button" onClick={() => void uploadSecureId()} disabled={uploading} className="mt-4 rounded-xl border border-purple-400/45 bg-purple-900/30 px-4 py-3 text-white hover:shadow-[0_0_18px_rgba(168,85,247,0.35)] transition-shadow disabled:opacity-60">
                {uploading ? "Uploading..." : "Submit For Verification"}
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {message && <p className="mt-5 text-sm text-cyan-200">{message}</p>}
      </section>
    </main>
  );
}
