"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Briefcase,
  GraduationCap,
  ShieldCheck,
  Sparkles,
  UserRound,
  Venus,
  Mars,
  CircleHelp,
  Smartphone,
  ScanFace,
  Gamepad2,
  Swords,
  Crosshair,
  Flame,
  Shield,
  Clock3,
  Sun,
  Sunset,
  Moon,
  CalendarDays,
  ArrowLeft,
  ArrowRight,
  Check,
  X,
  Upload,
} from "lucide-react";
import Image from "next/image";
import { useAuthOverlay } from "@/components/auth/AuthProvider";

type OnboardingStage = 1 | 2 | 3 | 4 | 5;
type OccupationMode = "student" | "working";
type GenderMode = "male" | "female" | "other";
type DocumentType = "aadhar" | "student-id" | "license" | "passport" | "other";
type TimeBlock = "morning" | "afternoon" | "night" | "weekend";
type RoleChoice = "duelist" | "controller" | "initiator" | "sentinel";
type StrategyChoice = "aggressive" | "tactical";
type WeaponChoice = "vandal" | "phantom";

const stageLabels: Array<{ id: OnboardingStage; title: string; subtitle: string }> = [
  { id: 1, title: "Identity", subtitle: "Gamer Card" },
  { id: 2, title: "Proximity", subtitle: "Low-Ping Match" },
  { id: 3, title: "Security", subtitle: "Verification" },
  { id: 4, title: "Vibe", subtitle: "Personality" },
  { id: 5, title: "Matchmaker", subtitle: "Deep Integration" },
];

const vibeTags = ["Toxic-free", "Comms-heavy", "IGL", "Tilt-proof", "Clutch-focused", "Eco-smart", "Objective-first"];
const documents: Array<{ id: DocumentType; label: string }> = [
  { id: "aadhar", label: "Aadhar" },
  { id: "student-id", label: "Student ID" },
  { id: "license", label: "Driving License" },
  { id: "passport", label: "Passport" },
  { id: "other", label: "Other" },
];
const maps = ["Ascent", "Bind", "Haven", "Lotus", "Split", "Sunset"];
const games = ["Valorant", "CS2", "Apex Legends", "Fortnite", "Dota 2", "League of Legends"];

function stageTitle(stage: OnboardingStage) {
  return stageLabels.find((item) => item.id === stage) ?? stageLabels[0];
}

export default function OnboardingDashboard() {
  const { user, showToast, openAuthOverlay } = useAuthOverlay();
  const [stage, setStage] = useState<OnboardingStage>(1);

  const [displayName, setDisplayName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [gender, setGender] = useState<GenderMode>("other");
  const [occupationMode, setOccupationMode] = useState<OccupationMode>("student");
  const [institutionName, setInstitutionName] = useState("");
  const [yearOfStudy, setYearOfStudy] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [workRole, setWorkRole] = useState("");
  const [funFact, setFunFact] = useState("");

  const [otpDigits, setOtpDigits] = useState<string[]>(["", "", "", "", "", ""]);
  const [cityArea, setCityArea] = useState("Unknown area");
  const [geoBusy, setGeoBusy] = useState(false);

  const [docType, setDocType] = useState<DocumentType>("aadhar");
  const [docPreview, setDocPreview] = useState<string | null>(null);
  const [docName, setDocName] = useState<string>("");

  const [socialType, setSocialType] = useState(50);
  const [energyLevel, setEnergyLevel] = useState(50);
  const [timeBlocks, setTimeBlocks] = useState<TimeBlock[]>([]);
  const [chosenVibes, setChosenVibes] = useState<string[]>([]);

  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const [riotConnected, setRiotConnected] = useState(false);
  const [weaponChoice, setWeaponChoice] = useState<WeaponChoice>("vandal");
  const [roleChoice, setRoleChoice] = useState<RoleChoice>("duelist");
  const [strategyChoice, setStrategyChoice] = useState<StrategyChoice>("aggressive");
  const [mapIndex, setMapIndex] = useState(0);
  const [likedMaps, setLikedMaps] = useState<string[]>([]);
  const [dislikedMaps, setDislikedMaps] = useState<string[]>([]);

  const age = useMemo(() => {
    if (!birthDate) return null;
    const now = new Date();
    const birth = new Date(birthDate);
    let value = now.getFullYear() - birth.getFullYear();
    const monthDiff = now.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < birth.getDate())) {
      value -= 1;
    }
    return value;
  }, [birthDate]);

  const progress = (stage / 5) * 100;
  const currentMap = maps[mapIndex] ?? maps[0];

  const onOtpChange = (index: number, value: string) => {
    const safeValue = value.replace(/\D/g, "").slice(0, 1);
    const next = [...otpDigits];
    next[index] = safeValue;
    setOtpDigits(next);
  };

  const toggleTimeBlock = (block: TimeBlock) => {
    setTimeBlocks((current) =>
      current.includes(block) ? current.filter((entry) => entry !== block) : [...current, block],
    );
  };

  const toggleVibeTag = (tag: string) => {
    setChosenVibes((current) =>
      current.includes(tag) ? current.filter((entry) => entry !== tag) : [...current, tag],
    );
  };

  const handleDocPick = (file: File | null) => {
    if (!file) return;
    setDocName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      setDocPreview(typeof reader.result === "string" ? reader.result : null);
    };
    reader.readAsDataURL(file);
  };

  const findLocalArea = () => {
    if (!navigator.geolocation) {
      showToast({ title: "Geolocation unavailable", description: "Your browser does not support geolocation.", variant: "error" });
      return;
    }

    setGeoBusy(true);
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${coords.latitude}&lon=${coords.longitude}`,
          );
          const payload = (await response.json()) as {
            address?: { city?: string; town?: string; village?: string; suburb?: string; state?: string };
          };
          const resolvedCity =
            payload.address?.city || payload.address?.town || payload.address?.village || payload.address?.suburb || "your area";
          const resolvedState = payload.address?.state ? `, ${payload.address.state}` : "";
          setCityArea(`${resolvedCity}${resolvedState}`);
          showToast({ title: "Location captured", description: `Local queue tuned for ${resolvedCity}.`, variant: "success" });
        } catch {
          setCityArea(`${coords.latitude.toFixed(2)}, ${coords.longitude.toFixed(2)}`);
          showToast({ title: "Location captured", description: "Using coordinate-based local matching.", variant: "info" });
        } finally {
          setGeoBusy(false);
        }
      },
      () => {
        setGeoBusy(false);
        showToast({ title: "Location denied", description: "You can continue without location access.", variant: "info" });
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 0 },
    );
  };

  const handleMapVote = (vote: "like" | "dislike") => {
    if (vote === "like") {
      setLikedMaps((current) => (current.includes(currentMap) ? current : [...current, currentMap]));
      setDislikedMaps((current) => current.filter((entry) => entry !== currentMap));
    } else {
      setDislikedMaps((current) => (current.includes(currentMap) ? current : [...current, currentMap]));
      setLikedMaps((current) => current.filter((entry) => entry !== currentMap));
    }

    setMapIndex((current) => (current + 1) % maps.length);
  };

  const onComplete = () => {
    showToast({
      title: "Onboarding complete",
      description: "Your duo profile is tuned. Start queueing from Shuffle.",
      variant: "success",
    });
  };

  const canGoNext = stage < 5;
  const canGoBack = stage > 1;
  const title = stageTitle(stage);

  if (!user) {
    return (
      <main className="min-h-screen pt-24 pb-16 px-4 md:px-10">
        <section className="max-w-3xl mx-auto rounded-3xl border border-white/10 bg-glass-dark p-8">
          <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">Dashboard Access</p>
          <h1 className="font-heading text-4xl font-bold mt-2">Sign in to open onboarding dashboard</h1>
          <p className="text-zinc-300 mt-3">
            This experience is personalized from your account identity, linked providers, and profile preferences.
          </p>
          <button
            type="button"
            onClick={() => openAuthOverlay("generic", "/dashboard")}
            className="mt-6 rounded-xl border border-cyan-300/45 bg-cyan-900/30 px-4 py-2 text-white"
          >
            Sign In to Continue
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen pt-24 pb-16 px-4 md:px-10 relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_22%,rgba(34,211,238,0.2),transparent_40%),radial-gradient(circle_at_82%_20%,rgba(168,85,247,0.2),transparent_45%),radial-gradient(circle_at_50%_80%,rgba(251,191,36,0.12),transparent_40%)]" />

      <section className="max-w-6xl mx-auto relative z-10">
        <div className="rounded-3xl border border-white/10 bg-glass-dark p-5 md:p-8 shadow-[0_0_45px_rgba(8,145,178,0.12)]">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-cyan-300">Welcome {user?.email?.split("@")[0] || "gamer"}</p>
              <h1 className="font-heading text-4xl md:text-5xl font-bold mt-1 text-white">Your Match DNA Dashboard</h1>
              <p className="text-zinc-300 mt-2">Stage {stage} of 5: {title.subtitle}</p>
            </div>
            <div className="w-full md:w-64">
              <div className="h-2 rounded-full bg-zinc-800 overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400"
                  animate={{ width: `${progress}%` }}
                  transition={{ type: "spring", stiffness: 210, damping: 24 }}
                />
              </div>
              <div className="mt-2 grid grid-cols-5 gap-2 text-[11px] text-zinc-400">
                {stageLabels.map((item) => (
                  <span key={item.id} className={item.id <= stage ? "text-cyan-300" : "text-zinc-500"}>{item.id}</span>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-7 grid grid-cols-2 md:grid-cols-5 gap-2">
            {stageLabels.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setStage(item.id)}
                className={`rounded-xl px-3 py-2 text-left border transition-colors ${
                  item.id === stage
                    ? "border-cyan-300/60 bg-cyan-900/30 text-white"
                    : "border-white/10 bg-zinc-900/35 text-zinc-300 hover:border-white/25"
                }`}
              >
                <p className="text-xs uppercase tracking-wide">Stage {item.id}</p>
                <p className="text-sm font-semibold">{item.title}</p>
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={stage}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.24 }}
              className="mt-8"
            >
              {stage === 1 && (
                <div className="space-y-6">
                  <div className="rounded-2xl border border-white/10 bg-zinc-950/55 p-5">
                    <p className="text-xs uppercase tracking-[0.2em] text-purple-300">Identity & Occupation Gamer Card</p>
                    <div className="mt-4 grid md:grid-cols-2 gap-4">
                      <label className="space-y-2">
                        <span className="text-sm text-zinc-300">Display Name</span>
                        <input
                          value={displayName}
                          onChange={(event) => setDisplayName(event.target.value)}
                          placeholder="NeonJett"
                          className="w-full rounded-xl border border-white/15 bg-zinc-900/70 px-4 py-3 text-white"
                        />
                      </label>
                      <label className="space-y-2">
                        <span className="text-sm text-zinc-300">Date of Birth</span>
                        <input
                          type="date"
                          value={birthDate}
                          onChange={(event) => setBirthDate(event.target.value)}
                          className="w-full rounded-xl border border-white/15 bg-zinc-900/70 px-4 py-3 text-white"
                        />
                        <p className="text-xs text-zinc-400">Calculated age: {age ?? "-"}</p>
                      </label>
                    </div>

                    <div className="mt-5">
                      <p className="text-sm text-zinc-300 mb-2">Gender Selection</p>
                      <div className="grid sm:grid-cols-3 gap-3">
                        {[
                          { id: "male", label: "Male", icon: Mars },
                          { id: "female", label: "Female", icon: Venus },
                          { id: "other", label: "Other", icon: UserRound },
                        ].map((item) => {
                          const Icon = item.icon;
                          const active = gender === item.id;
                          return (
                            <button
                              key={item.id}
                              type="button"
                              onClick={() => setGender(item.id as GenderMode)}
                              className={`rounded-xl border px-3 py-3 flex items-center gap-2 justify-center ${
                                active ? "border-cyan-300/60 bg-cyan-900/30 text-cyan-200" : "border-white/10 bg-zinc-900/45 text-zinc-300"
                              }`}
                            >
                              <Icon className="h-4 w-4" />
                              {item.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="mt-6 rounded-xl border border-white/10 p-4 bg-zinc-900/35">
                      <p className="text-sm text-zinc-300">Life Status</p>
                      <div className="mt-3 flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => setOccupationMode("student")}
                          className={`flex-1 rounded-lg px-3 py-2 border flex items-center justify-center gap-2 ${
                            occupationMode === "student" ? "border-emerald-300/60 bg-emerald-900/30 text-emerald-200" : "border-white/10 text-zinc-300"
                          }`}
                        >
                          <GraduationCap className="h-4 w-4" />
                          Student
                        </button>
                        <button
                          type="button"
                          onClick={() => setOccupationMode("working")}
                          className={`flex-1 rounded-lg px-3 py-2 border flex items-center justify-center gap-2 ${
                            occupationMode === "working" ? "border-amber-300/60 bg-amber-900/30 text-amber-200" : "border-white/10 text-zinc-300"
                          }`}
                        >
                          <Briefcase className="h-4 w-4" />
                          Working
                        </button>
                      </div>

                      <div className="mt-4 grid md:grid-cols-2 gap-4">
                        {occupationMode === "student" ? (
                          <>
                            <input
                              value={institutionName}
                              onChange={(event) => setInstitutionName(event.target.value)}
                              placeholder="Institution Name"
                              className="rounded-xl border border-white/15 bg-zinc-900/70 px-4 py-3 text-white"
                            />
                            <input
                              value={yearOfStudy}
                              onChange={(event) => setYearOfStudy(event.target.value)}
                              placeholder="Year of Study"
                              className="rounded-xl border border-white/15 bg-zinc-900/70 px-4 py-3 text-white"
                            />
                          </>
                        ) : (
                          <>
                            <input
                              value={companyName}
                              onChange={(event) => setCompanyName(event.target.value)}
                              placeholder="Company Name"
                              className="rounded-xl border border-white/15 bg-zinc-900/70 px-4 py-3 text-white"
                            />
                            <input
                              value={workRole}
                              onChange={(event) => setWorkRole(event.target.value)}
                              placeholder="Role"
                              className="rounded-xl border border-white/15 bg-zinc-900/70 px-4 py-3 text-white"
                            />
                          </>
                        )}
                      </div>
                    </div>

                    <label className="mt-5 block space-y-2">
                      <span className="text-sm text-zinc-300">Fun Fact (max 150)</span>
                      <textarea
                        value={funFact}
                        onChange={(event) => setFunFact(event.target.value.slice(0, 150))}
                        placeholder="I warm up with no-audio deathmatch runs before ranked."
                        className="w-full min-h-24 rounded-xl border border-white/15 bg-zinc-900/70 px-4 py-3 text-white"
                      />
                      <p className="text-xs text-zinc-500">{funFact.length}/150</p>
                    </label>
                  </div>
                </div>
              )}

              {stage === 2 && (
                <div className="grid lg:grid-cols-2 gap-5">
                  <div className="rounded-2xl border border-cyan-300/20 bg-zinc-950/60 p-5">
                    <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">Proximity & Low-Ping Matching</p>
                    <div className="mt-5 relative h-72 rounded-2xl border border-white/10 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.24),rgba(15,23,42,0.45)_35%,rgba(2,6,23,0.92)_75%)] overflow-hidden">
                      {[0, 1, 2, 3].map((ring) => (
                        <div
                          key={ring}
                          className="absolute rounded-full border border-cyan-300/20"
                          style={{
                            width: `${(ring + 1) * 24}%`,
                            height: `${(ring + 1) * 24}%`,
                            left: `${50 - (ring + 1) * 12}%`,
                            top: `${50 - (ring + 1) * 12}%`,
                          }}
                        />
                      ))}
                      <motion.div
                        className="absolute w-4 h-4 rounded-full bg-cyan-300"
                        animate={{ scale: [1, 1.7, 1], opacity: [0.9, 0.35, 0.9] }}
                        transition={{ duration: 1.8, repeat: Infinity }}
                        style={{ left: "49%", top: "49%" }}
                      />
                      <div className="absolute bottom-3 left-3 rounded-lg border border-white/10 bg-zinc-950/80 px-3 py-2 text-xs text-zinc-300">
                        Current local focus: {cityArea}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-5">
                    <div className="rounded-2xl border border-white/10 bg-zinc-950/55 p-5">
                      <p className="text-sm text-zinc-200 flex items-center gap-2"><Smartphone className="h-4 w-4" /> Phone Verification (Optional)</p>
                      <div className="mt-3 flex gap-2">
                        {otpDigits.map((digit, index) => (
                          <input
                            key={index}
                            value={digit}
                            onChange={(event) => onOtpChange(index, event.target.value)}
                            inputMode="numeric"
                            maxLength={1}
                            className="h-12 w-10 rounded-lg border border-white/15 bg-zinc-900/70 text-center text-white"
                          />
                        ))}
                      </div>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-zinc-950/55 p-5">
                      <button
                        type="button"
                        onClick={findLocalArea}
                        disabled={geoBusy}
                        className="rounded-xl border border-cyan-400/50 bg-cyan-900/25 px-4 py-3 text-white"
                      >
                        {geoBusy ? "Finding location..." : "Find Local Teammates"}
                      </button>
                      <div className="mt-4 rounded-xl border border-cyan-300/20 bg-cyan-950/20 p-3 text-sm text-cyan-100">
                        <p className="flex items-center gap-2 font-medium"><CircleHelp className="h-4 w-4" /> Why?</p>
                        <p className="mt-1 text-cyan-100/90">
                          We match you with local players in {cityArea} to ensure you are on the same server for the lowest possible ping.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {stage === 3 && (
                <div className="space-y-5">
                  <div className="rounded-2xl border border-white/10 bg-zinc-950/55 p-5">
                    <p className="text-xs uppercase tracking-[0.2em] text-emerald-300">Security Clearance</p>
                    <div className="mt-3 h-2 rounded-full bg-zinc-800 overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-emerald-400 to-cyan-400" style={{ width: docPreview ? "100%" : "45%" }} />
                    </div>
                    <p className="mt-2 text-xs text-zinc-400">Verified Badge Progress: {docPreview ? "Document selected" : "Awaiting upload"}</p>
                  </div>

                  <div className="grid md:grid-cols-5 gap-2">
                    {documents.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setDocType(item.id)}
                        className={`rounded-xl border px-3 py-3 text-sm ${
                          docType === item.id ? "border-emerald-300/60 bg-emerald-900/20 text-emerald-200" : "border-white/10 bg-zinc-900/40 text-zinc-300"
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>

                  <label
                    className="block rounded-2xl border-2 border-dashed border-white/20 bg-zinc-900/45 p-6 text-center cursor-pointer"
                    onDrop={(event) => {
                      event.preventDefault();
                      handleDocPick(event.dataTransfer.files?.[0] ?? null);
                    }}
                    onDragOver={(event) => event.preventDefault()}
                  >
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*,application/pdf"
                      onChange={(event) => handleDocPick(event.target.files?.[0] ?? null)}
                    />
                    <Upload className="h-5 w-5 mx-auto text-zinc-300" />
                    <p className="mt-2 text-zinc-200">Drag and drop your document, or click to browse</p>
                    <p className="text-xs text-zinc-500 mt-1">Selected type: {documents.find((item) => item.id === docType)?.label}</p>
                  </label>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="rounded-xl border border-white/10 bg-zinc-900/45 p-4 min-h-44 flex items-center justify-center">
                      {docPreview ? (
                        <Image
                          src={docPreview}
                          alt="Document preview"
                          width={260}
                          height={200}
                          className="max-h-40 w-auto rounded-lg object-cover"
                          unoptimized
                        />
                      ) : (
                        <p className="text-zinc-500 text-sm">No preview selected</p>
                      )}
                    </div>
                    <div className="rounded-xl border border-emerald-300/30 bg-emerald-950/20 p-4 text-emerald-100">
                      <p className="font-medium flex items-center gap-2"><ShieldCheck className="h-4 w-4" /> Privacy Shield</p>
                      <p className="mt-2 text-sm">
                        Documents are encrypted and stored in a private vault. Only used for age and identity verification.
                      </p>
                      {docName && <p className="mt-2 text-xs text-emerald-200/80">Selected file: {docName}</p>}
                    </div>
                  </div>
                </div>
              )}

              {stage === 4 && (
                <div className="space-y-5">
                  <div className="rounded-2xl border border-white/10 bg-zinc-950/55 p-5">
                    <p className="text-xs uppercase tracking-[0.2em] text-pink-300">Personality & The Vibe</p>
                    <div className="mt-4 grid md:grid-cols-2 gap-4">
                      <div className="rounded-xl border border-white/10 bg-zinc-900/45 p-4">
                        <p className="text-sm text-zinc-200">Social Type</p>
                        <input type="range" min={0} max={100} value={socialType} onChange={(event) => setSocialType(Number(event.target.value))} className="w-full mt-3" />
                        <p className="text-xs text-zinc-400 mt-2">{socialType < 50 ? "Introvert" : "Extrovert"}</p>
                      </div>
                      <div className="rounded-xl border border-white/10 bg-zinc-900/45 p-4">
                        <p className="text-sm text-zinc-200">Energy Level</p>
                        <input type="range" min={0} max={100} value={energyLevel} onChange={(event) => setEnergyLevel(Number(event.target.value))} className="w-full mt-3" />
                        <p className="text-xs text-zinc-400 mt-2">{energyLevel < 50 ? "Chill / Casual" : "Sweaty / Tryhard"}</p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-zinc-950/55 p-5">
                    <p className="text-sm text-zinc-200 flex items-center gap-2"><Clock3 className="h-4 w-4" /> Schedule</p>
                    <div className="mt-3 grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
                      {[
                        { id: "morning", label: "Morning", icon: Sun },
                        { id: "afternoon", label: "Afternoon", icon: Sunset },
                        { id: "night", label: "Night Owl", icon: Moon },
                        { id: "weekend", label: "Weekend Warrior", icon: CalendarDays },
                      ].map((entry) => {
                        const Icon = entry.icon;
                        const active = timeBlocks.includes(entry.id as TimeBlock);
                        return (
                          <button
                            key={entry.id}
                            type="button"
                            onClick={() => toggleTimeBlock(entry.id as TimeBlock)}
                            className={`rounded-xl border px-3 py-3 flex items-center gap-2 justify-center ${
                              active ? "border-cyan-300/60 bg-cyan-900/25 text-cyan-100" : "border-white/10 bg-zinc-900/40 text-zinc-300"
                            }`}
                          >
                            <Icon className="h-4 w-4" />
                            {entry.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-zinc-950/55 p-5">
                    <p className="text-sm text-zinc-200 flex items-center gap-2"><Sparkles className="h-4 w-4" /> Vibe Tags</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {vibeTags.map((tag) => {
                        const active = chosenVibes.includes(tag);
                        return (
                          <button
                            key={tag}
                            type="button"
                            onClick={() => toggleVibeTag(tag)}
                            className={`rounded-full px-3 py-1.5 text-sm border ${
                              active ? "border-fuchsia-300/70 bg-fuchsia-900/30 text-fuchsia-100" : "border-white/15 text-zinc-300"
                            }`}
                          >
                            {tag}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {stage === 5 && (
                <div className="space-y-5">
                  <div className="rounded-2xl border border-white/10 bg-zinc-950/55 p-5">
                    <p className="text-xs uppercase tracking-[0.2em] text-amber-300">Deep Game Integration</p>
                    <div className="mt-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {games.map((game) => (
                        <button
                          key={game}
                          type="button"
                          onClick={() => setSelectedGame(game)}
                          className={`rounded-xl border px-3 py-3 text-left ${
                            selectedGame === game ? "border-amber-300/60 bg-amber-900/25 text-amber-100" : "border-white/10 bg-zinc-900/40 text-zinc-200"
                          }`}
                        >
                          <p className="font-semibold">{game}</p>
                          <p className="text-xs text-zinc-400 mt-1">Open deep data modal</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  <AnimatePresence>
                    {selectedGame && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[70] bg-black/65 backdrop-blur-sm p-4 md:p-8"
                        onClick={() => setSelectedGame(null)}
                      >
                        <motion.div
                          initial={{ opacity: 0, y: 14 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.2 }}
                          className="max-w-4xl mx-auto max-h-[88vh] overflow-y-auto rounded-2xl border border-amber-300/40 bg-zinc-950/95 p-5"
                          onClick={(event) => event.stopPropagation()}
                        >
                          <div className="flex items-center justify-between gap-3">
                            <p className="text-lg font-semibold text-white">{selectedGame} Deep Data</p>
                            <button type="button" onClick={() => setSelectedGame(null)} className="text-zinc-400 hover:text-white">
                              <X className="h-4 w-4" />
                            </button>
                          </div>

                          {selectedGame === "Valorant" ? (
                            <div className="mt-4 space-y-4">
                            <div className="rounded-xl border border-cyan-300/35 bg-cyan-950/20 p-4">
                              <p className="text-sm text-cyan-100 flex items-center gap-2"><ScanFace className="h-4 w-4" /> Riot Account Connection</p>
                              <button
                                type="button"
                                onClick={() => setRiotConnected(true)}
                                className="mt-3 rounded-lg border border-cyan-300/50 bg-cyan-900/30 px-4 py-2 text-cyan-100"
                              >
                                {riotConnected ? "Riot Connected" : "Connect Riot Account"}
                              </button>
                            </div>

                            <div className="grid md:grid-cols-2 gap-4">
                              <div className="rounded-xl border border-white/10 bg-zinc-900/45 p-4">
                                <p className="text-sm text-zinc-200 flex items-center gap-2"><Crosshair className="h-4 w-4" /> Weapon Choice</p>
                                <div className="mt-3 grid grid-cols-2 gap-2">
                                  {[
                                    { id: "vandal", label: "Vandal" },
                                    { id: "phantom", label: "Phantom" },
                                  ].map((item) => (
                                    <button
                                      key={item.id}
                                      type="button"
                                      onClick={() => setWeaponChoice(item.id as WeaponChoice)}
                                      className={`rounded-lg border px-3 py-3 ${
                                        weaponChoice === item.id ? "border-purple-300/60 bg-purple-900/30 text-purple-100" : "border-white/10 text-zinc-300"
                                      }`}
                                    >
                                      {item.label}
                                    </button>
                                  ))}
                                </div>
                              </div>

                              <div className="rounded-xl border border-white/10 bg-zinc-900/45 p-4">
                                <p className="text-sm text-zinc-200 flex items-center gap-2"><Gamepad2 className="h-4 w-4" /> Playstyle Role</p>
                                <div className="mt-3 grid grid-cols-2 gap-2">
                                  {[
                                    { id: "duelist", label: "Duelist", icon: Swords },
                                    { id: "controller", label: "Controller", icon: Shield },
                                    { id: "initiator", label: "Initiator", icon: Flame },
                                    { id: "sentinel", label: "Sentinel", icon: ShieldCheck },
                                  ].map((item) => {
                                    const Icon = item.icon;
                                    return (
                                      <button
                                        key={item.id}
                                        type="button"
                                        onClick={() => setRoleChoice(item.id as RoleChoice)}
                                        className={`rounded-lg border px-3 py-2 text-sm flex items-center justify-center gap-2 ${
                                          roleChoice === item.id ? "border-cyan-300/60 bg-cyan-900/30 text-cyan-100" : "border-white/10 text-zinc-300"
                                        }`}
                                      >
                                        <Icon className="h-4 w-4" />
                                        {item.label}
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>
                            </div>

                            <div className="rounded-xl border border-white/10 bg-zinc-900/45 p-4">
                              <p className="text-sm text-zinc-200">Strategy</p>
                              <div className="mt-2 grid sm:grid-cols-2 gap-2">
                                <button
                                  type="button"
                                  onClick={() => setStrategyChoice("aggressive")}
                                  className={`rounded-lg border px-3 py-3 ${
                                    strategyChoice === "aggressive" ? "border-rose-300/60 bg-rose-900/30 text-rose-100" : "border-white/10 text-zinc-300"
                                  }`}
                                >
                                  Aggressive / Rush
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setStrategyChoice("tactical")}
                                  className={`rounded-lg border px-3 py-3 ${
                                    strategyChoice === "tactical" ? "border-emerald-300/60 bg-emerald-900/30 text-emerald-100" : "border-white/10 text-zinc-300"
                                  }`}
                                >
                                  Tactical / Slow
                                </button>
                              </div>
                            </div>

                            <div className="rounded-xl border border-white/10 bg-zinc-900/45 p-4">
                              <p className="text-sm text-zinc-200">Map Preferences (Like / Dislike)</p>
                              <div className="mt-3 rounded-xl border border-white/10 bg-zinc-950/75 p-6 text-center">
                                <p className="text-xs text-zinc-500">Current map</p>
                                <p className="text-2xl font-semibold mt-1">{currentMap}</p>
                                <div className="mt-4 flex items-center justify-center gap-3">
                                  <button
                                    type="button"
                                    onClick={() => handleMapVote("dislike")}
                                    className="rounded-lg border border-rose-300/50 bg-rose-900/20 px-4 py-2 text-rose-100"
                                  >
                                    Dislike
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleMapVote("like")}
                                    className="rounded-lg border border-emerald-300/50 bg-emerald-900/20 px-4 py-2 text-emerald-100"
                                  >
                                    Like
                                  </button>
                                </div>
                              </div>
                              <div className="mt-3 grid sm:grid-cols-2 gap-2 text-xs text-zinc-300">
                                <p>Liked: {likedMaps.length ? likedMaps.join(", ") : "none"}</p>
                                <p>Disliked: {dislikedMaps.length ? dislikedMaps.join(", ") : "none"}</p>
                              </div>
                            </div>
                            </div>
                          ) : (
                            <div className="mt-4 rounded-xl border border-white/10 bg-zinc-900/45 p-4 text-zinc-300">
                              <p className="text-sm">Manual preference setup will be used for {selectedGame}.</p>
                              <p className="text-xs mt-2 text-zinc-400">Pick your top loadout, role and play rhythm to improve duo matching confidence.</p>
                            </div>
                          )}
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => canGoBack && setStage((stage - 1) as OnboardingStage)}
              disabled={!canGoBack}
              className="rounded-xl border border-white/15 px-4 py-2 text-zinc-200 disabled:opacity-50"
            >
              <span className="inline-flex items-center gap-2"><ArrowLeft className="h-4 w-4" /> Previous</span>
            </button>

            {stage < 5 ? (
              <button
                type="button"
                onClick={() => canGoNext && setStage((stage + 1) as OnboardingStage)}
                className="rounded-xl border border-cyan-300/45 bg-cyan-900/30 px-4 py-2 text-white"
              >
                <span className="inline-flex items-center gap-2">Next Stage <ArrowRight className="h-4 w-4" /></span>
              </button>
            ) : (
              <button
                type="button"
                onClick={onComplete}
                className="rounded-xl border border-emerald-300/45 bg-emerald-900/30 px-4 py-2 text-emerald-100"
              >
                <span className="inline-flex items-center gap-2"><Check className="h-4 w-4" /> Complete Onboarding</span>
              </button>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
