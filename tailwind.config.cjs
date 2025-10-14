/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors')

module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'orange_one': '#FFEBC0',
        'orange_two': '#FFE8B6',
        'orange_three': '#FFC36E',
        'orange_four': '#F5A623',
        'orange_five': '#FF9800',
        'white': '#FFFFFF',
        'black': '#000000',
        gray_one: '#D4D7E3',
        gray_two: '#8897AD',
        gray_three: '#B3B3B3',
        yellow_one: '#FEE500',
        green_one: '#C2ECB4',
        pink_one: '#FFC4C5',
        red_one: '#DF0000',
        green_two: '#34A853',
      },
      borderWidth: {
        '3': '3px',
      },
      backgroundImage: {
        'home-background': "url('@/assets/home.png')",
      },
    },
  },
  plugins: [],
}
