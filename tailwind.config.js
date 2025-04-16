/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{html,ts}"],
    theme: {
      extend: {
        colors: {
          peach: '#f4b098',
          salmon: '#f17c63',
          lightPeach: '#f7d8c8',
          lavender: '#c4a2e2',
          mint: '#c7e2c3',
          coral: '#ee9870',
        },
        fontFamily: {
          peachy: ['Poppins', 'sans-serif'], // puedes cambiarlo si usas otra fuente
        }
      },
    },
    plugins: [],
  };