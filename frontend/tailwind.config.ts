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
      md: '760px',
      lg: '976px',
      xl: '1280px'
    },
    extend: {
      colors: {
        baseWhite: '#FFFFFF',
        baseWhite70: 'rgba(255, 255, 255, .7)',
        darkBlue: '#033581',
        darkBlueLight: "#3877d9",
        lightBlue: '#D8EBFC',
        iceBlue: '#BEC8D6',
        lightGray: '#989191',
        baseBlack: '#403E3E',
        baseBlackLight: '#595757',
        eyeCatch: '#FFAE83',
        eyeCatchDark: '#d68960'
      },
      boxShadow: {
        'dl': '0 4px 8px 0.5px rgba(0, 0, 0, 0.3)'
      },
      spacing: {
        'screenWOHeader': 'calc(100vh - 3.5rem)'
      }
    },
    fontFamily: {
      logo: ["Julius Sans One", "sans-serif"],
      base: ["Inter", "serif"]
    }
  },
  plugins: [],
};
export default config;
