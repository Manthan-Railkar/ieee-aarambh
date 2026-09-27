"use client";

import React, { useState } from "react";
import { X, CheckCircle, Ticket, User, Mail, BookOpen, Sparkles, Loader2, AlertCircle } from "lucide-react";

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function RegistrationModal({ isOpen, onClose }: RegistrationModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [branch, setBranch] = useState("Computer Science & Engineering");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [ticketId, setTicketId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, branch }),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || "Failed to register. Please try again.");
      }

      if (result.data) {
        if (result.data.ticketId) setTicketId(result.data.ticketId);
        if (result.data.name) setName(result.data.name);
        if (result.data.branch) setBranch(result.data.branch);
      }
      setIsSubmitted(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Something went wrong. Please try again.";
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setName("");
    setEmail("");
    setErrorMessage(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md transition-all">
      <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border border-white/15 bg-neutral-950/90 p-4 sm:p-6 md:p-8 shadow-2xl">
        {/* Glow ambient background */}
        <div className="absolute -top-24 -right-24 h-48 w-48 rounded-full bg-indigo-500/20 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 h-48 w-48 rounded-full bg-amber-500/15 blur-3xl" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {!isSubmitted ? (
          <div>
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 border border-white/10">
                <Ticket className="w-5 h-5 text-amber-300" />
              </div>
              <div>
                <h3 className="text-xl font-bold tracking-tight text-white">Enter Aarambh 2026</h3>
                <p className="text-xs text-neutral-400">Claim your official Freshers Orientation Pass</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-4 h-4 text-neutral-500" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Alex Rivera"
                    className="w-full rounded-xl border border-white/15 bg-white/5 py-2.5 pl-10 pr-4 text-sm text-white placeholder-neutral-500 focus:border-white/40 focus:outline-none focus:ring-1 focus:ring-white/40"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1.5">
                  College Email or Phone
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-4 h-4 text-neutral-500" />
                  <input
                    type="text"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student@college.edu"
                    className="w-full rounded-xl border border-white/15 bg-white/5 py-2.5 pl-10 pr-4 text-sm text-white placeholder-neutral-500 focus:border-white/40 focus:outline-none focus:ring-1 focus:ring-white/40"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1.5">
                  Department / Branch
                </label>
                <div className="relative">
                  <BookOpen className="absolute left-3 top-3 w-4 h-4 text-neutral-500 pointer-events-none" />
                  <select
                    value={branch}
                    onChange={(e) => setBranch(e.target.value)}
                    className="w-full appearance-none rounded-xl border border-white/15 bg-neutral-900 py-2.5 pl-10 pr-4 text-sm text-white focus:border-white/40 focus:outline-none focus:ring-1 focus:ring-white/40"
                  >
                    <option value="Computer Science & Engineering">Computer Science & Engineering</option>
                    <option value="Artificial Intelligence & Data Science">Artificial Intelligence & Data Science</option>
                    <option value="Electronics & Communication">Electronics & Communication</option>
                    <option value="Mechanical & Mechatronics">Mechanical & Mechatronics</option>
                    <option value="Business Administration & Management">Business Administration & Management</option>
                    <option value="Design & Architecture">Design & Architecture</option>
                  </select>
                </div>
              </div>

              {errorMessage && (
                <div className="flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-300">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-white py-3 text-sm font-semibold tracking-wider uppercase text-black hover:bg-neutral-200 transition-all duration-200 hover:shadow-[0_0_25px_rgba(255,255,255,0.3)] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Saving Registration...</span>
                  </>
                ) : (
                  <span>Generate Access Pass</span>
                )}
              </button>
            </form>
          </div>
        ) : (
          <div className="text-center py-2">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <CheckCircle className="w-8 h-8" />
            </div>

            <h3 className="text-2xl font-bold text-white tracking-tight">You are Confirmed!</h3>
            <p className="mt-1 text-xs text-neutral-400">Welcome to Aarambh 2026. Here is your digital badge.</p>

            {/* Digital Badge Card */}
            <div className="mt-6 text-left rounded-xl border border-white/20 bg-gradient-to-br from-white/10 to-white/5 p-5 backdrop-blur-md shadow-inner relative overflow-hidden">
              <div className="flex justify-between items-start border-b border-white/10 pb-3">
                <div>
                  <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-amber-300">
                    AARAMBH PASS 2026
                  </span>
                  <h4 className="text-lg font-bold text-white mt-0.5">{name}</h4>
                  <p className="text-xs text-neutral-400">{branch}</p>
                </div>
                <div className="flex items-center gap-1 bg-white/10 px-2.5 py-1 rounded text-xs font-mono text-neutral-300 border border-white/10">
                  <Sparkles className="w-3 h-3 text-amber-300" />
                  {ticketId}
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between text-xs text-neutral-400">
                <div>
                  <span className="block text-[10px] text-neutral-500 uppercase tracking-wider">Date & Time</span>
                  <span className="text-neutral-200 font-medium">Oct 12, 2026 • 09:30 AM</span>
                </div>
                <div>
                  <span className="block text-[10px] text-neutral-500 uppercase tracking-wider">Venue</span>
                  <span className="text-neutral-200 font-medium">Grand Campus Arena</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleReset}
              className="mt-6 w-full rounded-xl bg-white/10 border border-white/20 py-2.5 text-xs font-semibold tracking-wider uppercase text-white hover:bg-white/20 transition-all"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
