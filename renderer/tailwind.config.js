/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./renderer/pages/**/*.{js,ts,jsx,tsx}",
    "./renderer/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        white: "#ECEBE8",
      },
      borderRadius: {
        "4xl": "50px",
      },
      // backgroundColor: {
      //   white: "#ECEBE8",
      // },
    },
  },
  plugins: [],
};
