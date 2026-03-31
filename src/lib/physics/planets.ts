export interface Planet {
  id: string;
  name: string;
  gravity: number;
  color: string;
  emoji: string;
}

export const PLANETS: Planet[] = [
  { id: "earth", name: "Terra", gravity: 9.8, color: "hsl(200 70% 50%)", emoji: "🌍" },
  { id: "moon", name: "Lua", gravity: 1.62, color: "hsl(0 0% 75%)", emoji: "🌙" },
  { id: "mars", name: "Marte", gravity: 3.72, color: "hsl(15 80% 50%)", emoji: "🔴" },
  { id: "jupiter", name: "Júpiter", gravity: 24.79, color: "hsl(30 60% 55%)", emoji: "🟠" },
  { id: "venus", name: "Vênus", gravity: 8.87, color: "hsl(45 80% 60%)", emoji: "🟡" },
  { id: "mercury", name: "Mercúrio", gravity: 3.7, color: "hsl(0 0% 60%)", emoji: "⚫" },
  { id: "saturn", name: "Saturno", gravity: 10.44, color: "hsl(40 50% 65%)", emoji: "🪐" },
  { id: "uranus", name: "Urano", gravity: 8.69, color: "hsl(180 50% 65%)", emoji: "🔵" },
  { id: "neptune", name: "Netuno", gravity: 11.15, color: "hsl(220 70% 55%)", emoji: "💙" },
];
