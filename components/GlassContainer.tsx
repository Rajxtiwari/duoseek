"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface GlassContainerProps {
  children: ReactNode;
  className?: string;
  dark?: boolean;
  style?: React.CSSProperties;
}

export default function GlassContainer({ children, className, dark = false, style }: GlassContainerProps) {
  return (
    <div className={cn(dark ? "bg-glass-dark" : "bg-glass", "rounded-2xl", className)} style={style}>
      {children}
    </div>
  );
}
