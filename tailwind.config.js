/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',
        sm: '2rem',
        lg: '4rem',
        xl: '5rem',
        '2xl': '6rem',
      },
      // Completely override container behavior - no max-width restrictions
      screens: {
        sm: '100%',
        md: '100%', 
        lg: '100%',
        xl: '100%',
        '2xl': '100%',
      },
    },
    extend: {
      screens: {
        'mobile': {'max': '991px'},
        'tablet': '992px',
        'desktop': '1200px',
        'xl': '1024px', // Override default xl breakpoint to 1024px
      },
    },
  },
  plugins: [],
}