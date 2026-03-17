const {heroui} = require('@heroui/theme');
// tailwind.config.js
module.exports = {
  plugins: [heroui()],
  content: [
    "./node_modules/@heroui/theme/dist/components/(date-picker|button|ripple|spinner|calendar|date-input|form|popover).js"
],
  corePlugins: {
    preflight: true,
  },
  // ... other configurations
}
