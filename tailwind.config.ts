import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'brand-primary': '#7256F6',
        'brand-primary-hover': '#5d3ef5',
        'shopify-gray': {
          50: '#f6f6f7',
          100: '#e1e3e5',
          200: '#c9cccf',
          300: '#b1b5b8',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
        },
      },
    },
  },
  plugins: [],
  // Important: Prevent Tailwind from overriding Carbon styles
  corePlugins: {
    preflight: false,
  },
}
export default config
