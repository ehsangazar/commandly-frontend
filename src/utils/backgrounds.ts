// High-quality, subtle background images that work well with glassmorphism
export const backgrounds = [
  {
    url: "https://commandly.dev/backgrounds/background-1.jpeg",
    credit: "Unsplash - Modestas Urbonas",
    color: "from-purple-500/30 to-blue-500/30", // Tailwind gradient colors for overlay
  },
  {
    url: "https://commandly.dev/backgrounds/background-2.jpeg",
    credit: "Unsplash - Pawel Czerwinski",
    color: "from-indigo-500/30 to-cyan-500/30",
  },
];

export const getRandomBackground = () => {
  return backgrounds[Math.floor(Math.random() * backgrounds.length)];
};

// Save the current background index to localStorage
export const saveBackgroundIndex = (index: number) => {
  localStorage.setItem("dashboard-background-index", index.toString());
};

// Get the saved background index from localStorage
export const getSavedBackgroundIndex = (): number => {
  const saved = localStorage.getItem("dashboard-background-index");
  return saved
    ? parseInt(saved, 10)
    : Math.floor(Math.random() * backgrounds.length);
};
