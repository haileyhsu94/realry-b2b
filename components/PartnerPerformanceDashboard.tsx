'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Grid,
  Column,
  Button,
  Tag,
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
  Dropdown,
} from '@carbon/react';
import {
  Dashboard,
  Analytics,
  User,
  ShoppingCart,
  Document,
  Settings,
  UserAvatar,
  Menu,
  Close,
  ArrowUp,
  ArrowDown,
  Search,
  Notification,
  ChevronRight,
  ChevronDown,
  Information,
  Calendar,
  Filter,
  Download,
  Currency,
  ChartLineSmooth,
  UserMultiple,
  Star,
  Trophy,
  Idea,
  Video,
  Camera,
  Time,
  Chat,
} from '@carbon/icons-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { ComposableMap, Geographies, Geography, ZoomableGroup } from 'react-simple-maps';
import {
  mockPartnerPlans,
  mockWebsitePerformance,
  mockCreatorPerformance,
  mockTopTierShopPerformance,
  mockRevenueData,
  mockPreviousPeriodData,
  type PartnerPlans,
} from '@/lib/mockData';

// Mock data for seller-focused dashboard
const mockPartnerPerformance = [
  { id: 1, name: 'Partner A', revenue: 25000, growth: '+15%' },
  { id: 2, name: 'Partner B', revenue: 18500, growth: '+22%' },
  { id: 3, name: 'Partner C', revenue: 12300, growth: '+8%' },
  { id: 4, name: 'Partner D', revenue: 9800, growth: '+18%' },
  { id: 5, name: 'Partner E', revenue: 7200, growth: '+12%' },
];

const mockCampaignBreakdown = [
  { name: 'Social Media', value: 4500, color: '#0f62fe' },
  { name: 'Email', value: 3200, color: '#8a3ffc' },
  { name: 'Display Ads', value: 2800, color: '#0072c3' },
  { name: 'Search', value: 2100, color: '#00539a' },
];

const mockTopTierBenchmarks = [
  { metric: 'Revenue', yourValue: '$47,234', topTierAvg: '$62,500' },
  { metric: 'Clicks', yourValue: '8,920', topTierAvg: '12,300' },
  { metric: 'Conversions', yourValue: '1,243', topTierAvg: '1,850' },
  { metric: 'CVR', yourValue: '13.9%', topTierAvg: '15.2%' },
  { metric: 'ROAS', yourValue: '3.2x', topTierAvg: '4.1x' },
];

// Customer demographics data
const customerDemographics = {
  // Global totals for comparison
  totals: {
    orders: 6850,
    customers: 4890,
    revenue: 312450,
  },
  topLocations: [
    { location: 'California', percentage: 28, sales: 450, trend: 'up', trendValue: 3.2 },
    { location: 'New York', percentage: 22, sales: 355, trend: 'down', trendValue: 4.4 },
    { location: 'Texas', percentage: 18, sales: 290, trend: 'up', trendValue: 5.1 },
    { location: 'Florida', percentage: 15, sales: 242, trend: 'down', trendValue: 2.3 },
    { location: 'Illinois', percentage: 17, sales: 274, trend: 'up', trendValue: 1.8 },
  ],
  topCountries: [
    { country: 'United States', iso: 'USA', percentage: 45, sales: 1820, customers: 1245, revenue: 78450, cvr: 14.2, trend: 'up', trendValue: 5.2 },
    { country: 'United Kingdom', iso: 'GBR', percentage: 18, sales: 730, customers: 512, revenue: 45200, cvr: 16.8, trend: 'down', trendValue: 2.8 },
    { country: 'Canada', iso: 'CAN', percentage: 12, sales: 485, customers: 358, revenue: 28900, cvr: 15.3, trend: 'up', trendValue: 8.5 },
    { country: 'Germany', iso: 'DEU', percentage: 10, sales: 405, customers: 298, revenue: 32650, cvr: 18.5, trend: 'up', trendValue: 12.3 },
    { country: 'Australia', iso: 'AUS', percentage: 8, sales: 325, customers: 245, revenue: 31370, cvr: 17.2, trend: 'up', trendValue: 6.7 },
    { country: 'France', iso: 'FRA', percentage: 7, sales: 285, customers: 198, revenue: 21950, cvr: 13.8, trend: 'down', trendValue: 1.5 },
  ],
  topCities: [
    { city: 'New York', country: 'USA', sales: 485, customers: 342, revenue: 24650, cvr: 15.8, trend: 'up', trendValue: 8.2 },
    { city: 'Los Angeles', country: 'USA', sales: 356, customers: 265, revenue: 18920, cvr: 14.5, trend: 'up', trendValue: 5.7 },
    { city: 'London', country: 'UK', sales: 342, customers: 245, revenue: 21580, cvr: 17.2, trend: 'down', trendValue: 3.5 },
    { city: 'Toronto', country: 'Canada', sales: 265, customers: 198, revenue: 16850, cvr: 16.1, trend: 'up', trendValue: 12.1 },
    { city: 'Sydney', country: 'Australia', sales: 198, customers: 152, revenue: 19140, cvr: 18.9, trend: 'up', trendValue: 7.3 },
    { city: 'Berlin', country: 'Germany', sales: 176, customers: 138, revenue: 14260, cvr: 19.2, trend: 'up', trendValue: 15.8 },
  ],
  interests: [
    { category: 'Clothing', value: 28, color: '#1192E8' },     // Cyan 50
    { category: 'Shoes', value: 18, color: '#6929C4' },        // Purple 70
    { category: 'Bags', value: 15, color: '#002D9C' },         // Blue 80
    { category: 'Wallets', value: 10, color: '#005D5D' },      // Teal 70
    { category: 'Accessories', value: 12, color: '#198038' },  // Green 60
    { category: 'Cosmetics', value: 9, color: '#9F1853' },     // Magenta 70
    { category: 'Home', value: 5, color: '#B28600' },          // Yellow 50
    { category: 'Tech', value: 3, color: '#EE538B' },          // Magenta 50
  ]
};

// Top performing items
const topPerformingItems = [
  { name: 'Summer Sale Banner', type: 'Ad Creative', clicks: 2340, conversions: 342, cvr: 14.6, revenue: 12956, tag: 'Best CVR' },
  { name: 'Product Video - Earbuds', type: 'Content', clicks: 1890, conversions: 265, cvr: 14.0, revenue: 10070, tag: null },
  { name: 'Instagram Story', type: 'Traffic Source', clicks: 3420, conversions: 445, cvr: 13.0, revenue: 16905, tag: 'Most Clicks' },
  { name: 'Email Campaign', type: 'Traffic Source', clicks: 980, conversions: 145, cvr: 14.8, revenue: 5510, tag: null },
  { name: 'Wireless Earbuds Pro', type: 'Product', clicks: 1560, conversions: 234, cvr: 15.0, revenue: 8892, tag: 'Trending' },
];

// State-level sales data for USA heatmap
const usaStatesSalesData: { [key: string]: { sales: number; customers: number; revenue: number; cvr: number } } = {
  'California': { sales: 485, customers: 342, revenue: 18250, cvr: 3.2 },
  'New York': { sales: 356, customers: 258, revenue: 13420, cvr: 3.1 },
  'Texas': { sales: 312, customers: 225, revenue: 11760, cvr: 3.3 },
  'Florida': { sales: 245, customers: 178, revenue: 9245, cvr: 3.2 },
  'Illinois': { sales: 198, customers: 145, revenue: 7524, cvr: 3.0 },
  'Pennsylvania': { sales: 187, customers: 136, revenue: 7098, cvr: 2.9 },
  'Ohio': { sales: 165, customers: 122, revenue: 6270, cvr: 3.1 },
  'Georgia': { sales: 154, customers: 112, revenue: 5852, cvr: 3.0 },
  'North Carolina': { sales: 143, customers: 104, revenue: 5434, cvr: 3.2 },
  'Michigan': { sales: 132, customers: 96, revenue: 5016, cvr: 2.9 },
  'New Jersey': { sales: 128, customers: 94, revenue: 4864, cvr: 3.0 },
  'Virginia': { sales: 115, customers: 84, revenue: 4370, cvr: 3.1 },
  'Washington': { sales: 108, customers: 79, revenue: 4104, cvr: 3.3 },
  'Arizona': { sales: 98, customers: 72, revenue: 3724, cvr: 3.2 },
  'Massachusetts': { sales: 95, customers: 70, revenue: 3610, cvr: 3.0 },
  'Tennessee': { sales: 87, customers: 64, revenue: 3306, cvr: 3.1 },
  'Indiana': { sales: 82, customers: 60, revenue: 3116, cvr: 2.9 },
  'Missouri': { sales: 78, customers: 57, revenue: 2964, cvr: 3.0 },
  'Maryland': { sales: 75, customers: 55, revenue: 2850, cvr: 3.2 },
  'Wisconsin': { sales: 71, customers: 52, revenue: 2698, cvr: 2.9 },
  'Colorado': { sales: 68, customers: 50, revenue: 2584, cvr: 3.3 },
  'Minnesota': { sales: 65, customers: 48, revenue: 2470, cvr: 3.0 },
  'South Carolina': { sales: 58, customers: 43, revenue: 2204, cvr: 3.1 },
  'Alabama': { sales: 52, customers: 38, revenue: 1976, cvr: 2.9 },
  'Louisiana': { sales: 48, customers: 35, revenue: 1824, cvr: 3.0 },
  'Kentucky': { sales: 45, customers: 33, revenue: 1710, cvr: 3.1 },
  'Oregon': { sales: 42, customers: 31, revenue: 1596, cvr: 3.2 },
  'Oklahoma': { sales: 38, customers: 28, revenue: 1444, cvr: 2.9 },
  'Connecticut': { sales: 35, customers: 26, revenue: 1330, cvr: 3.0 },
  'Utah': { sales: 32, customers: 24, revenue: 1216, cvr: 3.3 },
  'Iowa': { sales: 28, customers: 21, revenue: 1064, cvr: 2.9 },
  'Nevada': { sales: 25, customers: 19, revenue: 950, cvr: 3.2 },
  'Arkansas': { sales: 22, customers: 16, revenue: 836, cvr: 3.0 },
  'Mississippi': { sales: 18, customers: 13, revenue: 684, cvr: 2.8 },
  'Kansas': { sales: 15, customers: 11, revenue: 570, cvr: 2.9 },
  'New Mexico': { sales: 12, customers: 9, revenue: 456, cvr: 3.1 },
  'Nebraska': { sales: 10, customers: 7, revenue: 380, cvr: 2.9 },
  'West Virginia': { sales: 8, customers: 6, revenue: 304, cvr: 2.7 },
  'Idaho': { sales: 7, customers: 5, revenue: 266, cvr: 3.0 },
  'Hawaii': { sales: 6, customers: 4, revenue: 228, cvr: 3.2 },
  'New Hampshire': { sales: 5, customers: 4, revenue: 190, cvr: 2.8 },
  'Maine': { sales: 4, customers: 3, revenue: 152, cvr: 2.9 },
  'Montana': { sales: 3, customers: 2, revenue: 114, cvr: 2.7 },
  'Rhode Island': { sales: 3, customers: 2, revenue: 114, cvr: 2.8 },
  'Delaware': { sales: 2, customers: 1, revenue: 76, cvr: 2.6 },
  'South Dakota': { sales: 2, customers: 1, revenue: 76, cvr: 2.7 },
  'North Dakota': { sales: 1, customers: 1, revenue: 38, cvr: 2.5 },
  'Alaska': { sales: 1, customers: 1, revenue: 38, cvr: 2.6 },
  'Vermont': { sales: 1, customers: 1, revenue: 38, cvr: 2.5 },
  'Wyoming': { sales: 1, customers: 1, revenue: 38, cvr: 2.5 },
};

const PartnerPerformanceDashboard = () => {
  const [timeRange, setTimeRange] = useState('7d');
  const [activeSection, setActiveSection] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [plans, setPlans] = useState<PartnerPlans>(mockPartnerPlans);
  const [mapRegion, setMapRegion] = useState('north-america'); // north-america, europe, asia, oceania, global
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number]>([-95, 40]);
  const [mapZoom, setMapZoom] = useState<number>(3);
  const [mapType, setMapType] = useState<'world' | 'usa-states'>('world');
  const [selectedMetric, setSelectedMetric] = useState<'orders' | 'customers' | 'revenue' | 'cvr'>('orders');
  
  // Tooltip states
  const [hoveredRegion, setHoveredRegion] = useState<{
    name: string;
    sales: number;
    customers?: number;
    revenue?: number;
    cvr?: number;
    percentage?: number;
    trend?: 'up' | 'down';
    trendValue?: number;
  } | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  
  // Custom date range states
  const [showCustomDatePicker, setShowCustomDatePicker] = useState(false);
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [isCustomRange, setIsCustomRange] = useState(false);
  
  // Filter states for detail tabs
  const [chartMetric, setChartMetric] = useState('revenue'); // revenue, clicks, conversions, roas
  const [campaignFilter, setCampaignFilter] = useState('all'); // all, active, completed

  // Country coordinates mapping for map zoom
  const countryCoordinates: { [key: string]: { center: [number, number], zoom: number } } = {
    'United States': { center: [-95, 40], zoom: 4 },
    'United Kingdom': { center: [-2, 54], zoom: 5 },
    'Canada': { center: [-106, 56], zoom: 3.5 },
    'Germany': { center: [10, 51], zoom: 5.5 },
    'Australia': { center: [133, -27], zoom: 4 },
    'France': { center: [2, 46], zoom: 5.5 },
  };

  // City coordinates mapping for detailed zoom
  const cityCoordinates: { [key: string]: { center: [number, number], zoom: number, state?: string } } = {
    'New York': { center: [-74, 40.7], zoom: 7, state: 'New York' },
    'Los Angeles': { center: [-118.2, 34], zoom: 7, state: 'California' },
    'London': { center: [-0.1, 51.5], zoom: 8 },
    'Toronto': { center: [-79.4, 43.7], zoom: 8 },
    'Sydney': { center: [151.2, -33.9], zoom: 8 },
    'Berlin': { center: [13.4, 52.5], zoom: 8 },
  };

  // Handle country click to zoom map
  const handleCountryClick = (countryName: string) => {
    const coords = countryCoordinates[countryName];
    if (coords) {
      setSelectedCountry(countryName);
      setSelectedCity(null);
      setMapType('world');
      setMapCenter(coords.center);
      setMapZoom(coords.zoom);
      setMapRegion(''); // Clear region dropdown when manually selecting country
    }
  };

  // Handle city click to zoom map and switch to regional view
  const handleCityClick = (cityName: string, countryName: string) => {
    const coords = cityCoordinates[cityName];
    if (coords) {
      setSelectedCity(cityName);
      setSelectedCountry(null);
      
      // Switch to regional map for USA cities
      if (countryName === 'USA') {
        setMapType('usa-states');
        setMapCenter(coords.center);
        setMapZoom(coords.zoom);
      } else {
        // For non-USA cities, just zoom on world map
        setMapType('world');
        setMapCenter(coords.center);
        setMapZoom(coords.zoom);
      }
      
      setMapRegion(''); // Clear region dropdown
    }
  };

  // Reset to world map
  const resetToWorldMap = () => {
    setMapType('world');
    setSelectedCity(null);
    setSelectedCountry(null);
    setMapCenter([0, 20]);
    setMapZoom(1);
    setMapRegion('global');
  };

  // Plan utility functions
  const hasShopPlan = () => plans.shop !== null;
  const hasCreatorPlan = () => plans.creator !== null;
  const isShopPaid = () => plans.shop === 'paid';
  const isCreatorPaid = () => plans.creator === 'paid';
  
  const canAccessFeature = (feature: string): boolean => {
    // Feature-specific access logic
    if (feature === 'ai-suggestions-full') {
      return isCreatorPaid();
    }
    if (feature === 'advanced-analytics') {
      return isShopPaid();
    }
    if (feature === 'top-tier-benchmarking') {
      return hasCreatorPlan(); // Free creator users can see this
    }
    if (feature === 'creator-performance') {
      return hasCreatorPlan();
    }
    if (feature === 'shop-performance') {
      return hasShopPlan();
    }
    return false;
  };

  // Handle time range selection
  const handleTimeRangeChange = (range: string) => {
    setTimeRange(range);
    setIsCustomRange(false);
    setShowCustomDatePicker(false);
    setCustomStartDate('');
    setCustomEndDate('');
  };

  // Handle custom date range apply
  const handleCustomDateRangeApply = () => {
    if (customStartDate && customEndDate) {
      if (new Date(customStartDate) <= new Date(customEndDate)) {
        setIsCustomRange(true);
        setTimeRange('custom');
        setShowCustomDatePicker(false);
      } else {
        alert('Start date must be before or equal to end date');
      }
    } else {
      alert('Please select both start and end dates');
    }
  };

  // Format custom date range for display
  const formatCustomDateRange = () => {
    if (!customStartDate || !customEndDate) return 'Custom';
    const start = new Date(customStartDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const end = new Date(customEndDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    return `${start} - ${end}`;
  };

  // Close date picker when clicking outside
  const datePickerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target as Node)) {
        setShowCustomDatePicker(false);
      }
    };

    if (showCustomDatePicker) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showCustomDatePicker]);

  const revenueData = [
    { date: 'Jan 8', revenue: 4200, clicks: 890, conversions: 124, spend: 1200, roas: 3.5 },
    { date: 'Jan 9', revenue: 5800, clicks: 1200, conversions: 165, spend: 1600, roas: 3.6 },
    { date: 'Jan 10', revenue: 4900, clicks: 980, conversions: 142, spend: 1300, roas: 3.8 },
    { date: 'Jan 11', revenue: 7100, clicks: 1450, conversions: 198, spend: 1900, roas: 3.7 },
    { date: 'Jan 12', revenue: 6400, clicks: 1320, conversions: 178, spend: 1750, roas: 3.7 },
    { date: 'Jan 13', revenue: 8200, clicks: 1680, conversions: 225, spend: 2100, roas: 3.9 },
    { date: 'Jan 14', revenue: 7800, clicks: 1590, conversions: 210, spend: 2000, roas: 3.9 },
  ];

  const partnerPerformance = [
    { name: 'TechDeals Pro', revenue: 12500, growth: 23.5, status: 'active' },
    { name: 'ShopSmart Media', revenue: 10200, growth: 18.2, status: 'active' },
    { name: 'Digital Marketplace', revenue: 8900, growth: -5.3, status: 'active' },
    { name: 'Promo Networks', revenue: 7600, growth: 31.8, status: 'active' },
    { name: 'Click & Buy', revenue: 6400, growth: 12.1, status: 'active' },
  ];

  const campaignTypes = [
    { name: 'Product Ads', value: 45, color: '#0f62fe' }, // Carbon blue-60
    { name: 'Promotions', value: 30, color: '#8a3ffc' }, // Carbon purple-60
    { name: 'Flash Sales', value: 15, color: '#0072c3' }, // Carbon cyan-60
    { name: 'Affiliate Links', value: 10, color: '#00539a' }, // Carbon teal-60
  ];

  const topTierBenchmarks = [
    { metric: 'Click-Through Rate', yourValue: 2.8, topTier: 5.2, unit: '%' },
    { metric: 'Conversion Rate', yourValue: 2.1, topTier: 4.5, unit: '%' },
    { metric: 'Avg Revenue per Click', yourValue: 5.3, topTier: 8.7, unit: '$' },
    { metric: 'Customer Retention', yourValue: 68, topTier: 85, unit: '%' },
  ];

  const improvementTips = [
    {
      title: 'Optimize Ad Placement',
      impact: 'High',
      description: 'Top performers place ads above the fold with clear CTAs',
      potentialGain: '+45% CTR'
    },
    {
      title: 'A/B Test Creatives',
      impact: 'High',
      description: 'Test different images and copy to find what resonates',
      potentialGain: '+32% Conversions'
    },
    {
      title: 'Target Peak Hours',
      impact: 'Medium',
      description: 'Focus campaigns during 2-4 PM and 7-9 PM for best results',
      potentialGain: '+28% Revenue'
    },
    {
      title: 'Segment Audiences',
      impact: 'Medium',
      description: 'Create personalized campaigns for different user groups',
      potentialGain: '+25% Engagement'
    },
  ];

  // Generate trend data for sparklines (last 7 days)
  const revenueTrend = mockRevenueData.map(d => d.revenue);
  const clicksTrend = mockRevenueData.map(d => d.clicks);
  const conversionsTrend = mockRevenueData.map(d => d.conversions);
  const cvrTrend = mockRevenueData.map(d => ((d.conversions / d.clicks) * 100));

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
    {
      title: 'Click Through Rate',
      value: '4.2%',
      change: '+0.8%',
      trend: 'up',
      description: 'Average CTR',
      trendData: cvrTrend,
      color: '#8a3ffc'
    },
    {
      title: 'ROAS',
      value: '3.8x',
      change: '+0.5x',
      trend: 'up',
      description: 'Return on ad spend',
      trendData: revenueTrend.map((v, i) => (v / 1000) * 0.7),
      color: '#0072c3'
    },
    {
      title: 'Conversion Rate',
      value: '13.9%',
      change: '-0.3%',
      trend: 'down',
      description: 'Average CVR',
      trendData: cvrTrend,
      color: '#00539a'
    },
  ];

  // Build menu items organized by sections
  const generalItems = [
    { 
      id: 'dashboard', 
      label: 'Dashboard', 
      icon: Dashboard, 
      active: true,
      planBadge: null,
      badge: null
    },
    ...(hasShopPlan() ? [{
      id: 'shop-performance',
      label: 'Shop Performance',
      icon: ShoppingCart,
      active: true,
      planBadge: plans.shop === 'paid' ? 'Paid' : 'Free',
      badge: null
    }] : []),
    ...(hasCreatorPlan() ? [{
      id: 'creator-performance',
      label: 'Creator Performance',
      icon: User,
      active: true,
      planBadge: plans.creator === 'paid' ? 'Paid' : 'Free',
      badge: null
    }] : []),
  ];

  const toolsItems = [
    {
      id: 'analytics',
      label: 'Analytics',
      icon: Analytics,
      active: isShopPaid() || isCreatorPaid(),
      planBadge: null,
      badge: null
    },
    {
      id: 'documents',
      label: 'Documents',
      icon: Document,
      active: true,
      planBadge: null,
      badge: null
    },
  ];

  const supportItems = [
    { 
      id: 'settings', 
      label: 'Settings', 
      icon: Settings, 
      active: true,
      planBadge: null,
      badge: null
    },
  ];

  // FeatureGate component for conditional rendering
  const FeatureGate = ({ 
    feature, 
    children, 
    fallback 
  }: { 
    feature: string; 
    children: React.ReactNode; 
    fallback?: React.ReactNode;
  }) => {
    if (canAccessFeature(feature)) {
      return <>{children}</>;
    }
    return fallback ? <>{fallback}</> : null;
  };

  const StatCard = ({ metric }: { metric: typeof metrics[0] }) => {
    // Prepare data for trend chart with dates
    const trendData = mockRevenueData.map((row, index) => ({
      date: row.date,
      value: metric.trendData[index] || 0,
      revenueNew: row.revenueNew || 0,
      revenueReturning: row.revenueReturning || 0,
      index
    }));

    // Check if this is the Total Revenue card
    const isTotalRevenueCard = metric.title === 'Total Revenue';

    return (
      <div className="shopify-metric-card">
        {/* Header with title, info icon, and value */}
        <div style={{ padding: '24px 24px 0 24px', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
            <div className="shopify-metric-label">{metric.title}</div>
            <Information 
              size={16} 
              style={{ 
                color: 'var(--shopify-text-secondary)', 
                opacity: 0.6,
                cursor: 'pointer',
                flexShrink: 0,
                transition: 'opacity 0.15s ease'
              }}
              onMouseEnter={(e) => {
                const target = e.currentTarget as unknown as HTMLElement;
                if (target && target.style) {
                  target.style.opacity = '1';
                  target.style.color = '#7256F6';
                }
              }}
              onMouseLeave={(e) => {
                const target = e.currentTarget as unknown as HTMLElement;
                if (target && target.style) {
                  target.style.opacity = '0.6';
                  target.style.color = 'var(--shopify-text-secondary)';
                }
              }}
              onClick={() => alert(`Information about ${metric.title}`)}
            />
          </div>
          <div className="shopify-metric-value" style={{ marginBottom: '8px' }}>{metric.value}</div>
          <div className={`shopify-metric-change ${metric.trend === 'up' ? 'positive' : 'negative'}`}>
            {metric.trend === 'up' ? (
              <ArrowUp size={16} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} />
            ) : (
              <ArrowDown size={16} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} />
            )}
            {metric.change}
            <span style={{ marginLeft: '8px', color: 'var(--shopify-text-secondary)', fontWeight: 'normal' }}>
              {metric.description}
            </span>
          </div>
        </div>
        
        {/* Chart - Stacked Bar Chart for Total Revenue, Line Chart for others */}
        <div style={{ 
          width: '100%', 
          height: '180px',
          padding: '0 12px 0 12px'
        }}>
          <ResponsiveContainer width="100%" height="100%">
            {isTotalRevenueCard ? (
              <BarChart 
                data={trendData} 
                margin={{ top: 5, right: 10, left: 0, bottom: 25 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e1e3e5" vertical={false} />
                <XAxis 
                  dataKey="date" 
                  stroke="#6d7175" 
                  tick={{ fontSize: 12, fill: '#6d7175' }}
                  tickLine={{ stroke: '#6d7175' }}
                  ticks={[trendData[0]?.date, trendData[Math.floor(trendData.length / 2)]?.date, trendData[trendData.length - 1]?.date]}
                />
                <YAxis 
                  stroke="#6d7175" 
                  tick={{ fontSize: 12, fill: '#6d7175' }}
                  tickLine={{ stroke: '#6d7175' }}
                  width={40}
                  tickFormatter={(value: number) => {
                    if (value >= 1000) return `$${(value / 1000).toFixed(0)}k`;
                    return `$${value}`;
                  }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white',
                    border: '1px solid #e1e3e5',
                    borderRadius: '6px',
                    padding: '10px 14px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    fontSize: '13px'
                  }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      const total = data.revenueNew + data.revenueReturning;
                      const newPercent = ((data.revenueNew / total) * 100).toFixed(0);
                      const returningPercent = ((data.revenueReturning / total) * 100).toFixed(0);
                      
                      return (
                        <div style={{ 
                          backgroundColor: 'white',
                          border: '1px solid #e1e3e5',
                          borderRadius: '6px',
                          padding: '10px 14px',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                        }}>
                          <div style={{ fontWeight: '600', marginBottom: '8px', color: '#202124' }}>
                            {data.date}
                          </div>
                          <div style={{ fontSize: '15px', fontWeight: '600', marginBottom: '10px', color: '#202124' }}>
                            Total: ${total.toLocaleString()}
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                            <div style={{ width: '12px', height: '12px', backgroundColor: '#0f62fe', borderRadius: '2px' }}></div>
                            <span style={{ color: '#5f6368', fontSize: '13px' }}>New Users:</span>
                            <span style={{ fontWeight: '600', color: '#202124', marginLeft: 'auto' }}>${data.revenueNew.toLocaleString()}</span>
                            <span style={{ color: '#5f6368', fontSize: '12px' }}>({newPercent}%)</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{ width: '12px', height: '12px', backgroundColor: '#a6c8ff', borderRadius: '2px' }}></div>
                            <span style={{ color: '#5f6368', fontSize: '13px' }}>Returning:</span>
                            <span style={{ fontWeight: '600', color: '#202124', marginLeft: 'auto' }}>${data.revenueReturning.toLocaleString()}</span>
                            <span style={{ color: '#5f6368', fontSize: '12px' }}>({returningPercent}%)</span>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend 
                  verticalAlign="top" 
                  height={36}
                  formatter={(value: string) => {
                    if (value === 'revenueNew') return 'New Users';
                    if (value === 'revenueReturning') return 'Returning Users';
                    if (value === 'value') return 'Total Trend';
                    return value;
                  }}
                  wrapperStyle={{ fontSize: '12px', paddingBottom: '8px' }}
                />
                <Bar 
                  dataKey="revenueNew" 
                  stackId="revenue" 
                  fill="#0f62fe"
                  radius={[0, 0, 0, 0]}
                />
                <Bar 
                  dataKey="revenueReturning" 
                  stackId="revenue" 
                  fill="#a6c8ff"
                  radius={[4, 4, 0, 0]}
                />
                {/* Trend line overlay */}
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#161616" 
                  strokeWidth={2}
                  dot={{ r: 3, fill: '#161616', strokeWidth: 0 }}
                  isAnimationActive={false}
                  activeDot={{ r: 5, fill: '#161616' }}
                  strokeDasharray="5 5"
                />
              </BarChart>
            ) : (
              <LineChart 
                data={trendData} 
                margin={{ top: 5, right: 10, left: 0, bottom: 25 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e1e3e5" vertical={false} />
                <XAxis 
                  dataKey="date" 
                  stroke="#6d7175" 
                  tick={{ fontSize: 12, fill: '#6d7175' }}
                  tickLine={{ stroke: '#6d7175' }}
                  ticks={[trendData[0]?.date, trendData[Math.floor(trendData.length / 2)]?.date, trendData[trendData.length - 1]?.date]}
                />
                <YAxis 
                  stroke="#6d7175" 
                  tick={{ fontSize: 12, fill: '#6d7175' }}
                  tickLine={{ stroke: '#6d7175' }}
                  width={40}
                  tickFormatter={(value: number) => {
                    if (metric.title.includes('Revenue')) {
                      if (value >= 1000) return `$${(value / 1000).toFixed(0)}k`;
                      return `$${value}`;
                    }
                    if (metric.title.includes('Rate')) return `${value.toFixed(0)}%`;
                    if (value >= 1000) return `${(value / 1000).toFixed(0)}k`;
                    return value.toString();
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke={metric.color} 
                  strokeWidth={2.5}
                  dot={{ r: 3, fill: metric.color, strokeWidth: 0 }}
                  isAnimationActive={false}
                  activeDot={{ r: 5, fill: metric.color }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                  border: '1px solid var(--shopify-border)',
                  borderRadius: '6px',
                  padding: '4px 8px',
                  fontSize: '12px'
                }}
                formatter={(value: number) => {
                  if (metric.title.includes('Revenue')) return `$${value.toLocaleString()}`;
                  if (metric.title.includes('Rate')) return `${value.toFixed(1)}%`;
                  return value.toLocaleString();
                }}
              />
            </LineChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>
    );
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f6f6f7' }}>
      {/* Shopify-style Sidebar */}
      <aside 
        className="shopify-sidebar"
        style={{ 
          width: sidebarOpen ? '240px' : '64px',
          transition: 'width 0.3s ease',
          position: 'sticky',
          top: 0,
          height: '100vh',
          overflowY: 'auto'
        }}
      >
        <div style={{ 
          height: '64px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          padding: '0 24px',
          borderBottom: '1px solid var(--shopify-border)'
        }}>
          {sidebarOpen && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <img 
                src="/logo.svg" 
                alt="Realry Logo" 
                style={{ 
                  width: '60px', 
                  height: '32px',
                  objectFit: 'contain'
                }}
              />
            </div>
          )}
          <Button
            kind="ghost"
            size="sm"
            hasIconOnly
            iconDescription={sidebarOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{ minWidth: '32px' }}
          >
            {sidebarOpen ? (
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="20" height="20" fill="white" fillOpacity="0.01" style={{mixBlendMode: 'multiply'}}/>
                <rect width="20" height="20" fill="white" fillOpacity="0.01" style={{mixBlendMode: 'multiply'}}/>
                <path d="M16 4H4C3.45 4 3 4.45 3 5V15C3 15.55 3.45 16 4 16H16C16.55 16 17 15.55 17 15V5C17 4.45 16.55 4 16 4ZM7 15H4V5H7V15ZM16 9.5H10.9L12.7 7.7L12 7L9 10L12 13L12.7 12.3L10.9 10.5H16V15H8V5H16V9.5Z" fill="#161616"/>
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="20" height="20" fill="white" fillOpacity="0.01" style={{mixBlendMode: 'multiply'}}/>
                <rect width="20" height="20" fill="white" fillOpacity="0.01" style={{mixBlendMode: 'multiply'}}/>
                <path d="M16 4H4C3.45 4 3 4.45 3 5V15C3 15.55 3.45 16 4 16H16C16.55 16 17 15.55 17 15V5C17 4.45 16.55 4 16 4ZM7 15H4V5H7V15ZM16 15H8V10.5H13.1L11.3 12.3L12 13L15 10L12 7L11.3 7.7L13.1 9.5H8V5H16V15Z" fill="#161616"/>
              </svg>
            )}
          </Button>
        </div>

        <nav style={{ padding: '8px 0', flex: 1 }}>
          {/* General Section */}
          {sidebarOpen && (
            <div style={{ 
              padding: '8px 24px 4px 24px',
              fontSize: '11px',
              fontWeight: '600',
              color: 'var(--shopify-text-secondary)',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              marginBottom: '8px'
            }}>
              General
            </div>
          )}
          {generalItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => item.active && setActiveSection(item.id)}
                disabled={!item.active}
                className={`shopify-nav-item ${isActive ? 'active' : ''}`}
                style={{
                  marginBottom: '2px',
                }}
              >
                <Icon 
                  size={20} 
                  style={{ 
                    marginRight: sidebarOpen ? '12px' : '0', 
                    flexShrink: 0,
                    width: '20px',
                    height: '20px'
                  }} 
                />
                {sidebarOpen && (
                  <>
                    <span style={{ 
                      flex: 1, 
                      textAlign: 'left',
                      lineHeight: '20px'
                    }}>
                      {item.label}
                    </span>
                    {item.planBadge && (
                      <Tag
                        type={item.planBadge === 'Paid' ? 'green' : 'gray'}
                        size="sm"
                        style={{ 
                          marginLeft: '8px',
                          fontSize: '11px',
                          padding: '2px 6px',
                          height: '18px',
                          lineHeight: '14px'
                        }}
                      >
                        {item.planBadge}
                      </Tag>
                    )}
                    {item.badge && (
                      <Tag
                        type={item.badge === 'New' ? 'blue' : 'gray'}
                        size="sm"
                        style={{ 
                          marginLeft: '8px',
                          fontSize: '11px',
                          padding: '2px 6px',
                          height: '18px',
                          lineHeight: '14px'
                        }}
                      >
                        {item.badge}
                      </Tag>
                    )}
                  </>
                )}
              </button>
            );
          })}

          {/* Tools Section */}
          {sidebarOpen && (
            <div style={{ 
              padding: '24px 24px 4px 24px',
              fontSize: '11px',
              fontWeight: '600',
              color: 'var(--shopify-text-secondary)',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              marginTop: '8px',
              marginBottom: '8px'
            }}>
              Tools
            </div>
          )}
          {toolsItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => item.active && setActiveSection(item.id)}
                disabled={!item.active}
                className={`shopify-nav-item ${isActive ? 'active' : ''}`}
                style={{
                  marginBottom: '2px',
                }}
              >
                <Icon 
                  size={20} 
                  style={{ 
                    marginRight: sidebarOpen ? '12px' : '0', 
                    flexShrink: 0,
                    width: '20px',
                    height: '20px'
                  }} 
                />
                {sidebarOpen && (
                  <>
                    <span style={{ 
                      flex: 1, 
                      textAlign: 'left',
                      lineHeight: '20px'
                    }}>
                      {item.label}
                    </span>
                    {item.planBadge && (
                      <Tag
                        type={item.planBadge === 'Paid' ? 'green' : 'gray'}
                        size="sm"
                        style={{ 
                          marginLeft: '8px',
                          fontSize: '11px',
                          padding: '2px 6px',
                          height: '18px',
                          lineHeight: '14px'
                        }}
                      >
                        {item.planBadge}
                      </Tag>
                    )}
                    {item.badge && (
                      <Tag
                        type={item.badge === 'New' ? 'blue' : 'gray'}
                        size="sm"
                        style={{ 
                          marginLeft: '8px',
                          fontSize: '11px',
                          padding: '2px 6px',
                          height: '18px',
                          lineHeight: '14px'
                        }}
                      >
                        {item.badge}
                      </Tag>
                    )}
                  </>
                )}
              </button>
            );
          })}

          {/* Support Section */}
          {sidebarOpen && (
            <div style={{ 
              padding: '24px 24px 4px 24px',
              fontSize: '11px',
              fontWeight: '600',
              color: 'var(--shopify-text-secondary)',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              marginTop: '8px',
              marginBottom: '8px'
            }}>
              Support
            </div>
          )}
          {supportItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => item.active && setActiveSection(item.id)}
                disabled={!item.active}
                className={`shopify-nav-item ${isActive ? 'active' : ''}`}
                style={{
                  marginBottom: '2px',
                }}
              >
                <Icon 
                  size={20} 
                  style={{ 
                    marginRight: sidebarOpen ? '12px' : '0', 
                    flexShrink: 0,
                    width: '20px',
                    height: '20px'
                  }} 
                />
                {sidebarOpen && (
                  <>
                    <span style={{ 
                      flex: 1, 
                      textAlign: 'left',
                      lineHeight: '20px'
                    }}>
                      {item.label}
                    </span>
                    {item.planBadge && (
                      <Tag
                        type={item.planBadge === 'Paid' ? 'green' : 'gray'}
                        size="sm"
                        style={{ 
                          marginLeft: '8px',
                          fontSize: '11px',
                          padding: '2px 6px',
                          height: '18px',
                          lineHeight: '14px'
                        }}
                      >
                        {item.planBadge}
                      </Tag>
                    )}
                    {item.badge && (
                      <Tag
                        type={item.badge === 'New' ? 'blue' : 'gray'}
                        size="sm"
                        style={{ 
                          marginLeft: '8px',
                          fontSize: '11px',
                          padding: '2px 6px',
                          height: '18px',
                          lineHeight: '14px'
                        }}
                      >
                        {item.badge}
                      </Tag>
                    )}
                  </>
                )}
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        {/* Nexus-style Header */}
        <header style={{
          height: '64px',
          backgroundColor: 'white',
          borderBottom: '1px solid var(--shopify-border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 24px',
          position: 'sticky',
          top: 0,
          zIndex: 10
        }}>
          {/* Left: Search Bar */}
          <div style={{ 
            maxWidth: '400px', 
            marginRight: '24px',
            position: 'relative'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              border: '1px solid var(--shopify-border)',
              borderRadius: '8px',
              backgroundColor: 'var(--shopify-gray-50)',
              transition: 'all 0.15s ease'
            }}
            onFocus={(e) => {
              e.currentTarget.style.backgroundColor = 'white';
              e.currentTarget.style.borderColor = '#7256F6';
            }}
            onBlur={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--shopify-gray-50)';
              e.currentTarget.style.borderColor = 'var(--shopify-border)';
            }}
            >
              <Search size={16} style={{ color: 'var(--shopify-text-secondary)', flexShrink: 0 }} />
              <input
                type="text"
                placeholder="Search"
                style={{
                  flex: 1,
                  border: 'none',
                  outline: 'none',
                  backgroundColor: 'transparent',
                  fontSize: '14px',
                  color: 'var(--shopify-text-primary)',
                  width: '100%'
                }}
              />
              <span style={{
                fontSize: '12px',
                color: 'var(--shopify-text-secondary)',
                padding: '2px 6px',
                backgroundColor: 'white',
                borderRadius: '4px',
                border: '1px solid var(--shopify-border)',
                fontFamily: 'monospace',
                flexShrink: 0
              }}>
                ⌘ F
              </span>
            </div>
          </div>

          {/* Spacer */}
          <div style={{ flex: 1 }}></div>

          {/* Right: Icons and User Profile */}
          <div ref={datePickerRef} style={{ display: 'flex', gap: '8px', alignItems: 'center', position: 'relative' }}>
            {/* Refresh, Icons */}
            <button
              style={{
                width: '36px',
                height: '36px',
                border: 'none',
                background: 'transparent',
                borderRadius: '6px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--shopify-text-secondary)',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--shopify-gray-50)';
                e.currentTarget.style.color = 'var(--shopify-text-primary)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = 'var(--shopify-text-secondary)';
              }}
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M9 3v6h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M9 15v-6H3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </button>
            
            <button
              style={{
                width: '36px',
                height: '36px',
                border: 'none',
                background: 'transparent',
                borderRadius: '6px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--shopify-text-secondary)',
                transition: 'all 0.15s ease',
                position: 'relative'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--shopify-gray-50)';
                e.currentTarget.style.color = 'var(--shopify-text-primary)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = 'var(--shopify-text-secondary)';
              }}
            >
              <Notification size={18} />
            </button>

            {/* User Profile */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 12px',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'background-color 0.15s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--shopify-gray-50)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <UserAvatar size={32} />
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <span style={{
                  fontSize: '14px',
                  fontWeight: '500',
                  color: 'var(--shopify-text-primary)',
                  lineHeight: '1.2'
                }}>
                  Partner Demo
                </span>
                <span style={{
                  fontSize: '12px',
                  color: 'var(--shopify-text-secondary)',
                  lineHeight: '1.2'
                }}>
                  Business
                </span>
              </div>
            </div>
            
            {/* Custom Date Range Picker Dropdown */}
            {showCustomDatePicker && (
              <div style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                marginTop: '8px',
                backgroundColor: 'white',
                border: '1px solid var(--shopify-border)',
                borderRadius: '8px',
                padding: '24px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                zIndex: 1000,
                minWidth: '320px'
              }}>
                <div style={{ marginBottom: '24px' }}>
                  <h3 style={{
                    fontSize: '14px',
                    fontWeight: '600',
                    color: 'var(--shopify-text-primary)',
                    marginBottom: '12px'
                  }}>
                    Select Date Range
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div>
                      <label style={{
                        display: 'block',
                        fontSize: '13px',
                        fontWeight: '500',
                        color: 'var(--shopify-text-secondary)',
                        marginBottom: '6px'
                      }}>
                        Start Date
                      </label>
                      <input
                        type="date"
                        value={customStartDate}
                        onChange={(e) => setCustomStartDate(e.target.value)}
                        max={customEndDate || undefined}
                        style={{
                          width: '100%',
                          padding: '8px 12px',
                          border: '1px solid var(--shopify-border)',
                          borderRadius: '6px',
                          fontSize: '13px',
                          color: 'var(--shopify-text-primary)',
                          backgroundColor: 'white',
                          outline: 'none',
                          transition: 'border-color 0.15s ease'
                        }}
                        onFocus={(e) => e.target.style.borderColor = '#7256F6'}
                        onBlur={(e) => e.target.style.borderColor = 'var(--shopify-border)'}
                      />
                    </div>
                    <div>
                      <label style={{
                        display: 'block',
                        fontSize: '13px',
                        fontWeight: '500',
                        color: 'var(--shopify-text-secondary)',
                        marginBottom: '6px'
                      }}>
                        End Date
                      </label>
                      <input
                        type="date"
                        value={customEndDate}
                        onChange={(e) => setCustomEndDate(e.target.value)}
                        min={customStartDate || undefined}
                        style={{
                          width: '100%',
                          padding: '8px 12px',
                          border: '1px solid var(--shopify-border)',
                          borderRadius: '6px',
                          fontSize: '13px',
                          color: 'var(--shopify-text-primary)',
                          backgroundColor: 'white',
                          outline: 'none',
                          transition: 'border-color 0.15s ease'
                        }}
                        onFocus={(e) => e.target.style.borderColor = '#7256F6'}
                        onBlur={(e) => e.target.style.borderColor = 'var(--shopify-border)'}
                      />
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                  <button
                    className="shopify-time-button"
                    onClick={() => {
                      setShowCustomDatePicker(false);
                      setCustomStartDate('');
                      setCustomEndDate('');
                    }}
                    style={{ fontSize: '13px', padding: '6px 12px' }}
                  >
                    Cancel
                  </button>
                  <button
                    className="shopify-time-button active"
                    onClick={handleCustomDateRangeApply}
                    style={{ fontSize: '13px', padding: '6px 12px' }}
                  >
                    Apply
                  </button>
                </div>
              </div>
            )}
          </div>
        </header>

        <div style={{ 
          padding: '0',
          flex: 1, 
          overflowY: 'auto',
          backgroundColor: '#f6f6f7'
        }}>
          <FeatureGate feature="shop-performance">
            {activeSection === 'shop-performance' && (
              <div style={{ width: '100%' }}>
                <div style={{ padding: '24px', borderBottom: '1px solid var(--shopify-border)' }}>
                  <h1 style={{ 
                    fontSize: '24px', 
                    fontWeight: '600', 
                    color: 'var(--shopify-text-primary)',
                    margin: 0,
                    marginBottom: '8px',
                    letterSpacing: '-0.02em'
                  }}>
                    Shop Performance
                  </h1>
                  <p style={{ 
                    fontSize: '14px', 
                    color: 'var(--shopify-text-secondary)',
                    margin: 0
                  }}>
                    Track your ads, product exposure, campaigns, and overall performance
                  </p>
                </div>

                {/* Core Metrics */}
                <div style={{ padding: '0 24px' }}>
                  <Grid narrow style={{ marginBottom: '24px' }}>
                    <Column lg={3} md={2} sm={1}>
                      <div className="shopify-metric-card">
                        <div className="shopify-metric-value">${mockWebsitePerformance.revenue.toLocaleString()}</div>
                        <div className="shopify-metric-label">Revenue</div>
                        <div className={`shopify-metric-change ${mockWebsitePerformance.trend.direction === 'up' ? 'positive' : 'negative'}`}>
                          {mockWebsitePerformance.trend.direction === 'up' ? (
                            <ArrowUp size={16} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} />
                          ) : (
                            <ArrowDown size={16} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} />
                          )}
                          {mockWebsitePerformance.trend.change > 0 ? '+' : ''}{mockWebsitePerformance.trend.change}%
                          <span style={{ marginLeft: '8px', color: 'var(--shopify-text-secondary)', fontWeight: 'normal' }}>
                            vs previous period
                          </span>
                        </div>
                      </div>
                    </Column>
                    <Column lg={3} md={2} sm={1}>
                      <div className="shopify-metric-card">
                        <div className="shopify-metric-value">{mockWebsitePerformance.conversions.toLocaleString()}</div>
                        <div className="shopify-metric-label">Conversions</div>
                        <div className="shopify-metric-change positive">
                          <ArrowUp size={16} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} />
                          +15.2%
                          <span style={{ marginLeft: '8px', color: 'var(--shopify-text-secondary)', fontWeight: 'normal' }}>
                            vs previous period
                          </span>
                        </div>
                      </div>
                    </Column>
                    <Column lg={3} md={2} sm={1}>
                      <div className="shopify-metric-card">
                        <div className="shopify-metric-value">{mockWebsitePerformance.roas.toFixed(1)}x</div>
                        <div className="shopify-metric-label">ROAS</div>
                        <div className="shopify-metric-change positive">
                          <ArrowUp size={16} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} />
                          +8.3%
                          <span style={{ marginLeft: '8px', color: 'var(--shopify-text-secondary)', fontWeight: 'normal' }}>
                            vs previous period
                          </span>
                        </div>
                      </div>
                    </Column>
                    <Column lg={3} md={2} sm={1}>
                      <div className="shopify-metric-card">
                        <div className="shopify-metric-value">${mockWebsitePerformance.aov.toFixed(2)}</div>
                        <div className="shopify-metric-label">AOV</div>
                        <div className="shopify-metric-change positive">
                          <ArrowUp size={16} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} />
                          +2.1%
                          <span style={{ marginLeft: '8px', color: 'var(--shopify-text-secondary)', fontWeight: 'normal' }}>
                            vs previous period
                          </span>
                        </div>
                      </div>
                    </Column>
                  </Grid>
                </div>

                {/* Performance Funnel */}
                <div style={{ padding: '0 24px' }}>
                  <div className="shopify-chart-container" style={{ marginBottom: '24px' }}>
                    <h3 style={{ 
                      fontSize: '16px', 
                      fontWeight: '600', 
                      marginBottom: '8px',
                      color: 'var(--shopify-text-primary)'
                    }}>
                      Performance Funnel: Clicks → Conversions → CVR
                    </h3>
                    <p style={{ 
                      fontSize: '13px', 
                      color: 'var(--shopify-text-secondary)',
                      marginBottom: '24px'
                    }}>
                      Track your conversion funnel performance
                    </p>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={[
                        { 
                          name: 'Clicks', 
                          value: mockWebsitePerformance.funnel.clicks,
                          fill: '#0f62fe'
                        },
                        { 
                          name: 'Conversions', 
                          value: mockWebsitePerformance.funnel.conversions,
                          fill: '#8a3ffc'
                        },
                        { 
                          name: 'CVR', 
                          value: mockWebsitePerformance.funnel.cvr,
                          fill: '#0072c3'
                        }
                      ]}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e1e3e5" />
                        <XAxis dataKey="name" stroke="#6d7175" />
                        <YAxis stroke="#6d7175" />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'white', 
                            border: '1px solid #e1e3e5',
                            borderRadius: '6px'
                          }} 
                        />
                        <Bar dataKey="value" radius={[6, 6, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                    <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'space-around', fontSize: '13px', color: 'var(--shopify-text-secondary)' }}>
                      <div>
                        <strong style={{ color: 'var(--shopify-text-primary)' }}>{mockWebsitePerformance.funnel.clicks.toLocaleString()}</strong> Clicks
                      </div>
                      <div>
                        <strong style={{ color: 'var(--shopify-text-primary)' }}>{mockWebsitePerformance.funnel.conversions.toLocaleString()}</strong> Conversions
                      </div>
                      <div>
                        <strong style={{ color: 'var(--shopify-text-primary)' }}>{mockWebsitePerformance.funnel.cvr.toFixed(1)}%</strong> CVR
                      </div>
                    </div>
                  </div>
                </div>

                {/* Revenue Trends */}
                <div style={{ padding: '0 24px' }}>
                  <div className="shopify-chart-container" style={{ marginBottom: '24px' }}>
                    <h3 style={{ 
                      fontSize: '16px', 
                      fontWeight: '600', 
                      marginBottom: '8px',
                      color: 'var(--shopify-text-primary)'
                    }}>
                      Revenue Trend vs Previous Period
                    </h3>
                    <p style={{ 
                      fontSize: '13px', 
                      color: 'var(--shopify-text-secondary)',
                      marginBottom: '24px'
                    }}>
                      Compare current performance with previous period
                    </p>
                    <ResponsiveContainer width="100%" height={400}>
                      <AreaChart data={mockRevenueData}>
                        <defs>
                          <linearGradient id="colorCurrent" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#0f62fe" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#0f62fe" stopOpacity={0.1}/>
                          </linearGradient>
                          <linearGradient id="colorPrevious" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#8a3ffc" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#8a3ffc" stopOpacity={0.05}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e1e3e5" />
                        <XAxis dataKey="date" stroke="#6d7175" />
                        <YAxis stroke="#6d7175" />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'white', 
                            border: '1px solid #e1e3e5',
                            borderRadius: '6px'
                          }} 
                        />
                        <Legend />
                        <Area 
                          type="monotone" 
                          dataKey="revenue" 
                          stroke="#0f62fe" 
                          fillOpacity={1} 
                          fill="url(#colorCurrent)"
                          strokeWidth={2}
                          name="Current Period"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Revenue Data Table - Source of Truth */}
                <div style={{ padding: '0 24px' }}>
                  <div className="shopify-chart-container" style={{ marginBottom: '24px' }}>
                    <div style={{ marginBottom: '24px' }}>
                    <h3 style={{ 
                      fontSize: '18px', 
                      fontWeight: '600', 
                      marginBottom: '8px',
                      color: 'var(--shopify-text-primary)',
                      letterSpacing: '-0.01em'
                    }}>
                      Revenue Data
                    </h3>
                    <p style={{ 
                      fontSize: '14px', 
                      color: 'var(--shopify-text-secondary)',
                      margin: 0,
                      lineHeight: '1.5'
                    }}>
                      Source of truth: Daily revenue breakdown with detailed metrics
                    </p>
                  </div>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableHeader>Date</TableHeader>
                        <TableHeader>Revenue</TableHeader>
                        <TableHeader>Clicks</TableHeader>
                        <TableHeader>Conversions</TableHeader>
                        <TableHeader>ROAS</TableHeader>
                        <TableHeader>CVR</TableHeader>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {mockRevenueData.map((row, index) => (
                        <TableRow key={index}>
                          <TableCell>{row.date}</TableCell>
                          <TableCell>${row.revenue.toLocaleString()}</TableCell>
                          <TableCell>{row.clicks.toLocaleString()}</TableCell>
                          <TableCell>{row.conversions.toLocaleString()}</TableCell>
                          <TableCell>{row.roas.toFixed(1)}x</TableCell>
                          <TableCell>{((row.conversions / row.clicks) * 100).toFixed(1)}%</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  </div>
                </div>

                {/* Campaign Performance Table - Source of Truth */}
                <div style={{ padding: '0 24px' }}>
                  <div className="shopify-chart-container" style={{ marginBottom: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                      <div>
                        <h3 style={{ 
                        fontSize: '18px', 
                        fontWeight: '600', 
                        marginBottom: '8px',
                        color: 'var(--shopify-text-primary)',
                        letterSpacing: '-0.01em'
                      }}>
                        Campaign Performance
                      </h3>
                      <p style={{ 
                        fontSize: '14px', 
                        color: 'var(--shopify-text-secondary)',
                        margin: 0,
                        lineHeight: '1.5'
                      }}>
                        Source of truth: Detailed performance metrics for all campaigns
                      </p>
                    </div>
                    {/* Filter */}
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <label style={{ fontSize: '13px', color: 'var(--shopify-text-secondary)', fontWeight: '500' }}>
                        Status:
                      </label>
                      <div style={{ display: 'flex', gap: '4px' }}>
                        {['all', 'active', 'completed'].map((status) => (
                          <button
                            key={status}
                            className={`shopify-time-button ${campaignFilter === status ? 'active' : ''}`}
                            onClick={() => setCampaignFilter(status)}
                            style={{ textTransform: 'capitalize', fontSize: '12px', padding: '4px 10px' }}
                          >
                            {status}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableHeader>Campaign Name</TableHeader>
                        <TableHeader>Type</TableHeader>
                        <TableHeader>Status</TableHeader>
                        <TableHeader>Clicks</TableHeader>
                        <TableHeader>Conversions</TableHeader>
                        <TableHeader>Revenue</TableHeader>
                        <TableHeader>ROAS</TableHeader>
                        <TableHeader>Spend</TableHeader>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {mockWebsitePerformance.campaigns.campaignPerformance.map((campaign) => (
                        <TableRow key={campaign.id}>
                          <TableCell>{campaign.name}</TableCell>
                          <TableCell>{campaign.type}</TableCell>
                          <TableCell>
                            <Tag type={campaign.status === 'active' ? 'green' : 'gray'} size="sm">
                              {campaign.status}
                            </Tag>
                          </TableCell>
                          <TableCell>{campaign.clicks.toLocaleString()}</TableCell>
                          <TableCell>{campaign.conversions.toLocaleString()}</TableCell>
                          <TableCell>${campaign.revenue.toLocaleString()}</TableCell>
                          <TableCell>{campaign.roas.toFixed(1)}x</TableCell>
                          <TableCell>${campaign.spend.toLocaleString()}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  </div>
                </div>

                {/* Product Exposure Table - Source of Truth */}
                <div style={{ padding: '0 24px' }}>
                  <div className="shopify-chart-container" style={{ marginBottom: '24px' }}>
                    <div style={{ marginBottom: '24px' }}>
                      <h3 style={{ 
                      fontSize: '18px', 
                      fontWeight: '600', 
                      marginBottom: '8px',
                      color: 'var(--shopify-text-primary)',
                      letterSpacing: '-0.01em'
                    }}>
                      Product Exposure
                    </h3>
                    <p style={{ 
                      fontSize: '14px', 
                      color: 'var(--shopify-text-secondary)',
                      margin: 0,
                      lineHeight: '1.5'
                    }}>
                      Source of truth: Top performing products by exposure and conversions
                    </p>
                  </div>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableHeader>Product Name</TableHeader>
                        <TableHeader>Views</TableHeader>
                        <TableHeader>Clicks</TableHeader>
                        <TableHeader>Conversions</TableHeader>
                        <TableHeader>Revenue</TableHeader>
                        <TableHeader>Conversion Rate</TableHeader>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {mockWebsitePerformance.productExposure.topProducts.map((product) => (
                        <TableRow key={product.id}>
                          <TableCell>{product.name}</TableCell>
                          <TableCell>{product.views.toLocaleString()}</TableCell>
                          <TableCell>{product.clicks.toLocaleString()}</TableCell>
                          <TableCell>{product.conversions.toLocaleString()}</TableCell>
                          <TableCell>${product.revenue.toLocaleString()}</TableCell>
                          <TableCell>{((product.conversions / product.clicks) * 100).toFixed(1)}%</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  </div>
                </div>

                {/* Ads Performance Table - Source of Truth */}
                <div style={{ padding: '0 24px' }}>
                  <div className="shopify-chart-container" style={{ marginBottom: '24px' }}>
                    <div style={{ marginBottom: '24px' }}>
                      <h3 style={{ 
                        fontSize: '18px', 
                        fontWeight: '600', 
                        marginBottom: '8px',
                        color: 'var(--shopify-text-primary)',
                        letterSpacing: '-0.01em'
                      }}>
                        Ads Performance
                      </h3>
                    <p style={{ 
                      fontSize: '14px', 
                      color: 'var(--shopify-text-secondary)',
                      margin: 0,
                      lineHeight: '1.5'
                    }}>
                      Source of truth: Comprehensive ad metrics and performance
                    </p>
                  </div>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableHeader>Metric</TableHeader>
                        <TableHeader>Value</TableHeader>
                        <TableHeader>Rate</TableHeader>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell>Impressions</TableCell>
                        <TableCell>{mockWebsitePerformance.ads.impressions.toLocaleString()}</TableCell>
                        <TableCell>-</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Clicks</TableCell>
                        <TableCell>{mockWebsitePerformance.ads.clicks.toLocaleString()}</TableCell>
                        <TableCell>{mockWebsitePerformance.ads.ctr.toFixed(2)}% CTR</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Spend</TableCell>
                        <TableCell>${mockWebsitePerformance.ads.spend.toLocaleString()}</TableCell>
                        <TableCell>${mockWebsitePerformance.ads.cpc.toFixed(2)} CPC</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Revenue</TableCell>
                        <TableCell>${mockWebsitePerformance.ads.revenue.toLocaleString()}</TableCell>
                        <TableCell>{(mockWebsitePerformance.ads.revenue / mockWebsitePerformance.ads.spend).toFixed(1)}x ROAS</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                  </div>
                </div>

                {/* Paid Features Upgrade Prompt */}
                {!isShopPaid() && (
                  <div style={{ padding: '0 24px 24px 24px' }}>
                    <div className="shopify-card" style={{ 
                      background: 'linear-gradient(135deg, #7256F6 0%, #5d3ef5 100%)',
                      color: 'white',
                      border: 'none'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div>
                          <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px', color: 'white' }}>
                            Unlock Advanced Analytics
                          </h3>
                          <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.9)', margin: 0 }}>
                            Get deeper funnel analysis, cohort analysis, custom reports, and historical trend analysis
                          </p>
                        </div>
                        <Button
                          kind="primary"
                          size="lg"
                          style={{
                            backgroundColor: 'white',
                            color: '#7256F6',
                            fontWeight: '600',
                            minWidth: '120px'
                          }}
                        >
                          Upgrade
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </FeatureGate>

          <FeatureGate feature="creator-performance">
            {activeSection === 'creator-performance' && (
              <div style={{ width: '100%' }}>
                <div style={{ padding: '24px', borderBottom: '1px solid var(--shopify-border)' }}>
                  <h1 style={{ 
                    fontSize: '24px', 
                    fontWeight: '600', 
                    color: 'var(--shopify-text-primary)',
                    margin: 0,
                    marginBottom: '8px',
                    letterSpacing: '-0.02em'
                  }}>
                    Creator Performance
                  </h1>
                  <p style={{ 
                    fontSize: '14px', 
                    color: 'var(--shopify-text-secondary)',
                    margin: 0
                  }}>
                    Track your creator network performance and collaborations
                  </p>
                </div>

                {/* Creator Metrics */}
                <Grid narrow style={{ marginBottom: '24px' }}>
                  <Column lg={3} md={2} sm={1}>
                    <div className="shopify-metric-card">
                      <div className="shopify-metric-value">{mockCreatorPerformance.totalCreators}</div>
                      <div className="shopify-metric-label">Total Creators</div>
                    </div>
                  </Column>
                  <Column lg={3} md={2} sm={1}>
                    <div className="shopify-metric-card">
                      <div className="shopify-metric-value">{mockCreatorPerformance.activeCollaborations}</div>
                      <div className="shopify-metric-label">Active Collaborations</div>
                    </div>
                  </Column>
                  <Column lg={3} md={2} sm={1}>
                    <div className="shopify-metric-card">
                      <div className="shopify-metric-value">${mockCreatorPerformance.creatorRevenue.toLocaleString()}</div>
                      <div className="shopify-metric-label">Creator Revenue</div>
                    </div>
                  </Column>
                  <Column lg={3} md={2} sm={1}>
                    <div className="shopify-metric-card">
                      <div className="shopify-metric-value">{mockCreatorPerformance.creatorConversions}</div>
                      <div className="shopify-metric-label">Creator Conversions</div>
                    </div>
                  </Column>
                </Grid>

                {/* Creator Performance Table - Source of Truth */}
                <div className="shopify-chart-container" style={{ marginBottom: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                    <div>
                      <h3 style={{ 
                        fontSize: '18px', 
                        fontWeight: '600', 
                        marginBottom: '8px',
                        color: 'var(--shopify-text-primary)',
                        letterSpacing: '-0.01em'
                      }}>
                        Creator Performance
                      </h3>
                      <p style={{ 
                        fontSize: '14px', 
                        color: 'var(--shopify-text-secondary)',
                        margin: 0,
                        lineHeight: '1.5'
                      }}>
                        Source of truth: Detailed performance metrics for all creators
                      </p>
                    </div>
                    {/* Filter */}
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <label style={{ fontSize: '13px', color: 'var(--shopify-text-secondary)', fontWeight: '500' }}>
                        Sort by:
                      </label>
                      <div style={{ display: 'flex', gap: '4px' }}>
                        {['revenue', 'conversions', 'growth'].map((sort) => (
                          <button
                            key={sort}
                            className={`shopify-time-button ${chartMetric === sort ? 'active' : ''}`}
                            onClick={() => setChartMetric(sort)}
                            style={{ textTransform: 'capitalize', fontSize: '12px', padding: '4px 10px' }}
                          >
                            {sort}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableHeader>Creator Name</TableHeader>
                        <TableHeader>Revenue</TableHeader>
                        <TableHeader>Conversions</TableHeader>
                        <TableHeader>Growth %</TableHeader>
                        <TableHeader>Status</TableHeader>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {mockCreatorPerformance.topCreators.map((creator) => (
                        <TableRow key={creator.id}>
                          <TableCell>{creator.name}</TableCell>
                          <TableCell>${creator.revenue.toLocaleString()}</TableCell>
                          <TableCell>{creator.conversions.toLocaleString()}</TableCell>
                          <TableCell>
                            <div style={{ 
                              display: 'flex', 
                              alignItems: 'center', 
                              gap: '4px',
                              color: creator.growth > 0 ? '#7256F6' : '#d72c0d'
                            }}>
                              {creator.growth > 0 ? (
                                <ArrowUp size={16} />
                              ) : (
                                <ArrowDown size={16} />
                              )}
                              {Math.abs(creator.growth)}%
                            </div>
                          </TableCell>
                          <TableCell>
                            <Tag type="green" size="sm">Active</Tag>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Creator Revenue Breakdown */}
                <div className="shopify-chart-container" style={{ marginBottom: '24px' }}>
                  <h3 style={{ 
                    fontSize: '16px', 
                    fontWeight: '600', 
                    marginBottom: '8px',
                    color: 'var(--shopify-text-primary)'
                  }}>
                    Creator Revenue Summary
                  </h3>
                  <p style={{ 
                    fontSize: '13px', 
                    color: 'var(--shopify-text-secondary)',
                    marginBottom: '24px'
                  }}>
                    Overall creator network performance metrics
                  </p>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableHeader>Metric</TableHeader>
                        <TableHeader>Value</TableHeader>
                        <TableHeader>Details</TableHeader>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell>Total Creators</TableCell>
                        <TableCell>{mockCreatorPerformance.totalCreators}</TableCell>
                        <TableCell>{mockCreatorPerformance.activeCollaborations} active collaborations</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Total Revenue</TableCell>
                        <TableCell>${mockCreatorPerformance.creatorRevenue.toLocaleString()}</TableCell>
                        <TableCell>From creator-driven traffic</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Total Conversions</TableCell>
                        <TableCell>{mockCreatorPerformance.creatorConversions.toLocaleString()}</TableCell>
                        <TableCell>{((mockCreatorPerformance.creatorConversions / mockCreatorPerformance.creatorRevenue) * 100).toFixed(1)}% conversion rate</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Average Revenue per Creator</TableCell>
                        <TableCell>${(mockCreatorPerformance.creatorRevenue / mockCreatorPerformance.totalCreators).toLocaleString()}</TableCell>
                        <TableCell>Based on {mockCreatorPerformance.totalCreators} creators</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>

                {/* Top-Tier Benchmarking - Free Creator Feature */}
                <FeatureGate feature="top-tier-benchmarking">
                  <div className="shopify-chart-container" style={{ marginBottom: '24px' }}>
                    <div style={{ marginBottom: '24px' }}>
                      <h3 style={{ 
                        fontSize: '18px', 
                        fontWeight: '600', 
                        marginBottom: '8px',
                        color: 'var(--shopify-text-primary)',
                        letterSpacing: '-0.01em'
                      }}>
                        Top-Tier Shop Performance
                      </h3>
                      <p style={{ 
                        fontSize: '14px', 
                        color: 'var(--shopify-text-secondary)',
                        margin: 0,
                        lineHeight: '1.5'
                      }}>
                        Benchmark against top performers in your category
                      </p>
                    </div>
                    <div style={{ marginBottom: '20px' }}>
                      {mockTopTierShopPerformance.map((shop, index) => (
                        <div key={index} className="shopify-card" style={{ marginBottom: '24px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                            <h4 style={{ fontSize: '14px', fontWeight: '600', color: 'var(--shopify-text-primary)', margin: 0 }}>
                              {shop.shopName}
                            </h4>
                            <Tag type="green" size="sm">Top Performer</Tag>
                          </div>
                          <Grid narrow>
                            <Column lg={3} md={2} sm={1}>
                              <div style={{ fontSize: '12px', color: 'var(--shopify-text-secondary)', marginBottom: '4px' }}>Revenue</div>
                              <div style={{ fontSize: '16px', fontWeight: '600', color: 'var(--shopify-text-primary)' }}>
                                ${shop.metrics.revenue.toLocaleString()}
                              </div>
                            </Column>
                            <Column lg={3} md={2} sm={1}>
                              <div style={{ fontSize: '12px', color: 'var(--shopify-text-secondary)', marginBottom: '4px' }}>ROAS</div>
                              <div style={{ fontSize: '16px', fontWeight: '600', color: 'var(--shopify-text-primary)' }}>
                                {shop.metrics.roas.toFixed(1)}x
                              </div>
                            </Column>
                            <Column lg={3} md={2} sm={1}>
                              <div style={{ fontSize: '12px', color: 'var(--shopify-text-secondary)', marginBottom: '4px' }}>CVR</div>
                              <div style={{ fontSize: '16px', fontWeight: '600', color: 'var(--shopify-text-primary)' }}>
                                {shop.metrics.funnel.cvr.toFixed(1)}%
                              </div>
                            </Column>
                            <Column lg={3} md={2} sm={1}>
                              <div style={{ fontSize: '12px', color: 'var(--shopify-text-secondary)', marginBottom: '4px' }}>AOV</div>
                              <div style={{ fontSize: '16px', fontWeight: '600', color: 'var(--shopify-text-primary)' }}>
                                ${shop.metrics.aov.toFixed(2)}
                              </div>
                            </Column>
                          </Grid>
                        </div>
                      ))}
                    </div>

                    {/* Top-Tier Comparison Table */}
                    <div style={{ marginTop: '24px' }}>
                      <h4 style={{ 
                        fontSize: '14px', 
                        fontWeight: '600', 
                        marginBottom: '24px',
                        color: 'var(--shopify-text-primary)'
                      }}>
                        Your Performance vs Top-Tier Shops
                      </h4>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableHeader>Metric</TableHeader>
                            <TableHeader>Your Performance</TableHeader>
                            <TableHeader>Top-Tier Average</TableHeader>
                            <TableHeader>Gap</TableHeader>
                            <TableHeader>% of Top-Tier</TableHeader>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          <TableRow>
                            <TableCell>Revenue</TableCell>
                            <TableCell>${mockWebsitePerformance.revenue.toLocaleString()}</TableCell>
                            <TableCell>${Math.round((mockTopTierShopPerformance[0].metrics.revenue + mockTopTierShopPerformance[1].metrics.revenue) / 2).toLocaleString()}</TableCell>
                            <TableCell>
                              ${(Math.round((mockTopTierShopPerformance[0].metrics.revenue + mockTopTierShopPerformance[1].metrics.revenue) / 2) - mockWebsitePerformance.revenue).toLocaleString()}
                            </TableCell>
                            <TableCell>
                              {((mockWebsitePerformance.revenue / Math.round((mockTopTierShopPerformance[0].metrics.revenue + mockTopTierShopPerformance[1].metrics.revenue) / 2)) * 100).toFixed(0)}%
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>ROAS</TableCell>
                            <TableCell>{mockWebsitePerformance.roas.toFixed(1)}x</TableCell>
                            <TableCell>{((mockTopTierShopPerformance[0].metrics.roas + mockTopTierShopPerformance[1].metrics.roas) / 2).toFixed(1)}x</TableCell>
                            <TableCell>
                              {(((mockTopTierShopPerformance[0].metrics.roas + mockTopTierShopPerformance[1].metrics.roas) / 2) - mockWebsitePerformance.roas).toFixed(1)}x
                            </TableCell>
                            <TableCell>
                              {((mockWebsitePerformance.roas / ((mockTopTierShopPerformance[0].metrics.roas + mockTopTierShopPerformance[1].metrics.roas) / 2)) * 100).toFixed(0)}%
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>CVR</TableCell>
                            <TableCell>{mockWebsitePerformance.funnel.cvr.toFixed(1)}%</TableCell>
                            <TableCell>{((mockTopTierShopPerformance[0].metrics.funnel.cvr + mockTopTierShopPerformance[1].metrics.funnel.cvr) / 2).toFixed(1)}%</TableCell>
                            <TableCell>
                              {(((mockTopTierShopPerformance[0].metrics.funnel.cvr + mockTopTierShopPerformance[1].metrics.funnel.cvr) / 2) - mockWebsitePerformance.funnel.cvr).toFixed(1)}%
                            </TableCell>
                            <TableCell>
                              {((mockWebsitePerformance.funnel.cvr / ((mockTopTierShopPerformance[0].metrics.funnel.cvr + mockTopTierShopPerformance[1].metrics.funnel.cvr) / 2)) * 100).toFixed(0)}%
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>AOV</TableCell>
                            <TableCell>${mockWebsitePerformance.aov.toFixed(2)}</TableCell>
                            <TableCell>${((mockTopTierShopPerformance[0].metrics.aov + mockTopTierShopPerformance[1].metrics.aov) / 2).toFixed(2)}</TableCell>
                            <TableCell>
                              ${(((mockTopTierShopPerformance[0].metrics.aov + mockTopTierShopPerformance[1].metrics.aov) / 2) - mockWebsitePerformance.aov).toFixed(2)}
                            </TableCell>
                            <TableCell>
                              {((mockWebsitePerformance.aov / ((mockTopTierShopPerformance[0].metrics.aov + mockTopTierShopPerformance[1].metrics.aov) / 2)) * 100).toFixed(0)}%
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                </FeatureGate>

                {/* AI Suggestions */}
                <div className="shopify-chart-container">
                  <h3 style={{ 
                    fontSize: '16px', 
                    fontWeight: '600', 
                    marginBottom: '8px',
                    color: 'var(--shopify-text-primary)'
                  }}>
                    AI Performance Suggestions
                  </h3>
                  <p style={{ 
                    fontSize: '13px', 
                    color: 'var(--shopify-text-secondary)',
                    marginBottom: '24px'
                  }}>
                    {isCreatorPaid() 
                      ? 'All AI suggestions to improve your creator performance'
                      : 'Get personalized recommendations to boost your performance'
                    }
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {mockCreatorPerformance.aiSuggestions
                      .filter(suggestion => isCreatorPaid() || suggestion.visibleInFree)
                      .map((suggestion) => (
                        <div 
                          key={suggestion.id} 
                          className="shopify-card"
                          style={{ 
                            cursor: 'pointer',
                            transition: 'all 0.15s',
                            border: '1px solid var(--shopify-border)'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = '#7256F6';
                            e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = 'var(--shopify-border)';
                            e.currentTarget.style.boxShadow = 'none';
                          }}
                        >
                          <div style={{ 
                            display: 'flex', 
                            alignItems: 'start', 
                            justifyContent: 'space-between',
                            marginBottom: '8px'
                          }}>
                            <h4 style={{ 
                              fontSize: '14px', 
                              fontWeight: '600', 
                              color: 'var(--shopify-text-primary)',
                              margin: 0
                            }}>
                              {suggestion.title}
                            </h4>
                            <Tag
                              type={suggestion.impact === 'high' ? 'red' : 'warm-gray'}
                              size="sm"
                            >
                              {suggestion.impact} Impact
                            </Tag>
                          </div>
                          <p style={{ 
                            fontSize: '13px', 
                            color: 'var(--shopify-text-secondary)',
                            marginBottom: '8px',
                            margin: 0
                          }}>
                            {suggestion.description}
                          </p>
                          <div style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '8px'
                          }}>
                            <ArrowUp size={16} style={{ color: '#7256F6' }} />
                            <span style={{ 
                              fontSize: '13px', 
                              fontWeight: '600', 
                              color: '#7256F6'
                            }}>
                              {suggestion.potentialGain}
                            </span>
                          </div>
                        </div>
                      ))}
                    
                    {!isCreatorPaid() && (
                      <div className="shopify-card" style={{ 
                        background: 'linear-gradient(135deg, #7256F6 0%, #5d3ef5 100%)',
                        color: 'white',
                        border: 'none',
                        textAlign: 'center',
                        padding: '24px'
                      }}>
                        <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px', color: 'white' }}>
                          Unlock {mockCreatorPerformance.aiSuggestions.filter(s => !s.visibleInFree).length} More AI Suggestions
                        </h4>
                        <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.9)', marginBottom: '16px' }}>
                          Get full access to all AI-powered performance optimization suggestions
                        </p>
                        <Button
                          kind="primary"
                          size="lg"
                          style={{
                            backgroundColor: 'white',
                            color: '#7256F6',
                            fontWeight: '600',
                            minWidth: '120px'
                          }}
                        >
                          Upgrade to Paid
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </FeatureGate>

          {activeSection === 'dashboard' && (
            <div style={{ width: '100%' }}>
              {/* Dashboard Title and Controls */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '12px 24px',
                borderBottom: '1px solid var(--shopify-border)'
              }}>
                <h2 style={{
                  fontSize: '24px',
                  fontWeight: '600',
                  color: 'var(--shopify-text-primary)',
                  margin: 0,
                  letterSpacing: '-0.02em'
                }}>
                  Dashboard
                </h2>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  {/* Date Range Display */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 12px',
                    border: '1px solid var(--shopify-border)',
                    borderRadius: '6px',
                    backgroundColor: 'white',
                    fontSize: '14px',
                    color: 'var(--shopify-text-primary)',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                  onClick={() => setShowCustomDatePicker(!showCustomDatePicker)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#7256F6';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--shopify-border)';
                  }}
                  >
                    {isCustomRange ? formatCustomDateRange() : (
                      <>
                        {timeRange === '24h' ? 'Last 24 hours' :
                         timeRange === '7d' ? 'Last 7 days' :
                         timeRange === '30d' ? 'Last 30 days' :
                         'Last 90 days'}
                      </>
                    )}
                    <Calendar size={16} style={{ opacity: 0.6 }} />
                  </div>
                  
                  {/* Monthly/Period Dropdown */}
                  <select
                    style={{
                      padding: '8px 32px 8px 12px',
                      border: '1px solid var(--shopify-border)',
                      borderRadius: '6px',
                      backgroundColor: 'white',
                      fontSize: '14px',
                      color: 'var(--shopify-text-primary)',
                      cursor: 'pointer',
                      outline: 'none',
                      appearance: 'none',
                      backgroundImage: `url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L6 6L11 1' stroke='%236d7175' stroke-width='2' stroke-linecap='round'/%3E%3C/svg%3E")`,
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'right 12px center',
                      transition: 'border-color 0.15s ease'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#7256F6'}
                    onBlur={(e) => e.target.style.borderColor = 'var(--shopify-border)'}
                  >
                    <option>Monthly</option>
                    <option>Weekly</option>
                    <option>Daily</option>
                  </select>
                  
                  {/* Filter Button */}
                  <button
                    className="shopify-time-button"
                    style={{
                      padding: '8px 16px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontSize: '14px'
                    }}
                  >
                    <Filter size={16} />
                    Filter
                  </button>
                  
                  {/* Export Button */}
                  <button
                    className="shopify-time-button"
                    style={{
                      padding: '8px 16px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontSize: '14px'
                    }}
                  >
                    <Download size={16} />
                    Export
                  </button>
                </div>
              </div>

              {/* Performance Rank - Subtle */}
              {mockWebsitePerformance.performanceRank && (
                <div style={{ 
                  margin: '24px',
                  padding: '12px 24px',
                  backgroundColor: mockWebsitePerformance.performanceRank.percentile >= 75 
                    ? '#f0edff'
                    : mockWebsitePerformance.performanceRank.percentile >= 50
                    ? '#e8f4f8'
                    : '#f6f6f7',
                  border: '1px solid var(--shopify-border)',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  fontSize: '13px',
                  color: 'var(--shopify-text-secondary)'
                }}>
                  <span style={{ 
                    fontWeight: '500',
                    color: 'var(--shopify-text-primary)'
                  }}>
                    Performance rank:
                  </span>
                  <span style={{ 
                    fontWeight: '600',
                    color: mockWebsitePerformance.performanceRank.percentile >= 75 
                      ? '#7256F6'
                      : mockWebsitePerformance.performanceRank.percentile >= 50
                      ? '#0072c3'
                      : '#6d7175'
                  }}>
                    {isShopPaid() 
                      ? `#${mockWebsitePerformance.performanceRank.rank.toLocaleString()} of ${mockWebsitePerformance.performanceRank.totalShops.toLocaleString()}`
                      : `Top ${100 - mockWebsitePerformance.performanceRank.percentile}%`
                    }
                  </span>
                  {!isShopPaid() && (
                    <span 
                      style={{ 
                        marginLeft: 'auto',
                        fontSize: '12px',
                        color: 'var(--shopify-text-secondary)',
                        textDecoration: 'none',
                        cursor: 'pointer',
                        transition: 'color 0.15s ease'
                      }} 
                      onClick={() => alert('Navigate to upgrade page')}
                      onMouseEnter={(e) => e.currentTarget.style.color = '#7256F6'}
                      onMouseLeave={(e) => e.currentTarget.style.color = 'var(--shopify-text-secondary)'}
                    >
                      View details →
                    </span>
                  )}
                </div>
              )}

              {/* 1. Recent Activity & Live Performance */}
              <div style={{ 
                marginTop: '24px',
                marginLeft: '24px',
                marginRight: '24px',
                marginBottom: '24px',
              }}>
                <Grid narrow style={{ marginLeft: 0, marginRight: 0, paddingLeft: 0, paddingRight: 0 }}>
                  {/* Left Panel - Historical Comparison */}
                  <Column lg={11} style={{ paddingLeft: 0, paddingRight: 0 }}>
                    <div style={{ 
                      backgroundColor: 'white',
                      borderRadius: '8px',
                      border: '1px solid var(--shopify-border)',
                      padding: '24px',
                      height: '100%'
                    }}>
                      <h4 style={{ fontSize: '14px', fontWeight: '400', color: '#202124', marginBottom: '20px' }}>
                        Last 7 days vs. Previous period
                      </h4>
                      
                      {/* KPI Cards - Last 7 Days vs Previous */}
                      <div style={{ display: 'flex', gap: '32px', marginBottom: '24px' }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: '13px', color: '#5f6368', marginBottom: '6px', fontWeight: '400' }}>New users</div>
                          <div style={{ fontSize: '28px', fontWeight: '400', color: '#202124', lineHeight: '1.2', marginBottom: '4px' }}>241K</div>
                          <div style={{ fontSize: '13px', color: '#d93025', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: '400' }}>
                            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M5 8L1 4H9L5 8Z" fill="#d93025"/>
                            </svg>
                            6.4%
                          </div>
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: '13px', color: '#5f6368', marginBottom: '6px', fontWeight: '400' }}>Total users</div>
                          <div style={{ fontSize: '28px', fontWeight: '400', color: '#202124', lineHeight: '1.2', marginBottom: '4px' }}>263K</div>
                          <div style={{ fontSize: '13px', color: '#d93025', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: '400' }}>
                            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M5 8L1 4H9L5 8Z" fill="#d93025"/>
                            </svg>
                            6.9%
                          </div>
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: '13px', color: '#5f6368', marginBottom: '6px', fontWeight: '400' }}>Impressions</div>
                          <div style={{ fontSize: '28px', fontWeight: '400', color: '#202124', lineHeight: '1.2', marginBottom: '4px' }}>840K</div>
                          <div style={{ fontSize: '13px', color: '#d93025', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: '400' }}>
                            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M5 8L1 4H9L5 8Z" fill="#d93025"/>
                            </svg>
                            5.2%
                          </div>
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: '13px', color: '#5f6368', marginBottom: '6px', fontWeight: '400' }}>Returning users</div>
                          <div style={{ fontSize: '28px', fontWeight: '400', color: '#202124', lineHeight: '1.2', marginBottom: '4px' }}>22K</div>
                          <div style={{ fontSize: '13px', color: '#d93025', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: '400' }}>
                            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M5 8L1 4H9L5 8Z" fill="#d93025"/>
                            </svg>
                            8.3%
                          </div>
                        </div>
                      </div>  

                      {/* Comparison Line Chart */}
                      <div style={{ marginTop: '20px' }}>
                        <ResponsiveContainer width="100%" height={280}>
                          <LineChart 
                            data={[
                              { date: 'Jan 13', current: 38000, previous: 42000 },
                              { date: 'Jan 14', current: 35000, previous: 40000 },
                              { date: 'Jan 15', current: 36500, previous: 41500 },
                              { date: 'Jan 16', current: 34000, previous: 39500 },
                              { date: 'Jan 17', current: 37500, previous: 43000 },
                              { date: 'Jan 18', current: 39000, previous: 44500 },
                              { date: 'Jan 19', current: 36000, previous: 41000 },
                            ]}
                            margin={{ top: 20, right: 10, left: -25, bottom: 5 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f3f4" vertical={false} />
                            <XAxis 
                              dataKey="date" 
                              tick={{ fontSize: 12, fill: '#5f6368' }}
                              axisLine={{ stroke: '#dadce0' }}
                              tickLine={false}
                            />
                            <YAxis 
                              tick={{ fontSize: 12, fill: '#5f6368' }}
                              axisLine={false}
                              tickLine={false}
                              tickFormatter={(value) => `${value / 1000}K`}
                            />
                            <Tooltip 
                              contentStyle={{ 
                                backgroundColor: 'white', 
                                border: '1px solid #dadce0',
                                borderRadius: '8px',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                padding: '12px'
                              }}
                              labelStyle={{ 
                                color: '#202124',
                                fontWeight: '500',
                                marginBottom: '8px'
                              }}
                              itemStyle={{
                                color: '#5f6368',
                                fontSize: '13px',
                                padding: '4px 0'
                              }}
                              formatter={(value: any, name: any) => {
                                const formattedValue = `${(value / 1000).toFixed(1)}K`;
                                return [formattedValue, name];
                              }}
                              cursor={{ stroke: '#dadce0', strokeWidth: 1, strokeDasharray: '5 5' }}
                            />
                            <Legend 
                              wrapperStyle={{ fontSize: '13px', paddingTop: '16px' }}
                              formatter={(value, entry: any) => {
                                const isDashed = entry.payload.strokeDasharray;
                                return (
                                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                                    <svg width="20" height="2" style={{ marginRight: '4px' }}>
                                      {isDashed ? (
                                        <line x1="0" y1="1" x2="20" y2="1" stroke="#1a73e8" strokeWidth="2" strokeDasharray="3 3" />
                                      ) : (
                                        <line x1="0" y1="1" x2="20" y2="1" stroke="#1a73e8" strokeWidth="2" />
                                      )}
                                    </svg>
                                    <span style={{ color: '#5f6368' }}>{value}</span>
                                  </span>
                                );
                              }}
                            />
                            <Line 
                              type="monotone" 
                              dataKey="previous" 
                              stroke="#1a73e8" 
                              strokeWidth={2}
                              strokeDasharray="5 5"
                              dot={false}
                              activeDot={{ r: 5, fill: '#1a73e8', strokeWidth: 2, stroke: 'white' }}
                              name="Previous period"
                            />
                            <Line 
                              type="monotone" 
                              dataKey="current" 
                              stroke="#1a73e8" 
                              strokeWidth={2}
                              dot={false}
                              activeDot={{ r: 5, fill: '#1a73e8', strokeWidth: 2, stroke: 'white' }}
                              name="Last 7 days"
                            />
                          </LineChart>
                        </ResponsiveContainer>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
                          <select style={{ 
                            padding: '6px 12px', 
                            border: '1px solid #dadce0', 
                            borderRadius: '4px', 
                            backgroundColor: 'white',
                            fontSize: '13px',
                            color: '#202124',
                            cursor: 'pointer',
                            outline: 'none'
                          }}>
                            <option>Last 7 days</option>
                            <option>Last 28 days</option>
                            <option>Last 90 days</option>
                          </select>
                          <div style={{ fontSize: '13px', color: '#1a73e8', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            View reports snapshot
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M6 3L11 8L6 13" stroke="#1a73e8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Column>

                  {/* Right Panel - Real-time Activity */}
                  <Column lg={5} style={{ paddingLeft: 0, paddingRight: 0 }}>
                    <div style={{ 
                      backgroundColor: 'white',
                      borderRadius: '8px',
                      border: '1px solid var(--shopify-border)',
                      padding: '24px',
                      height: '100%'
                    }}>
                      {/* Live Metric */}
                      <div style={{ marginBottom: '24px' }}>
                        <div style={{ fontSize: '13px', color: '#5f6368', marginBottom: '8px', fontWeight: '400', display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M8 14C11.3137 14 14 11.3137 14 8C14 4.68629 11.3137 2 8 2C4.68629 2 2 4.68629 2 8C2 11.3137 4.68629 14 8 14Z" fill="#34a853"/>
                            <path d="M8 14C11.3137 14 14 11.3137 14 8C14 4.68629 11.3137 2 8 2C4.68629 2 2 4.68629 2 8C2 11.3137 4.68629 14 8 14Z" stroke="white" strokeWidth="2"/>
                          </svg>
                          ACTIVE USERS IN LAST 30 MINUTES
                        </div>
                        <div style={{ fontSize: '40px', fontWeight: '400', color: '#202124', lineHeight: 1 }}>436</div>
                      </div>

                      {/* Orders Per Minute Chart */}
                      <div style={{ marginBottom: '24px' }}>
                        <div style={{ fontSize: '13px', color: '#5f6368', marginBottom: '12px', fontWeight: '400' }}>
                          Active users per minute
                        </div>
                        <ResponsiveContainer width="100%" height={80}>
                          <BarChart data={[
                            { time: '1', value: 12 },
                            { time: '2', value: 18 },
                            { time: '3', value: 15 },
                            { time: '4', value: 22 },
                            { time: '5', value: 19 },
                            { time: '6', value: 25 },
                            { time: '7', value: 20 },
                            { time: '8', value: 17 },
                            { time: '9', value: 23 },
                            { time: '10', value: 21 },
                            { time: '11', value: 16 },
                            { time: '12', value: 19 },
                            { time: '13', value: 24 },
                            { time: '14', value: 18 },
                            { time: '15', value: 20 },
                          ]}>
                            <Tooltip 
                              contentStyle={{ 
                                backgroundColor: 'white', 
                                border: '1px solid #dadce0',
                                borderRadius: '8px',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                padding: '8px 12px'
                              }}
                              labelStyle={{ 
                                color: '#202124',
                                fontWeight: '500',
                                fontSize: '12px',
                                marginBottom: '4px'
                              }}
                              itemStyle={{
                                color: '#5f6368',
                                fontSize: '13px'
                              }}
                              formatter={(value: any) => [`${value} users`, '']}
                              labelFormatter={(label) => `${label} min ago`}
                              cursor={{ fill: 'rgba(26, 115, 232, 0.1)' }}
                            />
                            <Bar dataKey="value" fill="#1a73e8" radius={[2, 2, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>

                      {/* Geographic Breakdown */}
                      <div>
                        <div style={{ 
                          display: 'flex', 
                          justifyContent: 'space-between',
                          fontSize: '11px',
                          color: 'var(--shopify-text-secondary)',
                          marginBottom: '12px',
                          fontWeight: '600',
                          textTransform: 'uppercase',
                          borderBottom: '1px solid var(--shopify-border)',
                          paddingBottom: '8px'
                        }}>
                          <span>Country</span>
                          <span>Active Users</span>
                        </div>
                        
                        {[
                          { country: 'United States', users: 242 },
                          { country: 'United Kingdom', users: 62 },
                          { country: 'China', users: 61 },
                          { country: 'Canada', users: 17 },
                          { country: 'Germany', users: 15 },
                        ].map((item, index) => {
                          const maxUsers = 242;
                          const barWidth = (item.users / maxUsers) * 100;
                          
                          return (
                            <div key={index} style={{ marginBottom: '12px' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                                <span style={{ fontSize: '13px', color: 'var(--shopify-text-primary)', fontWeight: '500' }}>
                                  {item.country}
                                </span>
                                <span style={{ fontSize: '13px', color: 'var(--shopify-text-primary)', fontWeight: '600' }}>
                                  {item.users}
                                </span>
                              </div>
                              <div style={{ 
                                width: '100%', 
                                height: '6px', 
                                backgroundColor: '#e0e0e0',
                                borderRadius: '3px',
                                overflow: 'hidden'
                              }}>
                                <div style={{ 
                                  width: `${barWidth}%`, 
                                  height: '100%', 
                                  backgroundColor: '#1a73e8',
                                  borderRadius: '3px',
                                  transition: 'width 0.3s ease'
                                }} />
                              </div>
                            </div>
                          );
                        })}

                        <div style={{ fontSize: '13px', color: '#1a73e8', textAlign: 'right', marginTop: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '4px' }}>
                          View realtime
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M6 3L11 8L6 13" stroke="#1a73e8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                      </div>
                    </div>
                  </Column>
                </Grid>
              </div>

              {/* KPI Cards */}
                <div style={{ 
                  padding: '0 0 24px 0',
                  marginLeft: '24px',
                  marginRight: '24px',
                  }}>
                <Grid narrow style={{ marginLeft: 0, marginRight: 0, padding: '0' }}>
                  {metrics.map((metric, index) => (
                    <Column key={index} lg={4} md={4} sm={2}>
                      <StatCard metric={metric} />
                    </Column>
                  ))}
                </Grid>
              </div>

              {/* Seller-Focused Dashboard Sections */}
              
              {/* 2. Performance Overview */}
              <div style={{ 
                marginLeft: '24px',
                marginRight: '24px',
                backgroundColor: 'white',
                borderRadius: '8px',
                border: '1px solid var(--shopify-border)',
                padding: '24px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                  <div>
                    <h3 style={{ fontSize: '20px', fontWeight: '600', color: 'var(--shopify-text-primary)', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Currency size={24} style={{ color: '#7256F6' }} />
                      Performance Overview
                    </h3>
                    <p style={{ fontSize: '14px', color: 'var(--shopify-text-secondary)', margin: 0 }}>
                      Monitor your key financial metrics and efficiency
                    </p>
                  </div>
                  <Tag type="green">+12.5% vs last period</Tag>
                </div>
                
                {/* Grid of earning metrics */}
                <Grid narrow style={{ marginBottom: '24px' }}>
                  <Column lg={5}>
                    <div style={{ padding: '20px', backgroundColor: '#f0edff', borderRadius: '8px', border: '1px solid #e0d9ff' }}>
                      <div style={{ fontSize: '13px', color: 'var(--shopify-text-secondary)', marginBottom: '8px' }}>Total Revenue</div>
                      <div style={{ fontSize: '32px', fontWeight: '600', color: '#7256F6' }}>$47,234</div>
                      <div style={{ fontSize: '13px', color: '#16a34a', marginTop: '8px' }}>↑ $5,260 from last period</div>
                    </div>
                  </Column>
                  <Column lg={5}>
                    <div style={{ padding: '20px', backgroundColor: '#f6f6f7', borderRadius: '8px', border: '1px solid #e0e0e0' }}>
                      <div style={{ fontSize: '13px', color: 'var(--shopify-text-secondary)', marginBottom: '8px' }}>Avg Order Value</div>
                      <div style={{ fontSize: '32px', fontWeight: '600', color: 'var(--shopify-text-primary)' }}>$38.02</div>
                      <div style={{ fontSize: '13px', color: '#6d7175', marginTop: '8px' }}>Per transaction</div>
                    </div>
                  </Column>
                  <Column lg={6}>
                    <div style={{ padding: '20px', backgroundColor: '#f6f6f7', borderRadius: '8px', border: '1px solid #e0e0e0' }}>
                      <div style={{ fontSize: '13px', color: 'var(--shopify-text-secondary)', marginBottom: '8px' }}>Net CPA</div>
                      <div style={{ fontSize: '32px', fontWeight: '600', color: 'var(--shopify-text-primary)' }}>$5.29</div>
                      <div style={{ fontSize: '13px', color: '#6d7175', marginTop: '8px' }}>Cost to acquire one customer</div>
                    </div>
                  </Column>
                </Grid>
                
                {/* Revenue trend chart */}
                <div style={{ marginTop: '16px' }}>
                  <div style={{ fontSize: '15px', fontWeight: '500', color: 'var(--shopify-text-primary)', marginBottom: '16px' }}>
                    Revenue Trend
                  </div>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart 
                      data={mockRevenueData} 
                      margin={{ top: 5, right: 10, left: 0, bottom: 25 }}
                    >
                      <defs>
                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#7256F6" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#7256F6" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                      <XAxis 
                        dataKey="date" 
                        tick={{ fill: '#6d7175', fontSize: 12 }}
                        tickLine={{ stroke: '#e0e0e0' }}
                      />
                      <YAxis 
                        width={40}
                        tick={{ fill: '#6d7175', fontSize: 12 }}
                        tickLine={{ stroke: '#e0e0e0' }}
                        tickFormatter={(value) => `$${value / 1000}k`}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'white',
                          border: '1px solid #e0e0e0',
                          borderRadius: '6px',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                        }}
                        formatter={(value: number) => [`$${value.toLocaleString()}`, 'Revenue']}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="revenue" 
                        stroke="#7256F6" 
                        strokeWidth={2.5}
                        fillOpacity={1}
                        fill="url(#colorRevenue)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* 2. Conversion Performance */}
              <div style={{ 
                marginTop: '24px',
                marginLeft: '24px',
                marginRight: '24px',
                backgroundColor: 'white',
                borderRadius: '8px',
                border: '1px solid var(--shopify-border)',
                padding: '24px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                  <div>
                    <h3 style={{ fontSize: '20px', fontWeight: '600', color: 'var(--shopify-text-primary)', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <ChartLineSmooth size={24} style={{ color: '#16a34a' }} />
                      Conversion Performance
                    </h3>
                    <p style={{ fontSize: '14px', color: 'var(--shopify-text-secondary)', margin: 0 }}>
                      Your click-to-purchase conversion funnel
                    </p>
                  </div>
                  <div style={{ 
                    padding: '8px 16px', 
                    backgroundColor: '#e8f4f8', 
                    borderRadius: '6px',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#0f62fe'
                  }}>
                    CVR: 13.9% (2.3% above avg)
                  </div>
                </div>

                <Grid narrow style={{ marginBottom: '24px' }}>
                  <Column lg={8}>
                    {/* Funnel visualization */}
                    <div style={{ padding: '24px', backgroundColor: '#f6f6f7', borderRadius: '8px' }}>
                      <div style={{ marginBottom: '20px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                          <span style={{ fontSize: '14px', fontWeight: '500' }}>Total Clicks</span>
                          <span style={{ fontSize: '18px', fontWeight: '600', color: '#7256F6' }}>8,920</span>
                        </div>
                        <div style={{ height: '40px', backgroundColor: '#7256F6', borderRadius: '4px', width: '100%' }}></div>
                      </div>
                      
                      <div style={{ marginBottom: '20px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                          <span style={{ fontSize: '14px', fontWeight: '500' }}>Add to Cart</span>
                          <span style={{ fontSize: '18px', fontWeight: '600', color: '#0f62fe' }}>2,456 (27.5%)</span>
                        </div>
                        <div style={{ height: '40px', backgroundColor: '#0f62fe', borderRadius: '4px', width: '27.5%' }}></div>
                      </div>
                      
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                          <span style={{ fontSize: '14px', fontWeight: '500' }}>Purchase</span>
                          <span style={{ fontSize: '18px', fontWeight: '600', color: '#16a34a' }}>1,243 (13.9%)</span>
                        </div>
                        <div style={{ height: '40px', backgroundColor: '#16a34a', borderRadius: '4px', width: '13.9%' }}></div>
                      </div>
                    </div>
                  </Column>
                  
                  <Column lg={8}>
                    {/* Conversion rate trend */}
                    <div style={{ height: '100%', minHeight: '250px' }}>
                      <ResponsiveContainer width="100%" height="100%">
                      <LineChart 
                        data={mockRevenueData.map(item => ({ 
                          date: item.date, 
                          cvr: ((item.conversions / item.clicks) * 100).toFixed(1)
                        }))}
                        margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                        <XAxis 
                          dataKey="date" 
                          tick={{ fill: '#6d7175', fontSize: 11 }}
                          tickLine={{ stroke: '#e0e0e0' }}
                        />
                        <YAxis 
                          width={40}
                          tick={{ fill: '#6d7175', fontSize: 11 }}
                          tickLine={{ stroke: '#e0e0e0' }}
                          tickFormatter={(value) => `${value}%`}
                        />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'white',
                            border: '1px solid #e0e0e0',
                            borderRadius: '6px'
                          }}
                          formatter={(value: any) => [`${value}%`, 'CVR']}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="cvr" 
                          stroke="#16a34a" 
                          strokeWidth={2.5}
                          dot={{ fill: '#16a34a', r: 4 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                    </div>
                  </Column>
                </Grid>
              </div>

              {/* 3. Your Customers */}
              <div style={{ 
                marginTop: '24px',
                marginLeft: '24px',
                marginRight: '24px',
                backgroundColor: 'white',
                borderRadius: '8px',
                border: '1px solid var(--shopify-border)',
                padding: '24px'
              }}>
                <div style={{ marginBottom: '24px' }}>
                  <h3 style={{ fontSize: '20px', fontWeight: '600', color: 'var(--shopify-text-primary)', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <UserMultiple size={24} style={{ color: '#0f62fe' }} />
                    Your Customers
                  </h3>
                  <p style={{ fontSize: '14px', color: 'var(--shopify-text-secondary)', margin: 0 }}>
                    Demographics, interests, and shopping behavior
                  </p>
                </div>

                {/* Global Customer Distribution - World Map */}
                <div style={{ marginBottom: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <div style={{ fontSize: '15px', fontWeight: '600' }}>Global Customer Distribution</div>
                    {/* Metric and Region Filters */}
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                      {/* Metric Switcher */}
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <span style={{ fontSize: '13px', color: 'var(--shopify-text-secondary)' }}>View by:</span>
                        <select
                          value={selectedMetric}
                          onChange={(e) => setSelectedMetric(e.target.value as 'orders' | 'customers' | 'revenue' | 'cvr')}
                          style={{
                            padding: '6px 24px 6px 12px',
                            border: '1px solid var(--shopify-border)',
                            borderRadius: '6px',
                            backgroundColor: 'white',
                            fontSize: '13px',
                            color: 'var(--shopify-text-primary)',
                            cursor: 'pointer',
                            outline: 'none',
                            appearance: 'none',
                            backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'12\' height=\'8\' viewBox=\'0 0 12 8\' fill=\'none\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M1 1L6 6L11 1\' stroke=\'%236d7175\' stroke-width=\'2\' stroke-linecap=\'round\'/%3E%3C/svg%3E")',
                            backgroundRepeat: 'no-repeat',
                            backgroundPosition: 'right 8px center',
                            transition: 'border-color 0.15s ease',
                            minWidth: '140px'
                          }}
                        >
                          <option value="orders">Orders</option>
                          <option value="customers">Customers</option>
                          <option value="revenue">Revenue</option>
                          <option value="cvr">Conversion Rate</option>
                        </select>
                      </div>
                      {/* Region Filter */}
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <span style={{ fontSize: '13px', color: 'var(--shopify-text-secondary)' }}>Region:</span>
                        <select
                        value={mapRegion}
                        onChange={(e) => {
                          const region = e.target.value;
                          setMapRegion(region);
                          setSelectedCountry(null);
                          setSelectedCity(null);
                          setMapType('world');
                          // Update map center and zoom based on region
                          if (region === 'north-america') {
                            setMapCenter([-95, 40]);
                            setMapZoom(3);
                          } else if (region === 'europe') {
                            setMapCenter([15, 50]);
                            setMapZoom(3.5);
                          } else if (region === 'asia') {
                            setMapCenter([100, 30]);
                            setMapZoom(2.5);
                          } else if (region === 'oceania') {
                            setMapCenter([135, -25]);
                            setMapZoom(3.5);
                          } else {
                            setMapCenter([0, 20]);
                            setMapZoom(1);
                          }
                        }}
                        style={{
                          padding: '6px 24px 6px 12px',
                          border: '1px solid var(--shopify-border)',
                          borderRadius: '6px',
                          backgroundColor: 'white',
                          fontSize: '13px',
                          color: 'var(--shopify-text-primary)',
                          cursor: 'pointer',
                          outline: 'none',
                          appearance: 'none',
                          backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'12\' height=\'8\' viewBox=\'0 0 12 8\' fill=\'none\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M1 1L6 6L11 1\' stroke=\'%236d7175\' stroke-width=\'2\' stroke-linecap=\'round\'/%3E%3C/svg%3E")',
                          backgroundRepeat: 'no-repeat',
                          backgroundPosition: 'right 8px center',
                          transition: 'border-color 0.15s ease'
                        }}
                      >
                        <option value="north-america">North America</option>
                        <option value="europe">Europe</option>
                        <option value="asia">Asia</option>
                        <option value="oceania">Oceania</option>
                        <option value="global">Global View</option>
                      </select>
                      </div>
                    </div>
                  </div>
                  <Grid narrow style={{ marginLeft: 0, marginRight: 0, paddingLeft: 0, paddingRight: 0 }}>
                    <Column lg={8}>
                      {/* World Map Visualization */}
                      <div style={{ 
                        padding: '0px', 
                        backgroundColor: 'white',
                        border: '1px solid var(--shopify-border)',
                        borderRadius: '8px',
                        height: '320px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative'
                      }}>
                        <ComposableMap
                          projection={mapType === 'usa-states' ? "geoAlbersUsa" : "geoMercator"}
                          style={{ width: '100%', height: '100%' }}
                        >
                          <ZoomableGroup
                            center={mapType === 'usa-states' ? [-95, 40] : mapCenter}
                            zoom={mapType === 'usa-states' ? 1 : mapZoom}
                          >
                            {/* World Map */}
                            {mapType === 'world' && (
                              <Geographies geography="https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json">
                              {({ geographies }) => {
                                // Calculate max value for color scaling based on selected metric
                                const maxValue = Math.max(...customerDemographics.topCountries.map(c => {
                                  if (selectedMetric === 'orders') return c.sales;
                                  if (selectedMetric === 'customers') return c.customers;
                                  if (selectedMetric === 'revenue') return c.revenue;
                                  return c.cvr; // cvr
                                }));
                                
                                // Create a country name mapping for better matching
                                const countryNameMap: { [key: string]: string } = {
                                  'United States of America': 'United States',
                                  'United Kingdom': 'United Kingdom',
                                  'Canada': 'Canada',
                                  'Germany': 'Germany',
                                  'Australia': 'Australia',
                                  'France': 'France',
                                };
                                
                                return geographies.map((geo) => {
                                  const geoName = geo.properties.name;
                                  const mappedName = countryNameMap[geoName] || geoName;
                                  
                                  const countryData = customerDemographics.topCountries.find(
                                    (c) => c.country === mappedName
                                  );
                                  
                                  // Get the value based on selected metric
                                  let metricValue = 0;
                                  if (countryData) {
                                    if (selectedMetric === 'orders') metricValue = countryData.sales;
                                    else if (selectedMetric === 'customers') metricValue = countryData.customers;
                                    else if (selectedMetric === 'revenue') metricValue = countryData.revenue;
                                    else metricValue = countryData.cvr;
                                  }
                                  
                                  const isHighlighted = selectedCountry === countryData?.country;
                                  
                                  // Get highlight color based on selected metric
                                  const getHighlightColor = () => {
                                    if (selectedMetric === 'orders') return '#7256F6'; // Purple
                                    if (selectedMetric === 'customers') return '#1192E8'; // Blue
                                    if (selectedMetric === 'revenue') return '#16A34A'; // Green
                                    return '#F97316'; // Orange for CVR
                                  };
                                  
                                  // Calculate color intensity based on metric value (heatmap)
                                  // Use different colors for different metrics
                                  const getHeatmapColor = (value: number) => {
                                    if (value === 0) return '#f5f5f5';
                                    const intensity = value / maxValue;
                                    
                                    // Different color for each metric
                                    if (selectedMetric === 'orders') {
                                      // Purple for orders
                                      return `rgba(114, 86, 246, ${0.15 + intensity * 0.85})`;
                                    } else if (selectedMetric === 'customers') {
                                      // Blue for customers
                                      return `rgba(17, 146, 232, ${0.15 + intensity * 0.85})`;
                                    } else if (selectedMetric === 'revenue') {
                                      // Green for revenue
                                      return `rgba(22, 163, 74, ${0.15 + intensity * 0.85})`;
                                    } else {
                                      // Orange for CVR
                                      return `rgba(249, 115, 22, ${0.15 + intensity * 0.85})`;
                                    }
                                  };

                                  return (
                                    <Geography
                                      key={geo.rsmKey}
                                      geography={geo}
                                      fill={isHighlighted ? getHighlightColor() : getHeatmapColor(metricValue)}
                                      stroke="#ffffff"
                                      strokeWidth={0.5}
                                      onMouseMove={(e: any) => {
                                        if (countryData && e.clientX && e.clientY) {
                                          setTooltipPosition({ x: e.clientX, y: e.clientY });
                                          setHoveredRegion({
                                            name: countryData.country,
                                            sales: countryData.sales,
                                            customers: countryData.customers,
                                            revenue: countryData.revenue,
                                            cvr: countryData.cvr,
                                            percentage: countryData.percentage,
                                            trend: countryData.trend as 'up' | 'down',
                                            trendValue: countryData.trendValue
                                          });
                                        }
                                      }}
                                      onMouseOut={() => {
                                        setHoveredRegion(null);
                                      }}
                                      style={{
                                        default: { outline: 'none', cursor: 'pointer' },
                                        hover: {
                                          fill: getHighlightColor(),
                                          outline: 'none',
                                          cursor: 'pointer',
                                          opacity: 0.8
                                        },
                                        pressed: { outline: 'none' }
                                      }}
                                    />
                                  );
                                });
                              }}
                            </Geographies>
                            )}
                            
                            {/* USA States Map */}
                            {mapType === 'usa-states' && (
                              <Geographies geography="https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json">
                              {({ geographies }: { geographies: any }) => {
                                // Calculate max value for color scaling based on selected metric
                                const maxValue = Math.max(...Object.values(usaStatesSalesData).map(data => {
                                  if (selectedMetric === 'orders') return data.sales;
                                  if (selectedMetric === 'customers') return data.customers;
                                  if (selectedMetric === 'revenue') return data.revenue;
                                  return data.cvr;
                                }));
                                
                                return geographies.map((geo: any) => {
                                  const stateName = geo.properties.name;
                                  const stateData = usaStatesSalesData[stateName];
                                  const sales = stateData?.sales || 0;
                                  
                                  // Get the value based on selected metric
                                  let metricValue = 0;
                                  if (stateData) {
                                    if (selectedMetric === 'orders') metricValue = stateData.sales;
                                    else if (selectedMetric === 'customers') metricValue = stateData.customers;
                                    else if (selectedMetric === 'revenue') metricValue = stateData.revenue;
                                    else metricValue = stateData.cvr;
                                  }
                                  
                                  const isHighlighted = selectedCity && cityCoordinates[selectedCity]?.state === stateName;
                                  
                                  // Get highlight color based on selected metric
                                  const getHighlightColor = () => {
                                    if (selectedMetric === 'orders') return '#7256F6'; // Purple
                                    if (selectedMetric === 'customers') return '#1192E8'; // Blue
                                    if (selectedMetric === 'revenue') return '#16A34A'; // Green
                                    return '#F97316'; // Orange for CVR
                                  };
                                  
                                  // Calculate color intensity based on metric value (heatmap)
                                  // Use different colors for different metrics
                                  const getHeatmapColor = (value: number) => {
                                    if (value === 0) return '#f5f5f5';
                                    const intensity = value / maxValue;
                                    
                                    // Match the color to selected metric
                                    if (selectedMetric === 'orders') {
                                      return `rgba(114, 86, 246, ${0.15 + intensity * 0.85})`;
                                    } else if (selectedMetric === 'customers') {
                                      return `rgba(17, 146, 232, ${0.15 + intensity * 0.85})`;
                                    } else if (selectedMetric === 'revenue') {
                                      return `rgba(22, 163, 74, ${0.15 + intensity * 0.85})`;
                                    } else {
                                      return `rgba(249, 115, 22, ${0.15 + intensity * 0.85})`;
                                    }
                                  };
                                  
                                  return (
                                    <Geography
                                      key={geo.rsmKey}
                                      geography={geo}
                                      fill={isHighlighted ? getHighlightColor() : getHeatmapColor(metricValue)}
                                      stroke="#ffffff"
                                      strokeWidth={0.8}
                                      onMouseMove={(e: any) => {
                                        if (metricValue > 0 && e.clientX && e.clientY) {
                                          setTooltipPosition({ x: e.clientX, y: e.clientY });
                                          setHoveredRegion({
                                            name: stateName,
                                            sales: stateData?.sales || 0,
                                            customers: stateData?.customers,
                                            revenue: stateData?.revenue,
                                            cvr: stateData?.cvr
                                          });
                                        }
                                      }}
                                      onMouseOut={() => {
                                        setHoveredRegion(null);
                                      }}
                                      style={{
                                        default: { outline: 'none', cursor: 'pointer' },
                                        hover: {
                                          fill: getHighlightColor(),
                                          outline: 'none',
                                          cursor: 'pointer',
                                          opacity: 0.8
                                        },
                                        pressed: { outline: 'none' }
                                      }}
                                    />
                                  );
                                });
                              }}
                            </Geographies>
                            )}
                          </ZoomableGroup>
                        </ComposableMap>
                        
                        {/* Custom Tooltip */}
                        {hoveredRegion && (
                          <div style={{
                            position: 'fixed',
                            top: `${tooltipPosition.y - 120}px`,
                            left: `${tooltipPosition.x}px`,
                            transform: 'translateX(-50%)',
                            backgroundColor: 'white',
                            padding: '12px 16px',
                            borderRadius: '8px',
                            border: '1px solid var(--shopify-border)',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                            zIndex: 1000,
                            pointerEvents: 'none',
                            minWidth: '180px'
                          }}>
                            <div style={{ 
                              fontSize: '14px', 
                              fontWeight: '600', 
                              color: 'var(--shopify-text-primary)',
                              marginBottom: '8px'
                            }}>
                              {hoveredRegion.name}
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                              {/* Orders */}
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: '12px', color: 'var(--shopify-text-secondary)' }}>Orders:</span>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                  <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--shopify-text-primary)' }}>
                                    {hoveredRegion.sales.toLocaleString()}
                                  </span>
                                  {hoveredRegion.trend && (
                                    <div style={{ 
                                      display: 'flex', 
                                      alignItems: 'center', 
                                      gap: '2px',
                                      color: hoveredRegion.trend === 'up' ? '#16a34a' : '#dc2626',
                                      fontSize: '11px',
                                      fontWeight: '600'
                                    }}>
                                      {hoveredRegion.trend === 'up' ? <ArrowUp size={10} /> : <ArrowDown size={10} />}
                                      {hoveredRegion.trendValue}%
                                    </div>
                                  )}
                                </div>
                              </div>
                              {/* Customers */}
                              {hoveredRegion.customers !== undefined && (
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                  <span style={{ fontSize: '12px', color: 'var(--shopify-text-secondary)' }}>Customers:</span>
                                  <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--shopify-text-primary)' }}>
                                    {hoveredRegion.customers.toLocaleString()}
                                  </span>
                                </div>
                              )}
                              {/* Revenue */}
                              {hoveredRegion.revenue !== undefined && (
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                  <span style={{ fontSize: '12px', color: 'var(--shopify-text-secondary)' }}>Revenue:</span>
                                  <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--shopify-text-primary)' }}>
                                    ${hoveredRegion.revenue.toLocaleString()}
                                  </span>
                                </div>
                              )}
                              {/* Conversion Rate */}
                              {hoveredRegion.cvr !== undefined && (
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                  <span style={{ fontSize: '12px', color: 'var(--shopify-text-secondary)' }}>CVR:</span>
                                  <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--shopify-text-primary)' }}>
                                    {hoveredRegion.cvr.toFixed(1)}%
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                        
                        {/* Back to World Map Button */}
                        {mapType !== 'world' && (
                          <button
                            onClick={resetToWorldMap}
                            style={{
                              position: 'absolute',
                              top: '16px',
                              left: '16px',
                              backgroundColor: 'white',
                              padding: '8px 12px',
                              borderRadius: '6px',
                              border: '1px solid var(--shopify-border)',
                              fontSize: '12px',
                              fontWeight: '500',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
                              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                              zIndex: 10,
                              transition: 'all 0.15s ease'
                            }}
                            onMouseEnter={(e) => {
                              (e.currentTarget as HTMLElement).style.backgroundColor = '#f6f6f7';
                            }}
                            onMouseLeave={(e) => {
                              (e.currentTarget as HTMLElement).style.backgroundColor = 'white';
                            }}
                          >
                            ← Back to World Map
                          </button>
                        )}
                        
                        {/* Map Type Indicator */}
                        <div style={{
                          position: 'absolute',
                          top: '16px',
                          right: '16px',
                          backgroundColor: mapType === 'usa-states' ? 'rgba(114, 86, 246, 0.9)' : 'rgba(255, 255, 255, 0.9)',
                          padding: '6px 12px',
                          borderRadius: '6px',
                          fontSize: '11px',
                          color: mapType === 'usa-states' ? 'white' : '#6d7175',
                          fontWeight: '600',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                          zIndex: 10
                        }}>
                          {mapType === 'usa-states' ? '🇺🇸 USA States' : '🌍 World View'}
                        </div>
                        
                        {/* Drag hint (only show in world view) */}
                        {mapType === 'world' && (
                          <div style={{
                            position: 'absolute',
                            bottom: '16px',
                            left: '16px',
                            backgroundColor: 'rgba(255, 255, 255, 0.9)',
                            padding: '6px 10px',
                            borderRadius: '4px',
                            fontSize: '11px',
                            color: '#6d7175',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                          }}>
                            <span style={{ fontSize: '14px' }}>🖱️</span>
                            <span>Drag to pan, scroll to zoom</span>
                          </div>
                        )}
                        
                        {/* Legend */}
                        <div style={{
                          position: 'absolute',
                          bottom: '16px',
                          right: '16px',
                          backgroundColor: 'white',
                          padding: '8px 12px',
                          borderRadius: '6px',
                          border: '1px solid #e0e0e0',
                          fontSize: '11px',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <div style={{ 
                                width: '16px', 
                                height: '10px', 
                                background: selectedMetric === 'orders' 
                                  ? 'linear-gradient(to right, rgba(114, 86, 246, 0.2), rgba(114, 86, 246, 1))' 
                                  : selectedMetric === 'customers'
                                  ? 'linear-gradient(to right, rgba(17, 146, 232, 0.2), rgba(17, 146, 232, 1))'
                                  : selectedMetric === 'revenue'
                                  ? 'linear-gradient(to right, rgba(22, 163, 74, 0.2), rgba(22, 163, 74, 1))'
                                  : 'linear-gradient(to right, rgba(249, 115, 22, 0.2), rgba(249, 115, 22, 1))',
                                borderRadius: '2px' 
                              }}></div>
                              <span style={{ color: '#6d7175' }}>
                                {selectedMetric === 'orders' ? 'Orders' 
                                  : selectedMetric === 'customers' ? 'Customers'
                                  : selectedMetric === 'revenue' ? 'Revenue'
                                  : 'CVR'}
                              </span>
                            </div>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#999', marginTop: '2px' }}>
                            <span>Low</span>
                            <span style={{ marginLeft: '24px' }}>High</span>
                          </div>
                        </div>
                      </div>
                    </Column>
                    
                    <Column lg={4}>
                      {/* Ranked Country List */}
                      <div className="subtle-scrollbar" style={{ 
                        padding: '12px', 
                        backgroundColor: 'white',
                        border: '1px solid var(--shopify-border)',
                        borderRadius: '8px',
                        height: '320px',
                        overflowY: 'auto'
                      }}>
                        <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '16px', color: 'var(--shopify-text-primary)' }}>
                          Top Countries by {selectedMetric === 'orders' ? 'Orders' : selectedMetric === 'customers' ? 'Customers' : selectedMetric === 'revenue' ? 'Revenue' : 'CVR'}
                        </div>
                        {[...customerDemographics.topCountries]
                          .sort((a, b) => {
                            if (selectedMetric === 'orders') return b.sales - a.sales;
                            if (selectedMetric === 'customers') return b.customers - a.customers;
                            if (selectedMetric === 'revenue') return b.revenue - a.revenue;
                            return b.cvr - a.cvr;
                          })
                          .map((country, index) => {
                          const totalValue = customerDemographics.topCountries.reduce((sum, c) => {
                            if (selectedMetric === 'orders') return sum + c.sales;
                            if (selectedMetric === 'customers') return sum + c.customers;
                            if (selectedMetric === 'revenue') return sum + c.revenue;
                            return sum + c.cvr;
                          }, 0);
                          
                          const countryValue = selectedMetric === 'orders' ? country.sales : 
                                             selectedMetric === 'customers' ? country.customers :
                                             selectedMetric === 'revenue' ? country.revenue : country.cvr;
                          const barWidth = (countryValue / totalValue) * 100;
                          
                          return (
                            <div 
                              key={index}
                              style={{ 
                                padding: '8px 0px',
                                borderBottom: index < customerDemographics.topCountries.length - 1 ? '1px solid #f0f0f0' : 'none',
                                cursor: 'pointer',
                                borderRadius: '6px',
                                backgroundColor: selectedCountry === country.country ? '#f0edff' : 'transparent',
                                transition: 'background-color 0.15s ease'
                              }}
                              onClick={() => handleCountryClick(country.country)}
                              onMouseEnter={(e) => {
                                if (selectedCountry !== country.country) {
                                  e.currentTarget.style.backgroundColor = '#f9f9f9';
                                }
                              }}
                              onMouseLeave={(e) => {
                                if (selectedCountry !== country.country) {
                                  e.currentTarget.style.backgroundColor = 'transparent';
                                }
                              }}
                            >
                              {/* Top row: rank, country name, value, trend */}
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: 0 }}>
                                  <span style={{ 
                                    fontSize: '12px',
                                    fontWeight: '600',
                                    color: '#999',
                                    minWidth: '14px',
                                    flexShrink: 0
                                  }}>
                                    {index + 1}
                                  </span>
                                  <span style={{ 
                                    fontSize: '12px', 
                                    fontWeight: selectedCountry === country.country ? '600' : (index === 0 ? '600' : '500'),
                                    color: selectedCountry === country.country ? '#7256F6' : 'var(--shopify-text-primary)',
                                    overflow: 'visible',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                    textDecoration: selectedCountry === country.country ? 'underline' : 'none'
                                  }}>
                                    {country.country}
                                  </span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
                                  <span style={{ 
                                    fontSize: '11px', 
                                    fontWeight: '600',
                                    color: 'var(--shopify-text-primary)',
                                    minWidth: '50px',
                                    textAlign: 'right'
                                  }}>
                                    {selectedMetric === 'orders' ? country.sales.toLocaleString() :
                                     selectedMetric === 'customers' ? country.customers.toLocaleString() :
                                     selectedMetric === 'revenue' ? `$${country.revenue.toLocaleString()}` :
                                     `${country.cvr.toFixed(1)}%`}
                                  </span>
                                  <div style={{ 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    gap: '2px',
                                    color: country.trend === 'up' ? '#16a34a' : '#dc2626',
                                    fontSize: '11px',
                                    fontWeight: '500',
                                    minWidth: '50px'
                                  }}>
                                    {country.trend === 'up' ? (
                                      <ArrowUp size={12} />
                                    ) : (
                                      <ArrowDown size={12} />
                                    )}
                                    <span>{country.trendValue}%</span>
                                  </div>
                                </div>
                              </div>
                              
                              {/* Bottom row: horizontal bar */}
                              <div style={{ 
                                width: 'calc(100% - 28px)',
                                height: '4px', 
                                backgroundColor: '#e8e8e8', 
                                borderRadius: '2px',
                                overflow: 'hidden',
                                marginLeft: '28px'
                              }}>
                                <div style={{ 
                                  width: `${barWidth}%`, 
                                  height: '100%', 
                                  backgroundColor: selectedCountry === country.country ? '#7256F6' : '#0f62fe',
                                  borderRadius: '2px',
                                  transition: 'width 0.3s ease'
                                }} />
                              </div>
                            </div>
                          );
                        })}
                        <div style={{ 
                          marginTop: '16px', 
                          padding: '10px',
                          backgroundColor: '#f6f6f7',
                          borderRadius: '6px',
                          fontSize: '11px',
                          color: 'var(--shopify-text-secondary)',
                          textAlign: 'center'
                        }}>
                          {selectedMetric === 'orders' ? 
                            (() => {
                              const listTotal = customerDemographics.topCountries.reduce((sum, country) => sum + country.sales, 0);
                              const globalTotal = customerDemographics.totals.orders;
                              const percentage = ((listTotal / globalTotal) * 100).toFixed(1);
                              return `${listTotal.toLocaleString()} / ${globalTotal.toLocaleString()} orders (${percentage}%)`;
                            })() :
                           selectedMetric === 'customers' ? 
                            (() => {
                              const listTotal = customerDemographics.topCountries.reduce((sum, country) => sum + country.customers, 0);
                              const globalTotal = customerDemographics.totals.customers;
                              const percentage = ((listTotal / globalTotal) * 100).toFixed(1);
                              return `${listTotal.toLocaleString()} / ${globalTotal.toLocaleString()} customers (${percentage}%)`;
                            })() :
                           selectedMetric === 'revenue' ? 
                            (() => {
                              const listTotal = customerDemographics.topCountries.reduce((sum, country) => sum + country.revenue, 0);
                              const globalTotal = customerDemographics.totals.revenue;
                              const percentage = ((listTotal / globalTotal) * 100).toFixed(1);
                              return `$${listTotal.toLocaleString()} / $${globalTotal.toLocaleString()} revenue (${percentage}%)`;
                            })() :
                           `${(customerDemographics.topCountries.reduce((sum, country) => sum + country.cvr, 0) / customerDemographics.topCountries.length).toFixed(1)}% avg CVR`}
                        </div>
                      </div>
                    </Column>
                    
                    <Column lg={4}>
                      {/* Ranked City List */}
                      <div className="subtle-scrollbar" style={{ 
                        padding: '12px', 
                        backgroundColor: 'white',
                        border: '1px solid var(--shopify-border)',
                        borderRadius: '8px',
                        height: '320px',
                        overflowY: 'auto'
                      }}>
                        <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '16px', color: 'var(--shopify-text-primary)' }}>
                          Top Cities by {selectedMetric === 'orders' ? 'Orders' : selectedMetric === 'customers' ? 'Customers' : selectedMetric === 'revenue' ? 'Revenue' : 'CVR'}
                        </div>
                        {[...customerDemographics.topCities]
                          .sort((a, b) => {
                            if (selectedMetric === 'orders') return b.sales - a.sales;
                            if (selectedMetric === 'customers') return b.customers - a.customers;
                            if (selectedMetric === 'revenue') return b.revenue - a.revenue;
                            return b.cvr - a.cvr;
                          })
                          .map((city, index) => {
                          const totalValue = customerDemographics.topCities.reduce((sum, c) => {
                            if (selectedMetric === 'orders') return sum + c.sales;
                            if (selectedMetric === 'customers') return sum + c.customers;
                            if (selectedMetric === 'revenue') return sum + c.revenue;
                            return sum + c.cvr;
                          }, 0);
                          
                          const cityValue = selectedMetric === 'orders' ? city.sales : 
                                           selectedMetric === 'customers' ? city.customers :
                                           selectedMetric === 'revenue' ? city.revenue : city.cvr;
                          const barWidth = (cityValue / totalValue) * 100;
                          
                          return (
                            <div 
                              key={index}
                              onClick={() => handleCityClick(city.city, city.country)}
                              style={{ 
                                padding: '8px 0px',
                                borderBottom: index < customerDemographics.topCities.length - 1 ? '1px solid #f0f0f0' : 'none',
                                cursor: 'pointer',
                                borderRadius: '6px',
                                transition: 'background-color 0.15s ease',
                                backgroundColor: selectedCity === city.city ? 'rgba(114, 86, 246, 0.08)' : 'transparent'
                              }}
                              onMouseEnter={(e) => {
                                if (selectedCity !== city.city) {
                                  (e.currentTarget as HTMLElement).style.backgroundColor = '#f6f6f7';
                                }
                              }}
                              onMouseLeave={(e) => {
                                if (selectedCity !== city.city) {
                                  (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
                                }
                              }}
                            >
                              {/* Top row: rank, city name/country, value, trend */}
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: 0 }}>
                                  <span style={{ 
                                    fontSize: '12px',
                                    fontWeight: '600',
                                    color: '#999',
                                    minWidth: '14px',
                                    flexShrink: 0
                                  }}>
                                    {index + 1}
                                  </span>
                                  <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ 
                                      fontSize: '12px', 
                                      fontWeight: (index === 0 || selectedCity === city.city) ? '600' : '500',
                                      color: selectedCity === city.city ? '#7256F6' : 'var(--shopify-text-primary)',
                                      overflow: 'hidden',
                                      textOverflow: 'ellipsis',
                                      whiteSpace: 'nowrap'
                                    }}>
                                      {city.city}
                                    </div>
                                    <div style={{ 
                                      fontSize: '11px', 
                                      color: 'var(--shopify-text-secondary)',
                                      marginTop: '2px'
                                    }}>
                                      {city.country}
                                    </div>
                                  </div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
                                  <span style={{ 
                                    fontSize: '11px', 
                                    fontWeight: '600',
                                    color: 'var(--shopify-text-primary)',
                                    minWidth: '50px',
                                    textAlign: 'right'
                                  }}>
                                    {selectedMetric === 'orders' ? city.sales.toLocaleString() :
                                     selectedMetric === 'customers' ? city.customers.toLocaleString() :
                                     selectedMetric === 'revenue' ? `$${city.revenue.toLocaleString()}` :
                                     `${city.cvr.toFixed(1)}%`}
                                  </span>
                                  <div style={{ 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    gap: '2px',
                                    color: city.trend === 'up' ? '#16a34a' : '#dc2626',
                                    fontSize: '11px',
                                    fontWeight: '500',
                                    minWidth: '50px'
                                  }}>
                                    {city.trend === 'up' ? (
                                      <ArrowUp size={12} />
                                    ) : (
                                      <ArrowDown size={12} />
                                    )}
                                    <span>{city.trendValue}%</span>
                                  </div>
                                </div>
                              </div>
                              
                              {/* Bottom row: horizontal bar */}
                              <div style={{ 
                                width: 'calc(100% - 28px)',
                                height: '4px', 
                                backgroundColor: '#e8e8e8', 
                                borderRadius: '2px',
                                overflow: 'hidden',
                                marginLeft: '28px'
                              }}>
                                <div style={{ 
                                  width: `${barWidth}%`, 
                                  height: '100%', 
                                  backgroundColor: selectedCity === city.city ? '#7256F6' : '#0f62fe',
                                  borderRadius: '2px',
                                  transition: 'width 0.3s ease'
                                }} />
                              </div>
                            </div>
                          );
                        })}
                        <div style={{ 
                          marginTop: '16px', 
                          padding: '10px',
                          backgroundColor: '#f6f6f7',
                          borderRadius: '6px',
                          fontSize: '11px',
                          color: 'var(--shopify-text-secondary)',
                          textAlign: 'center'
                        }}>
                          {selectedMetric === 'orders' ? 
                            (() => {
                              const listTotal = customerDemographics.topCities.reduce((sum, city) => sum + city.sales, 0);
                              const globalTotal = customerDemographics.totals.orders;
                              const percentage = ((listTotal / globalTotal) * 100).toFixed(1);
                              return `${listTotal.toLocaleString()} / ${globalTotal.toLocaleString()} orders (${percentage}%)`;
                            })() :
                           selectedMetric === 'customers' ? 
                            (() => {
                              const listTotal = customerDemographics.topCities.reduce((sum, city) => sum + city.customers, 0);
                              const globalTotal = customerDemographics.totals.customers;
                              const percentage = ((listTotal / globalTotal) * 100).toFixed(1);
                              return `${listTotal.toLocaleString()} / ${globalTotal.toLocaleString()} customers (${percentage}%)`;
                            })() :
                           selectedMetric === 'revenue' ? 
                            (() => {
                              const listTotal = customerDemographics.topCities.reduce((sum, city) => sum + city.revenue, 0);
                              const globalTotal = customerDemographics.totals.revenue;
                              const percentage = ((listTotal / globalTotal) * 100).toFixed(1);
                              return `$${listTotal.toLocaleString()} / $${globalTotal.toLocaleString()} revenue (${percentage}%)`;
                            })() :
                           `${(customerDemographics.topCities.reduce((sum, city) => sum + city.cvr, 0) / customerDemographics.topCities.length).toFixed(1)}% avg CVR`}
                        </div>
                      </div>
                    </Column>
                  </Grid>
                </div>

                {/* Regional Performance Insights */}
                <div style={{ marginBottom: '24px' }}>
                  <Grid narrow style={{ marginLeft: 0, marginRight: 0, paddingLeft: 0, paddingRight: 0 }}>
                    <Column lg={16} style={{ paddingLeft: 0, paddingRight: 0 }}>
                      <div style={{ 
                        backgroundColor: 'white', 
                        padding: '20px 24px',
                        borderRadius: '8px',
                        border: '1px solid var(--shopify-border)'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                          <ChartLineSmooth size={18} style={{ color: '#7256F6' }} />
                          <span style={{ fontSize: '15px', fontWeight: '600', color: 'var(--shopify-text-primary)' }}>
                            Regional Performance Insights
                          </span>
                        </div>
                        
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
                          {/* Highest CVR */}
                          <div style={{ 
                            padding: '12px 16px',
                            backgroundColor: '#fef3f2',
                            borderRadius: '6px',
                            borderLeft: '3px solid #F97316'
                          }}>
                            <div style={{ fontSize: '11px', color: 'var(--shopify-text-secondary)', marginBottom: '4px', fontWeight: '500' }}>
                              🎯 Highest Conversion Rate
                            </div>
                            <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--shopify-text-primary)' }}>
                              {(() => {
                                const highest = [...customerDemographics.topCountries].sort((a, b) => b.cvr - a.cvr)[0];
                                return `${highest.country} (${highest.cvr.toFixed(1)}%)`;
                              })()}
                            </div>
                          </div>

                          {/* Most Customers */}
                          <div style={{ 
                            padding: '12px 16px',
                            backgroundColor: '#eff8ff',
                            borderRadius: '6px',
                            borderLeft: '3px solid #1192E8'
                          }}>
                            <div style={{ fontSize: '11px', color: 'var(--shopify-text-secondary)', marginBottom: '4px', fontWeight: '500' }}>
                              👥 Most Customers
                            </div>
                            <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--shopify-text-primary)' }}>
                              {(() => {
                                const highest = [...customerDemographics.topCountries].sort((a, b) => b.customers - a.customers)[0];
                                return `${highest.country} (${highest.customers.toLocaleString()} unique)`;
                              })()}
                            </div>
                          </div>

                          {/* Highest Revenue */}
                          <div style={{ 
                            padding: '12px 16px',
                            backgroundColor: '#f0fdf4',
                            borderRadius: '6px',
                            borderLeft: '3px solid #16A34A'
                          }}>
                            <div style={{ fontSize: '11px', color: 'var(--shopify-text-secondary)', marginBottom: '4px', fontWeight: '500' }}>
                              💰 Highest Revenue
                            </div>
                            <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--shopify-text-primary)' }}>
                              {(() => {
                                const highest = [...customerDemographics.topCountries].sort((a, b) => b.revenue - a.revenue)[0];
                                return `${highest.country} ($${highest.revenue.toLocaleString()})`;
                              })()}
                            </div>
                          </div>

                          {/* Fastest Growing */}
                          <div style={{ 
                            padding: '12px 16px',
                            backgroundColor: '#faf5ff',
                            borderRadius: '6px',
                            borderLeft: '3px solid #7256F6'
                          }}>
                            <div style={{ fontSize: '11px', color: 'var(--shopify-text-secondary)', marginBottom: '4px', fontWeight: '500' }}>
                              📈 Fastest Growing
                            </div>
                            <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--shopify-text-primary)' }}>
                              {(() => {
                                const fastest = [...customerDemographics.topCountries]
                                  .filter(c => c.trend === 'up')
                                  .sort((a, b) => (b.trendValue || 0) - (a.trendValue || 0))[0];
                                return fastest ? `${fastest.country} (+${fastest.trendValue}%)` : 'N/A';
                              })()}
                            </div>
                          </div>
                        </div>
                      </div>
                    </Column>
                  </Grid>
                </div>

                {/* Customer Interests */}
                <div style={{ marginBottom: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <div style={{ fontSize: '15px', fontWeight: '600' }}>Customer Interests</div>
                  </div>
                  <Grid narrow style={{ marginLeft: 0, marginRight: 0, paddingLeft: 0, paddingRight: 0 }}>
                    <Column lg={16} style={{ paddingLeft: 0, paddingRight: 0 }}>
                      <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                        <div style={{ flex: '0 0 380px' }}>
                          <ResponsiveContainer width="100%" height={280}>
                            <PieChart>
                              <Pie
                                data={customerDemographics.interests}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={(props: any) => {
                                  const { cx, cy, midAngle, innerRadius, outerRadius, category, value } = props;
                                  const RADIAN = Math.PI / 180;
                                  const radius = outerRadius + 10;
                                  const x = cx + radius * Math.cos(-midAngle * RADIAN);
                                  const y = cy + radius * Math.sin(-midAngle * RADIAN);
                                  
                                  return (
                                    <text
                                      x={x}
                                      y={y}
                                      fill="#6d7175"
                                      textAnchor={x > cx ? 'start' : 'end'}
                                      dominantBaseline="central"
                                      fontSize="11px"
                                      fontWeight="500"
                                    >
                                      {`${category}: ${value}%`}
                                    </text>
                                  );
                                }}
                                outerRadius={110}
                                fill="#8884d8"
                                dataKey="value"
                              >
                                {customerDemographics.interests.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                              </Pie>
                              <Tooltip formatter={(value: any) => [`${value}%`, 'Interest %']} />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                        <div style={{ 
                          flex: 1, 
                          display: 'flex', 
                          flexDirection: 'column', 
                          gap: '12px',
                          padding: '16px',
                          backgroundColor: '#f9f9f9',
                          border: '1px solid #e0e0e0',
                          borderRadius: '6px'
                        }}>
                          {customerDemographics.interests.map((interest, index) => (
                            <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                              <div style={{ 
                                width: '12px', 
                                height: '12px', 
                                borderRadius: '3px',
                                backgroundColor: interest.color 
                              }}></div>
                              <span style={{ fontSize: '12px', color: 'var(--shopify-text-primary)', fontWeight: '500', minWidth: '140px' }}>
                                {interest.category}
                              </span>
                              <div style={{ 
                                flex: 1,
                                height: '8px',
                                backgroundColor: '#f0f0f0',
                                borderRadius: '4px',
                                overflow: 'hidden'
                              }}>
                                <div style={{ 
                                  width: `${interest.value}%`,
                                  height: '100%',
                                  backgroundColor: interest.color,
                                  borderRadius: '4px'
                                }}></div>
                              </div>
                              <span style={{ fontSize: '12px', fontWeight: '600', color: interest.color, minWidth: '40px', textAlign: 'right' }}>
                                {interest.value}%
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </Column>
                  </Grid>
                </div>

                {/* Shopping behavior insights */}
                <div style={{ 
                  marginTop: '24px', 
                  padding: '20px', 
                  backgroundColor: '#f6f6f7', 
                  borderRadius: '8px',
                  display: 'flex',
                  gap: '32px'
                }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '13px', color: 'var(--shopify-text-secondary)', marginBottom: '4px' }}>Peak Shopping Time</div>
                    <div style={{ fontSize: '18px', fontWeight: '600', color: 'var(--shopify-text-primary)' }}>7-9 PM</div>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '13px', color: 'var(--shopify-text-secondary)', marginBottom: '4px' }}>Peak Shopping Day</div>
                    <div style={{ fontSize: '18px', fontWeight: '600', color: 'var(--shopify-text-primary)' }}>Fri, Sat, Sun</div>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '13px', color: 'var(--shopify-text-secondary)', marginBottom: '4px' }}>Preferred Device</div>
                    <div style={{ fontSize: '18px', fontWeight: '600', color: 'var(--shopify-text-primary)' }}>Mobile (68%)</div>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '13px', color: 'var(--shopify-text-secondary)', marginBottom: '4px' }}>Most Popular</div>
                    <div style={{ fontSize: '18px', fontWeight: '600', color: 'var(--shopify-text-primary)' }}>Clothing</div>
                  </div>
                </div>
              </div>

              {/* 4. What's Working */}
              <div style={{ 
                marginTop: '24px',
                marginLeft: '24px',
                marginRight: '24px',
                backgroundColor: 'white',
                borderRadius: '8px',
                border: '1px solid var(--shopify-border)',
                padding: '24px'
              }}>
                <div style={{ marginBottom: '24px' }}>
                  <h3 style={{ fontSize: '20px', fontWeight: '600', color: 'var(--shopify-text-primary)', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Star size={24} style={{ color: '#d97706' }} />
                    What's Working Best for You
                  </h3>
                  <p style={{ fontSize: '14px', color: 'var(--shopify-text-secondary)', margin: 0 }}>
                    Top performing products, ads, and traffic sources
                  </p>
                </div>
                
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableHeader>Item</TableHeader>
                      <TableHeader>Type</TableHeader>
                      <TableHeader>Clicks</TableHeader>
                      <TableHeader>Conversions</TableHeader>
                      <TableHeader>CVR</TableHeader>
                      <TableHeader>Revenue</TableHeader>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {topPerformingItems.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            {item.name}
                            {item.tag && (
                              <Tag type="green" size="sm">{item.tag}</Tag>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{item.type}</TableCell>
                        <TableCell>{item.clicks.toLocaleString()}</TableCell>
                        <TableCell>{item.conversions}</TableCell>
                        <TableCell>
                          <span style={{ fontWeight: '600', color: item.cvr >= 14 ? '#16a34a' : 'inherit' }}>
                            {item.cvr}%
                          </span>
                        </TableCell>
                        <TableCell style={{ fontWeight: '600' }}>${item.revenue.toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* 5. Learn from Top Performers */}
              <div style={{ 
                marginTop: '24px',
                marginLeft: '24px',
                marginRight: '24px',
                backgroundColor: 'white',
                borderRadius: '8px',
                border: '1px solid var(--shopify-border)',
                padding: '24px'
              }}>
                <div style={{ marginBottom: '24px' }}>
                  <h3 style={{ fontSize: '20px', fontWeight: '600', color: 'var(--shopify-text-primary)', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Trophy size={24} style={{ color: '#8a3ffc' }} />
                    Learn from Top Performers
                  </h3>
                  <p style={{ fontSize: '14px', color: 'var(--shopify-text-secondary)', margin: 0 }}>
                    Success patterns and best practices from high-earning sellers
                  </p>
                </div>
                
                <Grid narrow>
                  <Column lg={8}>
                    <div style={{ 
                      padding: '20px', 
                      backgroundColor: '#f0edff', 
                      borderRadius: '8px', 
                      border: '1px solid #e0d9ff',
                      height: '100%'
                    }}>
                      <div style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px', color: '#7256F6', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Video size={20} />
                        Video Content Advantage
                      </div>
                      <div style={{ fontSize: '14px', color: '#6d7175', lineHeight: '1.6', marginBottom: '16px' }}>
                        Sellers using video in their posts see <strong>25% higher conversion rates</strong> and <strong>40% more engagement</strong> compared to image-only content.
                      </div>
                      <Button size="sm" kind="ghost" style={{ color: '#7256F6' }}>
                        Try video content →
                      </Button>
                    </div>
                  </Column>
                  
                  <Column lg={8}>
                    <div style={{ 
                      padding: '20px', 
                      backgroundColor: '#e8f4f8', 
                      borderRadius: '8px', 
                      border: '1px solid #d0e8f2',
                      height: '100%'
                    }}>
                      <div style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px', color: '#0f62fe', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Camera size={20} />
                        Image Best Practice
                      </div>
                      <div style={{ fontSize: '14px', color: '#6d7175', lineHeight: '1.6', marginBottom: '16px' }}>
                        Top performers use <strong>3-5 product images</strong> per post, including lifestyle shots and close-ups for higher trust and conversions.
                      </div>
                      <Button size="sm" kind="ghost" style={{ color: '#0f62fe' }}>
                        See examples →
                      </Button>
                    </div>
                  </Column>
                </Grid>

                <Grid narrow style={{ marginTop: '16px' }}>
                  <Column lg={8}>
                    <div style={{ 
                      padding: '20px', 
                      backgroundColor: '#e6f4ea', 
                      borderRadius: '8px', 
                      border: '1px solid #c6e7d0',
                      height: '100%'
                    }}>
                      <div style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px', color: '#16a34a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Time size={20} />
                        Timing Optimization
                      </div>
                      <div style={{ fontSize: '14px', color: '#6d7175', lineHeight: '1.6', marginBottom: '16px' }}>
                        Posts published on <strong>weekend evenings (7-9 PM)</strong> get <strong>2x more engagement</strong> and 35% better click-through rates.
                      </div>
                      <Button size="sm" kind="ghost" style={{ color: '#16a34a' }}>
                        Optimize schedule →
                      </Button>
                    </div>
                  </Column>
                  
                  <Column lg={8}>
                    <div style={{ 
                      padding: '20px', 
                      backgroundColor: '#fef3e6', 
                      borderRadius: '8px', 
                      border: '1px solid #fde3c4',
                      height: '100%'
                    }}>
                      <div style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px', color: '#d97706', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Chat size={20} />
                        Social Proof Works
                      </div>
                      <div style={{ fontSize: '14px', color: '#6d7175', lineHeight: '1.6', marginBottom: '16px' }}>
                        Including <strong>customer reviews and ratings</strong> in product descriptions increases conversions by <strong>18%</strong> on average.
                      </div>
                      <Button size="sm" kind="ghost" style={{ color: '#d97706' }}>
                        Add reviews →
                      </Button>
                    </div>
                  </Column>
                </Grid>
              </div>

              {/* 6. Recommended Actions */}
              <div style={{ 
                marginTop: '24px',
                marginLeft: '24px',
                marginRight: '24px',
                marginBottom: '24px',
                backgroundColor: 'white',
                borderRadius: '8px',
                border: '1px solid var(--shopify-border)',
                padding: '24px'
              }}>
                <div style={{ marginBottom: '24px' }}>
                  <h3 style={{ fontSize: '20px', fontWeight: '600', color: 'var(--shopify-text-primary)', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Idea size={24} style={{ color: '#f1c21b' }} />
                    Recommended Actions
                  </h3>
                  <p style={{ fontSize: '14px', color: 'var(--shopify-text-secondary)', margin: 0 }}>
                    AI-powered suggestions to maximize your earnings
                  </p>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ 
                    padding: '20px', 
                    backgroundColor: '#f6f6f7', 
                    borderRadius: '8px',
                    border: '1px solid #e0e0e0',
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center' 
                  }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ marginBottom: '8px' }}>
                        <Tag type="purple" size="sm">High Impact</Tag>
                      </div>
                      <div style={{ fontSize: '16px', fontWeight: '500', marginBottom: '6px', color: 'var(--shopify-text-primary)' }}>
                        Promote "Wireless Earbuds Pro" - trending in your area
                      </div>
                      <div style={{ fontSize: '14px', color: 'var(--shopify-text-secondary)' }}>
                        Expected <strong>+$2,400 revenue</strong> this month based on current trends
                      </div>
                    </div>
                    <Button size="sm">Start promoting</Button>
                  </div>
                  
                  <div style={{ 
                    padding: '20px', 
                    backgroundColor: '#f6f6f7', 
                    borderRadius: '8px',
                    border: '1px solid #e0e0e0',
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center' 
                  }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ marginBottom: '8px' }}>
                        <Tag type="cyan" size="sm">Quick Win</Tag>
                      </div>
                      <div style={{ fontSize: '16px', fontWeight: '500', marginBottom: '6px', color: 'var(--shopify-text-primary)' }}>
                        Post earlier in the day for better engagement
                      </div>
                      <div style={{ fontSize: '14px', color: 'var(--shopify-text-secondary)' }}>
                        Your CTR drops <strong>40% after 8pm</strong> - schedule posts for 6-8pm instead
                      </div>
                    </div>
                    <Button size="sm" kind="secondary">Learn more</Button>
                  </div>
                  
                  <div style={{ 
                    padding: '20px', 
                    backgroundColor: '#f6f6f7', 
                    borderRadius: '8px',
                    border: '1px solid #e0e0e0',
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center' 
                  }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ marginBottom: '8px' }}>
                        <Tag type="green" size="sm">New Opportunity</Tag>
                      </div>
                      <div style={{ fontSize: '16px', fontWeight: '500', marginBottom: '6px', color: 'var(--shopify-text-primary)' }}>
                        Target customers in New York - high conversion potential
                      </div>
                      <div style={{ fontSize: '14px', color: 'var(--shopify-text-secondary)' }}>
                        NY customers have <strong>22% higher AOV</strong> and convert at 16.2%
                      </div>
                    </div>
                    <Button size="sm" kind="secondary">Explore</Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default PartnerPerformanceDashboard;
