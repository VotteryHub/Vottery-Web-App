/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,jsx}',
    './src/components/**/*.{js,jsx}',
    './src/app/**/*.{js,jsx}',
    './src/**/*.{js,jsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        border: 'var(--color-border)', /* slate-400 with opacity */
        input: 'var(--color-input)', /* slate-400 with opacity */
        ring: 'var(--color-ring)', /* blue-600 */
        background: 'var(--color-background)', /* gray-50 / slate-900 */
        foreground: 'var(--color-foreground)', /* gray-900 / 92% white */
        primary: {
          DEFAULT: 'var(--color-primary)', /* blue-600 / blue-500 */
          foreground: 'var(--color-primary-foreground)', /* white */
        },
        secondary: {
          DEFAULT: 'var(--color-secondary)', /* violet-600 / violet-500 */
          foreground: 'var(--color-secondary-foreground)', /* white */
        },
        accent: {
          DEFAULT: 'var(--color-accent)', /* amber-500 / amber-400 */
          foreground: 'var(--color-accent-foreground)', /* gray-800 / slate-900 */
        },
        destructive: {
          DEFAULT: 'var(--color-destructive)', /* red-600 / red-500 */
          foreground: 'var(--color-destructive-foreground)', /* white */
        },
        success: {
          DEFAULT: 'var(--color-success)', /* emerald-600 / emerald-500 */
          foreground: 'var(--color-success-foreground)', /* white */
        },
        warning: {
          DEFAULT: 'var(--color-warning)', /* amber-600 / amber-500 */
          foreground: 'var(--color-warning-foreground)', /* white */
        },
        error: {
          DEFAULT: 'var(--color-error)', /* red-600 / red-500 */
          foreground: 'var(--color-error-foreground)', /* white */
        },
        muted: {
          DEFAULT: 'var(--color-muted)', /* gray-100 / slate-700 */
          foreground: 'var(--color-muted-foreground)', /* gray-500 / slate-400 */
        },
        card: {
          DEFAULT: 'var(--color-card)', /* white / slate-800 */
          foreground: 'var(--color-card-foreground)', /* gray-700 / slate-200 */
        },
        popover: {
          DEFAULT: 'var(--color-popover)', /* white / slate-800 */
          foreground: 'var(--color-popover-foreground)', /* gray-900 / 92% white */
        },
      },
      borderRadius: {
        sm: 'var(--radius-sm)', /* 6px */
        md: 'var(--radius-md)', /* 12px */
        lg: 'var(--radius-lg)', /* 18px */
        xl: 'var(--radius-xl)', /* 24px */
      },
      fontFamily: {
        heading: ['Outfit', 'sans-serif'],
        body: ['Source Sans 3', 'sans-serif'],
        caption: ['Inter Tight', 'sans-serif'],
        data: ['JetBrains Mono', 'monospace'],
      },
      fontSize: {
        'h1': ['2.5rem', { lineHeight: '1.2', fontWeight: '700' }],
        'h2': ['2rem', { lineHeight: '1.25', fontWeight: '600' }],
        'h3': ['1.5rem', { lineHeight: '1.3', fontWeight: '600' }],
        'h4': ['1.25rem', { lineHeight: '1.4', fontWeight: '500' }],
        'h5': ['1.125rem', { lineHeight: '1.5', fontWeight: '500' }],
        'caption': ['0.875rem', { lineHeight: '1.4', letterSpacing: '-0.01em' }],
      },
      spacing: {
        '15': '3.75rem',
        '18': '4.5rem',
        '88': '22rem',
      },
      transitionDuration: {
        '250': '250ms',
      },
      transitionTimingFunction: {
        'spring': 'cubic-bezier(0.34, 1.26, 0.64, 1)',
      },
      keyframes: {
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(37, 99, 235, 0.4)' },
          '50%': { boxShadow: '0 0 0 4px rgba(37, 99, 235, 0)' },
        },
        celebrate: {
          '0%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.2)', opacity: '0.8' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      animation: {
        shimmer: 'shimmer 2s infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        celebrate: 'celebrate 600ms cubic-bezier(0.34, 1.26, 0.64, 1)',
      },
      boxShadow: {
        'democratic-sm': '0 2px 4px rgba(15, 23, 42, 0.08)',
        'democratic-md': '0 4px 8px rgba(15, 23, 42, 0.1)',
        'democratic-lg': '0 8px 16px rgba(15, 23, 42, 0.12)',
        'democratic-xl': '0 16px 32px rgba(15, 23, 42, 0.14)',
        'democratic-2xl': '0 32px 64px -12px rgba(15, 23, 42, 0.16)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
    require('tailwindcss-animate'),
  ],
}