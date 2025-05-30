/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    fontFamily:{
      display:["Poppins","sans-serif"],
    },
    extend: {
      color:{
        primary:"#0586D3",
        secondary:"#EF863E",
      },
    },
  },
  plugins: [],
}

