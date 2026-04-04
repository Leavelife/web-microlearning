export const cardColors = [
  "bg-yellow-400",
  "bg-orange-400",
  "bg-green-500",
  "bg-red-500",
  "bg-purple-400",
  "bg-violet-400",
  "bg-green-300",
  "bg-red-300",
  "bg-blue-400",
  "bg-fuchsia-500"
];

export function getColorById(id) {
  let hash = 0;

  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }

  return cardColors[Math.abs(hash) % cardColors.length];
}