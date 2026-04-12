"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useAuthOverlay } from "@/components/auth/AuthProvider";
import GamerAvatar from "@/components/GamerAvatar";
import { isLevelOneComplete } from "@/lib/profile";

type Step = 1 | 2 | 3;
type DocumentType = "aadhaar" | "pan" | "college_id" | "bank_card";

const spring = { type: "spring" as const, stiffness: 260, damping: 20 };

const docLabels: Record<DocumentType, string> = {
  aadhaar: "Aadhaar",
  pan: "PAN",
  college_id: "College ID",
  bank_card: "Bank Card",
};

function parseAge(value: string) {
  const parsed = Number.parseInt(value, 10);
  if (Number.isNaN(parsed)) {
    return 0;
  }
  return parsed;
}

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
  const searchParams = useSearchParams();
  const { user, profile, openAuthOverlay, refreshProfile, showToast } = useAuthOverlay();

  const [step, setStep] = useState<Step>(1);
  const [fullName, setFullName] = useState("");
  const [ageInput, setAgeInput] = useState("");
  const [gender, setGender] = useState("");
  const [dob, setDob] = useState("");
  const [bio, setBio] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [savingLevelOne, setSavingLevelOne] = useState(false);

  const [documentType, setDocumentType] = useState<DocumentType>("aadhaar");
  const [frontFile, setFrontFile] = useState<File | null>(null);
  const [backFile, setBackFile] = useState<File | null>(null);
  const [uploadingDocs, setUploadingDocs] = useState(false);
  const [docSentForReview, setDocSentForReview] = useState(false);

  const levelOneComplete = isLevelOneComplete(profile);
  const computedAge = ageFromDate(dob);

  const metadata = user?.user_metadata as { full_name?: string } | undefined;
  const gamerHandle = profile?.gamer_handle ? `@${profile.gamer_handle}` : `@${user?.email?.split("@")[0] || "player"}`;
  const avatarUrl = profile?.avatar_url || null;
  const avatarSeed = profile?.gamer_handle || metadata?.full_name || user?.email || "U";

  const levelTwoUnlocked = levelOneComplete;

  const progress = useMemo(() => {
    if (docSentForReview || (profile?.verification_level ?? 0) >= 2) {
      return 67;
    }
    if (levelOneComplete) {
      return 34;
    }
    return 10;
  }, [docSentForReview, levelOneComplete, profile?.verification_level]);

  useEffect(() => {
    if (!profile) {
      return;
    }

    queueMicrotask(() => {
      setFullName(profile.full_name ?? "");
      setAgeInput(profile.age ? String(profile.age) : "");
      setGender(profile.gender ?? "");
      setDob(profile.dob ?? "");
      setBio(profile.bio ?? "");
      setPhoneNumber(profile.phone_number ?? "");
      setDocSentForReview((profile.verification_level ?? 0) >= 2);
    });
  }, [profile]);

  useEffect(() => {
    const required = searchParams.get("required") === "1";
    if (required) {
      queueMicrotask(() => setStep(1));
      return;
    }

    if (levelOneComplete) {
      queueMicrotask(() => setStep(2));
    }
  }, [levelOneComplete, searchParams]);

  const saveLevelOne = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!user) {
      openAuthOverlay("generic", "/profile/settings");
      return;
    }

    const finalAge = parseAge(ageInput) || ageFromDate(dob);
    if (!fullName.trim() || !finalAge || !gender || !dob || !bio.trim()) {
      showToast({ title: "Level 1 incomplete", description: "Fill all required identity fields.", variant: "error" });
      return;
    }

    setSavingLevelOne(true);
    const supabase = createClient();
    const fallbackHandle = profile?.gamer_handle ?? user.email?.split("@")[0] ?? `player_${user.id.slice(0, 6)}`;

    const payload = {
      id: user.id,
      gamer_handle: fallbackHandle,
      full_name: fullName.trim(),
      age: finalAge,
      gender,
      dob,
      bio: bio.trim(),
      phone_number: phoneNumber.trim() || null,
      verification_level: 1,
    };

    const { error } = await supabase.from("profiles").upsert(payload, { onConflict: "id" });

    if (error) {
      showToast({ title: "Level 1 save failed", description: error.message, variant: "error" });
      setSavingLevelOne(false);
      return;
    }

    await refreshProfile();
    showToast({ title: "Level 1 complete", description: "Basic identity saved.", variant: "success" });
    setSavingLevelOne(false);
    setStep(2);
  };

  const uploadLevelTwoDocs = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!user) {
      openAuthOverlay("generic", "/profile/settings");
      return;
    }

    if (!levelOneComplete) {
      showToast({ title: "Finish Level 1 first", description: "Basic identity is required before document upload.", variant: "error" });
      setStep(1);
      return;
    }

    if (!frontFile || !backFile) {
      showToast({ title: "Missing documents", description: "Upload front and back images.", variant: "error" });
      return;
    }

    setUploadingDocs(true);
    const supabase = createClient();
    const frontPath = `${user.id}/docs/${documentType}_front.png`;
    const backPath = `${user.id}/docs/${documentType}_back.png`;

    const { error: frontError } = await supabase.storage
      .from("secure_vault_ids")
      .upload(frontPath, frontFile, { cacheControl: "3600", upsert: true, contentType: "image/png" });

    if (frontError) {
      showToast({ title: "Front upload failed", description: frontError.message, variant: "error" });
      setUploadingDocs(false);
      return;
    }

    const { error: backError } = await supabase.storage
      .from("secure_vault_ids")
      .upload(backPath, backFile, { cacheControl: "3600", upsert: true, contentType: "image/png" });

    if (backError) {
      showToast({ title: "Back upload failed", description: backError.message, variant: "error" });
      setUploadingDocs(false);
      return;
    }

    const { error: profileError } = await supabase
      .from("profiles")
      .update({ verification_level: 2, is_verified: false })
      .eq("id", user.id);

    if (profileError) {
      showToast({ title: "Status update failed", description: profileError.message, variant: "error" });
      setUploadingDocs(false);
      return;
    }

    setUploadingDocs(false);
    setDocSentForReview(true);
    await refreshProfile();
    showToast({ title: "Document Sent for Review", description: "Your documents are now in secure vault review queue.", variant: "success" });
  };

  if (!user) {
    return (
      <main className="min-h-screen pt-28 pb-16 px-6 md:px-12 flex items-center justify-center">
        <div className="max-w-lg w-full rounded-2xl border border-cyan-500/20 bg-glass p-8">
          <h1 className="font-heading text-3xl text-white font-bold">Profile Settings</h1>
          <p className="mt-2 text-zinc-400">Sign in to configure your 3-tier verification profile.</p>
          <motion.button
            type="button"
            whileTap={{ scale: 0.98 }}
            onClick={() => openAuthOverlay("generic", "/profile/settings")}
            className="mt-5 rounded-xl border border-cyan-400/40 bg-cyan-900/30 px-5 py-3 text-white hover:shadow-[0_0_20px_rgba(34,211,238,0.35)] transition-shadow"
          >
            Open Auth Overlay
          </motion.button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen pt-28 pb-16 px-6 md:px-12 bg-[radial-gradient(circle_at_15%_20%,rgba(34,211,238,0.15),transparent_45%),radial-gradient(circle_at_80%_10%,rgba(59,130,246,0.14),transparent_40%),linear-gradient(160deg,#040710_0%,#0a1022_45%,#0a0f1a_100%)]">
      <section className="max-w-5xl mx-auto rounded-3xl border border-cyan-400/20 bg-white/5 backdrop-blur-xl p-6 md:p-8 shadow-[0_0_45px_rgba(34,211,238,0.12)]">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">Midnight Glass Protocol</p>
            <h1 className="font-heading text-4xl text-white font-bold mt-2">3-Tier Profile & Verification</h1>
          </div>
          <div className="flex items-center gap-3">
            <GamerAvatar avatarUrl={avatarUrl} seedText={avatarSeed} alt="Profile avatar" sizeClassName="h-12 w-12" />
            <div>
              <p className="text-sm text-zinc-100 font-medium">{gamerHandle}</p>
              <p className="text-xs text-zinc-400">{levelOneComplete ? "Level 1 complete" : "Level 1 required for Lobby"}</p>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <div className="h-2 rounded-full bg-zinc-800/80 overflow-hidden">
            <motion.div className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500" animate={{ width: `${progress}%` }} transition={spring} />
          </div>
          <div className="flex items-center justify-between mt-3 text-xs text-zinc-400">
            <span>Level 1: Basic Identity</span>
            <span>Level 2: Document Verification</span>
            <span>Level 3: Elite Status</span>
          </div>
        </div>

        <div className="mt-6 flex gap-2 flex-wrap">
          <motion.button
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={() => setStep(1)}
            className={`rounded-lg px-4 py-2 text-sm transition-all ${step === 1 ? "border border-cyan-400/60 bg-cyan-900/30 text-white" : "border border-white/15 text-zinc-300"}`}
          >
            Level 1
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={() => levelTwoUnlocked && setStep(2)}
            disabled={!levelTwoUnlocked}
            className={`rounded-lg px-4 py-2 text-sm transition-all ${step === 2 ? "border border-cyan-400/60 bg-cyan-900/30 text-white" : "border border-white/15 text-zinc-300"} disabled:opacity-50`}
          >
            Level 2
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={() => setStep(3)}
            className={`rounded-lg px-4 py-2 text-sm transition-all ${step === 3 ? "border border-cyan-400/60 bg-cyan-900/30 text-white" : "border border-white/15 text-zinc-300"}`}
          >
            Level 3
          </motion.button>
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.form
              key="level-1"
              onSubmit={saveLevelOne}
              initial={{ x: 24, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -24, opacity: 0 }}
              transition={spring}
              className="mt-8 grid gap-4 md:grid-cols-2"
            >
              <input
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                placeholder="Full Name"
                required
                className="rounded-xl border border-white/15 bg-zinc-900/60 px-4 py-3 text-white"
              />
              <input
                value={ageInput}
                onChange={(event) => setAgeInput(event.target.value)}
                placeholder="Age"
                required
                inputMode="numeric"
                className="rounded-xl border border-white/15 bg-zinc-900/60 px-4 py-3 text-white"
              />
              <select
                value={gender}
                onChange={(event) => setGender(event.target.value)}
                required
                className="rounded-xl border border-white/15 bg-zinc-900/60 px-4 py-3 text-white"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Non-binary">Non-binary</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
              <input
                type="date"
                value={dob}
                onChange={(event) => setDob(event.target.value)}
                required
                className="rounded-xl border border-white/15 bg-zinc-900/60 px-4 py-3 text-white"
              />
              <input
                value={phoneNumber}
                onChange={(event) => setPhoneNumber(event.target.value)}
                placeholder="Phone Number (Optional)"
                className="md:col-span-2 rounded-xl border border-white/15 bg-zinc-900/60 px-4 py-3 text-white"
              />
              <textarea
                value={bio}
                onChange={(event) => setBio(event.target.value)}
                placeholder="Bio"
                required
                className="md:col-span-2 rounded-xl border border-white/15 bg-zinc-900/60 px-4 py-3 text-white min-h-28"
              />
              <p className="md:col-span-2 text-sm text-zinc-400">Detected age from DOB: {computedAge || "-"}</p>
              <motion.button
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={savingLevelOne}
                className="md:col-span-2 rounded-xl border border-cyan-400/45 bg-cyan-900/30 px-4 py-3 text-white hover:shadow-[0_0_20px_rgba(34,211,238,0.35)] transition-shadow disabled:opacity-60"
              >
                {savingLevelOne ? "Saving..." : "Save Level 1 and Unlock Level 2"}
              </motion.button>
            </motion.form>
          )}

          {step === 2 && (
            <motion.form
              key="level-2"
              onSubmit={uploadLevelTwoDocs}
              initial={{ x: 24, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -24, opacity: 0 }}
              transition={spring}
              className="mt-8 space-y-4"
            >
              <div className="rounded-2xl border border-cyan-400/20 bg-white/5 p-4">
                <label className="text-sm text-zinc-200">Document Picker</label>
                <select
                  value={documentType}
                  onChange={(event) => setDocumentType(event.target.value as DocumentType)}
                  className="mt-2 w-full rounded-xl border border-white/15 bg-zinc-900/60 px-4 py-3 text-white"
                >
                  {(Object.keys(docLabels) as DocumentType[]).map((key) => (
                    <option key={key} value={key}>
                      {docLabels[key]}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="rounded-2xl border border-white/15 bg-zinc-900/45 p-4 text-zinc-200">
                  <span className="text-sm">Upload Front</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(event) => setFrontFile(event.target.files?.[0] ?? null)}
                    className="mt-2 block w-full text-sm text-zinc-300"
                    required
                  />
                </label>
                <label className="rounded-2xl border border-white/15 bg-zinc-900/45 p-4 text-zinc-200">
                  <span className="text-sm">Upload Back</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(event) => setBackFile(event.target.files?.[0] ?? null)}
                    className="mt-2 block w-full text-sm text-zinc-300"
                    required
                  />
                </label>
              </div>

              <motion.button
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={uploadingDocs}
                className="rounded-xl border border-cyan-400/45 bg-cyan-900/30 px-4 py-3 text-white hover:shadow-[0_0_20px_rgba(34,211,238,0.35)] transition-shadow disabled:opacity-60"
              >
                {uploadingDocs ? "Uploading..." : "Submit Documents"}
              </motion.button>

              {(docSentForReview || (profile?.verification_level ?? 0) >= 2) && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="rounded-xl border border-cyan-300/60 bg-cyan-500/10 px-4 py-3 text-cyan-100 shadow-[0_0_26px_rgba(34,211,238,0.5)]"
                >
                  Document Sent for Review
                </motion.div>
              )}
            </motion.form>
          )}

          {step === 3 && (
            <motion.div
              key="level-3"
              initial={{ x: 24, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -24, opacity: 0 }}
              transition={spring}
              className="mt-8 rounded-2xl border border-white/20 bg-white/5 backdrop-blur-xl p-6"
            >
              <div className="rounded-xl border border-zinc-300/20 bg-zinc-900/30 p-6">
                <p className="text-xs uppercase tracking-[0.18em] text-zinc-400">Locked Tier</p>
                <h2 className="mt-2 font-heading text-2xl text-white font-bold">Level 3 - Elite Status</h2>
                <p className="mt-3 text-zinc-300">Coming Soon. Stay tuned for advanced perks.</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </main>
  );
}
