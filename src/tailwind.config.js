/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./*.{html,js}"],
  theme: {
    extend: {},
  },
  plugins: [],
  
  theme: {
    extend: {
      boxShadow: {
        'all-sides': '0 0 15px rgba(0, 0, 0, 0.3)',
      },
      maxWidth: {
        'mid': '22rem',
      },
      backgroundImage: {
        'gray-to-white': 'linear-gradient(to bottom, #D1D5DB 1%, white 100%)',
      },
      colors: {
        'dark-mode-background': '#0f131e',
      }
    }
  }
}

