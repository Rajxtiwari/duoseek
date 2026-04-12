"use client";

import { ReactNode, useState, useEffect } from "react";
import GlassContainer from "./GlassContainer";

interface Section {
  id: string;
  title: string;
}

interface LegalLayoutProps {
  children: ReactNode;
  title: string;
  lastUpdated?: string;
  sections?: Section[];
}

export default function LegalLayout({ children, title, lastUpdated = "April 2026", sections = [] }: LegalLayoutProps) {
  const [activeSection, setActiveSection] = useState<string>("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.3 }
    );

    sections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [sections]);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen pt-20 pb-24 px-6 md:px-12">
      <div className="max-w-7xl mx-auto flex gap-8">
        {sections.length > 0 && (
          <aside className="hidden lg:block w-56 flex-shrink-0 sticky top-24 self-start">
            <GlassContainer dark className="p-5">
              <p className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-4">Contents</p>
              <nav className="space-y-1">
                {sections.map(({ id, title }) => (
                  <button
                    key={id}
                    onClick={() => scrollTo(id)}
                    className={`w-full text-left text-sm px-3 py-2 rounded-lg transition-all duration-200 ${
                      activeSection === id
                        ? "text-purple-400 bg-purple-500/10 border-l-2 border-purple-400"
                        : "text-zinc-400 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    {title}
                  </button>
                ))}
              </nav>
            </GlassContainer>
          </aside>
        )}

        <div className="flex-1 min-w-0">
          <div className="mb-10">
            <div className="flex items-center gap-4 mb-4 flex-wrap">
              <h1 className="font-heading text-4xl md:text-5xl font-bold text-white">{title}</h1>
              {lastUpdated && (
                <span className="bg-glass border border-white/10 text-zinc-400 text-xs px-3 py-1.5 rounded-full">
                  Last Updated: {lastUpdated}
                </span>
              )}
            </div>
            <div className="divider-purple" />
          </div>

          <GlassContainer dark className="p-8 md:p-12">
            <div>{children}</div>
          </GlassContainer>
        </div>
      </div>
    </div>
  );
}
