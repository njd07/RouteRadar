/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bg:      '#060D1A',
        surface: '#0D1B2E',
        border:  '#1E3A5F',
        accent:  '#3B82F6',
        'accent-hover': '#2563EB',
        risk: {
          critical: '#EF4444',
          high:     '#F97316',
          medium:   '#EAB308',
          low:      '#22C55E',
        },
      },
      fontFamily: { sans: ['Inter', 'system-ui', 'sans-serif'] },
    },
  },
  plugins: [],
};
