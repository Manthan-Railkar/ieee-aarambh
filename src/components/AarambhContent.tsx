"use client";

import React from "react";
import { ArrowRight } from "lucide-react";

interface AarambhContentProps {
  onRegisterClick: () => void;
}

export default function AarambhContent({ onRegisterClick }: AarambhContentProps) {
  return (
    <section
      id="aarambh-content"
      className="relative w-full min-h-screen bg-[#111] text-white flex flex-col justify-center items-center text-center px-6 z-30"
    >
      <div className="content-inner max-w-4xl mx-auto flex flex-col items-center gap-5 sm:gap-6">
        {/* Eyebrow */}
        <p className="eyebrow text-xs tracking-[0.35em] uppercase text-neutral-400 font-medium">
          WELCOME TO
        </p>

        {/* Main Title */}
        <h1 className="text-6xl sm:text-8xl md:text-9xl lg:text-[150px] font-black tracking-[-0.05em] leading-[0.9] select-none text-white">
          AARAMBH
        </h1>

        {/* Subtitle */}
        <p className="subtitle text-base sm:text-lg md:text-xl text-neutral-300 opacity-70 max-w-xl font-light">
          Where your college journey begins.
        </p>

        {/* Register CTA Button */}
        <button
          id="register-btn"
          onClick={onRegisterClick}
          className="mt-5 inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-white text-black text-sm font-semibold tracking-wide cursor-pointer transition-transform duration-200 hover:scale-105 active:scale-95 shadow-[0_0_25px_rgba(255,255,255,0.25)]"
        >
          <span>Enter Aarambh</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </section>
  );
}
