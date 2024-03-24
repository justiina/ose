import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./index.html",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      fontFamily: {
        sans: ["Roboto", "sans-serif"],
        heading: ["Outfit", "sans-serif"],
      },
      colors: {
        background: "#F2F2F2",
        grey: "#42464D",
        greyhover: "#2f3237",
        greylight: "#C6C7C9",
        blue: "#0470C0",
        bluehover: "#035696",
        orange: "#F35B18",
        orangehover: "#DA490B",
        green: "#39A845",
        purple: "#D21BEF",
        yellow: "#F5B715",
      },
    },
  },
  plugins: [],
};
export default config;
