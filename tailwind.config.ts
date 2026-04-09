import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#162521",
        mist: "#f6f2e8",
        clay: "#d9835f",
        moss: "#5d7a63",
        gold: "#eabf6b"
      },
      fontFamily: {
        display: ["Georgia", "serif"],
        body: ["Trebuchet MS", "sans-serif"]
      },
      boxShadow: {
        card: "0 18px 40px rgba(22, 37, 33, 0.10)"
      }
    }
  },
  plugins: []
};

export default config;
