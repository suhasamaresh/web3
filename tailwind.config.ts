import type { Config } from "tailwindcss";
const fontUrl = 'https://fonts.googleapis.com/css2?family=Goblin+One&family=Montserrat&family=Oi&family=Poppins:ital,wght@0,100;0,400;1,100&family=Roboto+Mono&family=Satisfy&display=swap';
const fontUrl2 = 'https://fonts.googleapis.com/css2?family=Epilogue:ital,wght@0,100..900;1,100..900&family=Goblin+One&family=Montserrat&family=Oi&family=Poppins:ital,wght@0,100;0,400;1,100&family=Roboto+Mono&family=Satisfy&display=swap';

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      animation: {
        "left-to-right": "left-to-right 0.5s",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      fontFamily: { poppins: ["Poppins", "sans-serif"] , epilogue: ["Epilogue", "sans-serif"] },
      
    },
    },
    plugins: [],
  };
export default config;
