import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Dark theme base colors
        background: {
          primary: "#0A0A0F",
          secondary: "#1A1A2E",
          tertiary: "#16213E",
        },
        // Neon accent colors
        neon: {
          blue: "#00D9FF",
          purple: "#9D4EDD",
          green: "#00FF88",
          pink: "#FF006E",
        },
        // Surface colors
        surface: {
          primary: "rgba(26, 26, 46, 0.8)",
          secondary: "rgba(22, 33, 62, 0.6)",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        heading: ["var(--font-space-grotesk)", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      animation: {
        "glow-pulse": "glow 2s ease-in-out infinite alternate",
        "float": "float 6s ease-in-out infinite",
        "slide-up": "slideUp 0.5s ease-out",
      },
      keyframes: {
        glow: {
          "0%": { boxShadow: "0 0 20px rgba(0, 217, 255, 0.5)" },
          "100%": { boxShadow: "0 0 30px rgba(0, 217, 255, 0.8)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
        slideUp: {
          "0%": { transform: "translateY(100px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
    },
  },
  plugins: [
    // Add plugin for custom classes
    function({ addUtilities, theme }: any) {
      const newUtilities = {
        '.glass': {
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        },
        '.glass-dark': {
          background: 'rgba(0, 0, 0, 0.3)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        },
      };
      addUtilities(newUtilities);
    }
  ],
};

export default config;
