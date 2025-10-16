/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Current color scheme
        cream: "#FDFBF5",
        chocolate: {
          DEFAULT: "#4A2C2A",
          light: "#805A45",
        },
        // New premium color scheme inspired by Wild Woven
        primary: {
          DEFAULT: "#3A261E", // Rich deep brown
          light: "#5C4034", // Lighter brown for accents
          dark: "#291A15", // Darker brown for emphasis
        },
        secondary: {
          DEFAULT: "#D8C3A5", // Warm tan/beige
          light: "#E6D7C3", // Lighter beige for backgrounds
          dark: "#C0A678", // Darker tan for accents
        },
        accent: {
          DEFAULT: "#8A5A44", // Rustic leather color
          light: "#A27559", // Lighter version for hover states
          dark: "#6E4535", // Darker version for active states
        },
        neutral: {
          100: "#F9F6F0", // Lightest cream/off-white
          200: "#EFE8DD", // Light cream
          300: "#DFD3C3", // Medium cream
          400: "#C7B299", // Darker cream
          500: "#A69276", // Light brown
          600: "#846F54", // Medium brown
          700: "#5F4D37", // Dark brown
          800: "#3F3423", // Very dark brown
          900: "#221C13", // Almost black brown
        }
      },
      fontFamily: {
        'sans': ['Montserrat', 'Helvetica', 'Arial', 'sans-serif'],
        'serif': ['Playfair Display', 'Georgia', 'serif'],
        'display': ['Cormorant Garamond', 'serif'],
        'body': ['Montserrat', 'sans-serif'],
      },
      boxShadow: {
        'subtle': '0 2px 10px rgba(0, 0, 0, 0.05)',
        'premium': '0 4px 20px rgba(0, 0, 0, 0.08)',
        'inner-soft': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
      },
      borderWidth: {
        'thin': '0.5px',
      },
      spacing: {
        '72': '18rem',
        '84': '21rem',
        '96': '24rem',
        '128': '32rem',
      },
      fontSize: {
        'xxs': '0.625rem',
      },
      backgroundImage: {
        'leather-texture': "url('/assets/leather-texture.jpg')",
        'grain-pattern': "url('/assets/grain-pattern.png')",
      },
    },
  },
  plugins: [
    require('@tailwindcss/aspect-ratio'),
  ],
};