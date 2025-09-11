import { Manrope, Nunito } from "next/font/google";
import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "12px",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        Manrope: ["var(--font-manrope)", "sans-serif"],
        Nunito: ["var(--font-nunito)", "sans-serif"],
      },
      colors: {
        primary_light_blue: "#25c3ec",
        primary_dark_blue: "#1765AA",
        text_primary_gradient:
          "linear-gradient(135deg, #25C3EC 0%, #1765AA 100%)",
        text_gray: "#738287",
        text_dark_gray: "#596569",
        background_dark_black: "#01222E",
        background_darker_black: "#021921",
        background_darkest_black: "#02141A",
        backgound_navbar: "rgba(1, 23, 31, 0.50)",
        background_contact: "rgba(2, 20, 26, 0.50)",
        hero_section_border: "rgba(255, 255, 255, 0.15)",
        navbar_bg: "rgba(2, 25, 33, 0.50)",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
      },
      backgroundImage: {
        "primary-gradient": "linear-gradient(135deg, #25C3EC 0%, #1765AA 100%)",
        "button-card-gradient":
          "linear-gradient(180deg, #021921 -6.25%, #01222E 100%)",
        "radial-gradient-custom":
          "radial-gradient(153.71% 117.75% at 100% 0%, #01222E 0%, #021921 100%)",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
