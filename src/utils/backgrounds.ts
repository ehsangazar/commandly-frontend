// High-quality, subtle background images that work well with glassmorphism
export const backgrounds = [
  {
    url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=2400",
    credit: "Unsplash - Modestas Urbonas",
    color: "from-purple-500/30 to-blue-500/30", // Tailwind gradient colors for overlay
  },
  {
    url: "https://images.unsplash.com/photo-1557683311-eac922347aa1?auto=format&fit=crop&q=80&w=2400",
    credit: "Unsplash - Pawel Czerwinski",
    color: "from-indigo-500/30 to-cyan-500/30",
  },
  {
    url: "https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?auto=format&fit=crop&q=80&w=2400",
    credit: "Unsplash - Pawel Czerwinski",
    color: "from-blue-500/30 to-emerald-500/30",
  },
  {
    url: "https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?auto=format&fit=crop&q=80&w=2400",
    credit: "Unsplash - Pawel Czerwinski",
    color: "from-rose-500/30 to-orange-500/30",
  },
  {
    url: "https://images.unsplash.com/photo-1604076913837-52ab5629fba9?auto=format&fit=crop&q=80&w=2400",
    credit: "Unsplash - Mohammad Rahmani",
    color: "from-violet-500/30 to-fuchsia-500/30",
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
