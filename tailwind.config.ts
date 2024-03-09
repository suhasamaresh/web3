import type { Config } from "tailwindcss";
const fontUrl = 'https://fonts.googleapis.com/css2?family=Goblin+One&family=Montserrat&family=Oi&family=Poppins:ital,wght@0,100;0,400;1,100&family=Roboto+Mono&family=Satisfy&display=swap';


const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      fontFamily: { poppins: ["Poppins", "sans-serif"] },
    },
  },
  plugins: [],
};
export default config;
