import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        muted: "hsl(var(--muted))",
        "muted-foreground": "hsl(var(--muted-foreground))",
        primary: "hsl(var(--primary))",
        "primary-foreground": "hsl(var(--primary-foreground))",
        accent: "hsl(var(--accent))",
        "accent-foreground": "hsl(var(--accent-foreground))",
        surface: "hsl(var(--surface))",
        "surface-soft": "hsl(var(--surface-soft))",
        sky: "hsl(var(--sky))",
        coral: "hsl(var(--coral))",
        lavender: "hsl(var(--lavender))",
        yellow: "hsl(var(--yellow))",
      },
      boxShadow: {
        soft: "0 20px 60px rgba(30, 41, 59, 0.08)",
        panel: "0 18px 45px rgba(13, 111, 110, 0.14)",
      },
    },
  },
  plugins: [],
};

export default config;
