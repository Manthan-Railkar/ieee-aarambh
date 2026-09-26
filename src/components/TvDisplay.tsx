"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Power,
  Ticket,
  Info,
  User,
  Mail,
  Phone,
  Hash,
  BookOpen,
  ArrowLeft,
  CheckCircle,
  ChevronDown,
  ArrowRight,
} from "lucide-react";
import FadeContent from "@/components/react-bits/FadeContent";
import InteractiveTvBackground from "@/components/InteractiveTvBackground";

export default function TvDisplay() {
  const [powerState, setPowerState] = useState<"on" | "turning-off" | "off" | "turning-on">("on");
  const isPoweredOn = powerState === "on" || powerState === "turning-on";
  const [currentChannel, setCurrentChannel] = useState<"home" | "register" | "info">("home");
  const [isStaticGlitching, setIsStaticGlitching] = useState(false);

  // Registration Form State
  const [name, setName] = useState("");
  const [uid, setUid] = useState("");
  const [branch, setBranch] = useState("CSE");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [issuedPassId, setIssuedPassId] = useState("");

  const staticCanvasRef = useRef<HTMLCanvasElement>(null);

  // Synthesized authentic CRT electronic switch sounds
  const playCrtSound = (type: "on" | "off") => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof window.AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      if (type === "off") {
        // CRT capacitor discharge click
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(240, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(25, ctx.currentTime + 0.12);
        gain.gain.setValueAtTime(0.16, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.13);
      } else {
        // Relay click + cathode warm hum
        osc.type = "sine";
        osc.frequency.setValueAtTime(55, ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(130, ctx.currentTime + 0.08);
        osc.frequency.linearRampToValueAtTime(60, ctx.currentTime + 0.22);
        gain.gain.setValueAtTime(0.18, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.24);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.25);
      }
    } catch {
      // AudioContext policy: ignore safely if not permitted yet
    }
  };

  // CRT Power Switch Animation State Machine
  const togglePower = () => {
    if (powerState === "turning-off" || powerState === "turning-on") return;

    if (powerState === "on") {
      playCrtSound("off");
      setPowerState("turning-off");
      setTimeout(() => {
        setPowerState("off");
      }, 450);
    } else {
      playCrtSound("on");
      setPowerState("turning-on");
      setTimeout(() => {
        setPowerState("on");
      }, 500);
    }
  };

  // Program / Channel Change Animation
  const switchChannel = (target: "home" | "register" | "info") => {
    if (currentChannel === target) return;
    setIsStaticGlitching(true);

    setTimeout(() => {
      setCurrentChannel(target);
      setIsSubmitted(false);
    }, 220);

    setTimeout(() => {
      setIsStaticGlitching(false);
    }, 450);
  };

  // Draw TV Static Noise when changing channels
  useEffect(() => {
    if (!isStaticGlitching) return;
    const canvas = staticCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    const width = (canvas.width = canvas.parentElement?.clientWidth || 800);
    const height = (canvas.height = canvas.parentElement?.clientHeight || 450);

    const renderStatic = () => {
      const imgData = ctx.createImageData(width, height);
      const data = imgData.data;
      const len = data.length;

      for (let i = 0; i < len; i += 4) {
        const val = Math.floor(Math.random() * 255);
        data[i] = val;
        data[i + 1] = val;
        data[i + 2] = val;
        data[i + 3] = 255;
      }

      ctx.putImageData(imgData, 0, 0);

      // Add a bright CRT horizontal sweep line
      ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
      ctx.fillRect(0, Math.random() * height, width, 4);

      animId = requestAnimationFrame(renderStatic);
    };

    renderStatic();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [isStaticGlitching]);

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !uid.trim()) return;

    const generatedId = `SPIT-AAR-${uid.slice(-4) || "2026"}`;
    setIssuedPassId(generatedId);
    setIsSubmitted(true);
  };

  return (
    <div className="relative w-full max-w-[96vw] xl:max-w-7xl 2xl:max-w-[1600px] mx-auto flex flex-col items-center select-none px-1 sm:px-3">
      {/* Outer TV Monitor Frame: Responsive height on mobile, expanded 16:9 on desktop */}
      <div className="relative w-full h-[72vh] min-h-[460px] max-h-[600px] sm:h-auto sm:min-h-0 sm:max-h-[86vh] sm:aspect-[16/9] rounded-sm bg-neutral-950 border-[6px] sm:border-[10px] md:border-[14px] lg:border-[16px] border-neutral-900 shadow-[0_0_0_1px_rgba(255,255,255,0.15),0_25px_60px_rgba(0,0,0,0.95)] overflow-hidden flex flex-col justify-between">
        
        {/* Subtle Screen Glare / Reflection Overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.02] to-white/[0.04] pointer-events-none z-10" />

        {/* TV Static Noise & Channel Glitch Overlay */}
        {isStaticGlitching && (
          <div className="absolute inset-0 z-40 bg-black flex items-center justify-center overflow-hidden">
            <canvas ref={staticCanvasRef} className="absolute inset-0 w-full h-full opacity-90" />
            <div className="relative z-10 bg-black/80 px-4 py-2 border border-white/20 rounded font-mono text-xs text-white tracking-widest uppercase animate-pulse">
              TUNING PROGRAM...
            </div>
          </div>
        )}

        {/* TV Screen Display Content */}
        {powerState !== "off" ? (
          <div
            className={`relative w-full h-full bg-black overflow-hidden flex flex-col justify-between ${
              powerState === "turning-off"
                ? "animate-crt-off pointer-events-none"
                : powerState === "turning-on"
                ? "animate-crt-on"
                : ""
            }`}
          >
            {/* CRT Phosphor Beam Flash during Turn-Off or Turn-On */}
            {(powerState === "turning-off" || powerState === "turning-on") && (
              <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none">
                <div className="w-full h-1 bg-white animate-crt-beam shadow-[0_0_40px_10px_rgba(255,255,255,1),0_0_80px_20px_rgba(56,189,248,0.8)]" />
              </div>
            )}
            
            {/* TV Channel Indicator & OSD (Top Corner) */}
            <div className="relative z-20 flex items-center justify-between px-2.5 sm:px-6 pt-2 sm:pt-4 text-[9px] sm:text-xs font-mono tracking-wider pointer-events-auto">
              <div className="flex items-center gap-1.5 sm:gap-2 text-neutral-400 bg-black/60 backdrop-blur-md px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full border border-white/10">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-white font-semibold">
                  {currentChannel === "home"
                    ? "CH 01 • MAIN BROADCAST"
                    : currentChannel === "register"
                    ? "CH 02 • REGISTRATION PORTAL"
                    : "CH 03 • WELCOME TO AARAMBH"}
                </span>
              </div>

              {currentChannel !== "home" && (
                <button
                  onClick={() => switchChannel("home")}
                  className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-neutral-300 hover:text-white transition-all text-[10px] sm:text-[11px] font-sans font-medium cursor-pointer"
                >
                  <ArrowLeft className="w-3 sm:w-3.5 h-3 sm:h-3.5" />
                  <span className="hidden sm:inline">Back to Channel 01</span>
                  <span className="sm:hidden">Back</span>
                </button>
              )}
            </div>

            {/* CHANNEL 01: HOME (AARAMBH Centerpiece) */}
            {currentChannel === "home" && (
              <>
                {/* Interactive Canvas Particle & Light Field */}
                <InteractiveTvBackground isPoweredOn={isPoweredOn} />

                {/* Background SVG: Concentric Circles & Crosshair Dotted Line */}
                <svg
                  className="absolute inset-0 w-full h-full pointer-events-none opacity-40"
                  viewBox="0 0 1000 562.5"
                  preserveAspectRatio="xMidYMid slice"
                >
                  {/* Concentric Radar Rings */}
                  <circle cx="500" cy="281.25" r="90" fill="none" stroke="#525252" strokeWidth="0.75" opacity="0.4" />
                  <circle cx="500" cy="281.25" r="160" fill="none" stroke="#525252" strokeWidth="0.75" opacity="0.35" />
                  <circle cx="500" cy="281.25" r="230" fill="none" stroke="#525252" strokeWidth="0.75" opacity="0.3" strokeDasharray="3 4" />
                  <circle cx="500" cy="281.25" r="310" fill="none" stroke="#525252" strokeWidth="0.75" opacity="0.25" />
                  <circle cx="500" cy="281.25" r="400" fill="none" stroke="#525252" strokeWidth="0.75" opacity="0.18" />

                  {/* Vertical Dotted Axis Line */}
                  <line
                    x1="500"
                    y1="30"
                    x2="500"
                    y2="532.5"
                    stroke="#a3a3a3"
                    strokeWidth="1"
                    strokeDasharray="2 12"
                    opacity="0.6"
                  />

                  {/* Luminous Golden and Cyan Wave Ribbons */}
                  <path
                    d="M -100 240 C 200 160, 350 360, 600 260 C 780 180, 900 320, 1150 240"
                    fill="none"
                    stroke="url(#goldGradient)"
                    strokeWidth="2.5"
                    opacity="0.85"
                    filter="url(#glowFilter)"
                  />
                  <path
                    d="M -50 290 C 250 360, 420 180, 680 270 C 850 340, 950 210, 1150 300"
                    fill="none"
                    stroke="url(#blueGradient)"
                    strokeWidth="1.75"
                    opacity="0.65"
                    filter="url(#glowFilter)"
                  />
                  <path
                    d="M 50 260 C 280 200, 450 340, 720 250 C 880 190, 980 300, 1100 260"
                    fill="none"
                    stroke="#fef08a"
                    strokeWidth="0.75"
                    opacity="0.5"
                  />

                  {/* Gradient & Filter Definitions */}
                  <defs>
                    <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#d97706" stopOpacity="0" />
                      <stop offset="30%" stopColor="#f59e0b" stopOpacity="0.8" />
                      <stop offset="50%" stopColor="#fef08a" stopOpacity="1" />
                      <stop offset="70%" stopColor="#d97706" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="#92400e" stopOpacity="0" />
                    </linearGradient>

                    <linearGradient id="blueGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#0284c7" stopOpacity="0" />
                      <stop offset="40%" stopColor="#38bdf8" stopOpacity="0.75" />
                      <stop offset="60%" stopColor="#bae6fd" stopOpacity="0.9" />
                      <stop offset="100%" stopColor="#0369a1" stopOpacity="0" />
                    </linearGradient>

                    <filter id="glowFilter" x="-20%" y="-20%" width="140%" height="140%">
                      <feGaussianBlur stdDeviation="3" result="blur" />
                      <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                  </defs>
                </svg>

                {/* Ambient Center Glow */}
                <div className="absolute w-80 sm:w-96 h-40 bg-amber-500/10 blur-3xl pointer-events-none rounded-full" />

                {/* Central Graphic: AARAMBH Title + Starline Divider with React Bits FadeContent */}
                <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 my-auto">
                  <FadeContent
                    key={isPoweredOn ? "tv-on" : "tv-off"}
                    blur={true}
                    duration={1200}
                    delay={200}
                    easing="cubic-bezier(0.16, 1, 0.3, 1)"
                    initialOpacity={0}
                    className="flex flex-col items-center justify-center"
                  >
                    <h1 className="font-outfit text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-[-0.02em] leading-none text-white select-none drop-shadow-[0_4px_25px_rgba(255,255,255,0.4)]">
                      AARAMBH
                    </h1>

                    {/* Golden Starline Divider */}
                    <div className="relative flex items-center justify-center w-64 sm:w-80 md:w-[440px] my-3 sm:my-4 mx-auto">
                      <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-amber-200/80 to-transparent" />
                      <div className="absolute flex items-center justify-center">
                        <div className="w-3 sm:w-3.5 h-3 sm:h-3.5 bg-amber-100 rotate-45 shadow-[0_0_12px_#fde68a]" />
                        <div className="absolute w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_8px_#ffffff]" />
                      </div>
                    </div>
                  </FadeContent>
                </div>
              </>
            )}

            {/* CHANNEL 02: LANDSCAPE REGISTRATION PORTAL */}
            {currentChannel === "register" && (
              <>
                {/* Background Ambient Glow & Particles */}
                <InteractiveTvBackground isPoweredOn={isPoweredOn} />
                <div className="absolute w-80 sm:w-[600px] md:w-[800px] h-64 bg-amber-500/10 blur-3xl pointer-events-none rounded-full" />

                <div className="relative z-20 flex-1 min-h-0 flex flex-col justify-center px-4 sm:px-8 md:px-12 lg:px-16 my-auto pointer-events-auto overflow-y-auto">
                  {!isSubmitted ? (
                    <div className="w-full max-w-xl sm:max-w-2xl md:max-w-3xl lg:max-w-4xl xl:max-w-5xl 2xl:max-w-[1100px] mx-auto flex flex-col justify-center py-2 sm:py-3 md:py-5 animate-in fade-in zoom-in-95 duration-300">
                      {/* Header */}
                      <div className="text-center mb-3 sm:mb-4 md:mb-6 lg:mb-7">
                        <h2 className="font-outfit text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-extrabold text-white tracking-tight drop-shadow-[0_2px_15px_rgba(255,255,255,0.25)]">
                          Student Registration
                        </h2>
                      </div>

                      {/* Form: 1 col on mobile, 2 cols on tablet/desktop */}
                      <form onSubmit={handleRegisterSubmit} className="space-y-2 sm:space-y-3 md:space-y-4 lg:space-y-5">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 sm:gap-x-6 md:gap-x-8 lg:gap-x-10 gap-y-2 sm:gap-y-3 md:gap-y-4 lg:gap-y-5">
                          {/* 1. Full Name (Indian Placeholder) */}
                          <div>
                            <label className="block text-[10px] sm:text-xs md:text-sm uppercase font-mono tracking-wider text-neutral-400 font-medium mb-1 sm:mb-1.5 md:mb-2">
                              Full Name
                            </label>
                            <div className="relative">
                              <User className="absolute left-3 sm:left-3.5 md:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-4.5 sm:h-4.5 md:w-5 md:h-5 text-neutral-500 pointer-events-none" />
                              <input
                                type="text"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Aarav Sharma"
                                className="w-full rounded-lg sm:rounded-xl md:rounded-2xl border border-white/20 bg-neutral-900/90 py-1.5 sm:py-2.5 md:py-3 lg:py-3.5 pl-9 sm:pl-11 md:pl-12 pr-3.5 sm:pr-4 md:pr-5 text-xs sm:text-sm md:text-base lg:text-lg text-white placeholder-neutral-500 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400/40 transition-all shadow-inner"
                              />
                            </div>
                          </div>

                          {/* 2. College UID (10 Digits Placeholder) */}
                          <div>
                            <label className="block text-[10px] sm:text-xs md:text-sm uppercase font-mono tracking-wider text-neutral-400 font-medium mb-1 sm:mb-1.5 md:mb-2">
                              College UID (10 Digits)
                            </label>
                            <div className="relative">
                              <Hash className="absolute left-3 sm:left-3.5 md:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-4.5 sm:h-4.5 md:w-5 md:h-5 text-neutral-500 pointer-events-none" />
                              <input
                                type="text"
                                required
                                maxLength={10}
                                pattern="[0-9]{10}"
                                value={uid}
                                onChange={(e) => setUid(e.target.value.replace(/\D/g, ""))}
                                placeholder="2026100482"
                                className="w-full rounded-lg sm:rounded-xl md:rounded-2xl border border-white/20 bg-neutral-900/90 py-1.5 sm:py-2.5 md:py-3 lg:py-3.5 pl-9 sm:pl-11 md:pl-12 pr-3.5 sm:pr-4 md:pr-5 text-xs sm:text-sm md:text-base lg:text-lg text-white placeholder-neutral-500 font-mono focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400/40 transition-all shadow-inner"
                              />
                            </div>
                          </div>

                          {/* 3. Branch (CE, CSE, EXTC Selection with Chevron Icon) */}
                          <div>
                            <label className="block text-[10px] sm:text-xs md:text-sm uppercase font-mono tracking-wider text-neutral-400 font-medium mb-1 sm:mb-1.5 md:mb-2">
                              Branch
                            </label>
                            <div className="relative">
                              <BookOpen className="absolute left-3 sm:left-3.5 md:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-4.5 sm:h-4.5 md:w-5 md:h-5 text-neutral-500 pointer-events-none" />
                              <select
                                value={branch}
                                onChange={(e) => setBranch(e.target.value)}
                                className="w-full appearance-none rounded-lg sm:rounded-xl md:rounded-2xl border border-white/20 bg-neutral-900/90 py-1.5 sm:py-2.5 md:py-3 lg:py-3.5 pl-9 sm:pl-11 md:pl-12 pr-9 sm:pr-11 md:pr-12 text-xs sm:text-sm md:text-base lg:text-lg text-white focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400/40 cursor-pointer transition-all shadow-inner"
                              >
                                <option value="CE">CE (Computer Engineering)</option>
                                <option value="CSE">CSE (Computer Science & Engineering)</option>
                                <option value="EXTC">EXTC (Electronics & Telecommunication)</option>
                              </select>
                              <ChevronDown className="absolute right-3 sm:right-3.5 md:right-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-4.5 sm:h-4.5 md:w-5 md:h-5 text-neutral-400 pointer-events-none" />
                            </div>
                          </div>

                          {/* 4. Phone Number */}
                          <div>
                            <label className="block text-[10px] sm:text-xs md:text-sm uppercase font-mono tracking-wider text-neutral-400 font-medium mb-1 sm:mb-1.5 md:mb-2">
                              Phone Number
                            </label>
                            <div className="relative">
                              <Phone className="absolute left-3 sm:left-3.5 md:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-4.5 sm:h-4.5 md:w-5 md:h-5 text-neutral-500 pointer-events-none" />
                              <input
                                type="tel"
                                required
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                placeholder="+91 98765 43210"
                                className="w-full rounded-lg sm:rounded-xl md:rounded-2xl border border-white/20 bg-neutral-900/90 py-1.5 sm:py-2.5 md:py-3 lg:py-3.5 pl-9 sm:pl-11 md:pl-12 pr-3.5 sm:pr-4 md:pr-5 text-xs sm:text-sm md:text-base lg:text-lg text-white placeholder-neutral-500 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400/40 transition-all shadow-inner"
                              />
                            </div>
                          </div>

                          {/* 5. College Email (@spit.ac.in Placeholder) */}
                          <div className="sm:col-span-2">
                            <label className="block text-[10px] sm:text-xs md:text-sm uppercase font-mono tracking-wider text-neutral-400 font-medium mb-1 sm:mb-1.5 md:mb-2">
                              College Email ID
                            </label>
                            <div className="relative">
                              <Mail className="absolute left-3 sm:left-3.5 md:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-4.5 sm:h-4.5 md:w-5 md:h-5 text-neutral-500 pointer-events-none" />
                              <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="aarav.sharma@spit.ac.in"
                                className="w-full rounded-lg sm:rounded-xl md:rounded-2xl border border-white/20 bg-neutral-900/90 py-1.5 sm:py-2.5 md:py-3 lg:py-3.5 pl-9 sm:pl-11 md:pl-12 pr-3.5 sm:pr-4 md:pr-5 text-xs sm:text-sm md:text-base lg:text-lg text-white placeholder-neutral-500 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400/40 transition-all shadow-inner"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Submit 3D Button */}
                        <div className="pt-2 sm:pt-3 md:pt-4 flex justify-center">
                          <button
                            type="submit"
                            className="w-full sm:w-auto px-6 sm:px-10 md:px-14 lg:px-16 py-2.5 sm:py-3 md:py-3.5 lg:py-4 rounded-xl md:rounded-2xl bg-gradient-to-r from-amber-400 to-yellow-500 text-black text-xs sm:text-sm md:text-base lg:text-lg font-extrabold tracking-wider uppercase shadow-[0_4px_0_#92400e,0_8px_25px_rgba(245,158,11,0.4)] hover:brightness-110 active:translate-y-1 active:shadow-[0_1px_0_#92400e] transition-all cursor-pointer"
                          >
                            Confirm Registration & Issue Pass
                          </button>
                        </div>
                      </form>
                    </div>
                  ) : (
                    /* Issued Digital Pass View inside TV */
                    <div className="w-full max-w-lg sm:max-w-xl md:max-w-2xl lg:max-w-3xl mx-auto flex flex-col items-center justify-center text-center animate-in zoom-in-95 duration-300 py-2 sm:py-4">
                      <div className="w-10 h-10 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mb-2 sm:mb-3">
                        <CheckCircle className="w-5 h-5 sm:w-7 sm:h-7 md:w-8 md:h-8" />
                      </div>

                      <h3 className="font-outfit text-lg sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
                        Registration Confirmed!
                      </h3>
                      <p className="text-xs sm:text-sm md:text-base text-neutral-400 mb-3 sm:mb-5">
                        Your entry badge has been issued for Aarambh 2026.
                      </p>

                      {/* TV Screen Digital Pass Card */}
                      <div className="w-full rounded-xl md:rounded-2xl border border-white/20 bg-neutral-900/90 p-4 sm:p-6 md:p-8 text-left shadow-2xl relative overflow-hidden backdrop-blur-md">
                        <div className="flex justify-between items-start border-b border-white/10 pb-3 sm:pb-4">
                          <div>
                            <span className="text-[9px] sm:text-xs md:text-sm font-mono tracking-widest uppercase text-amber-300 font-semibold">
                              SPIT AARAMBH BADGE • 2026
                            </span>
                            <h4 className="text-base sm:text-xl md:text-2xl font-bold text-white mt-1">{name}</h4>
                            <p className="text-xs sm:text-sm md:text-base font-mono text-neutral-400 mt-0.5">UID: {uid} • {branch}</p>
                          </div>
                          <div className="bg-white/10 px-2.5 sm:px-3.5 py-1 rounded-lg text-[10px] sm:text-xs md:text-sm font-mono text-neutral-200 border border-white/15">
                            {issuedPassId}
                          </div>
                        </div>

                        <div className="mt-3 sm:mt-4 md:mt-5 flex items-center justify-between text-xs sm:text-sm md:text-base text-neutral-400">
                          <div>
                            <span className="block text-[9px] sm:text-[10px] md:text-xs text-neutral-500 uppercase font-mono">Email</span>
                            <span className="text-white font-medium">{email || `${name.toLowerCase().replace(/\s+/g, ".")}@spit.ac.in`}</span>
                          </div>
                          <div className="text-right">
                            <span className="block text-[9px] sm:text-[10px] md:text-xs text-neutral-500 uppercase font-mono">Status</span>
                            <span className="text-emerald-400 font-semibold uppercase tracking-wider">Verified</span>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => switchChannel("home")}
                        className="mt-3 sm:mt-5 px-5 sm:px-7 md:px-9 py-2 sm:py-2.5 md:py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs sm:text-sm md:text-base font-semibold text-white tracking-wider uppercase transition-all"
                      >
                        Return to Main Broadcast
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}

            {/* CHANNEL 03: INFO / WELCOME SECTION */}
            {currentChannel === "info" && (
              <>
                {/* Background Ambient Glow & Particles */}
                <InteractiveTvBackground isPoweredOn={isPoweredOn} />
                <div className="absolute w-80 sm:w-[500px] h-48 bg-amber-500/10 blur-3xl pointer-events-none rounded-full" />

                <div className="relative z-20 flex-1 min-h-0 flex flex-col justify-center px-4 sm:px-10 py-3 sm:py-5 my-auto pointer-events-auto overflow-y-auto">
                  <div className="w-full max-w-xl lg:max-w-2xl mx-auto flex flex-col items-center justify-center text-center py-1 sm:py-3 animate-in fade-in zoom-in-95 duration-500">
                    {/* Header Title */}
                    <h2 className="font-outfit text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-[0.16em] sm:tracking-[0.22em] uppercase leading-none bg-gradient-to-b from-white via-neutral-100 to-neutral-400 bg-clip-text text-transparent select-none drop-shadow-[0_4px_25px_rgba(255,255,255,0.4)] pl-[0.16em] sm:pl-[0.22em]">
                      AARAMBH
                    </h2>

                    {/* Luminous Starline Divider */}
                    <div className="relative flex items-center justify-center w-44 sm:w-64 my-2.5 sm:my-3.5 mx-auto">
                      <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-amber-300/80 to-transparent" />
                      <div className="absolute flex items-center justify-center">
                        <div className="w-2.5 sm:w-3 h-2.5 sm:h-3 bg-amber-100 rotate-45 shadow-[0_0_10px_#fde68a]" />
                        <div className="absolute w-1 h-1 bg-white rounded-full shadow-[0_0_6px_#ffffff]" />
                      </div>
                    </div>

                    {/* Subtitle with Editorial Serif Italic */}
                    <h3 className="font-playfair italic text-lg sm:text-2xl md:text-3xl font-medium bg-gradient-to-r from-amber-100 via-yellow-200 to-amber-300 bg-clip-text text-transparent drop-shadow-[0_2px_15px_rgba(251,191,36,0.3)] mb-3 sm:mb-4 tracking-normal">
                      Welcome to the family.
                    </h3>

                    {/* Narrative Paragraphs */}
                    <div className="space-y-2.5 sm:space-y-3.5 max-w-lg sm:max-w-xl mx-auto font-sans leading-relaxed text-xs sm:text-sm md:text-[15px]">
                      <p className="text-neutral-200 font-normal">
                        Your first year is about to begin — new faces, new stories, unexpected chaos, and memories you’ll be talking about long after graduation.
                      </p>
                      <p className="text-neutral-400 font-light">
                        Meet your batch, break the ice, and step into the beginning of your college journey.
                      </p>
                    </div>

                    {/* Tagline */}
                    <p className="font-mono text-[10px] sm:text-xs md:text-[13px] font-bold tracking-[0.25em] sm:tracking-[0.35em] text-amber-300 uppercase mt-3.5 sm:mt-5 mb-4 sm:mb-6 drop-shadow-[0_0_12px_rgba(245,158,11,0.5)]">
                      ✦ A NEW CHAPTER STARTS ✦
                    </p>

                    {/* [ ENTER AARAMBH ] 3D Glowing Button */}
                    <button
                      onClick={() => switchChannel("register")}
                      className="group relative inline-flex items-center gap-2.5 sm:gap-3 px-7 sm:px-10 py-2.5 sm:py-3.5 rounded-xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-black font-outfit text-xs sm:text-sm font-black tracking-widest uppercase shadow-[0_4px_0_#92400e,0_12px_30px_rgba(245,158,11,0.5)] hover:brightness-110 hover:-translate-y-0.5 active:translate-y-1 active:shadow-[0_1px_0_#92400e] transition-all cursor-pointer"
                    >
                      <span>ENTER AARAMBH</span>
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* Screen Control Bar (Bottom Area) */}
            <div className="relative z-20 px-2 sm:px-6 pb-2 sm:pb-4 flex items-center justify-between pointer-events-auto">
              {/* 3D Action Buttons on the Left */}
              <div className="flex items-center gap-1 sm:gap-3">
                {/* 3D Register Button (Triggers Program Change Animation) */}
                <button
                  onClick={() => switchChannel("register")}
                  className={`group relative flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl border transition-all duration-100 cursor-pointer ${
                    currentChannel === "register"
                      ? "bg-amber-500 text-black border-amber-300 shadow-[0_2px_0_#92400e]"
                      : "bg-gradient-to-b from-neutral-800 to-neutral-900 border-amber-500/40 text-amber-200 shadow-[0_3px_0_#1c1917,0_6px_12px_rgba(0,0,0,0.8)] hover:-translate-y-0.5 hover:shadow-[0_4px_0_#1c1917,0_0_20px_rgba(245,158,11,0.35)] active:translate-y-1 active:shadow-[0_1px_0_#1c1917]"
                  } text-[10px] sm:text-xs font-bold tracking-wider uppercase`}
                  title="Tune to Registration Program"
                >
                  <Ticket className="w-3 sm:w-3.5 h-3 sm:h-3.5 transition-transform group-hover:scale-110" />
                  <span>Register</span>
                </button>

                {/* 3D Info Button (Triggers Program Change Animation to Info) */}
                <button
                  onClick={() => switchChannel("info")}
                  className={`group relative flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl border transition-all duration-100 cursor-pointer ${
                    currentChannel === "info"
                      ? "bg-blue-500 text-black border-blue-300 shadow-[0_2px_0_#1e3a8a]"
                      : "bg-gradient-to-b from-neutral-800 to-neutral-900 border-blue-500/40 text-blue-200 shadow-[0_3px_0_#0f172a,0_6px_12px_rgba(0,0,0,0.8)] hover:-translate-y-0.5 hover:shadow-[0_4px_0_#0f172a,0_0_20px_rgba(56,189,248,0.35)] active:translate-y-1 active:shadow-[0_1px_0_#0f172a]"
                  } text-[10px] sm:text-xs font-bold tracking-wider uppercase`}
                  title="Tune to Welcome & Info Program"
                >
                  <Info className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-blue-300 transition-transform group-hover:scale-110" />
                  <span>Info</span>
                </button>
              </div>

              {/* Exact Replicated ON / OFF Pill Button on the Right */}
              <button
                onClick={togglePower}
                className="flex items-center gap-1.5 sm:gap-3 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full border border-amber-300/40 bg-black/80 backdrop-blur-md shadow-[0_0_16px_rgba(245,158,11,0.35)] transition-all duration-200 hover:border-amber-300/70 hover:scale-105 active:scale-95 cursor-pointer"
                title="Toggle TV Power"
              >
                {/* Circular White Power Badge */}
                <div className="w-4 h-4 sm:w-6 sm:h-6 rounded-full bg-white flex items-center justify-center text-black shadow-sm">
                  <Power className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 stroke-[2.5]" />
                </div>

                {/* OFF / ON Labels & Glowing Indicator Dot */}
                <div className="flex items-center gap-1 sm:gap-1.5 text-[9px] sm:text-xs font-bold font-mono tracking-wider">
                  <span className="text-neutral-500">OFF</span>
                  <span className="text-white">ON</span>
                  <span className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-amber-400 animate-pulse shadow-[0_0_8px_#fbbf24]" />
                </div>
              </button>
            </div>
          </div>
        ) : (
          /* Powered OFF State: TV Off with Standby LED */
          <div className="relative w-full h-full bg-[#050505] flex flex-col items-center justify-center">
            {/* Subtle CRT Phosphor Reflection */}
            <div className="absolute inset-0 bg-radial from-neutral-900/30 via-transparent to-transparent pointer-events-none" />

            <div className="text-center px-4 relative z-10 animate-in fade-in duration-300">
              <div className="w-12 h-12 rounded-full bg-neutral-900/80 border border-neutral-800 flex items-center justify-center mx-auto mb-3 text-neutral-500 shadow-inner">
                <Power className="w-5 h-5 text-red-500/80 animate-pulse" />
              </div>
              <p className="text-neutral-500 text-xs font-mono tracking-[0.25em] uppercase mb-1">
                STANDBY MODE
              </p>
              <p className="text-neutral-600 text-[10px] font-mono tracking-wider mb-4">
                CH 01 • BROADCAST PAUSED
              </p>
              <button
                onClick={togglePower}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-neutral-900/90 hover:bg-neutral-800 border border-neutral-700 text-neutral-300 text-xs font-semibold tracking-wider uppercase transition-all shadow-lg active:scale-95 cursor-pointer"
              >
                <Power className="w-3.5 h-3.5 text-amber-400" />
                <span>Turn ON TV</span>
              </button>
            </div>

            {/* Power Pill in OFF State */}
            <div className="absolute bottom-2 sm:bottom-4 right-2.5 sm:right-6 z-20 pointer-events-auto">
              <button
                onClick={togglePower}
                className="flex items-center gap-1.5 sm:gap-3 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full border border-neutral-700 bg-neutral-900/90 backdrop-blur-md shadow-md transition-all hover:scale-105 cursor-pointer"
                title="Turn ON TV"
              >
                <div className="w-4 h-4 sm:w-6 sm:h-6 rounded-full bg-neutral-800 flex items-center justify-center text-neutral-400">
                  <Power className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 stroke-[2.5]" />
                </div>
                <div className="flex items-center gap-1 sm:gap-1.5 text-[9px] sm:text-xs font-bold font-mono tracking-wider">
                  <span className="text-red-400">OFF</span>
                  <span className="text-neutral-600">ON</span>
                  <span className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-red-500 shadow-[0_0_8px_#ef4444]" />
                </div>
              </button>
            </div>
          </div>
        )}

        {/* Bottom Bezel Standby Light: Glowing Red when OFF/turning-off, Emerald when ON */}
        <div
          className={`absolute bottom-0.5 left-1/2 -translate-x-1/2 w-2 h-0.5 rounded-full transition-all duration-300 pointer-events-none ${
            powerState === "off" || powerState === "turning-off"
              ? "bg-red-500 shadow-[0_0_8px_#ef4444]"
              : "bg-emerald-400 shadow-[0_0_8px_#34d399]"
          }`}
        />
      </div>

      {/* TV Neck Stand */}
      <div className="w-12 sm:w-20 md:w-24 h-3 sm:h-6 bg-gradient-to-r from-neutral-800 via-neutral-600 to-neutral-800 rounded-b-xs shadow-md border-x border-neutral-700/60" />

      {/* TV Pedestal Base Plate */}
      <div className="w-44 sm:w-80 md:w-96 lg:w-[460px] h-2.5 sm:h-4 bg-gradient-to-b from-neutral-700 via-neutral-900 to-black rounded-sm border-t border-neutral-600/60 shadow-[0_15px_30px_rgba(0,0,0,0.95)]" />
    </div>
  );
}
