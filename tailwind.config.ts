import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./app/**/{**,.client,.server}/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          "50": "hsl(var(--primary) / 0.05)",
          "100": "hsl(var(--primary) / 0.1)",
          "200": "hsl(var(--primary) / 0.2)",
          "300": "hsl(var(--primary) / 0.3)",
          "400": "hsl(var(--primary) / 0.4)",
          "500": "hsl(var(--primary) / 0.5)",
          "600": "hsl(var(--primary) / 0.6)",
          "700": "hsl(var(--primary) / 0.7)",
          "800": "hsl(var(--primary) / 0.8)",
          "900": "hsl(var(--primary) / 0.9)",
          "950": "hsl(var(--primary) / 0.95)",
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        success: {
          "50": "hsl(var(--success) / 0.05)",
          "100": "hsl(var(--success) / 0.1)",
          "200": "hsl(var(--success) / 0.2)",
          "300": "hsl(var(--success) / 0.3)",
          "400": "hsl(var(--success) / 0.4)",
          "500": "hsl(var(--success) / 0.5)",
          "600": "hsl(var(--success) / 0.6)",
          "700": "hsl(var(--success) / 0.7)",
          "800": "hsl(var(--success) / 0.8)",
          "900": "hsl(var(--success) / 0.9)",
          "950": "hsl(var(--success) / 0.95)",
        },
        warning: {
          "50": "hsl(var(--warning) / 0.05)",
          "100": "hsl(var(--warning) / 0.1)",
          "200": "hsl(var(--warning) / 0.2)",
          "300": "hsl(var(--warning) / 0.3)",
          "400": "hsl(var(--warning) / 0.4)",
          "500": "hsl(var(--warning) / 0.5)",
          "600": "hsl(var(--warning) / 0.6)",
          "700": "hsl(var(--warning) / 0.7)",
          "800": "hsl(var(--warning) / 0.8)",
          "900": "hsl(var(--warning) / 0.9)",
          "950": "hsl(var(--warning) / 0.95)",
        },
        danger: {
          "50": "hsl(var(--danger) / 0.05)",
          "100": "hsl(var(--danger) / 0.1)",
          "200": "hsl(var(--danger) / 0.2)",
          "300": "hsl(var(--danger) / 0.3)",
          "400": "hsl(var(--danger) / 0.4)",
          "500": "hsl(var(--danger) / 0.5)",
          "600": "hsl(var(--danger) / 0.6)",
          "700": "hsl(var(--danger) / 0.7)",
          "800": "hsl(var(--danger) / 0.8)",
          "900": "hsl(var(--danger) / 0.9)",
          "950": "hsl(var(--danger) / 0.95)",
        },
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        "card-foreground": "hsl(var(--card-foreground))",
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        "popover-foreground": "hsl(var(--popover-foreground))",
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        "muted-foreground": "hsl(var(--muted-foreground))",
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        "accent-foreground": "hsl(var(--accent-foreground))",
        border: "hsl(var(--border))", // Ensure this is defined
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
      },
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
          "Apple Color Emoji",
          "Segoe UI Emoji",
          "Segoe UI Symbol",
          "Noto Color Emoji",
        ],
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