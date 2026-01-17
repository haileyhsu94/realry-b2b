# Partner Performance Dashboard

A modern React dashboard for e-commerce partner performance analytics built with Next.js, TypeScript, Tailwind CSS, and Recharts.

## Setup Instructions

1. **Install dependencies:**
   ```bash
   npm install
   ```

   If you encounter npm log errors, try:
   ```bash
   npm install --loglevel=error
   ```

   Or use yarn:
   ```bash
   yarn install
   ```

2. **Run the development server:**
   ```bash
   npm run dev
   ```

   Or with yarn:
   ```bash
   yarn dev
   ```

3. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Features

- Interactive dashboard with multiple analytics views
- Revenue and engagement trend charts
- Partner performance metrics
- Campaign analytics
- Top-tier benchmarking
- Responsive sidebar navigation
- Modern UI using Carbon Design System with Shopify-inspired styling
- Accessible components following Carbon's accessibility standards

## Tech Stack

- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Carbon Design System** - IBM's design system components
- **Tailwind CSS** - Additional styling and Shopify theme customization
- **Recharts** - Chart library
- **Carbon Icons** - Icon library
- **Shopify-inspired UI** - Custom styling to match Shopify's design language

## Project Structure

```
explore/
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx             # Main page
│   └── globals.css          # Global styles
├── components/
│   ├── ui/                  # UI components (Card, Tabs)
│   └── PartnerPerformanceDashboard.tsx  # Main dashboard component
├── lib/
│   └── utils.ts             # Utility functions
└── package.json             # Dependencies

```

## Troubleshooting

If you encounter issues:

1. **Clear npm cache:**
   ```bash
   npm cache clean --force
   ```

2. **Delete node_modules and reinstall:**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **Check Node.js version:**
   Ensure you're using Node.js 18+:
   ```bash
   node --version
   ```
