// High-quality, subtle background images that work well with glassmorphism
export const backgrounds = [
  {
    url: "https://commandly.dev/backgrounds/background1.jpeg",
    credit: "Commandly AI",
    color: "from-purple-500/30 to-blue-500/30",
  },
  {
    url: "https://commandly.dev/backgrounds/background2.jpeg",
    credit: "Commandly AI",
    color: "from-indigo-500/30 to-cyan-500/30",
  },
  {
    url: "https://commandly.dev/backgrounds/background3.jpeg",
    credit: "Commandly AI",
    color: "from-blue-500/30 to-teal-500/30",
  },
  {
    url: "https://commandly.dev/backgrounds/background4.jpeg",
    credit: "Commandly AI",
    color: "from-violet-500/30 to-fuchsia-500/30",
  },
  {
    url: "https://commandly.dev/backgrounds/background5.jpeg",
    credit: "Commandly AI",
    color: "from-emerald-500/30 to-cyan-500/30",
  },
  {
    url: "https://commandly.dev/backgrounds/background6.jpeg",
    credit: "Commandly AI",
    color: "from-rose-500/30 to-orange-500/30",
  },
  {
    url: "https://commandly.dev/backgrounds/background7.jpeg",
    credit: "Commandly AI",
    color: "from-sky-500/30 to-indigo-500/30",
  },
  {
    url: "https://commandly.dev/backgrounds/background8.jpeg",
    credit: "Commandly AI",
    color: "from-amber-500/30 to-pink-500/30",
  },
  {
    url: "https://commandly.dev/backgrounds/background9.jpeg",
    credit: "Commandly AI",
    color: "from-green-500/30 to-blue-500/30",
  },
  {
    url: "https://commandly.dev/backgrounds/background10.jpeg",
    credit: "Commandly AI",
    color: "from-purple-500/30 to-pink-500/30",
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
