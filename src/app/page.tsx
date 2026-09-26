"use client";

import CinematicExperience from "@/components/CinematicExperience";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-black text-white selection:bg-white/20 selection:text-white">
      {/* Main Cinematic Walkthrough & TV UI Experience */}
      <main id="experience" className="relative w-full">
        <CinematicExperience />
      </main>
    </div>
  );
}
