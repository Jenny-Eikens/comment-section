import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "mod-blue": "hsl(238, 40%, 52%)",
        "soft-red": "hsl(358, 79%, 66%)",
        "light-gray-blue": "hsl(239, 57%, 85%)", // only used for border of textarea
        "pale-red": "hsl(357, 100%, 86%)", // not used at all
        "dark-blue": "hsl(212, 24%, 26%)", // used for text and textarea border on hover
        "gray-blue": "hsl(211, 10%, 45%)", // used for relativeTime, comment content, deletion in modal
        "light-gray": "hsl(223, 19%, 93%)", // only used for border
        "v-light-gray": "hsl(228, 33%, 97%)", // used for background of page and voting
        white: "hsl(0, 0%, 100%)",
      },
    },
  },
  daisyui: {
    themes: [
      {
        lighttheme: {
          "base-100": "hsl(228, 33%, 97%)", // v-light-gray
          neutral: "hsl(211, 10%, 45%)", // gray-blue
          warning: "hsl(358, 79%, 66%)", // soft-red
          "base-200": "hsl(212, 24%, 26%)", // dark-blue
          primary: "hsl(238, 40%, 52%)", // mod-blue
          accent: "hsl(223, 19%, 93%)", // light-gray
          "base-300": "hsl(0, 0%, 100%)", // white
        },
        darktheme: {
          "base-100": "hsl(0, 0%, 0%)", // black
          neutral: "hsl(228, 33%, 97%)", // v-light-gray
          warning: "hsl(358, 79%, 66%)", // soft-red
          "base-200": "hsl(0, 0%, 100%)", // white
          primary: "hsl(238, 40%, 52%)", // mod-blue
          accent: "hsl(223, 19%, 93%)", // light-gray
          "base-300": "hsl(212, 24%, 16%)", // dark-blue
        },
      },
    ],
  },
  plugins: [require("daisyui")],
} satisfies Config;
