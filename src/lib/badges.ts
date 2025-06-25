export type BadgeCategory = "Strength" | "Endurance" | "Consistency" | "Leadership";
export type BadgeRarity = "Bronze" | "Silver" | "Gold" | "Platinum";

export interface Badge {
  id: string;
  name: string;
  description: string;
  category: BadgeCategory;
  rarity: BadgeRarity;
  icon: string; // path to SVG or icon component name
  unlocked: boolean;
  dateUnlocked?: string;
} 