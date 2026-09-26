"use client";

import React, { useState } from "react";
import CinematicExperience from "@/components/CinematicExperience";
import RegistrationModal from "@/components/RegistrationModal";
import InfoModal from "@/components/InfoModal";

export default function Home() {
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);

  return (
    <div className="relative min-h-screen bg-black text-white selection:bg-white/20 selection:text-white">
      {/* Main Cinematic Walkthrough & TV UI Experience */}
      <main id="experience" className="relative w-full">
        <CinematicExperience
          onRegisterClick={() => setIsRegisterModalOpen(true)}
          onInfoClick={() => setIsInfoModalOpen(true)}
        />
      </main>

      {/* Interactive Registration / Pass Modal */}
      <RegistrationModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
      />

      {/* Interactive Event Info Modal */}
      <InfoModal
        isOpen={isInfoModalOpen}
        onClose={() => setIsInfoModalOpen(false)}
        onRegisterClick={() => setIsRegisterModalOpen(true)}
      />
    </div>
  );
}
