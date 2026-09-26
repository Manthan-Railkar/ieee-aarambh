"use client";

import React, { useRef, useEffect, useState, ReactNode } from "react";

interface FadeContentProps {
  children: ReactNode;
  blur?: boolean;
  duration?: number;
  easing?: string;
  delay?: number;
  threshold?: number;
  initialOpacity?: number;
  className?: string;
  animate?: boolean;
}

export default function FadeContent({
  children,
  blur = true,
  duration = 1000,
  easing = "cubic-bezier(0.16, 1, 0.3, 1)",
  delay = 200,
  threshold = 0.1,
  initialOpacity = 0,
  className = "",
  animate = true,
}: FadeContentProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!animate) {
      setIsVisible(false);
      return;
    }

    const element = ref.current;
    if (!element) return;

    // Use IntersectionObserver or a slight microtask/requestAnimationFrame
    // to guarantee the initial style renders before transitioning
    let timer: NodeJS.Timeout;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          timer = setTimeout(() => {
            setIsVisible(true);
          }, delay);
          observer.unobserve(element);
        }
      },
      { threshold }
    );

    observer.observe(element);

    // Also trigger on mount if already in DOM
    const raf = requestAnimationFrame(() => {
      timer = setTimeout(() => {
        setIsVisible(true);
      }, delay);
    });

    return () => {
      observer.disconnect();
      clearTimeout(timer);
      cancelAnimationFrame(raf);
    };
  }, [animate, delay, threshold]);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: isVisible ? 1 : initialOpacity,
        filter: blur ? (isVisible ? "blur(0px)" : "blur(12px)") : "none",
        transform: isVisible ? "translateY(0) scale(1)" : "translateY(12px) scale(0.96)",
        transition: `opacity ${duration}ms ${easing}, filter ${duration}ms ${easing}, transform ${duration}ms ${easing}`,
        willChange: "opacity, filter, transform",
      }}
    >
      {children}
    </div>
  );
}
