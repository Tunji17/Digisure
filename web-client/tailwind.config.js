/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.tsx',
  ],
  theme: {
    screens: {
      sm: '480px',
      md: '768px',
      lg: '976px',
      xl: '1440px',
    },
    colors: {
      'primary': '#98D2EB',
      'primary-light': '#E1F2FE',
      'blue': '#546EFF',
      'blue-dark': '#3B4DB3',
      'blue-light': '#E8EBFF',
      'black': '#212121',
      'white': '#FFFFFF',
      'cream': '#FDF9FF',
      'cream-polish': '#FDFBFF',
      'gold': '#FFDF00',
      'grey': '#E5E5E5',
      'gray': '#616161',
      'overlay-gray': '#00000080',
      'red': '#A63232',
      'warning': '#FFC107',
      'success': '#20C997',
      'red-light': '#FF9494',
      'purple-light': '#ECCDFF',
    },
    fontFamily: {
      sans: ['avenir', 'sans-serif'],
    },
    extend: {},
  },
  plugins: [],
}
