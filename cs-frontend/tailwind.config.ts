import type { Config } from 'tailwindcss';

/**
 * Tailwind config — implements the design tokens from
 * `Design_System.md`. All values are exposed as CSS custom
 * properties in `globals.css` and surfaced here as Tailwind classes.
 *
 * Naming follows the design system tokens directly:
 *   bg-primary-900   →  brand blue background
 *   text-success-700 →  brand green text
 *   bg-neutral-50    →  light page background
 */
const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '1rem',
      screens: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
      },
    },
    extend: {
      colors: {
        // Brand primary blue (extended scale derived from #0D3A7A)
        primary: {
          50: '#EEF3FB',
          100: '#D6E1F2',
          200: '#A8BFE3',
          300: '#7B9DD3',
          500: '#1E58B0',
          700: '#0E47A0',
          900: '#0D3A7A',
          950: '#082654',
        },
        // Brand success green (extended from #0A8F4D)
        success: {
          50: '#E6F6EE',
          100: '#C2EBD3',
          300: '#5DC388',
          500: '#1AA85E',
          700: '#0A8F4D',
          900: '#04663A',
        },
        // Neutrals (extended from #6F7378)
        neutral: {
          0: '#FFFFFF',
          50: '#F2F4F7',
          100: '#E5E8ED',
          200: '#CDD2DA',
          300: '#AAB1BC',
          400: '#888F9A',
          600: '#6F7378',
          700: '#52565C',
          900: '#1A1D21',
        },
        // Semantic additions (not in brand kit, calibrated to match)
        warning: {
          50: '#FEF6E7',
          500: '#C77C0E',
          700: '#8E5808',
        },
        danger: {
          50: '#FCEBEA',
          500: '#B91C1C',
          700: '#7F1313',
        },
      },
      fontFamily: {
        // Brand mandates: Poppins for display/headings, Montserrat for body
        display: ['var(--font-poppins)', 'system-ui', 'sans-serif'],
        sans: ['var(--font-montserrat)', 'system-ui', 'sans-serif'],
        mono: ['ui-monospace', 'JetBrains Mono', 'Menlo', 'monospace'],
      },
      fontSize: {
        // 8pt-baseline scale, 1.25 modular ratio
        'display-xl': ['48px', { lineHeight: '56px', fontWeight: '600' }],
        'display-lg': ['36px', { lineHeight: '44px', fontWeight: '600' }],
        'h1': ['30px', { lineHeight: '38px', fontWeight: '600' }],
        'h2': ['24px', { lineHeight: '32px', fontWeight: '600' }],
        'h3': ['20px', { lineHeight: '28px', fontWeight: '600' }],
        'h4': ['18px', { lineHeight: '26px', fontWeight: '600' }],
        'h5': ['16px', { lineHeight: '24px', fontWeight: '600' }],
        'body-lg': ['18px', { lineHeight: '28px', fontWeight: '400' }],
        'body': ['16px', { lineHeight: '24px', fontWeight: '400' }],
        'body-sm': ['14px', { lineHeight: '20px', fontWeight: '400' }],
        'caption': ['12px', { lineHeight: '16px', fontWeight: '500' }],
        'overline': ['11px', { lineHeight: '16px', fontWeight: '600', letterSpacing: '0.06em' }],
      },
      spacing: {
        // 8pt grid; six tokens cover the system
        '1': '4px',
        '2': '8px',
        '3': '12px',
        '4': '16px',
        '6': '24px',
        '8': '32px',
        '12': '48px',
        '16': '64px',
      },
      borderRadius: {
        sm: '4px',
        md: '8px',
        lg: '12px',
        xl: '16px',
      },
      boxShadow: {
        sm: '0 1px 2px rgba(13, 29, 33, 0.05)',
        md: '0 4px 8px rgba(13, 29, 33, 0.08)',
        lg: '0 12px 24px rgba(13, 29, 33, 0.10)',
        xl: '0 24px 48px rgba(13, 29, 33, 0.14)',
      },
      animation: {
        // Restrained motion per design principles
        'fade-in': 'fadeIn 200ms cubic-bezier(0.4, 0, 0.2, 1)',
        'check-bounce': 'checkBounce 400ms cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        checkBounce: {
          '0%': { transform: 'scale(0)' },
          '60%': { transform: 'scale(1.15)' },
          '100%': { transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
