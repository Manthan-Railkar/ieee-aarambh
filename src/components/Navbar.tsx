"use client";

import React, { useState } from "react";
import { Volume2, VolumeX, Sparkles, Compass } from "lucide-react";

interface NavbarProps {
  onExploreClick?: () => void;
  onRegisterClick?: () => void;
}

export default function Navbar({ onExploreClick, onRegisterClick }: NavbarProps) {
  const [isMuted, setIsMuted] = useState(true);

  const toggleSound = () => {
    setIsMuted(!isMuted);
    // If an audio element is present, toggle its mute state
    const audio = document.getElementById("ambient-audio") as HTMLAudioElement | null;
    if (audio) {
      if (isMuted) {
        audio.play().catch(() => {});
        audio.muted = false;
      } else {
        audio.muted = true;
      }
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 md:px-12 backdrop-blur-md bg-black/40 border-b border-white/10 transition-all duration-300">
      {/* Brand */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500/20 via-white/10 to-indigo-500/20 border border-white/20 flex items-center justify-center shadow-[0_0_15px_rgba(255,255,255,0.1)]">
          <Sparkles className="w-4 h-4 text-amber-200" />
        </div>
        <a href="#experience" className="text-lg font-bold tracking-[0.25em] text-white hover:opacity-80 transition-opacity">
          AARAMBH
        </a>
      </div>

      {/* Nav Actions */}
      <div className="flex items-center gap-3 md:gap-6">
        <button
          onClick={toggleSound}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium tracking-wider text-neutral-300 bg-white/5 hover:bg-white/10 border border-white/10 transition-all duration-200"
          aria-label={isMuted ? "Unmute audio" : "Mute audio"}
          title={isMuted ? "Unmute ambient audio" : "Mute ambient audio"}
        >
          {isMuted ? (
            <>
              <VolumeX className="w-3.5 h-3.5 text-neutral-400" />
              <span className="hidden sm:inline">SOUND OFF</span>
            </>
          ) : (
            <>
              <Volume2 className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              <span className="hidden sm:inline text-emerald-300">SOUND ON</span>
            </>
          )}
        </button>

        {onExploreClick && (
          <button
            onClick={onExploreClick}
            className="hidden sm:flex items-center gap-1.5 text-xs font-medium tracking-wider uppercase text-neutral-300 hover:text-white transition-colors"
          >
            <Compass className="w-3.5 h-3.5" />
            Explore
          </button>
        )}

        <button
          onClick={onRegisterClick}
          className="px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase bg-white text-black hover:bg-neutral-200 transition-all duration-200 hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.2)]"
        >
          Register
        </button>
      </div>
    </header>
  );
}
