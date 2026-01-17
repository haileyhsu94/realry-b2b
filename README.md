# Partner Performance Dashboard

A modern, enterprise-grade B2B partner performance dashboard built with Next.js and IBM Carbon Design System. Features real-time analytics, interactive charts, and a clean Shopify-inspired UI.

## ✨ Features

### Core Functionality
- **Real-time Performance Metrics**: Track revenue, clicks, conversions, and conversion rates
- **Interactive KPI Cards**: Each metric includes trend sparkline charts for quick insights
- **Performance Ranking**: See how you compare to top-tier partners (Top 22%)
- **Multi-tab Analytics**: Deep dive into different aspects of your performance
  - Revenue Overview
  - Partner Performance
  - Campaign Analytics
  - Top-Tier Benchmarks

### User Experience
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Collapsible Sidebar**: Maximize screen space while maintaining easy navigation
- **Modern UI**: Clean, professional interface inspired by Shopify's design language
- **Dark Mode Ready**: Built with CSS variables for easy theme customization
- **Smooth Animations**: Subtle transitions and hover effects for better UX

### Technical Highlights
- **TypeScript**: Full type safety throughout the application
- **IBM Carbon Design System**: Enterprise-grade UI components
- **Recharts Integration**: Beautiful, responsive data visualizations
- **Modular Architecture**: Easy to extend and maintain
- **Mock Data System**: Pre-populated with realistic sample data

## 🚀 Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) - React framework with server-side rendering
- **Language**: [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript
- **UI Components**: [IBM Carbon Design System](https://carbondesignsystem.com/) - Enterprise UI library
- **Charts**: [Recharts](https://recharts.org/) - Composable charting library
- **Styling**: 
  - [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
  - Custom CSS with Shopify-inspired design tokens
- **Icons**: [@carbon/icons-react](https://www.carbondesignsystem.com/guidelines/icons/library/) - Carbon icon library

## 📦 Installation

### Prerequisites
- Node.js 18.x or higher
- npm or yarn

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/haileyhsu94/realry-b2b.git
   cd realry-b2b
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🎯 Usage

### Development
```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run start      # Start production server
npm run lint       # Run ESLint
```

### Customization

#### Update Mock Data
Edit `/lib/mockData.ts` to customize the sample data:
```typescript
export const mockPartnerPlans: PartnerPlans = {
  shop: 'paid',    // 'free' | 'paid' | null
  creator: 'paid'  // 'free' | 'paid' | null
};
```

#### Modify Metrics
Update the metrics array in `PartnerPerformanceDashboard.tsx`:
```typescript
const metrics = [
  {
    title: 'Total Revenue',
    value: '$47,234',
    change: '+12.5%',
    trend: 'up',
    description: 'Last 7 days',
    trendData: revenueTrend,
    color: '#0f62fe'
  },
  // Add more metrics...
];
```

#### Change Brand Colors
Update CSS variables in `/app/globals.css`:
```css
:root {
  --shopify-primary: #7256F6;
  --shopify-text-primary: #202223;
  --shopify-border: #e1e3e5;
  /* Add your brand colors */
}
```

## 📁 Project Structure

```
realry-b2b/
├── app/
│   ├── globals.css              # Global styles and CSS variables
│   ├── layout.tsx               # Root layout with Carbon Theme
│   └── page.tsx                 # Home page
├── components/
│   ├── PartnerPerformanceDashboard.tsx  # Main dashboard component
│   └── ui/                      # Reusable UI components
│       ├── card.tsx
│       └── tabs.tsx
├── lib/
│   ├── mockData.ts              # Sample data and TypeScript interfaces
│   └── utils.ts                 # Utility functions
├── public/
│   └── logo.svg                 # Logo asset
├── next.config.js               # Next.js configuration
├── tailwind.config.ts           # Tailwind CSS configuration
├── tsconfig.json                # TypeScript configuration
└── package.json                 # Dependencies and scripts
```

## 🎨 Key Components

### StatCard
Displays a single metric with trend visualization:
```tsx
<StatCard metric={{
  title: 'Total Revenue',
  value: '$47,234',
  change: '+12.5%',
  trend: 'up',
  trendData: [/* data points */],
  color: '#0f62fe'
}} />
```

### FeatureGate
Conditionally renders content based on plan type:
```tsx
<FeatureGate 
  feature="shop-performance" 
  fallback={<UpgradePrompt />}
>
  {/* Premium content */}
</FeatureGate>
```

## 📊 Dashboard Sections

1. **Dashboard Overview**
   - 4 KPI cards with sparkline trends
   - Performance ranking banner
   - Quick action buttons (Filter, Export)

2. **Revenue Overview Tab**
   - Area chart showing revenue trends over time
   - Filterable by date range

3. **Partner Performance Tab**
   - Sortable table of partner metrics
   - Revenue and growth tracking

4. **Campaign Analytics Tab**
   - Pie chart breaking down campaign distribution
   - Visual representation of channel performance

5. **Top-Tier Benchmarks Tab**
   - Comparison table: Your metrics vs. top performers
   - Identify areas for improvement

## 🔧 Configuration

### Environment Variables
Create a `.env.local` file for custom configuration:
```bash
# Add your environment variables here
NEXT_PUBLIC_API_URL=your_api_url
```

### Carbon Design System Theme
Customize the Carbon theme in `/app/layout.tsx`:
```tsx
<Theme theme="g10">  {/* g10, g90, g100, white */}
  {children}
</Theme>
```

## 🚦 Roadmap

- [ ] Connect to real API endpoints
- [ ] Add user authentication
- [ ] Implement data export functionality
- [ ] Add more chart types and visualizations
- [ ] Create mobile-optimized views
- [ ] Add dark mode toggle
- [ ] Implement real-time data updates
- [ ] Add customizable date range picker
- [ ] Create PDF report generation
- [ ] Add email notification system

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Team

Built with ❤️ by the Realry B2B Team

## 📧 Contact

For questions or support, please reach out to:
- **Email**: hsuyuhsuan@example.com
- **GitHub**: [@haileyhsu94](https://github.com/haileyhsu94)

---

**Note**: This dashboard uses mock data for demonstration purposes. To connect to real data sources, update the data fetching logic in the component files.
