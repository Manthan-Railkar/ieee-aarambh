"use client";

import React from "react";
import { X, Calendar, MapPin, Sparkles, Users, Award, ShieldCheck } from "lucide-react";

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRegisterClick: () => void;
}

export default function InfoModal({ isOpen, onClose, onRegisterClick }: InfoModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md transition-all">
      <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl border border-white/20 bg-neutral-950 p-4 sm:p-6 md:p-8 shadow-2xl">
        {/* Glow ambient background */}
        <div className="absolute -top-20 -right-20 h-44 w-44 rounded-full bg-amber-500/15 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 h-44 w-44 rounded-full bg-blue-500/15 blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
          aria-label="Close info modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 border-b border-white/10 pb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/20 border border-amber-500/30">
            <Sparkles className="w-5 h-5 text-amber-300" />
          </div>
          <div>
            <h3 className="text-xl font-bold tracking-tight text-white">About Aarambh 2026</h3>
            <p className="text-xs text-neutral-400">Presented by IEEE SPIT</p>
          </div>
        </div>

        {/* Info Grid */}
        <div className="mt-5 space-y-4 text-neutral-300 text-sm">
          <p className="leading-relaxed text-xs sm:text-sm text-neutral-300">
            <span className="font-semibold text-white">Aarambh</span> is the flagship freshman induction & cultural orientation fest. Designed to welcome incoming students into college life, innovation hubs, hackathons, and creative clubs.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/10">
              <Calendar className="w-4 h-4 text-amber-300 shrink-0" />
              <div>
                <p className="text-[10px] uppercase font-mono text-neutral-500">Dates</p>
                <p className="text-xs font-semibold text-white">October 12 – 15, 2026</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/10">
              <MapPin className="w-4 h-4 text-blue-400 shrink-0" />
              <div>
                <p className="text-[10px] uppercase font-mono text-neutral-500">Venue</p>
                <p className="text-xs font-semibold text-white">Campus Auditorium & Quad</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/10">
              <Users className="w-4 h-4 text-emerald-400 shrink-0" />
              <div>
                <p className="text-[10px] uppercase font-mono text-neutral-500">Eligibility</p>
                <p className="text-xs font-semibold text-white">All Incoming Freshmen</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/10">
              <Award className="w-4 h-4 text-purple-400 shrink-0" />
              <div>
                <p className="text-[10px] uppercase font-mono text-neutral-500">Organized By</p>
                <p className="text-xs font-semibold text-white">IEEE SPIT Committee</p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3.5 mt-2 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
            <p className="text-[11px] text-neutral-400 leading-normal">
              Digital Orientation Passes are mandatory for entry. Ensure you claim your pass using the Register button.
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-white/10">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-neutral-400 hover:text-white transition-colors"
          >
            Close
          </button>
          <button
            onClick={() => {
              onClose();
              onRegisterClick();
            }}
            className="px-5 py-2.5 rounded-xl bg-white text-black text-xs font-bold tracking-wider uppercase hover:bg-neutral-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)]"
          >
            Get Pass Now
          </button>
        </div>
      </div>
    </div>
  );
}
