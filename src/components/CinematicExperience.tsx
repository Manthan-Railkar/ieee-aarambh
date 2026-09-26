"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import TvDisplay from "@/components/TvDisplay";

const FRAME_COUNT = 240;

const getFramePath = (index: number) => {
  const padded = String(index).padStart(4, "0");
  return `/assets/frames/frame_${padded}.webp`;
};

export default function CinematicExperience() {
  const cinematicRef = useRef<HTMLDivElement>(null);
  const ambientLayerRef = useRef<HTMLDivElement>(null);
  const ambientVideoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scrollHintRef = useRef<HTMLDivElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const brandBadgeRef = useRef<HTMLDivElement>(null);
  const topStripRef = useRef<HTMLDivElement>(null);
  const bottomStripRef = useRef<HTMLDivElement>(null);
  const tvContainerRef = useRef<HTMLDivElement>(null);

  const isAtTopRef = useRef<boolean>(true);

  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  const framesRef = useRef<HTMLImageElement[]>([]);
  const stateRef = useRef({
    frame: 0,
    started: false,
    mouseX: 0,
    mouseY: 0,
    targetX: 0,
    targetY: 0,
    rafId: 0,
  });

  // Draw frame with object-fit: cover logic
  const renderFrame = useCallback((index: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const image = framesRef.current[index];
    if (!image || !image.complete) return;

    const canvasWidth = window.innerWidth;
    const canvasHeight = window.innerHeight;

    const imageRatio = (image.naturalWidth || image.width) / (image.naturalHeight || image.height);
    const canvasRatio = canvasWidth / canvasHeight;

    let drawWidth: number;
    let drawHeight: number;
    let offsetX: number;
    let offsetY: number;

    if (imageRatio > canvasRatio) {
      drawHeight = canvasHeight;
      drawWidth = canvasHeight * imageRatio;
      offsetX = (canvasWidth - drawWidth) / 2;
      offsetY = 0;
    } else {
      drawWidth = canvasWidth;
      drawHeight = canvasWidth / imageRatio;
      offsetX = 0;
      offsetY = (canvasHeight - drawHeight) / 2;
    }

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    ctx.drawImage(image, offsetX, offsetY, drawWidth, drawHeight);
  }, []);

  // Canvas resize with High DPR sharpness
  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    renderFrame(Math.round(stateRef.current.frame));
  }, [renderFrame]);

  // Leave top / enter walkthrough: starts 3s timer for intro
  const leaveTop = useCallback(() => {
    stateRef.current.started = true;
    setHasStarted(true);

    if (ambientVideoRef.current) {
      ambientVideoRef.current.style.pointerEvents = "none";
      ambientVideoRef.current.pause();
    }

    if (scrollHintRef.current) {
      gsap.to(scrollHintRef.current, {
        opacity: 0,
        duration: 0.3,
        overwrite: "auto",
      });
    }

    if (ambientLayerRef.current) {
      gsap.to(ambientLayerRef.current, {
        opacity: 0,
        duration: 0.45,
        ease: "power2.out",
        overwrite: "auto",
      });
    }

    if (introRef.current) {
      gsap.killTweensOf(introRef.current);
      gsap.to(introRef.current, {
        opacity: 0,
        y: -30,
        duration: 0.8,
        delay: 3, // Keep on screen for 3 seconds after scroll is hit
        ease: "power2.out",
        overwrite: "auto",
      });
    }
  }, []);

  // Return to the first frame / top: restore IEEE intro and ambient video
  const returnToTop = useCallback(() => {
    stateRef.current.started = false;
    setHasStarted(false);

    if (ambientVideoRef.current) {
      ambientVideoRef.current.play().catch(() => {});
    }

    if (ambientLayerRef.current) {
      gsap.to(ambientLayerRef.current, {
        opacity: 1,
        duration: 0.45,
        ease: "power2.out",
        overwrite: "auto",
      });
    }

    if (scrollHintRef.current) {
      gsap.to(scrollHintRef.current, {
        opacity: 0.9,
        duration: 0.4,
        overwrite: "auto",
      });
    }

    if (introRef.current) {
      gsap.killTweensOf(introRef.current);
      gsap.to(introRef.current, {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 0.6,
        ease: "power2.out",
        overwrite: "auto",
      });
    }
  }, []);

  // Preload all frames
  useEffect(() => {
    let active = true;
    const images: HTMLImageElement[] = new Array(FRAME_COUNT);
    let loadedCount = 0;

    const updateProgress = () => {
      loadedCount++;
      if (active) {
        setLoadingProgress(Math.round((loadedCount / FRAME_COUNT) * 100));
      }
      if (loadedCount === FRAME_COUNT && active) {
        framesRef.current = images;
        setIsLoaded(true);
        resizeCanvas();
        renderFrame(0);
        ScrollTrigger.refresh();
      }
    };

    // Load initial frames with high priority, then remaining
    for (let i = 0; i < FRAME_COUNT; i++) {
      const img = new window.Image();
      img.src = getFramePath(i);
      img.onload = updateProgress;
      img.onerror = () => {
        console.warn(`Frame ${i} failed to load, continuing...`);
        updateProgress();
      };
      images[i] = img;
    }

    return () => {
      active = false;
    };
  }, [renderFrame, resizeCanvas]);

  // Fade in IEEE intro when loaded
  useEffect(() => {
    if (isLoaded && introRef.current && !stateRef.current.started) {
      gsap.fromTo(
        introRef.current,
        { opacity: 0, scale: 0.92, y: 15 },
        { opacity: 1, scale: 1, y: 0, duration: 1.1, ease: "power3.out", delay: 0.15 }
      );
    }
  }, [isLoaded]);

  // GSAP Master Timeline (Walkthrough + Double Black Strip Transition + TV UI)
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const frameAnimation = { frame: 0 };
    const cinematicEl = cinematicRef.current;
    if (!cinematicEl) return;

    // Initial positions for black transition strips and TV UI
    if (topStripRef.current) gsap.set(topStripRef.current, { yPercent: -100 });
    if (bottomStripRef.current) gsap.set(bottomStripRef.current, { yPercent: 100 });
    if (tvContainerRef.current) gsap.set(tvContainerRef.current, { opacity: 0, pointerEvents: "none" });

    const masterTl = gsap.timeline({
      scrollTrigger: {
        trigger: cinematicEl,
        start: "top top",
        end: "bottom top",
        scrub: 0.15,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          if (self.progress > 0.003) {
            if (isAtTopRef.current) {
              isAtTopRef.current = false;
              leaveTop();
            }
          } else {
            if (!isAtTopRef.current) {
              isAtTopRef.current = true;
              returnToTop();
            }
          }
        },
      },
    });

    // 1. Scrub frames from 0 to 239 (Walkthrough approaching the TV)
    masterTl.to(frameAnimation, {
      frame: FRAME_COUNT - 1,
      duration: 6.5,
      ease: "none",
      onUpdate: () => {
        const currentFrame = Math.round(frameAnimation.frame);
        stateRef.current.frame = currentFrame;
        renderFrame(currentFrame);
      },
    });

    // 2. Double black strips close over the last frame
    masterTl
      .to(topStripRef.current, { yPercent: 0, duration: 1.0, ease: "power2.inOut" }, ">+=0.1")
      .to(bottomStripRef.current, { yPercent: 0, duration: 1.0, ease: "power2.inOut" }, "<")
      .to(brandBadgeRef.current, { opacity: 0, duration: 0.4 }, "<");

    // 3. Switch view: activate TV UI behind closed strips
    masterTl.set(tvContainerRef.current, {
      opacity: 1,
      pointerEvents: "auto",
    });

    // 4. Double black strips open to reveal the exact TV UI
    masterTl
      .to(topStripRef.current, { yPercent: -100, duration: 1.0, ease: "power2.inOut" })
      .to(bottomStripRef.current, { yPercent: 100, duration: 1.0, ease: "power2.inOut" }, "<");

    // 5. Rest / interact hold on the TV UI
    masterTl.to({}, { duration: 2.0 });

    return () => {
      masterTl.scrollTrigger?.kill();
      masterTl.kill();
    };
  }, [renderFrame, leaveTop, returnToTop]);

  // Window resize & parallax tracking
  useEffect(() => {
    window.addEventListener("resize", resizeCanvas);

    // Mouse tracking for parallax
    const handleMouseMove = (e: MouseEvent) => {
      if (stateRef.current.started) return;
      const normalizedX = (e.clientX / window.innerWidth) * 2 - 1;
      const normalizedY = (e.clientY / window.innerHeight) * 2 - 1;
      stateRef.current.targetX = -normalizedX;
      stateRef.current.targetY = -normalizedY;
    };

    const updateMouseParallax = () => {
      if (!isAtTopRef.current) {
        stateRef.current.rafId = requestAnimationFrame(updateMouseParallax);
        return;
      }

      const maxX = 14;
      const maxY = 8;
      const x = stateRef.current.targetX * maxX;
      const y = stateRef.current.targetY * maxY;

      stateRef.current.mouseX += (x - stateRef.current.mouseX) * 0.08;
      stateRef.current.mouseY += (y - stateRef.current.mouseY) * 0.08;

      if (ambientVideoRef.current) {
        ambientVideoRef.current.style.transform = `translate3d(${stateRef.current.mouseX.toFixed(2)}px, ${stateRef.current.mouseY.toFixed(2)}px, 0) scale(1.03)`;
      }

      stateRef.current.rafId = requestAnimationFrame(updateMouseParallax);
    };

    const currentState = stateRef.current;
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    currentState.rafId = requestAnimationFrame(updateMouseParallax);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(currentState.rafId);
    };
  }, [resizeCanvas]);

  return (
    <div id="experience" className="relative w-full">
      {/* Loading Overlay */}
      {!isLoaded && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black text-white px-6">
          <div className="flex items-center gap-3 mb-6">
            <span className="w-3 h-3 rounded-full bg-amber-400 animate-ping" />
            <span className="text-xs font-mono uppercase tracking-[0.3em] text-neutral-400">
              PREPARING CINEMATIC EXPERIENCE
            </span>
          </div>

          <div className="w-64 max-w-full h-1 bg-white/10 rounded-full overflow-hidden mb-3">
            <div
              className="h-full bg-gradient-to-r from-amber-400 to-indigo-400 transition-all duration-150 ease-out"
              style={{ width: `${loadingProgress}%` }}
            />
          </div>

          <span className="text-xs font-mono text-neutral-500">{loadingProgress}%</span>
        </div>
      )}

      {/* Cinematic Walkthrough Section (Tall scroll driver) */}
      <section
        id="cinematic"
        ref={cinematicRef}
        className="relative w-full h-[4500px] bg-black"
      >
        {/* Ambient Video Layer */}
        <div
          id="ambient-layer"
          ref={ambientLayerRef}
          className="fixed inset-0 w-screen h-screen z-10 overflow-hidden bg-black transition-opacity duration-500 pointer-events-none"
        >
          <video
            id="ambient-video"
            ref={ambientVideoRef}
            src="/assets/ambient.mp4"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            className="absolute inset-0 w-full h-full object-cover origin-center will-change-transform scale-[1.03]"
          />
        </div>

        {/* Walkthrough Canvas Wrapper (Sticky viewport) */}
        <div
          id="canvas-wrapper"
          className="sticky top-0 w-full h-screen z-5 overflow-hidden bg-black"
        >
          <canvas
            id="walkthrough-canvas"
            ref={canvasRef}
            className="block w-full h-full bg-black"
          />
        </div>

        {/* Centered IEEE Presents Intro Overlay */}
        <div
          id="ieee-intro"
          ref={introRef}
          className="fixed inset-0 z-20 flex flex-col items-center justify-center pointer-events-none select-none px-4 sm:px-6 opacity-0"
        >
          <div className="flex flex-col items-center gap-3.5 sm:gap-6 md:gap-7">
            {/* Ambient glow behind circular IEEE emblem */}
            <div className="relative flex items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-blue-500/25 blur-3xl scale-125 pointer-events-none animate-pulse-glow" />
              <Image
                src="/assets/ieee_logo.png"
                alt="IEEE SPIT Logo"
                width={288}
                height={288}
                priority
                className="relative w-28 h-28 sm:w-44 sm:h-44 md:w-60 md:h-60 lg:w-72 lg:h-72 object-contain drop-shadow-[0_16px_40px_rgba(0,0,0,0.95)]"
              />
            </div>

            {/* PRESENTS in the same font & styling as AARAMBH, scaled for mobile & desktop */}
            <p className="text-lg sm:text-2xl md:text-4xl lg:text-5xl font-black tracking-[0.28em] sm:tracking-[0.45em] md:tracking-[0.55em] uppercase leading-none bg-gradient-to-b from-white via-neutral-100 to-neutral-400 bg-clip-text text-transparent drop-shadow-[0_6px_20px_rgba(0,0,0,0.95)] pl-[0.28em] sm:pl-[0.45em] md:pl-[0.55em] whitespace-nowrap">
              PRESENTS
            </p>
          </div>
        </div>

        {/* Scroll Hint */}
        <div
          id="scroll-hint"
          ref={scrollHintRef}
          onClick={() => {
            if (isAtTopRef.current) {
              isAtTopRef.current = false;
              leaveTop();
            }
            window.scrollBy({ top: 350, behavior: "smooth" });
          }}
          className={`fixed left-1/2 bottom-6 sm:bottom-10 -translate-x-1/2 z-20 flex flex-col items-center gap-2 text-white cursor-pointer pointer-events-auto transition-opacity duration-300 hover:opacity-100 ${
            hasStarted ? "opacity-0 pointer-events-none" : "opacity-90"
          }`}
        >
          <div className="w-4 h-7 sm:w-5 sm:h-8 border border-white/70 rounded-full flex justify-center pt-1 shadow-[0_0_12px_rgba(255,255,255,0.2)]">
            <span className="w-1 h-1 sm:h-1.5 bg-white rounded-full animate-scroll-wheel" />
          </div>
          <p className="text-[10px] sm:text-[11px] font-semibold tracking-[0.18em] sm:tracking-[0.2em] uppercase opacity-80 select-none whitespace-nowrap">
            Scroll or Tap to enter
          </p>
        </div>

        {/* Bottom Right Brand Badge to conceal watermark */}
        <div
          id="brand-badge-overlay"
          ref={brandBadgeRef}
          className="hidden sm:flex fixed right-4 sm:right-6 bottom-[80px] z-20 items-center gap-2.5 px-5 py-3 rounded-full bg-black/95 backdrop-blur-md border border-white/20 shadow-[0_0_35px_12px_rgba(0,0,0,0.95)] select-none pointer-events-none transition-opacity duration-300"
        >
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          <span className="text-[11px] font-mono font-medium tracking-[0.22em] uppercase text-neutral-200">
            AARAMBH 2026
          </span>
        </div>

        {/* Double Black Strips for cinematic transition */}
        <div
          ref={topStripRef}
          className="fixed top-0 left-0 w-full h-1/2 bg-black z-30 pointer-events-none will-change-transform border-b border-neutral-800"
        />
        <div
          ref={bottomStripRef}
          className="fixed bottom-0 left-0 w-full h-1/2 bg-black z-30 pointer-events-none will-change-transform border-t border-neutral-800"
        />

        {/* TV UI Container (Replicated exact TV UI with ON/OFF & 3D buttons) */}
        <div
          ref={tvContainerRef}
          className="fixed inset-0 z-25 flex items-center justify-center p-1 sm:p-2 md:p-3 lg:p-4 bg-black pointer-events-none opacity-0 will-change-transform"
        >
          <TvDisplay />
        </div>
      </section>
    </div>
  );
}
