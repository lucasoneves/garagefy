// tailwind.config.js
module.exports = {
  plugins: [],
  corePlugins: {
    preflight: true,
  },
  theme: {
    extend: {
      colors: {
        primary: '#ff0000',
        secondary: '#00ff00',
      },
      fontFamily: {
        sans: ['Helvetica', 'Arial', 'sans-serif'],
        serif: ['Georgia', 'Cambria', 'serif'],
      },
    },
  },
  // ... other configurations
}
