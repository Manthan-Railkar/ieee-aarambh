"use client";

import React, { useRef, useEffect } from "react";

interface InteractiveTvBackgroundProps {
  isPoweredOn: boolean;
}

interface Particle {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  size: number;
  color: string;
  vx: number;
  vy: number;
  alpha: number;
  phase: number;
}

export default function InteractiveTvBackground({ isPoweredOn }: InteractiveTvBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({
    x: -1000,
    y: -1000,
    targetX: -1000,
    targetY: -1000,
    isHovered: false,
  });

  useEffect(() => {
    if (!isPoweredOn) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 1000);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 562);

    const handleResize = () => {
      if (!canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };

    window.addEventListener("resize", handleResize);

    // Initialize interactive particles
    const particleCount = 70;
    const particles: Particle[] = [];
    const colors = ["#fef08a", "#f59e0b", "#38bdf8", "#ffffff", "#d97706"];

    for (let i = 0; i < particleCount; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      particles.push({
        x,
        y,
        baseX: x,
        baseY: y,
        size: Math.random() * 2.2 + 0.8,
        color: colors[Math.floor(Math.random() * colors.length)],
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.3,
        alpha: Math.random() * 0.6 + 0.2,
        phase: Math.random() * Math.PI * 2,
      });
    }

    let time = 0;

    // Draw frame loop
    const render = () => {
      time += 0.015;
      ctx.clearRect(0, 0, width, height);

      // Smooth mouse lerp
      const mouse = mouseRef.current;
      mouse.x += (mouse.targetX - mouse.x) * 0.1;
      mouse.y += (mouse.targetY - mouse.y) * 0.1;

      // 1. Draw interactive cursor glow inside the TV screen
      if (mouse.isHovered && mouse.x > 0 && mouse.y > 0) {
        const glowRadius = 140;
        const radial = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, glowRadius);
        radial.addColorStop(0, "rgba(245, 158, 11, 0.15)");
        radial.addColorStop(0.5, "rgba(56, 189, 248, 0.08)");
        radial.addColorStop(1, "rgba(0, 0, 0, 0)");
        ctx.fillStyle = radial;
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, glowRadius, 0, Math.PI * 2);
        ctx.fill();
      }

      // 2. Draw interactive wave ribbons with mouse displacement
      const waveOffset = mouse.isHovered ? (mouse.y - height / 2) * 0.15 : 0;

      // Golden main wave
      ctx.beginPath();
      ctx.moveTo(-50, height * 0.45);
      const cp1x = width * 0.25;
      const cp1y = height * 0.35 + Math.sin(time) * 20 + waveOffset;
      const cp2x = width * 0.65;
      const cp2y = height * 0.6 + Math.cos(time * 0.8) * 25 - waveOffset;
      ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, width + 50, height * 0.45);
      ctx.strokeStyle = "rgba(245, 158, 11, 0.25)";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Cyan secondary wave
      ctx.beginPath();
      ctx.moveTo(-50, height * 0.55);
      const cpb1x = width * 0.35;
      const cpb1y = height * 0.65 + Math.cos(time * 1.1) * 18 - waveOffset;
      const cpb2x = width * 0.75;
      const cpb2y = height * 0.38 + Math.sin(time * 0.9) * 22 + waveOffset;
      ctx.bezierCurveTo(cpb1x, cpb1y, cpb2x, cpb2y, width + 50, height * 0.52);
      ctx.strokeStyle = "rgba(56, 189, 248, 0.22)";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // 3. Update & render interactive particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Natural drifting motion
        p.baseX += p.vx;
        p.baseY += p.vy;

        // Wrap around boundaries
        if (p.baseX < 0) p.baseX = width;
        if (p.baseX > width) p.baseX = 0;
        if (p.baseY < 0) p.baseY = height;
        if (p.baseY > height) p.baseY = 0;

        // Mouse interaction: push / magnetic deflection
        let targetX = p.baseX + Math.sin(time + p.phase) * 6;
        let targetY = p.baseY + Math.cos(time + p.phase) * 6;

        if (mouse.isHovered) {
          const dx = mouse.x - targetX;
          const dy = mouse.y - targetY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const maxDist = 110;

          if (dist < maxDist && dist > 0) {
            const force = (maxDist - dist) / maxDist;
            const angle = Math.atan2(dy, dx);
            targetX -= Math.cos(angle) * force * 35;
            targetY -= Math.sin(angle) * force * 35;
          }
        }

        p.x += (targetX - p.x) * 0.1;
        p.y += (targetY - p.y) * 0.1;

        // Draw particle with gentle pulsation
        const pulse = (Math.sin(time * 2 + p.phase) + 1) * 0.5;
        const currentAlpha = p.alpha * (0.6 + pulse * 0.4);

        ctx.fillStyle = p.color;
        ctx.globalAlpha = currentAlpha;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        // Connect nearby particles with subtle light links
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const distLinks = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (distLinks < 55) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = p.color;
            ctx.globalAlpha = (1 - distLinks / 55) * 0.12;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      ctx.globalAlpha = 1;
      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    // Track mouse & touch position relative to canvas
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.targetX = e.clientX - rect.left;
      mouseRef.current.targetY = e.clientY - rect.top;
      mouseRef.current.isHovered = true;
    };

    const handleMouseLeave = () => {
      mouseRef.current.isHovered = false;
      mouseRef.current.targetX = -1000;
      mouseRef.current.targetY = -1000;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        const rect = canvas.getBoundingClientRect();
        mouseRef.current.targetX = touch.clientX - rect.left;
        mouseRef.current.targetY = touch.clientY - rect.top;
        mouseRef.current.isHovered = true;
      }
    };

    const handleTouchEnd = () => {
      mouseRef.current.isHovered = false;
      mouseRef.current.targetX = -1000;
      mouseRef.current.targetY = -1000;
    };

    const parentEl = canvas.parentElement;
    if (parentEl) {
      parentEl.addEventListener("mousemove", handleMouseMove);
      parentEl.addEventListener("mouseleave", handleMouseLeave);
      parentEl.addEventListener("touchmove", handleTouchMove, { passive: true });
      parentEl.addEventListener("touchend", handleTouchEnd, { passive: true });
    }

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      if (parentEl) {
        parentEl.removeEventListener("mousemove", handleMouseMove);
        parentEl.removeEventListener("mouseleave", handleMouseLeave);
        parentEl.removeEventListener("touchmove", handleTouchMove);
        parentEl.removeEventListener("touchend", handleTouchEnd);
      }
    };
  }, [isPoweredOn]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-5"
    />
  );
}
