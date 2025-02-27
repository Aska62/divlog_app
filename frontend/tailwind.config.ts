import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    screens: {
      sm: '480px',
      md: '890px',
      lg: '976px',
      xl: '1280px'
    },
    extend: {
      colors: {
        baseWhite: '#FFFFFF',
        darkBlue: '#033581',
        lightBlue: '#D8EBFC',
        iceBlue: '#BEC8D6',
        lightGray: '#989191',
        baseBlack: '#403E3E',
        eyeCatch: '#FFAE83'
      },
    },
    fontFamily: {
      logo: ["Julius Sans One", "sans-serif"],
      base: ["Inter", "serif"]
    }
  },
  plugins: [],
};
export default config;
