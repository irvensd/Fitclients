import React, { useEffect } from "react";
import { Badge } from "@/lib/badges";
import useSound from "use-sound"; // install with: npm i use-sound

interface BadgeRevealProps {
  badge: Badge;
  onClose?: () => void;
}

const rarityColors = {
  Bronze: "from-yellow-700 to-yellow-400",
  Silver: "from-gray-400 to-gray-100",
  Gold: "from-yellow-400 to-yellow-200",
  Platinum: "from-blue-400 to-blue-200",
};

export const BadgeReveal: React.FC<BadgeRevealProps> = ({ badge, onClose }) => {
  const [play] = useSound("/sounds/badge-reveal.mp3"); // Place your sound in public/sounds

  useEffect(() => {
    play();
  }, [play]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-white rounded-2xl shadow-xl p-8 text-center animate-fadeInUp">
        <div
          className={`mx-auto mb-4 w-24 h-24 rounded-full bg-gradient-to-br ${rarityColors[badge.rarity]} flex items-center justify-center animate-pulseGlow`}
        >
          {/* Replace with your icon logic */}
          <span className="text-4xl">{badge.icon}</span>
        </div>
        <h2 className="text-2xl font-bold mb-2">{badge.name}</h2>
        <p className="mb-4">{badge.description}</p>
        <div className="flex justify-center gap-2 mb-4">
          <span className="px-3 py-1 rounded-full bg-gray-100 text-xs">{badge.category}</span>
          <span className="px-3 py-1 rounded-full bg-gray-200 text-xs">{badge.rarity}</span>
        </div>
        <button
          className="mt-2 px-6 py-2 bg-primary text-white rounded-lg font-semibold"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
}; 