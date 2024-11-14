/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        textColor:"#2C0F0F",
        inputBorder:"#D1D1D1",
        cmsbg:"#FAFAFA",
        textlightcolor:"#5F5F5F",
        bodyebg:"#FBFBFB",
        sidebarBg:"#202020"
      },
    },
  },
  plugins: [],
};
