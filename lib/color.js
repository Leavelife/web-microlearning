export const cardColors = [
  "bg-gradient-to-tl from-pink-300 via-pink-400 to-rose-400 hover:from-pink-400 hover:via-pink-500 hover:to-rose-600 transition-all duration-300",
  "bg-gradient-to-tl from-orange-300 via-orange-400 to-amber-500 hover:from-orange-400 hover:via-orange-500 hover:to-amber-600 transition-all duration-300",
  "bg-gradient-to-tl from-green-300 via-green-400 to-emerald-500 hover:from-green-400 hover:via-green-500 hover:to-emerald-600 transition-all duration-300",
  "bg-gradient-to-tl from-red-300 via-red-400 to-rose-500 hover:from-red-400 hover:via-red-500 hover:to-rose-600 transition-all duration-300",
  "bg-gradient-to-tl from-purple-300 via-purple-400 to-fuchsia-500 hover:from-purple-400 hover:via-purple-500 hover:to-fuchsia-600 transition-all duration-300",
  "bg-gradient-to-tl from-violet-300 via-violet-400 to-purple-500 hover:from-violet-400 hover:via-violet-500 hover:to-purple-600 transition-all duration-300",
  "bg-gradient-to-tl from-lime-300 via-lime-400 to-green-500 hover:from-lime-400 hover:via-lime-500 hover:to-green-600 transition-all duration-300",
  "bg-gradient-to-tl from-pink-300 via-pink-400 to-rose-400 hover:from-pink-400 hover:via-pink-500 hover:to-rose-600 transition-all duration-300",
  "bg-gradient-to-tl from-blue-300 via-blue-400 to-indigo-500 hover:from-blue-400 hover:via-blue-500 hover:to-indigo-600 transition-all duration-300",
  "bg-gradient-to-tl from-fuchsia-300 via-fuchsia-400 to-pink-500 hover:from-fuchsia-400 hover:via-fuchsia-500 hover:to-pink-600 transition-all duration-300"
];

export function getColorById(id) {
  let hash = 0;

  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }

  return cardColors[Math.abs(hash) % cardColors.length];
}