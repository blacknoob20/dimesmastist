module.exports = {
  darkMode: 'media',
  content: ['./src/**/*.{html,js,jsx,tsx,ts}', './index.html'],
  theme: {
    extend: {
      colors: {
        brand: {
          bg: 'var(--color-bg)',
          surface: 'var(--color-surface)',
          'surface-secondary': 'var(--color-surface-secondary)',
          border: 'var(--color-border)',
          text: 'var(--color-text)',
          muted: 'var(--color-text-muted)',
          accent: 'var(--color-accent)',
          'accent-hover': 'var(--color-accent-hover)',
        },
      },
      fontFamily: {
        display: ['Georgia', 'Cambria', 'serif'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
