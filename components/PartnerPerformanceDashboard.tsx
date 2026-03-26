'use client';
/// <reference lib="dom" />

import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
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
  TextInput,
  IconButton,
  Modal,
  TabsVertical,
  TabListVertical,
  Tab,
  TabPanels,
  TabPanel,
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
  Camera,
  Time,
  Chat,
  Application,
  Email,
  Image,
  Locked,
  Help,
  Favorite,
  Upload,
  CheckmarkFilled,
  Add,
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
  ZAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LabelList,
  ScatterChart,
  Scatter,
  ReferenceLine,
  ReferenceArea,
} from 'recharts';
import { ComposableMap, Geographies, Geography, ZoomableGroup } from 'react-simple-maps';
import {
  mockPartnerPlans,
  mockWebsitePerformance,
  mockCreatorPerformance,
  mockRevenueData,
  mockPreviousPeriodData,
  mockOrganizationSettings,
  mockTeamMembers,
  type PartnerPlans,
} from '@/lib/mockData';
import {
  STANDARD_TIMEZONE_OPTIONS,
  getTimezoneTypeaheadString,
  isStandardTimezoneId,
  type StandardTimezoneOption,
} from '@/lib/standardTimezones';
import {
  DISPLAY_LANGUAGE_OPTIONS,
  SETTINGS_I18N,
  isSupportedLocale,
  type DisplayLanguageOption,
  type SupportedLocale,
} from '@/lib/i18n/settings';
import { CreatorDashboardView } from '@/components/CreatorDashboardView';
import { SettingsFilterableSelect } from '@/components/SettingsFilterableSelect';
import { cn } from '@/lib/utils';

/** Settings currency options — same `{ value, label }` shape as timezone Dropdown items */
const CURRENCY_COMBO_ITEMS: readonly StandardTimezoneOption[] = [
  { value: 'USD', label: 'USD (US Dollar)' },
  { value: 'EUR', label: 'EUR (Euro)' },
  { value: 'GBP', label: 'GBP (British Pound)' },
  { value: 'JPY', label: 'JPY (Japanese Yen)' },
  { value: 'CAD', label: 'CAD (Canadian Dollar)' },
  { value: 'AUD', label: 'AUD (Australian Dollar)' },
  { value: 'CHF', label: 'CHF (Swiss Franc)' },
  { value: 'KRW', label: 'KRW (Korean Won)' },
];

const NON_COUNTRY_REGION_CODES = new Set(['EU', 'EZ', 'UN', 'XA', 'XB', 'ZZ']);

const toFlagEmoji = (countryCode: string): string => {
  const upperCode = countryCode.toUpperCase();
  return String.fromCodePoint(
    ...upperCode.split('').map((char) => 127397 + char.charCodeAt(0))
  );
};

const buildCountryOfBusinessItems = (): StandardTimezoneOption[] => {
  const displayNames = new Intl.DisplayNames(['en'], { type: 'region' });
  const items: StandardTimezoneOption[] = [];

  for (let i = 65; i <= 90; i += 1) {
    for (let j = 65; j <= 90; j += 1) {
      const code = String.fromCharCode(i, j);
      if (NON_COUNTRY_REGION_CODES.has(code)) continue;
      const displayName = displayNames.of(code);
      if (!displayName || displayName === code || displayName.startsWith('Unknown Region')) continue;
      items.push({ value: code, label: `${toFlagEmoji(code)} ${displayName}` });
    }
  }

  return items.sort((a, b) => a.label.localeCompare(b.label));
};


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
    { location: 'Washington', percentage: 12, sales: 195, trend: 'up', trendValue: 7.1 },
    { location: 'Georgia', percentage: 11, sales: 178, trend: 'up', trendValue: 4.0 },
    { location: 'Arizona', percentage: 9, sales: 145, trend: 'down', trendValue: 1.2 },
    { location: 'Colorado', percentage: 8, sales: 132, trend: 'up', trendValue: 6.3 },
    { location: 'North Carolina', percentage: 7, sales: 118, trend: 'up', trendValue: 2.9 },
  ],
  topCountries: [
    { country: 'United States', iso: 'USA', percentage: 45, sales: 1820, customers: 1245, revenue: 78450, cvr: 14.2, trend: 'up', trendValue: 5.2, mobile: 68, desktop: 32 },
    { country: 'United Kingdom', iso: 'GBR', percentage: 18, sales: 730, customers: 512, revenue: 45200, cvr: 16.8, trend: 'down', trendValue: 2.8, mobile: 62, desktop: 38 },
    { country: 'Canada', iso: 'CAN', percentage: 12, sales: 485, customers: 358, revenue: 28900, cvr: 15.3, trend: 'up', trendValue: 8.5, mobile: 65, desktop: 35 },
    { country: 'Germany', iso: 'DEU', percentage: 10, sales: 405, customers: 298, revenue: 32650, cvr: 18.5, trend: 'up', trendValue: 12.3, mobile: 58, desktop: 42 },
    { country: 'Australia', iso: 'AUS', percentage: 8, sales: 325, customers: 245, revenue: 31370, cvr: 17.2, trend: 'up', trendValue: 6.7, mobile: 72, desktop: 28 },
    { country: 'France', iso: 'FRA', percentage: 7, sales: 285, customers: 198, revenue: 21950, cvr: 13.8, trend: 'down', trendValue: 1.5, mobile: 60, desktop: 40 },
    { country: 'Japan', iso: 'JPN', percentage: 5, sales: 198, customers: 142, revenue: 18720, cvr: 15.1, trend: 'up', trendValue: 9.2, mobile: 78, desktop: 22 },
    { country: 'Netherlands', iso: 'NLD', percentage: 4, sales: 165, customers: 118, revenue: 15200, cvr: 16.2, trend: 'up', trendValue: 4.5, mobile: 64, desktop: 36 },
    { country: 'Italy', iso: 'ITA', percentage: 3, sales: 128, customers: 92, revenue: 11850, cvr: 14.5, trend: 'down', trendValue: 0.8, mobile: 61, desktop: 39 },
    { country: 'Spain', iso: 'ESP', percentage: 3, sales: 118, customers: 85, revenue: 10920, cvr: 13.9, trend: 'up', trendValue: 3.1, mobile: 66, desktop: 34 },
  ],
  interests: [
    { category: 'Clothing', value: 24, color: '#1192E8' },
    { category: 'Shoes', value: 16, color: '#6929C4' },
    { category: 'Bags', value: 13, color: '#002D9C' },
    { category: 'Wallets', value: 9, color: '#005D5D' },
    { category: 'Accessories', value: 11, color: '#198038' },
    { category: 'Cosmetics', value: 8, color: '#9F1853' },
    { category: 'Home', value: 5, color: '#B28600' },
    { category: 'Tech', value: 3, color: '#EE538B' },
    { category: 'Jewelry', value: 5, color: '#A56EFF' },
    { category: 'Sportswear', value: 4, color: '#24A148' },
    { category: 'Kids & Baby', value: 2, color: '#FA4D56' },
  ],
  // Active users by gender (for donut chart)
  gender: [
    { name: 'Female', value: 58, color: '#0f62fe' },
    { name: 'Male', value: 42, color: '#78a9ff' },
  ],
};

// Customer interests detail table (User ID, category, item, shopping time/day, device)
const customerInterestsDetailData: Array<{ userId: string; productCategory: string; productItem: string; shoppingTime: string; shoppingDay: string; device: string }> = [
  { userId: 'USR-2847', productCategory: 'Clothing', productItem: 'Summer Dress', shoppingTime: '7-9 PM', shoppingDay: 'Saturday', device: 'Mobile' },
  { userId: 'USR-3912', productCategory: 'Shoes', productItem: 'Running Sneakers', shoppingTime: '12-2 PM', shoppingDay: 'Friday', device: 'Mobile' },
  { userId: 'USR-5021', productCategory: 'Bags', productItem: 'Leather Tote', shoppingTime: '7-9 PM', shoppingDay: 'Sunday', device: 'Desktop' },
  { userId: 'USR-6183', productCategory: 'Clothing', productItem: 'Cotton T-Shirt', shoppingTime: '5-7 PM', shoppingDay: 'Thursday', device: 'Mobile' },
  { userId: 'USR-7294', productCategory: 'Accessories', productItem: 'Sunglasses', shoppingTime: '7-9 PM', shoppingDay: 'Saturday', device: 'Mobile' },
  { userId: 'USR-8346', productCategory: 'Cosmetics', productItem: 'Lipstick Set', shoppingTime: '2-4 PM', shoppingDay: 'Sunday', device: 'Tablet' },
  { userId: 'USR-9402', productCategory: 'Shoes', productItem: 'Ankle Boots', shoppingTime: '7-9 PM', shoppingDay: 'Friday', device: 'Mobile' },
  { userId: 'USR-1058', productCategory: 'Clothing', productItem: 'Denim Jacket', shoppingTime: '8-10 PM', shoppingDay: 'Saturday', device: 'Mobile' },
  { userId: 'USR-2173', productCategory: 'Jewelry', productItem: 'Silver Earrings', shoppingTime: '6-8 PM', shoppingDay: 'Sunday', device: 'Desktop' },
  { userId: 'USR-3289', productCategory: 'Sportswear', productItem: 'Yoga Leggings', shoppingTime: '7-9 PM', shoppingDay: 'Saturday', device: 'Mobile' },
  { userId: 'USR-4391', productCategory: 'Bags', productItem: 'Crossbody Bag', shoppingTime: '1-3 PM', shoppingDay: 'Friday', device: 'Mobile' },
  { userId: 'USR-5462', productCategory: 'Clothing', productItem: 'Wool Sweater', shoppingTime: '7-9 PM', shoppingDay: 'Sunday', device: 'Tablet' },
  { userId: 'USR-6538', productCategory: 'Accessories', productItem: 'Silk Scarf', shoppingTime: '5-7 PM', shoppingDay: 'Saturday', device: 'Mobile' },
  { userId: 'USR-7614', productCategory: 'Shoes', productItem: 'Sandals', shoppingTime: '7-9 PM', shoppingDay: 'Friday', device: 'Mobile' },
  { userId: 'USR-8725', productCategory: 'Cosmetics', productItem: 'Skincare Kit', shoppingTime: '12-2 PM', shoppingDay: 'Sunday', device: 'Desktop' },
  { userId: 'USR-9830', productCategory: 'Clothing', productItem: 'Midi Skirt', shoppingTime: '7-9 PM', shoppingDay: 'Saturday', device: 'Mobile' },
  { userId: 'USR-0947', productCategory: 'Tech', productItem: 'Wireless Earbuds', shoppingTime: '8-10 PM', shoppingDay: 'Thursday', device: 'Desktop' },
  { userId: 'USR-1083', productCategory: 'Home', productItem: 'Throw Pillow', shoppingTime: '2-4 PM', shoppingDay: 'Sunday', device: 'Tablet' },
  { userId: 'USR-2156', productCategory: 'Kids & Baby', productItem: 'Baby Onesie', shoppingTime: '6-8 PM', shoppingDay: 'Saturday', device: 'Mobile' },
];

// Search → Click Efficiency by Keyword (scatter: search volume, CTR, clicks, intent)
type KeywordIntent = 'Product' | 'Promotion';
const KEYWORD_INTENT_COLORS: Record<KeywordIntent, string> = {
  'Product': '#0f62fe',
  'Promotion': '#bf5300',
};
const keywordEfficiencyData: Array<{ keyword: string; searchVolume: number; ctr: number; clicks: number; intent: KeywordIntent }> = [
  { keyword: 'dress', searchVolume: 4200, ctr: 8.2, clicks: 1840, intent: 'Product' },
  { keyword: 'shoes', searchVolume: 3800, ctr: 7.8, clicks: 1520, intent: 'Product' },
  { keyword: 'bag', searchVolume: 2100, ctr: 6.1, clicks: 720, intent: 'Product' },
  { keyword: 'sale', searchVolume: 5200, ctr: 4.2, clicks: 1100, intent: 'Promotion' },
  { keyword: 'free shipping', searchVolume: 3400, ctr: 5.8, clicks: 980, intent: 'Promotion' },
  { keyword: 'accessories', searchVolume: 2900, ctr: 7.1, clicks: 1020, intent: 'Product' },
  { keyword: 'new arrival', searchVolume: 1600, ctr: 6.8, clicks: 540, intent: 'Promotion' },
  { keyword: 'best seller', searchVolume: 2400, ctr: 8.5, clicks: 1020, intent: 'Product' },
  { keyword: 'product', searchVolume: 3500, ctr: 7.4, clicks: 1290, intent: 'Product' },
  { keyword: 'design', searchVolume: 1100, ctr: 6.2, clicks: 340, intent: 'Product' },
  { keyword: 'winter coat', searchVolume: 1900, ctr: 9.2, clicks: 870, intent: 'Product' },
  { keyword: 'discount', searchVolume: 4100, ctr: 3.9, clicks: 800, intent: 'Promotion' },
  { keyword: 'sneakers', searchVolume: 2700, ctr: 8.1, clicks: 1090, intent: 'Product' },
  { keyword: 'clearance', searchVolume: 2200, ctr: 4.5, clicks: 495, intent: 'Promotion' },
  // More demo points across quadrants
  { keyword: 'jacket', searchVolume: 3200, ctr: 7.6, clicks: 1210, intent: 'Product' },
  { keyword: 'boots', searchVolume: 1800, ctr: 8.0, clicks: 720, intent: 'Product' },
  { keyword: 'handbag', searchVolume: 2500, ctr: 6.5, clicks: 810, intent: 'Product' },
  { keyword: 'deal', searchVolume: 4800, ctr: 3.8, clicks: 910, intent: 'Promotion' },
  { keyword: 'coupon', searchVolume: 3900, ctr: 4.1, clicks: 800, intent: 'Promotion' },
  { keyword: 'black friday', searchVolume: 6100, ctr: 5.2, clicks: 1580, intent: 'Promotion' },
  { keyword: 'hoodie', searchVolume: 1400, ctr: 7.4, clicks: 520, intent: 'Product' },
  { keyword: 'watch', searchVolume: 2600, ctr: 6.8, clicks: 880, intent: 'Product' },
  { keyword: 'jewelry', searchVolume: 1700, ctr: 5.9, clicks: 500, intent: 'Product' },
  { keyword: 'sunglasses', searchVolume: 1200, ctr: 8.3, clicks: 500, intent: 'Product' },
  { keyword: 'running shoes', searchVolume: 2300, ctr: 9.0, clicks: 1030, intent: 'Product' },
  { keyword: 'formal dress', searchVolume: 950, ctr: 7.8, clicks: 370, intent: 'Product' },
  { keyword: 'flash sale', searchVolume: 4400, ctr: 4.6, clicks: 1010, intent: 'Promotion' },
  { keyword: 'free delivery', searchVolume: 2800, ctr: 5.0, clicks: 700, intent: 'Promotion' },
  { keyword: 'last chance', searchVolume: 1500, ctr: 4.2, clicks: 315, intent: 'Promotion' },
  { keyword: 'summer sale', searchVolume: 3700, ctr: 4.8, clicks: 890, intent: 'Promotion' },
  { keyword: 'leather bag', searchVolume: 800, ctr: 7.2, clicks: 290, intent: 'Product' },
  { keyword: 'cotton t-shirt', searchVolume: 2100, ctr: 6.4, clicks: 670, intent: 'Product' },
  { keyword: 'vintage style', searchVolume: 650, ctr: 8.5, clicks: 276, intent: 'Product' },
  { keyword: 'limited offer', searchVolume: 1900, ctr: 3.5, clicks: 330, intent: 'Promotion' },
  { keyword: 'backpack', searchVolume: 3100, ctr: 6.9, clicks: 1070, intent: 'Product' },
  { keyword: 'earrings', searchVolume: 1650, ctr: 5.7, clicks: 470, intent: 'Product' },
  { keyword: 'yoga pants', searchVolume: 2800, ctr: 8.2, clicks: 1150, intent: 'Product' },
  { keyword: 'cyber monday', searchVolume: 5500, ctr: 4.9, clicks: 1350, intent: 'Promotion' },
  { keyword: 'gift card', searchVolume: 3200, ctr: 3.2, clicks: 510, intent: 'Promotion' },
  { keyword: 'mens suit', searchVolume: 1100, ctr: 7.1, clicks: 390, intent: 'Product' },
  { keyword: 'skincare', searchVolume: 4200, ctr: 6.5, clicks: 1360, intent: 'Product' },
  { keyword: 'buy one get one', searchVolume: 2600, ctr: 4.4, clicks: 570, intent: 'Promotion' },
  { keyword: 'athletic wear', searchVolume: 1900, ctr: 7.8, clicks: 740, intent: 'Product' },
  { keyword: 'wedding dress', searchVolume: 1400, ctr: 9.1, clicks: 640, intent: 'Product' },
  { keyword: 'member discount', searchVolume: 1200, ctr: 3.8, clicks: 228, intent: 'Promotion' },
  { keyword: 'denim jeans', searchVolume: 3500, ctr: 6.7, clicks: 1170, intent: 'Product' },
  { keyword: 'outlet', searchVolume: 4100, ctr: 4.0, clicks: 820, intent: 'Promotion' },
];
const keywordEfficiencyMidX = (() => { const s = [...keywordEfficiencyData].map(d => d.searchVolume).sort((a, b) => a - b); return s[Math.floor(s.length / 2)]; })();
const keywordEfficiencyMidY = (() => { const s = [...keywordEfficiencyData].map(d => d.ctr).sort((a, b) => a - b); return s[Math.floor(s.length / 2)]; })();
const keywordEfficiencyMinX = Math.min(...keywordEfficiencyData.map(d => d.searchVolume));

// Standardized Item Name column width for Product/Content/Optimization tables
const ITEM_NAME_COLUMN_STYLE: React.CSSProperties = { minWidth: '220px', maxWidth: '280px' };

/** Period / date-range selects (Last 7 days, etc.) — shared with Settings currency & timezone */
const DASHBOARD_PERIOD_SELECT_CHEVRON = `url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L6 6L11 1' stroke='%236d7175' stroke-width='2' stroke-linecap='round'/%3E%3C/svg%3E")`;

const DASHBOARD_PERIOD_SELECT_STYLE: React.CSSProperties = {
  padding: '8px 32px 8px 12px',
  border: '1px solid var(--shopify-border)',
  borderRadius: '6px',
  backgroundColor: 'white',
  fontSize: '14px',
  color: 'var(--shopify-text-primary)',
  cursor: 'pointer',
  outline: 'none',
  appearance: 'none',
  backgroundImage: DASHBOARD_PERIOD_SELECT_CHEVRON,
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'right 12px center',
  transition: 'border-color 0.15s ease',
};

const dashboardPeriodSelectInteractionProps: Pick<
  React.SelectHTMLAttributes<HTMLSelectElement>,
  'onFocus' | 'onBlur' | 'onMouseEnter' | 'onMouseLeave'
> = {
  onFocus: (e) => {
    (e.currentTarget as unknown as { style: Record<string, string> }).style.borderColor = '#7256F6';
  },
  onBlur: (e) => {
    (e.currentTarget as unknown as { style: Record<string, string> }).style.borderColor = 'var(--shopify-border)';
  },
  onMouseEnter: (e) => {
    (e.currentTarget as unknown as { style: Record<string, string> }).style.borderColor = '#7256F6';
  },
  onMouseLeave: (e) => {
    const doc = (globalThis as unknown as { document?: { activeElement?: EventTarget | null } }).document;
    if (doc?.activeElement !== e.currentTarget) {
      (e.currentTarget as unknown as { style: Record<string, string> }).style.borderColor = 'var(--shopify-border)';
    }
  },
};
const keywordEfficiencyMaxX = Math.max(...keywordEfficiencyData.map(d => d.searchVolume));
const keywordEfficiencyMinY = Math.min(...keywordEfficiencyData.map(d => d.ctr));
const keywordEfficiencyMaxY = Math.max(...keywordEfficiencyData.map(d => d.ctr));

// Realry Icon Component
const RealryIcon = ({ size = 20, style }: { size?: number; style?: React.CSSProperties }) => (
  <svg 
    width={size} 
    height={size * (19/21)} 
    viewBox="0 0 21 19" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    style={style}
  >
    <path d="M1.09837 0.824219C1.46637 0.840219 1.93837 0.856218 2.51437 0.872218C3.10637 0.888218 3.69037 0.896218 4.26637 0.896218C5.03437 0.896218 5.76237 0.888218 6.45037 0.872218C7.15437 0.856218 7.65037 0.848218 7.93837 0.848218C9.29837 0.848218 10.4264 1.02422 11.3224 1.37622C12.2344 1.72822 12.9064 2.22422 13.3384 2.86422C13.7864 3.48822 14.0104 4.20822 14.0104 5.02422C14.0104 5.52022 13.9064 6.04822 13.6984 6.60822C13.5064 7.15222 13.1624 7.66422 12.6664 8.14422C12.1704 8.60822 11.4984 8.99222 10.6504 9.29622C9.80237 9.60022 8.72237 9.75222 7.41037 9.75222H5.10637V9.27222H7.17037C8.24237 9.27222 9.05837 9.09622 9.61837 8.74422C10.1944 8.37622 10.5784 7.89622 10.7704 7.30422C10.9784 6.69622 11.0824 6.02422 11.0824 5.28822C11.0824 4.02422 10.8104 3.04822 10.2664 2.36022C9.72237 1.65622 8.77837 1.30422 7.43437 1.30422C6.74637 1.30422 6.29037 1.44022 6.06637 1.71222C5.85837 1.98422 5.75437 2.53622 5.75437 3.36822V15.2722C5.75437 15.8482 5.80237 16.2802 5.89837 16.5682C5.99437 16.8562 6.17837 17.0482 6.45037 17.1442C6.72237 17.2402 7.12237 17.3042 7.65037 17.3362V17.8162C7.26637 17.7842 6.77837 17.7682 6.18637 17.7682C5.61037 17.7522 5.01837 17.7442 4.41037 17.7442C3.73837 17.7442 3.10637 17.7522 2.51437 17.7682C1.93837 17.7682 1.46637 17.7842 1.09837 17.8162V17.3362C1.64237 17.3042 2.05037 17.2402 2.32237 17.1442C2.59437 17.0482 2.77037 16.8562 2.85037 16.5682C2.94637 16.2802 2.99437 15.8482 2.99437 15.2722V3.36822C2.99437 2.77622 2.94637 2.34422 2.85037 2.07222C2.77037 1.78422 2.58637 1.59222 2.29837 1.49622C2.02637 1.38422 1.62637 1.32022 1.09837 1.30422V0.824219ZM5.15437 9.34422C5.97037 9.37622 6.62637 9.41622 7.12237 9.46422C7.61837 9.49622 8.03437 9.52822 8.37037 9.56022C8.70637 9.59222 9.01837 9.63222 9.30637 9.68022C10.5064 9.84022 11.3784 10.1602 11.9224 10.6402C12.4824 11.1202 12.8664 11.8562 13.0744 12.8482L13.6744 15.2962C13.8184 15.9842 13.9704 16.4722 14.1304 16.7602C14.3064 17.0482 14.5624 17.1922 14.8984 17.1922C15.1544 17.1762 15.3624 17.1042 15.5224 16.9762C15.6984 16.8322 15.8824 16.6402 16.0744 16.4002L16.4104 16.6642C16.0424 17.1602 15.6584 17.5362 15.2584 17.7922C14.8584 18.0322 14.3224 18.1522 13.6504 18.1522C12.9624 18.1522 12.3704 17.9762 11.8744 17.6242C11.3944 17.2562 11.0504 16.5682 10.8424 15.5602L10.3624 13.1602C10.2184 12.4722 10.0584 11.8802 9.88237 11.3842C9.70637 10.8722 9.45837 10.4722 9.13837 10.1842C8.83437 9.89622 8.38637 9.75222 7.79437 9.75222H5.20237L5.15437 9.34422Z" fill="currentColor"/>
    <path d="M18.5 14.8642C18.98 14.8642 19.38 15.0242 19.7 15.3442C20.036 15.6482 20.204 16.0402 20.204 16.5202C20.204 16.9842 20.036 17.3762 19.7 17.6962C19.38 18.0002 18.98 18.1522 18.5 18.1522C18.02 18.1522 17.612 18.0002 17.276 17.6962C16.956 17.3762 16.796 16.9842 16.796 16.5202C16.796 16.0402 16.956 15.6482 17.276 15.3442C17.612 15.0242 18.02 14.8642 18.5 14.8642Z" fill="currentColor"/>
  </svg>
);

// Google Icon Component
const GoogleIcon = ({ size = 20, style }: { size?: number; style?: React.CSSProperties }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    style={style}
  >
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

// Instagram Icon Component
const InstagramIcon = ({ size = 20, style }: { size?: number; style?: React.CSSProperties }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    style={style}
  >
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" fill="currentColor"/>
  </svg>
);

// Target Icon Component
const TargetIcon = ({ size = 20, style }: { size?: number; style?: React.CSSProperties }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    style={style}
  >
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none"/>
    <circle cx="12" cy="12" r="6" stroke="currentColor" strokeWidth="2" fill="none"/>
    <circle cx="12" cy="12" r="2" fill="currentColor"/>
    <line x1="12" y1="2" x2="12" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <line x1="12" y1="18" x2="12" y2="22" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <line x1="2" y1="12" x2="6" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <line x1="18" y1="12" x2="22" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

// Top performing items grouped by traffic source
const topPerformingItemsByTrafficSource = {
  realry: [
    { name: 'Premium Headphones', itemType: 'Product', clicks: 2340, impressions: 15600, conversions: 342, cvr: 14.6, revenue: 12956, tag: 'Best CVR', imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=80&h=80&fit=crop', productUrl: '/products/premium-headphones' },
    { name: 'Summer Sale Banner', itemType: 'Banner', clicks: 1890, impressions: 12600, conversions: 265, cvr: 14.0, revenue: 10070, tag: null },
    { name: 'Wireless Speaker Set', itemType: 'Product', clicks: 1650, impressions: 11000, conversions: 231, cvr: 14.0, revenue: 9240, tag: null, imageUrl: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=80&h=80&fit=crop', productUrl: '/products/wireless-speaker-set' },
    { name: 'Holiday Collection Ad', itemType: 'Banner', clicks: 1520, impressions: 10133, conversions: 198, cvr: 13.0, revenue: 9504, tag: null },
    { name: 'Product Showcase Video', itemType: 'Content', clicks: 1420, impressions: 9467, conversions: 184, cvr: 13.0, revenue: 8808, tag: null },
    { name: 'Smart Watch Pro', itemType: 'Product', clicks: 1380, impressions: 9200, conversions: 193, cvr: 14.0, revenue: 8694, tag: null, imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=80&h=80&fit=crop', productUrl: '/products/smart-watch-pro' },
    { name: 'Flash Sale Banner', itemType: 'Banner', clicks: 1280, impressions: 8533, conversions: 166, cvr: 13.0, revenue: 8064, tag: null },
    { name: 'Unboxing Video', itemType: 'Content', clicks: 1180, impressions: 7867, conversions: 153, cvr: 13.0, revenue: 7344, tag: null },
    { name: 'Gaming Mouse', itemType: 'Product', clicks: 1120, impressions: 7467, conversions: 156, cvr: 13.9, revenue: 7056, tag: null, imageUrl: 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=80&h=80&fit=crop', productUrl: '/products/gaming-mouse' },
    { name: 'New Arrivals Ad', itemType: 'Banner', clicks: 1050, impressions: 7000, conversions: 136, cvr: 13.0, revenue: 6552, tag: null },
    { name: 'Mechanical Keyboard', itemType: 'Product', clicks: 980, impressions: 6533, conversions: 127, cvr: 13.8, revenue: 6174, tag: null, imageUrl: 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=80&h=80&fit=crop', productUrl: '/products/mechanical-keyboard' },
    { name: 'Desk Lamp LED', itemType: 'Product', clicks: 890, impressions: 5933, conversions: 118, cvr: 13.9, revenue: 5604, tag: null, imageUrl: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=80&h=80&fit=crop', productUrl: '/products/desk-lamp-led' },
    { name: 'Portable Charger', itemType: 'Product', clicks: 820, impressions: 5467, conversions: 109, cvr: 13.9, revenue: 5166, tag: null, imageUrl: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=80&h=80&fit=crop', productUrl: '/products/portable-charger' },
    { name: 'Bluetooth Earbuds', itemType: 'Product', clicks: 760, impressions: 5067, conversions: 98, cvr: 13.8, revenue: 4788, tag: null, imageUrl: 'https://images.unsplash.com/photo-1598331668826-20cecc596b86?w=80&h=80&fit=crop', productUrl: '/products/bluetooth-earbuds' },
    { name: 'Tech Review Video', itemType: 'Content', clicks: 710, impressions: 4733, conversions: 92, cvr: 13.8, revenue: 4476, tag: null },
  ],
  css: [
    { name: 'Wireless Earbuds Pro', itemType: 'Product', clicks: 1560, impressions: 10400, conversions: 234, cvr: 15.0, revenue: 8892, tag: 'Trending', imageUrl: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=80&h=80&fit=crop', productUrl: '/products/wireless-earbuds-pro' },
    { name: 'Luxury Handbag Collection', itemType: 'Product', clicks: 1450, impressions: 9667, conversions: 217, cvr: 15.0, revenue: 8262, tag: null, imageUrl: 'https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=80&h=80&fit=crop', productUrl: '/products/luxury-handbag-collection' },
    { name: 'Designer Sunglasses', itemType: 'Product', clicks: 1340, impressions: 8933, conversions: 201, cvr: 15.0, revenue: 7638, tag: null, imageUrl: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=80&h=80&fit=crop', productUrl: '/products/designer-sunglasses' },
    { name: 'Premium Watch Ad', itemType: 'Banner', clicks: 1230, impressions: 8200, conversions: 172, cvr: 14.0, revenue: 6888, tag: null },
    { name: 'Fashion Lookbook', itemType: 'Content', clicks: 1120, impressions: 7467, conversions: 157, cvr: 14.0, revenue: 6272, tag: null },
    { name: 'Leather Jacket', itemType: 'Product', clicks: 1010, impressions: 6733, conversions: 141, cvr: 14.0, revenue: 5656, tag: null, imageUrl: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=80&h=80&fit=crop', productUrl: '/products/leather-jacket' },
    { name: 'Brand Story Video', itemType: 'Content', clicks: 980, impressions: 6533, conversions: 137, cvr: 14.0, revenue: 5488, tag: null },
    { name: 'Exclusive Collection Ad', itemType: 'Banner', clicks: 920, impressions: 6133, conversions: 129, cvr: 14.0, revenue: 5152, tag: null },
    { name: 'High-End Sneakers', itemType: 'Product', clicks: 870, impressions: 5800, conversions: 122, cvr: 14.0, revenue: 4872, tag: null, imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=80&h=80&fit=crop', productUrl: '/products/high-end-sneakers' },
    { name: 'Lifestyle Photography', itemType: 'Content', clicks: 810, impressions: 5400, conversions: 113, cvr: 14.0, revenue: 4536, tag: null },
    { name: 'Minimalist Watch', itemType: 'Product', clicks: 750, impressions: 5000, conversions: 105, cvr: 14.0, revenue: 4200, tag: null, imageUrl: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=80&h=80&fit=crop', productUrl: '/products/minimalist-watch' },
    { name: 'Travel Backpack', itemType: 'Product', clicks: 690, impressions: 4600, conversions: 97, cvr: 14.0, revenue: 3864, tag: null, imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=80&h=80&fit=crop', productUrl: '/products/travel-backpack' },
    { name: 'Seasonal Editorial', itemType: 'Content', clicks: 630, impressions: 4200, conversions: 88, cvr: 14.0, revenue: 3528, tag: null },
    { name: 'Celebrity Collab Ad', itemType: 'Banner', clicks: 580, impressions: 3867, conversions: 81, cvr: 14.0, revenue: 3248, tag: null },
    { name: 'Canvas Sneakers', itemType: 'Product', clicks: 540, impressions: 3600, conversions: 76, cvr: 14.0, revenue: 3024, tag: null, imageUrl: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=80&h=80&fit=crop', productUrl: '/products/canvas-sneakers' },
  ],
  instagramStories: [
    { name: 'Product Video - Earbuds', itemType: 'Content', clicks: 3420, impressions: 22800, conversions: 445, cvr: 13.0, revenue: 16905, tag: 'Most Clicks' },
    { name: 'Instagram Story - Sale', itemType: 'Banner', clicks: 2890, impressions: 19267, conversions: 376, cvr: 13.0, revenue: 14280, tag: null },
    { name: 'Behind the Scenes', itemType: 'Content', clicks: 2450, impressions: 16333, conversions: 319, cvr: 13.0, revenue: 12120, tag: null },
    { name: 'Quick Product Demo', itemType: 'Content', clicks: 2120, impressions: 14133, conversions: 276, cvr: 13.0, revenue: 10488, tag: null },
    { name: 'Flash Deal Story', itemType: 'Banner', clicks: 1980, impressions: 13200, conversions: 257, cvr: 13.0, revenue: 9792, tag: null },
    { name: 'User Testimonial Video', itemType: 'Content', clicks: 1850, impressions: 12333, conversions: 241, cvr: 13.0, revenue: 9156, tag: null },
    { name: 'New Product Launch', itemType: 'Banner', clicks: 1720, impressions: 11467, conversions: 224, cvr: 13.0, revenue: 8520, tag: null },
    { name: 'Tutorial Video', itemType: 'Content', clicks: 1590, impressions: 10600, conversions: 207, cvr: 13.0, revenue: 7872, tag: null },
    { name: 'Limited Edition Story', itemType: 'Banner', clicks: 1460, impressions: 9733, conversions: 190, cvr: 13.0, revenue: 7224, tag: null },
    { name: 'Daily Deal Story', itemType: 'Banner', clicks: 1330, impressions: 8867, conversions: 173, cvr: 13.0, revenue: 6576, tag: null },
    { name: 'Influencer Unboxing', itemType: 'Content', clicks: 1210, impressions: 8067, conversions: 158, cvr: 13.0, revenue: 5976, tag: null },
    { name: 'Poll - New Color', itemType: 'Content', clicks: 1090, impressions: 7267, conversions: 142, cvr: 13.0, revenue: 5376, tag: null },
    { name: 'Swipe Up - Collection', itemType: 'Banner', clicks: 980, impressions: 6533, conversions: 128, cvr: 13.0, revenue: 4848, tag: null },
    { name: 'Reel - 15s Teaser', itemType: 'Content', clicks: 870, impressions: 5800, conversions: 113, cvr: 13.0, revenue: 4296, tag: null },
    { name: 'Countdown Story', itemType: 'Banner', clicks: 760, impressions: 5067, conversions: 99, cvr: 13.0, revenue: 3744, tag: null },
  ],
  edm: [
    { name: 'Email Campaign - New Arrivals', itemType: 'Banner', clicks: 980, impressions: 6533, conversions: 145, cvr: 14.8, revenue: 5510, tag: null },
    { name: 'Weekly Newsletter', itemType: 'Content', clicks: 920, impressions: 6133, conversions: 136, cvr: 14.8, revenue: 5168, tag: null },
    { name: 'Abandoned Cart Email', itemType: 'Banner', clicks: 870, impressions: 5800, conversions: 129, cvr: 14.8, revenue: 4890, tag: null },
    { name: 'Product Recommendation', itemType: 'Product', clicks: 820, impressions: 5467, conversions: 121, cvr: 14.8, revenue: 4608, tag: null, imageUrl: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=80&h=80&fit=crop', productUrl: '/products/product-recommendation' },
    { name: 'Seasonal Promotion Email', itemType: 'Banner', clicks: 780, impressions: 5200, conversions: 115, cvr: 14.7, revenue: 4368, tag: null },
    { name: 'Member Exclusive Offer', itemType: 'Banner', clicks: 740, impressions: 4933, conversions: 110, cvr: 14.9, revenue: 4158, tag: null },
    { name: 'Birthday Special Email', itemType: 'Content', clicks: 700, impressions: 4667, conversions: 104, cvr: 14.9, revenue: 3936, tag: null },
    { name: 'Flash Sale Alert', itemType: 'Banner', clicks: 660, impressions: 4400, conversions: 98, cvr: 14.8, revenue: 3708, tag: null },
    { name: 'Product Spotlight Email', itemType: 'Product', clicks: 620, impressions: 4133, conversions: 92, cvr: 14.8, revenue: 3480, tag: null, imageUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=80&h=80&fit=crop', productUrl: '/products/product-spotlight' },
    { name: 'Thank You Email', itemType: 'Content', clicks: 580, impressions: 3867, conversions: 86, cvr: 14.8, revenue: 3252, tag: null },
    { name: 'Re-engagement Campaign', itemType: 'Banner', clicks: 540, impressions: 3600, conversions: 80, cvr: 14.7, revenue: 3024, tag: null },
    { name: 'Cross-sell Email', itemType: 'Product', clicks: 500, impressions: 3333, conversions: 74, cvr: 14.8, revenue: 2800, tag: null, imageUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=80&h=80&fit=crop', productUrl: '/products/cross-sell' },
    { name: 'VIP Early Access', itemType: 'Banner', clicks: 460, impressions: 3067, conversions: 68, cvr: 14.9, revenue: 2576, tag: null },
    { name: 'Review Request Email', itemType: 'Content', clicks: 420, impressions: 2800, conversions: 62, cvr: 14.8, revenue: 2352, tag: null },
    { name: 'Win-back Offer', itemType: 'Banner', clicks: 380, impressions: 2533, conversions: 56, cvr: 14.7, revenue: 2128, tag: null },
  ],
};

// Partner Benchmarking Data
const partnerBenchmarking = {
  category: 'Fashion',
  metrics: {
    cvr: { partner: 13.9, categoryAvg: 12.5, top5Percent: 16.2, percentile: 75 },
    aov: { partner: 38.02, categoryAvg: 42.50, top5Percent: 52.80, percentile: 45 },
    rpc: { partner: 5.29, categoryAvg: 4.85, top5Percent: 6.40, percentile: 65 },
    returnRate: { partner: 3.2, categoryAvg: 4.1, top5Percent: 2.8, percentile: 70 }
  },
  recommendations: [
    'Your AOV is 10.5% below category average. Consider promoting higher-value items.',
    'Your CVR is strong - 11% above average. Maintain current strategy.',
    'Your return rate is 22% lower than average - excellent quality control.'
  ]
};

// Weekend vs Weekday Performance Data
// Weekly data for the last 12 weeks (default view uses first 5; more for demo)
const weekendWeekdayPerformanceWeekly = [
  { week: 'Week 1', weekend: { clicks: 3200, conversions: 425, cvr: 13.3, revenue: 17800 }, weekday: { clicks: 5100, conversions: 730, cvr: 14.3, revenue: 26500 } },
  { week: 'Week 2', weekend: { clicks: 3350, conversions: 445, cvr: 13.3, revenue: 18500 }, weekday: { clicks: 5250, conversions: 750, cvr: 14.3, revenue: 27200 } },
  { week: 'Week 3', weekend: { clicks: 3420, conversions: 456, cvr: 13.3, revenue: 18920 }, weekday: { clicks: 5350, conversions: 765, cvr: 14.3, revenue: 27800 } },
  { week: 'Week 4', weekend: { clicks: 3500, conversions: 465, cvr: 13.3, revenue: 19200 }, weekday: { clicks: 5450, conversions: 780, cvr: 14.3, revenue: 28500 } },
  { week: 'Week 5', weekend: { clicks: 3580, conversions: 475, cvr: 13.3, revenue: 19800 }, weekday: { clicks: 5550, conversions: 795, cvr: 14.3, revenue: 29200 } },
  { week: 'Week 6', weekend: { clicks: 3650, conversions: 485, cvr: 13.3, revenue: 20200 }, weekday: { clicks: 5620, conversions: 808, cvr: 14.4, revenue: 29800 } },
  { week: 'Week 7', weekend: { clicks: 3720, conversions: 494, cvr: 13.3, revenue: 20580 }, weekday: { clicks: 5690, conversions: 818, cvr: 14.4, revenue: 30400 } },
  { week: 'Week 8', weekend: { clicks: 3790, conversions: 503, cvr: 13.3, revenue: 20950 }, weekday: { clicks: 5760, conversions: 828, cvr: 14.4, revenue: 31020 } },
  { week: 'Week 9', weekend: { clicks: 3860, conversions: 512, cvr: 13.3, revenue: 21320 }, weekday: { clicks: 5830, conversions: 838, cvr: 14.4, revenue: 31650 } },
  { week: 'Week 10', weekend: { clicks: 3930, conversions: 522, cvr: 13.3, revenue: 21700 }, weekday: { clicks: 5900, conversions: 848, cvr: 14.4, revenue: 32280 } },
  { week: 'Week 11', weekend: { clicks: 4000, conversions: 531, cvr: 13.3, revenue: 22100 }, weekday: { clicks: 5970, conversions: 858, cvr: 14.4, revenue: 32920 } },
  { week: 'Week 12', weekend: { clicks: 4080, conversions: 541, cvr: 13.3, revenue: 22550 }, weekday: { clicks: 6040, conversions: 868, cvr: 14.4, revenue: 33580 } },
];

// Daily breakdown for Weekday vs Weekend detail table (Monday–Sunday by date)
const weekdayWeekendDailyData: Array<{ date: string; dateLabel: string; dayOfWeek: string; clicks: number; conversions: number; revenue: number; cvr: number; aov: number; rpc: number }> = [
  { date: '2025-02-03', dateLabel: 'Feb 3, 2025', dayOfWeek: 'Monday', clicks: 1020, conversions: 146, revenue: 5320, cvr: 14.3, aov: 36.44, rpc: 5.22 },
  { date: '2025-02-04', dateLabel: 'Feb 4, 2025', dayOfWeek: 'Tuesday', clicks: 1050, conversions: 151, revenue: 5480, cvr: 14.4, aov: 36.29, rpc: 5.22 },
  { date: '2025-02-05', dateLabel: 'Feb 5, 2025', dayOfWeek: 'Wednesday', clicks: 1080, conversions: 155, revenue: 5640, cvr: 14.4, aov: 36.39, rpc: 5.22 },
  { date: '2025-02-06', dateLabel: 'Feb 6, 2025', dayOfWeek: 'Thursday', clicks: 1100, conversions: 158, revenue: 5760, cvr: 14.4, aov: 36.46, rpc: 5.24 },
  { date: '2025-02-07', dateLabel: 'Feb 7, 2025', dayOfWeek: 'Friday', clicks: 1120, conversions: 160, revenue: 5840, cvr: 14.3, aov: 36.50, rpc: 5.21 },
  { date: '2025-02-08', dateLabel: 'Feb 8, 2025', dayOfWeek: 'Saturday', clicks: 1790, conversions: 238, revenue: 9900, cvr: 13.3, aov: 41.60, rpc: 5.53 },
  { date: '2025-02-09', dateLabel: 'Feb 9, 2025', dayOfWeek: 'Sunday', clicks: 1790, conversions: 237, revenue: 9900, cvr: 13.2, aov: 41.77, rpc: 5.53 },
];

// Monthly aggregated data (last 6 months)
const weekendWeekdayPerformanceMonthly = [
  { month: 'Month 1', weekend: { clicks: 13520, conversions: 1795, cvr: 13.3, revenue: 74420 }, weekday: { clicks: 21150, conversions: 3025, cvr: 14.3, revenue: 110200 } },
  { month: 'Month 2', weekend: { clicks: 14200, conversions: 1885, cvr: 13.3, revenue: 78500 }, weekday: { clicks: 22000, conversions: 3145, cvr: 14.3, revenue: 114500 } },
  { month: 'Month 3', weekend: { clicks: 14800, conversions: 1965, cvr: 13.3, revenue: 81800 }, weekday: { clicks: 22800, conversions: 3260, cvr: 14.3, revenue: 118800 } },
  { month: 'Month 4', weekend: { clicks: 15400, conversions: 2045, cvr: 13.3, revenue: 85100 }, weekday: { clicks: 23600, conversions: 3375, cvr: 14.3, revenue: 123100 } },
  { month: 'Month 5', weekend: { clicks: 16000, conversions: 2125, cvr: 13.3, revenue: 88400 }, weekday: { clicks: 24400, conversions: 3490, cvr: 14.3, revenue: 127400 } },
  { month: 'Month 6', weekend: { clicks: 16600, conversions: 2205, cvr: 13.3, revenue: 91700 }, weekday: { clicks: 25200, conversions: 3605, cvr: 14.3, revenue: 131700 } },
];

// 6 months data (bi-monthly)
const weekendWeekdayPerformance6Months = [
  { period: 'Months 1-2', weekend: { clicks: 27720, conversions: 3680, cvr: 13.3, revenue: 152920 }, weekday: { clicks: 43150, conversions: 6170, cvr: 14.3, revenue: 224700 } },
  { period: 'Months 3-4', weekend: { clicks: 29000, conversions: 3850, cvr: 13.3, revenue: 160300 }, weekday: { clicks: 44800, conversions: 6405, cvr: 14.3, revenue: 233300 } },
  { period: 'Months 5-6', weekend: { clicks: 30200, conversions: 4010, cvr: 13.3, revenue: 167100 }, weekday: { clicks: 46400, conversions: 6635, cvr: 14.3, revenue: 241800 } },
];

// 1 year data (quarterly)
const weekendWeekdayPerformance1Year = [
  { period: 'Q1', weekend: { clicks: 42520, conversions: 5645, cvr: 13.3, revenue: 235220 }, weekday: { clicks: 66150, conversions: 9455, cvr: 14.3, revenue: 344000 } },
  { period: 'Q2', weekend: { clicks: 44800, conversions: 5945, cvr: 13.3, revenue: 247800 }, weekday: { clicks: 69600, conversions: 9945, cvr: 14.3, revenue: 362200 } },
  { period: 'Q3', weekend: { clicks: 47200, conversions: 6265, cvr: 13.3, revenue: 261200 }, weekday: { clicks: 73200, conversions: 10460, cvr: 14.3, revenue: 381000 } },
  { period: 'Q4', weekend: { clicks: 49500, conversions: 6570, cvr: 13.3, revenue: 273900 }, weekday: { clicks: 76800, conversions: 10985, cvr: 14.3, revenue: 399800 } },
];

// Helper function to aggregate data based on time period
const aggregateWeekendWeekdayData = (data: typeof weekendWeekdayPerformanceWeekly) => {
  const weekend = data.reduce((acc, week) => ({
    clicks: acc.clicks + week.weekend.clicks,
    conversions: acc.conversions + week.weekend.conversions,
    revenue: acc.revenue + week.weekend.revenue,
    cvr: 0, // Will calculate after
  }), { clicks: 0, conversions: 0, revenue: 0, cvr: 0 });

  const weekday = data.reduce((acc, week) => ({
    clicks: acc.clicks + week.weekday.clicks,
    conversions: acc.conversions + week.weekday.conversions,
    revenue: acc.revenue + week.weekday.revenue,
    cvr: 0, // Will calculate after
  }), { clicks: 0, conversions: 0, revenue: 0, cvr: 0 });

  weekend.cvr = weekend.clicks > 0 ? (weekend.conversions / weekend.clicks) * 100 : 0;
  weekday.cvr = weekday.clicks > 0 ? (weekday.conversions / weekday.clicks) * 100 : 0;

  return { weekend, weekday, trend: weekend.cvr > weekday.cvr ? 'up' : 'down' };
};

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

// Metric definitions for tooltips
const metricDefinitions: { [key: string]: { name: string; formula: string; description: string } } = {
  ROAS: {
    name: 'Return on Ad Spend',
    formula: 'Revenue / Ad Spend',
    description: 'Shows how much revenue you earn for every dollar spent on advertising. A ROAS of 3.0x means you earn $3 for every $1 spent.'
  },
  CVR: {
    name: 'Conversion Rate',
    formula: '(Conversions / Clicks) × 100',
    description: 'Percentage of clicks that result in a conversion. Higher CVR indicates more effective traffic.'
  },
  CTR: {
    name: 'Click-Through Rate',
    formula: '(Clicks / Impressions) × 100',
    description: 'Percentage of impressions that result in clicks. Higher CTR indicates more engaging content.'
  },
  AOV: {
    name: 'Average Order Value',
    formula: 'Total Revenue / Number of Orders',
    description: 'Average amount spent per order. Higher AOV means customers are purchasing more per transaction.'
  },
  RPC: {
    name: 'Revenue Per Click',
    formula: 'Total Revenue / Total Clicks',
    description: 'Average revenue generated per click. Useful for comparing traffic quality across different sources.'
  },
  'Net CPA': {
    name: 'Net Cost Per Acquisition',
    formula: 'Total Ad Spend / Number of Conversions',
    description: 'Cost to acquire one customer. Lower CPA means more efficient customer acquisition.'
  },
  'Return Rate': {
    name: 'Return Rate',
    formula: '(Number of Returns / Number of Orders) × 100',
    description: 'Percentage of orders that are returned. Lower return rates indicate better product quality and customer satisfaction.'
  },
  Revenue: {
    name: 'Revenue',
    formula: 'Sum of all order values',
    description: 'Total income generated from sales. This is the gross revenue before any deductions.'
  },
  Conversions: {
    name: 'Conversions',
    formula: 'Number of completed purchases',
    description: 'Total number of successful transactions or purchases.'
  },
  Clicks: {
    name: 'Clicks',
    formula: 'Number of user clicks on ads or links',
    description: 'Total number of times users clicked on your ads, links, or call-to-action buttons.'
  },
  Impressions: {
    name: 'Impressions',
    formula: 'Number of times content was displayed',
    description: 'Total number of times your ads or content were shown to users, regardless of clicks.'
  }
};

// Custom Tooltip Component for Metric Definitions
const MetricTooltip = ({
  metric,
  children,
  formulaLabel = 'Formula',
}: {
  metric: string;
  children: React.ReactNode;
  formulaLabel?: string;
}) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const definition = metricDefinitions[metric];

  if (!definition) return <>{children}</>;

  return (
    <span
      style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', gap: '4px', cursor: 'help' }}
      onMouseEnter={(e) => {
        setShowTooltip(true);
        setTooltipPosition({ x: e.clientX, y: e.clientY });
      }}
      onMouseMove={(e) => {
        setTooltipPosition({ x: e.clientX, y: e.clientY });
      }}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {children}
      <Information size={14} style={{ color: '#6d7175', opacity: 0.7 }} />
      {showTooltip && (
        <div
          style={{
            position: 'fixed',
            top: tooltipPosition.y - 10,
            left: tooltipPosition.x + 10,
            backgroundColor: '#161616',
            color: 'white',
            padding: '12px',
            borderRadius: '6px',
            fontSize: '12px',
            maxWidth: '280px',
            zIndex: 10000,
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
            pointerEvents: 'none',
            transform: 'translateY(-100%)'
          }}
        >
          <div style={{ fontWeight: '600', marginBottom: '6px', fontSize: '13px' }}>{definition.name}</div>
          <div style={{ marginBottom: '4px', opacity: 0.9 }}><strong>{formulaLabel}:</strong> {definition.formula}</div>
          <div style={{ opacity: 0.8, lineHeight: '1.4' }}>{definition.description}</div>
        </div>
      )}
    </span>
  );
};

// Sorting utility function
const useTableSort = <T,>(data: T[], defaultSortKey?: keyof T) => {
  const [sortConfig, setSortConfig] = useState<{ key: keyof T; direction: 'asc' | 'desc' } | null>(
    defaultSortKey ? { key: defaultSortKey, direction: 'desc' } : null
  );

  const handleSort = (key: keyof T) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedData = React.useMemo(() => {
    if (!sortConfig) return data;
    
    return [...data].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      
      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;
      
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
      }
      
      const aString = String(aValue).toLowerCase();
      const bString = String(bValue).toLowerCase();
      
      if (sortConfig.direction === 'asc') {
        return aString < bString ? -1 : aString > bString ? 1 : 0;
      } else {
        return aString > bString ? -1 : aString < bString ? 1 : 0;
      }
    });
  }, [data, sortConfig]);

  return { sortedData, sortConfig, handleSort };
};

const PartnerPerformanceDashboard = () => {
  const [timeRange, setTimeRange] = useState<'hourly' | '7d' | '14d' | '30d' | 'thisMonth' | 'lastMonth' | 'thisQ' | 'lastQ' | 'custom'>('7d');
  const [activeSection, setActiveSection] = useState('dashboard');
  /** When partner has both Shop and Creator access, switch Sales vs Creators summary on Dashboard */
  const [dashboardView, setDashboardView] = useState<'sales' | 'creators'>('sales');
  /** Creator tab (embedded): exclude cancelled — Sales-style Filter button + custom dropdown */
  const [creatorExcludeCancelled, setCreatorExcludeCancelled] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [expandedMenus, setExpandedMenus] = useState<Set<string>>(new Set());

  useEffect(() => {
    const creatorSubSections = ['creator-overview', 'creator-detail-reports'];
    if (creatorSubSections.includes(activeSection)) {
      setExpandedMenus((prev) => {
        if (prev.has('creator-performance')) return prev;
        const next = new Set(prev);
        next.add('creator-performance');
        return next;
      });
    }
  }, [activeSection]);

  const [plans, setPlans] = useState<PartnerPlans>(mockPartnerPlans);
  const [mapRegion, setMapRegion] = useState('north-america'); // north-america, europe, asia, oceania, africa, global
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number]>([-95, 40]);
  const [mapZoom, setMapZoom] = useState<number>(3);
  const [mapType, setMapType] = useState<'world' | 'usa-states'>('world');
  const [selectedMetric, setSelectedMetric] = useState<'orders' | 'customers' | 'revenue' | 'cvr'>('orders');
  const [detailReportDateFilter, setDetailReportDateFilter] = useState<'7d' | '14d' | '30d' | 'thisMonth' | 'lastMonth'>('30d');
  const [detailReportTab, setDetailReportTab] = useState<'weekday-weekend' | 'customer-interests' | 'product-content' | 'high-ctr-low-cvr' | 'high-cvr-low-ctr' | 'spreadsheet'>('weekday-weekend');
  
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
  
  // Track mouse position for drag detection
  const [mouseDownPos, setMouseDownPos] = useState<{ x: number; y: number } | null>(null);
  const isDraggingRef = useRef(false);
  
  // Custom date range states
  const [showCustomDatePicker, setShowCustomDatePicker] = useState(false);
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [isCustomRange, setIsCustomRange] = useState(false);
  
  // Help menu dropdown state
  const [showHelpMenu, setShowHelpMenu] = useState(false);
  const helpMenuRef = useRef<HTMLDivElement>(null);
  
  // User menu dropdown state
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  
  // Notification state
  const [showNotificationMenu, setShowNotificationMenu] = useState(false);
  const notificationMenuRef = useRef<HTMLDivElement>(null);

  /** Creators dashboard: Filter uses Sales-style button + custom dropdown (not Carbon) */
  const [creatorFilterMenuOpen, setCreatorFilterMenuOpen] = useState(false);
  const creatorFilterMenuRef = useRef<HTMLDivElement>(null);

  // Site-wide currency and timezone (persisted to localStorage)
  const [currency, setCurrency] = useState<string>(() => {
    if (typeof (globalThis as unknown as { window?: unknown }).window === 'undefined') return 'USD';
    return (globalThis as unknown as { localStorage?: { getItem(key: string): string | null; setItem(key: string, value: string): void } }).localStorage?.getItem('dashboard-currency') || 'USD';
  });
  const [timezone, setTimezone] = useState<string>(() => {
    if (typeof (globalThis as unknown as { window?: unknown }).window === 'undefined') return 'America/New_York';
    return (globalThis as unknown as { localStorage?: { getItem(key: string): string | null; setItem(key: string, value: string): void } }).localStorage?.getItem('dashboard-timezone') || 'America/New_York';
  });
  type SettingsNavTab = 'account' | 'general' | 'organization' | 'team' | 'support';
  const SETTINGS_NAV_ITEMS: readonly SettingsNavTab[] = [
    'account',
    'general',
    'organization',
    'team',
    'support',
  ];
  const [settingsNavTab, setSettingsNavTab] = useState<SettingsNavTab>('general');
  /** Shared settings modal shell (same as Invite Member): invite vs contact support */
  type SettingsModalMode = 'invite' | 'contact' | null;
  const [settingsModal, setSettingsModal] = useState<SettingsModalMode>(null);
  const [inviteMemberEmail, setInviteMemberEmail] = useState('');
  const [displayLanguage, setDisplayLanguage] = useState<SupportedLocale>(() => {
    if (typeof (globalThis as unknown as { window?: unknown }).window === 'undefined') return 'en';
    const stored = (globalThis as unknown as { localStorage?: { getItem(key: string): string | null } }).localStorage?.getItem('dashboard-display-language');
    if (isSupportedLocale(stored)) {
      return stored;
    }
    return 'en';
  });

  type SupportInquiryStatus = 'Open' | 'Resolved';
  type SupportInquiry = {
    id: string;
    category: string;
    subject: string;
    messagePreview: string;
    status: SupportInquiryStatus;
    submittedAt: string; // ISO
  };

  type SupportInquiryCategory = { value: string; label: string };

  const SUPPORT_INQUIRY_CATEGORIES: readonly SupportInquiryCategory[] = [
    { value: 'Technical Issue', label: 'Technical Issue' },
    { value: 'Billing', label: 'Billing' },
    { value: 'Account Access', label: 'Account Access' },
    { value: 'Feature Request', label: 'Feature Request' },
    { value: 'Other', label: 'Other' },
  ];

  const DEFAULT_SUPPORT_INQUIRY_CATEGORY = 'Technical Issue';

  const [inquiries, setInquiries] = useState<SupportInquiry[]>([]);
  const [inquiryCategory, setInquiryCategory] = useState<string>(DEFAULT_SUPPORT_INQUIRY_CATEGORY);
  const [contactSubject, setContactSubject] = useState<string>('');
  const [contactMessage, setContactMessage] = useState<string>('');
  const [contactFormStatus, setContactFormStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);


  const selectedSupportInquiryCategoryItem =
    SUPPORT_INQUIRY_CATEGORIES.find((i) => i.value === inquiryCategory) ?? null;

  const formatSupportInquiryDate = (iso: string) => {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso;
    return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: '2-digit' });
  };

  const resetContactSupportForm = () => {
    setInquiryCategory(DEFAULT_SUPPORT_INQUIRY_CATEGORY);
    setContactSubject('');
    setContactMessage('');
    setContactFormStatus(null);
  };

  const handleSendInquiry = () => {
    const subject = contactSubject.trim();
    const message = contactMessage.trim();

    if (!subject || !message) {
      setContactFormStatus({ type: 'error', message: 'Please enter a subject and message.' });
      return false;
    }

    const nowIso = new Date().toISOString();
    const preview = message.length > 120 ? message.slice(0, 120).trimEnd() : message;
    const nextInquiry: SupportInquiry = {
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      category: inquiryCategory,
      subject,
      messagePreview: preview,
      status: 'Open',
      submittedAt: nowIso,
    };

    setInquiries((prev) => [nextInquiry, ...prev]);
    setContactSubject('');
    setContactMessage('');
    setContactFormStatus({ type: 'success', message: 'Inquiry sent. We will get back to you shortly.' });
    setTimeout(() => setContactFormStatus(null), 3000);
    return true;
  };

  const [orgEntityDisplayNames, setOrgEntityDisplayNames] = useState<Record<string, string>>(() =>
    Object.fromEntries(
      mockOrganizationSettings.associatedEntities.map((e) => [e.id, e.displayName])
    )
  );
  const countryOfBusinessItems = useMemo(() => buildCountryOfBusinessItems(), []);
  const [countryOfBusiness, setCountryOfBusiness] = useState<string>('US');
  useEffect(() => {
    if (typeof (globalThis as unknown as { window?: unknown }).window === 'undefined') return;
    const c = (globalThis as unknown as { localStorage?: { getItem(key: string): string | null; setItem(key: string, value: string): void } }).localStorage?.getItem('dashboard-currency');
    const t = (globalThis as unknown as { localStorage?: { getItem(key: string): string | null; setItem(key: string, value: string): void } }).localStorage?.getItem('dashboard-timezone');
    if (c) setCurrency(c);
    if (t) setTimezone(t);
  }, []);
  const persistDashboardSettings = (nextCurrency: string, nextTimezone: string) => {
    if (typeof (globalThis as unknown as { window?: unknown }).window === 'undefined') return;
    (globalThis as unknown as { localStorage?: { getItem(key: string): string | null; setItem(key: string, value: string): void } }).localStorage?.setItem(
      'dashboard-currency',
      nextCurrency
    );
    (globalThis as unknown as { localStorage?: { getItem(key: string): string | null; setItem(key: string, value: string): void } }).localStorage?.setItem(
      'dashboard-timezone',
      nextTimezone
    );
  };
  const formatCurrency = (value: number, options?: { compact?: boolean }) => {
    if (options?.compact && value >= 1000) {
      const formatter = new Intl.NumberFormat(undefined, { style: 'currency', currency, maximumFractionDigits: 0, minimumFractionDigits: 0 });
      return formatter.format(value / 1000) + 'k';
    }
    return new Intl.NumberFormat(undefined, { style: 'currency', currency }).format(value);
  };
  const formatInTimeZone = (date: Date, options?: Intl.DateTimeFormatOptions) => {
    return new Intl.DateTimeFormat(undefined, { timeZone: timezone, ...options }).format(date);
  };

  const timezoneComboItems = useMemo((): StandardTimezoneOption[] => {
    const base = [...STANDARD_TIMEZONE_OPTIONS];
    if (!isStandardTimezoneId(timezone)) {
      const exists = base.some((o) => o.value === timezone);
      if (!exists) {
        return [{ value: timezone, label: `${timezone} (current)` }, ...base];
      }
    }
    return base;
  }, [timezone]);

  const selectedTimezoneItem = useMemo(() => {
    return timezoneComboItems.find((o) => o.value === timezone) ?? null;
  }, [timezoneComboItems, timezone]);

  const selectedCurrencyItem = useMemo(() => {
    return CURRENCY_COMBO_ITEMS.find((o) => o.value === currency) ?? null;
  }, [currency]);

  const selectedCountryOfBusinessItem = useMemo(() => {
    return countryOfBusinessItems.find((o) => o.value === countryOfBusiness) ?? null;
  }, [countryOfBusiness, countryOfBusinessItems]);

  const selectedDisplayLanguageItem = useMemo(() => {
    return DISPLAY_LANGUAGE_OPTIONS.find((o) => o.value === displayLanguage) ?? null;
  }, [displayLanguage]);
  const settingsCopy = SETTINGS_I18N[displayLanguage];
  const extraCopy =
    displayLanguage === 'ko'
      ? {
          export: '내보내기',
          globalCustomerDistribution: '글로벌 고객 분포',
          viewBy: '보기 기준:',
          region: '지역:',
          orders: '주문',
          customers: '고객',
          northAmerica: '북미',
          europe: '유럽',
          asia: '아시아',
          oceania: '오세아니아',
          africa: '아프리카',
          globalView: '전체 보기',
          regionalPerformanceInsights: '지역별 성과 인사이트',
          highestConversionRate: '최고 전환율',
          mostCustomers: '최다 고객',
          highestRevenue: '최고 매출',
          fastestGrowing: '가장 빠른 성장',
          activeUsersByGender: '성별 활성 사용자',
          searchClickEfficiency: '키워드별 검색 -> 클릭 효율',
          searchClickEfficiencyDesc: '사용자 검색 수요와 클릭 성과 매핑',
          customerInterests: '고객 관심사',
          newUsers: '신규 사용자',
          totalUsers: '전체 사용자',
          returningUsers: '재방문 사용자',
          users: '사용자',
          impressions: '노출',
          itemName: '항목명',
          product: '제품',
          content: '콘텐츠',
          revenueWord: '매출',
          topPerformingItems: '상위 {count}개 {type} 성과 항목',
          highCtrLowCvr: '높은 CTR, 낮은 CVR',
          highCtrLowCvrDesc: '상위 25% CTR, 하위 25% CVR - 전환 퍼널 최적화',
          highCvrLowCtr: '높은 CVR, 낮은 CTR',
          highCvrLowCtrDesc: '상위 25% CVR, 하위 25% CTR - 노출과 트래픽 확대',
          recommendations: '추천 사항',
          recommendationAov: 'AOV가 카테고리 평균보다 10.5% 낮습니다. 고가 상품 프로모션을 고려하세요.',
          recommendationCvr: 'CVR이 강세입니다 - 평균 대비 11% 높습니다. 현재 전략을 유지하세요.',
          recommendationReturnRate: '반품률이 평균보다 22% 낮습니다 - 우수한 품질 관리입니다.',
          learnFromTopPerformers: '상위 성과자에게 배우기',
          learnFromTopPerformersDesc: '고수익 판매자의 성공 패턴과 모범 사례',
          recommendedActions: '추천 액션',
          recommendedActionsDesc: '수익 극대화를 위한 AI 기반 제안',
          comingSoon: '곧 제공',
          you: '나',
          average: '평균',
          top5: '상위 5%',
          activeUsersLast30m: '최근 30분 활성 사용자',
          activeUsersPerMinute: '분당 활성 사용자',
          viewRealtime: '실시간 보기',
        }
      : displayLanguage === 'ja'
        ? {
            export: 'エクスポート',
            globalCustomerDistribution: 'グローバル顧客分布',
            viewBy: '表示基準:',
            region: '地域:',
            orders: '注文',
            customers: '顧客',
            northAmerica: '北米',
            europe: 'ヨーロッパ',
            asia: 'アジア',
            oceania: 'オセアニア',
            africa: 'アフリカ',
            globalView: '全体表示',
            regionalPerformanceInsights: '地域別パフォーマンスインサイト',
            highestConversionRate: '最高コンバージョン率',
            mostCustomers: '最多顧客',
            highestRevenue: '最高売上',
            fastestGrowing: '最速成長',
            activeUsersByGender: '性別アクティブユーザー',
            searchClickEfficiency: 'キーワード別 検索 -> クリック効率',
            searchClickEfficiencyDesc: '検索需要とクリック成果のマッピング',
            customerInterests: '顧客の興味',
            newUsers: '新規ユーザー',
            totalUsers: '合計ユーザー',
            returningUsers: 'リピーターユーザー',
            users: 'ユーザー',
            impressions: '表示回数',
            itemName: '項目名',
            product: '商品',
            content: 'コンテンツ',
            revenueWord: '売上',
            topPerformingItems: '上位{count}件の{type}成果アイテム',
            highCtrLowCvr: '高CTR・低CVR',
            highCtrLowCvrDesc: 'CTR上位25%、CVR下位25% - コンバージョン導線を最適化',
            highCvrLowCtr: '高CVR・低CTR',
            highCvrLowCtrDesc: 'CVR上位25%、CTR下位25% - 露出と流入を強化',
            recommendations: 'おすすめ',
            recommendationAov: 'AOVはカテゴリ平均より10.5%低いです。高単価商品の訴求を検討してください。',
            recommendationCvr: 'CVRは好調です - 平均より11%高い状態です。現行戦略を維持しましょう。',
            recommendationReturnRate: '返品率は平均より22%低く、優れた品質管理ができています。',
            learnFromTopPerformers: 'トップパフォーマーから学ぶ',
            learnFromTopPerformersDesc: '高収益セラーの成功パターンとベストプラクティス',
            recommendedActions: '推奨アクション',
            recommendedActionsDesc: '収益最大化のためのAI提案',
            comingSoon: '近日公開',
            you: 'あなた',
            average: '平均',
            top5: '上位5%',
            activeUsersLast30m: '直近30分のアクティブユーザー',
            activeUsersPerMinute: '1分あたりアクティブユーザー',
            viewRealtime: 'リアルタイムを見る',
          }
        : {
            export: 'Export',
            globalCustomerDistribution: 'Global Customer Distribution',
            viewBy: 'View by:',
            region: 'Region:',
            orders: 'Orders',
            customers: 'Customers',
            northAmerica: 'North America',
            europe: 'Europe',
            asia: 'Asia',
            oceania: 'Oceania',
            africa: 'Africa',
            globalView: 'Global View',
            regionalPerformanceInsights: 'Regional Performance Insights',
            highestConversionRate: 'Highest Conversion Rate',
            mostCustomers: 'Most Customers',
            highestRevenue: 'Highest Revenue',
            fastestGrowing: 'Fastest Growing',
            activeUsersByGender: 'Active users by Gender',
            searchClickEfficiency: 'Search -> Click Efficiency by Keyword',
            searchClickEfficiencyDesc: 'Mapping user search demand against click performance',
            customerInterests: 'Customer Interests',
            newUsers: 'New users',
            totalUsers: 'Total users',
            returningUsers: 'Returning users',
            users: 'Users',
            impressions: 'Impressions',
            itemName: 'Item Name',
            product: 'Product',
            content: 'Content',
            revenueWord: 'revenue',
            topPerformingItems: 'Top {count} performing {type} items',
            highCtrLowCvr: 'High CTR, Low CVR',
            highCtrLowCvrDesc: 'Top 25% CTR, Bottom 25% CVR - Optimize conversion funnel',
            highCvrLowCtr: 'High CVR, Low CTR',
            highCvrLowCtrDesc: 'Top 25% CVR, Bottom 25% CTR - Increase visibility and traffic',
            recommendations: 'Recommendations',
            recommendationAov: 'Your AOV is 10.5% below category average. Consider promoting higher-value items.',
            recommendationCvr: 'Your CVR is strong - 11% above average. Maintain current strategy.',
            recommendationReturnRate: 'Your return rate is 22% lower than average - excellent quality control.',
            learnFromTopPerformers: 'Learn from Top Performers',
            learnFromTopPerformersDesc: 'Success patterns and best practices from high-earning sellers',
            recommendedActions: 'Recommended Actions',
            recommendedActionsDesc: 'AI-powered suggestions to maximize your earnings',
            comingSoon: 'Coming Soon',
            you: 'You',
            average: 'Average',
            top5: 'Top 5%',
            activeUsersLast30m: 'Active Users In Last 30 min',
            activeUsersPerMinute: 'Active users per minute',
            viewRealtime: 'View realtime',
          };
  const settingsNavLabels: Record<SettingsNavTab, string> = {
    account: settingsCopy.settingsTabAccount,
    general: settingsCopy.settingsTabGeneral,
    organization: settingsCopy.settingsTabOrganization,
    team: settingsCopy.settingsTabTeam,
    support: settingsCopy.settingsTabSupport,
  };
  const localizedRecommendations = [
    extraCopy.recommendationAov,
    extraCopy.recommendationCvr,
    extraCopy.recommendationReturnRate,
  ];

  // Mock notifications data
  const mockNotifications = [
    {
      id: 1,
      title: 'Revenue Alert',
      message: 'Your revenue dropped 15% compared to last week',
      time: '2 hours ago',
      type: 'warning',
      read: false
    },
    {
      id: 2,
      title: 'Campaign Status',
      message: 'Campaign "Summer Sale" has reached 80% of budget',
      time: '5 hours ago',
      type: 'info',
      read: false
    },
    {
      id: 3,
      title: 'New Feature Available',
      message: 'Advanced analytics dashboard is now available for paid plans',
      time: '1 day ago',
      type: 'info',
      read: true
    },
    {
      id: 4,
      title: 'Data Sync Complete',
      message: 'Your latest performance data has been synced successfully',
      time: '2 days ago',
      type: 'success',
      read: true
    },
    {
      id: 5,
      title: 'High CVR Opportunity',
      message: '3 products in "High CVR Low CTR" list — consider increasing visibility',
      time: '3 days ago',
      type: 'info',
      read: false
    },
    {
      id: 6,
      title: 'Weekend Performance Up',
      message: 'Weekend revenue up 8% vs last month. Weekend vs Weekday report updated.',
      time: '4 days ago',
      type: 'success',
      read: true
    },
    {
      id: 7,
      title: 'New Markets Detected',
      message: 'Traffic from Japan and Netherlands increased. Check Regional Performance.',
      time: '5 days ago',
      type: 'info',
      read: true
    },
    {
      id: 8,
      title: 'Detail Reports Ready',
      message: 'Full report tabs are now available under Shop Performance → Detail Reports',
      time: '1 week ago',
      type: 'success',
      read: true
    }
  ];
  
  const unreadCount = mockNotifications.filter(n => !n.read).length;
  
  // Filter states for detail tabs
  const [campaignFilter, setCampaignFilter] = useState('all'); // all, active, completed
  
  // Dashboard metric selection (GA4 style)
  const [dashboardMetric, setDashboardMetric] = useState<'newUsers' | 'totalUsers' | 'impressions' | 'returningUsers'>('newUsers');
  const [dashboardDateRange, setDashboardDateRange] = useState<'7d' | '28d' | '90d' | 'custom'>('7d');
  
  // Weekend vs Weekday Performance time period
  const [weekendWeekdayTimePeriod, setWeekendWeekdayTimePeriod] = useState<'1month' | '3months' | '6months' | '1year'>('1month');
  
  // Shop Performance and Creator Performance date filters
  const [shopPerformanceDateFilter, setShopPerformanceDateFilter] = useState<'7d' | '14d' | '30d' | 'thisMonth' | 'lastMonth' | 'thisQ' | 'lastQ'>('7d');
  const [creatorPerformanceDateFilter, setCreatorPerformanceDateFilter] = useState<'7d' | '14d' | '30d' | 'thisMonth' | 'lastMonth' | 'thisQ' | 'lastQ'>('7d');

  // Table sorting hooks - must be called at top level (Rules of Hooks)
  // These are called unconditionally to ensure hooks are always called in the same order
  
  // Compute filtered campaigns data
  const filteredCampaigns = React.useMemo(() => {
    return campaignFilter === 'all' 
      ? mockWebsitePerformance.campaigns.campaignPerformance
      : mockWebsitePerformance.campaigns.campaignPerformance.filter(c => c.status === campaignFilter);
  }, [campaignFilter]);

  // Compute "What's Working Best" items data
  const allWorkingItems = React.useMemo(() => {
    const allItems = [
      ...topPerformingItemsByTrafficSource.realry,
      ...topPerformingItemsByTrafficSource.css,
      ...topPerformingItemsByTrafficSource.instagramStories,
      ...topPerformingItemsByTrafficSource.edm
    ].filter(item => item.itemType !== 'Banner');
    
    const itemsByType = {
      'Product': allItems.filter(item => item.itemType === 'Product'),
      'Content': allItems.filter(item => item.itemType === 'Content')
    };
    
    return itemsByType;
  }, []);

  // Compute Product Optimization Opportunities data
  const allOptimizationItems = React.useMemo(() => {
    const allItems = [
      ...topPerformingItemsByTrafficSource.realry,
      ...topPerformingItemsByTrafficSource.css,
      ...topPerformingItemsByTrafficSource.instagramStories,
      ...topPerformingItemsByTrafficSource.edm
    ];
    
    // Calculate CTR for all items
    const itemsWithCTR = allItems.map(item => ({
      ...item,
      ctr: item.impressions > 0 ? (item.clicks / item.impressions) * 100 : 0
    }));
    
    // Sort by CTR and CVR to find thresholds
    const sortedByCTR = [...itemsWithCTR].sort((a, b) => b.ctr - a.ctr);
    const sortedByCVR = [...itemsWithCTR].sort((a, b) => b.cvr - a.cvr);
    
    // Calculate 25th and 75th percentiles
    const ctr75th = sortedByCTR[Math.floor(sortedByCTR.length * 0.25)]?.ctr || 0;
    const ctr25th = sortedByCTR[Math.floor(sortedByCTR.length * 0.75)]?.ctr || 0;
    const cvr75th = sortedByCVR[Math.floor(sortedByCVR.length * 0.25)]?.cvr || 0;
    const cvr25th = sortedByCVR[Math.floor(sortedByCVR.length * 0.75)]?.cvr || 0;
    
    // High CTR but Low CVR (top 25% CTR, bottom 25% CVR)
    const highCTRLowCVR = itemsWithCTR
      .filter(item => item.ctr >= ctr75th && item.cvr <= cvr25th)
      .sort((a, b) => b.ctr - a.ctr)
      .slice(0, 3);
    
    // High CVR but Low CTR (top 25% CVR, bottom 25% CTR)
    const highCVRLowCTR = itemsWithCTR
      .filter(item => item.cvr >= cvr75th && item.ctr <= ctr25th)
      .sort((a, b) => b.cvr - a.cvr)
      .slice(0, 3);
    
    return { highCTRLowCVR, highCVRLowCTR };
  }, []);

  // Deterministic pseudo-random function based on seed
  const seededRandom = (seed: number) => {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  };

  // Generate comprehensive time series data based on date range
  const generateTimeSeriesData = (range: typeof timeRange) => {
    const now = new Date();
    const data: Array<{ date: string; revenue: number; revenueNew: number; revenueReturning: number; clicks: number; conversions: number; roas: number }> = [];
    
    let days = 7;
    let startDate = new Date(now);
    
    switch (range) {
      case 'hourly':
        // For hourly, show last 24 hours
        for (let i = 23; i >= 0; i--) {
          const date = new Date(now);
          date.setHours(date.getHours() - i);
          const hour = date.getHours();
          const baseRevenue = 200 + (hour >= 7 && hour <= 9 ? 300 : hour >= 19 && hour <= 21 ? 400 : 100);
          const seed = hour * 1000 + i; // Deterministic seed based on hour and index
          data.push({
            date: `${hour}:00`,
            revenue: baseRevenue + seededRandom(seed) * 200,
            revenueNew: (baseRevenue + seededRandom(seed + 1) * 200) * 0.4,
            revenueReturning: (baseRevenue + seededRandom(seed + 2) * 200) * 0.6,
            clicks: Math.floor(baseRevenue / 5) + Math.floor(seededRandom(seed + 3) * 50),
            conversions: Math.floor(baseRevenue / 40) + Math.floor(seededRandom(seed + 4) * 10),
            roas: 3.0 + seededRandom(seed + 5) * 1.0
          });
        }
        return data;
      case '7d':
        days = 7;
        startDate.setDate(now.getDate() - 6);
        break;
      case '14d':
        days = 14;
        startDate.setDate(now.getDate() - 13);
        break;
      case '30d':
        days = 30;
        startDate.setDate(now.getDate() - 29);
        break;
      case 'thisMonth':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        days = Math.floor((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
        break;
      case 'lastMonth':
        startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);
        days = lastMonthEnd.getDate();
        break;
      case 'thisQ':
        const quarter = Math.floor(now.getMonth() / 3);
        startDate = new Date(now.getFullYear(), quarter * 3, 1);
        days = Math.floor((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
        break;
      case 'lastQ':
        const lastQuarter = Math.floor(now.getMonth() / 3) - 1;
        const lastQuarterYear = lastQuarter < 0 ? now.getFullYear() - 1 : now.getFullYear();
        const lastQuarterMonth = lastQuarter < 0 ? 9 : lastQuarter * 3;
        startDate = new Date(lastQuarterYear, lastQuarterMonth, 1);
        const lastQuarterEnd = new Date(lastQuarterYear, lastQuarterMonth + 3, 0);
        days = lastQuarterEnd.getDate();
        break;
      case 'custom':
        // For custom, use the last 7 days as default
        days = 7;
        startDate.setDate(now.getDate() - 6);
        break;
    }
    
    // Generate daily data
    for (let i = 0; i < days; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      const dayOfWeek = date.getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      
      // Weekend has slightly different performance
      const baseRevenue = isWeekend ? 6000 : 7000;
      // Use date as seed for deterministic randomness
      const dateSeed = date.getTime();
      const variance = seededRandom(dateSeed) * 2000;
      const revenue = baseRevenue + variance;
      
      data.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        revenue: Math.round(revenue),
        revenueNew: Math.round(revenue * 0.4),
        revenueReturning: Math.round(revenue * 0.6),
        clicks: Math.floor(revenue / 5) + Math.floor(seededRandom(dateSeed + 1) * 200),
        conversions: Math.floor(revenue / 38) + Math.floor(seededRandom(dateSeed + 2) * 20),
        roas: 3.2 + seededRandom(dateSeed + 3) * 0.8
      });
    }
    
    return data;
  };

  // Get filtered data based on timeRange
  const filteredRevenueData = React.useMemo(() => {
    return generateTimeSeriesData(timeRange);
  }, [timeRange]);

  // Use filtered revenue data with spend calculation
  const revenueData = React.useMemo(() => {
    return filteredRevenueData.map(d => ({
      date: d.date,
      revenue: d.revenue,
      clicks: d.clicks,
      conversions: d.conversions,
      spend: d.clicks * 1.65, // Estimated spend based on CPC
      roas: d.roas
    }));
  }, [filteredRevenueData]);

  // Calculate aggregated metrics from filtered data
  const aggregatedMetrics = React.useMemo(() => {
    const totalRevenue = filteredRevenueData.reduce((sum, d) => sum + d.revenue, 0);
    const totalClicks = filteredRevenueData.reduce((sum, d) => sum + d.clicks, 0);
    const totalConversions = filteredRevenueData.reduce((sum, d) => sum + d.conversions, 0);
    const totalSpend = totalClicks * 1.65; // Estimated spend based on CPC
    
    const avgROAS = totalSpend > 0 ? totalRevenue / totalSpend : 0;
    const cvr = totalClicks > 0 ? (totalConversions / totalClicks) * 100 : 0;
    const ctr = totalClicks > 0 ? (totalClicks / (totalClicks * 14)) * 100 : 0; // Estimated impressions
    const aov = totalConversions > 0 ? totalRevenue / totalConversions : 0;
    
    // Calculate previous period for comparison
    const previousPeriodData = generateTimeSeriesData(timeRange);
    const previousRevenue = previousPeriodData.reduce((sum, d) => sum + d.revenue * 0.9, 0); // Slightly lower
    const change = previousRevenue > 0 ? ((totalRevenue - previousRevenue) / previousRevenue) * 100 : 0;
    
    return {
      revenue: totalRevenue,
      clicks: totalClicks,
      conversions: totalConversions,
      roas: avgROAS,
      cvr: cvr,
      ctr: ctr,
      aov: aov,
      change: change,
      trend: change >= 0 ? 'up' as const : 'down' as const
    };
  }, [filteredRevenueData, timeRange]);

  const revenueTrend = filteredRevenueData.map(d => d.revenue);
  const clicksTrend = filteredRevenueData.map(d => d.clicks);
  const conversionsTrend = filteredRevenueData.map(d => d.conversions);
  const cvrTrend = filteredRevenueData.map(d => ((d.conversions / d.clicks) * 100));

  // Function to get date range description
  const getTimeRangeLabel = (range: typeof timeRange): string => {
    const descriptions: Record<string, string> = {
      hourly: settingsCopy.periodHourly,
      '7d': settingsCopy.periodLast7Days,
      '14d': settingsCopy.periodLast14Days,
      '30d': settingsCopy.periodLast30Days,
      thisMonth: settingsCopy.periodThisMonth,
      lastMonth: settingsCopy.periodLastMonth,
      thisQ: settingsCopy.periodThisQuarter,
      lastQ: settingsCopy.periodLastQuarter,
      custom: settingsCopy.periodCustomRange,
    };
    return descriptions[range] || settingsCopy.periodLast7Days;
  };
  const getDateRangeDescription = (range: typeof timeRange): string => {
    return getTimeRangeLabel(range);
  };

  const metrics = React.useMemo(() => [
    {
      key: 'totalRevenue',
      title: settingsCopy.metricTotalRevenue,
      value: formatCurrency(aggregatedMetrics.revenue),
      change: `${aggregatedMetrics.change >= 0 ? '+' : ''}${aggregatedMetrics.change.toFixed(1)}%`,
      trend: aggregatedMetrics.trend,
      description: getDateRangeDescription(timeRange),
      trendData: revenueTrend,
      color: '#0f62fe'
    },
    {
      key: 'ctr',
      title: settingsCopy.metricClickThroughRate,
      value: `${aggregatedMetrics.ctr.toFixed(1)}%`,
      change: '+0.8%',
      trend: 'up' as const,
      description: settingsCopy.metricAverageCtr,
      trendData: cvrTrend,
      color: '#8a3ffc'
    },
    {
      key: 'roas',
      title: settingsCopy.metricRoas,
      value: `${aggregatedMetrics.roas.toFixed(1)}x`,
      change: '+0.5x',
      trend: 'up' as const,
      description: settingsCopy.metricReturnOnAdSpend,
      trendData: filteredRevenueData.map(d => d.roas),
      color: '#0072c3'
    },
    {
      key: 'cvr',
      title: settingsCopy.metricConversionRate,
      value: `${aggregatedMetrics.cvr.toFixed(1)}%`,
      change: '-0.3%',
      trend: 'down' as const,
      description: settingsCopy.metricAverageCvr,
      trendData: cvrTrend,
      color: '#00539a'
    },
  ], [timeRange, revenueTrend, cvrTrend, aggregatedMetrics, filteredRevenueData, currency, settingsCopy]);

  // Call all sorting hooks at top level
  const revenueTableSort = useTableSort(revenueData, 'date');
  const campaignTableSort = useTableSort(filteredCampaigns, 'revenue');
  
  // For "What's Working Best" - we'll create separate hooks for each type
  const productItemsSort = useTableSort(
    allWorkingItems['Product']?.slice(0, 5) || [],
    'clicks'
  );
  const contentItemsSort = useTableSort(
    allWorkingItems['Content']?.slice(0, 5) || [],
    'clicks'
  );
  
  // For Product Optimization Opportunities
  const highCTRLowCVRSort = useTableSort(allOptimizationItems.highCTRLowCVR, 'ctr' as any);
  const highCVRLowCTRSort = useTableSort(allOptimizationItems.highCVRLowCTR, 'cvr');

  // Dynamic performance rank based on time range
  const performanceRankByTimeRange = React.useMemo(() => {
    // Mock different percentile values for different time ranges
    const rankMap: { [key: string]: number } = {
      'hourly': 82, // Top 18%
      '7d': 78,     // Top 22%
      '14d': 75,    // Top 25%
      '30d': 72,    // Top 28%
      'thisMonth': 70, // Top 30%
      'lastMonth': 68, // Top 32%
      'thisQ': 65,     // Top 35%
      'lastQ': 63,     // Top 37%
      'custom': 78     // Default to 7d value
    };
    
    return {
      percentile: rankMap[timeRange] || 78,
      rank: 234,
      totalShops: 1050,
      category: 'mid-size'
    };
  }, [timeRange]);

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
    // If clicking the same country that's already selected, deselect it
    if (selectedCountry === countryName) {
      setSelectedCountry(null);
      setSelectedCity(null);
      return;
    }
    
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

  const canViewSalesDashboard = hasShopPlan();
  const canViewCreatorDashboard = hasCreatorPlan();
  /** Sales metrics: show when shop-only, or when both and tab is Sales */
  const showSalesDashboard =
    canViewSalesDashboard &&
    (!canViewCreatorDashboard || dashboardView === 'sales');
  /** Creator summary: show when creator-only, or when both and tab is Creators */
  const showCreatorDashboard =
    canViewCreatorDashboard &&
    (!canViewSalesDashboard || dashboardView === 'creators');

  /** Active options in the Creators toolbar Filter menu (shown as a count badge on the button) */
  const creatorFilterSelectedCount = creatorExcludeCancelled ? 1 : 0;

  // Handle time range selection
  const handleTimeRangeChange = (range: 'hourly' | '7d' | '14d' | '30d' | 'thisMonth' | 'lastMonth' | 'thisQ' | 'lastQ' | 'custom') => {
    setTimeRange(range);
    if (range === 'custom') {
      setShowCustomDatePicker(true);
      setIsCustomRange(false);
    } else {
      setIsCustomRange(false);
      setShowCustomDatePicker(false);
      setCustomStartDate('');
      setCustomEndDate('');
    }
  };

  // Handle custom date range apply
  const handleCustomDateRangeApply = () => {
    if (customStartDate && customEndDate) {
      if (new Date(customStartDate) <= new Date(customEndDate)) {
        setIsCustomRange(true);
        setTimeRange('custom');
        setShowCustomDatePicker(false);
      } else {
        (globalThis as unknown as { alert?(m: string): void }).alert?.('Start date must be before or equal to end date');
      }
    } else {
      (globalThis as unknown as { alert?(m: string): void }).alert?.('Please select both start and end dates');
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
      if (datePickerRef.current && !(datePickerRef.current as unknown as { contains(node: EventTarget | null): boolean }).contains(event.target)) {
        setShowCustomDatePicker(false);
      }
      if (helpMenuRef.current && !(helpMenuRef.current as unknown as { contains(node: EventTarget | null): boolean }).contains(event.target)) {
        setShowHelpMenu(false);
      }
      if (userMenuRef.current && !(userMenuRef.current as unknown as { contains(node: EventTarget | null): boolean }).contains(event.target)) {
        setShowUserMenu(false);
      }
      if (notificationMenuRef.current && !(notificationMenuRef.current as unknown as { contains(node: EventTarget | null): boolean }).contains(event.target)) {
        setShowNotificationMenu(false);
      }
      if (creatorFilterMenuRef.current && !(creatorFilterMenuRef.current as unknown as { contains(node: EventTarget | null): boolean }).contains(event.target)) {
        setCreatorFilterMenuOpen(false);
      }
    };

    type Doc = { addEventListener(type: string, listener: (e: MouseEvent) => void): void; removeEventListener(type: string, listener: (e: MouseEvent) => void): void };
    const doc = (globalThis as unknown as { document?: Doc }).document;
    if (showCustomDatePicker || showHelpMenu || showUserMenu || showNotificationMenu || creatorFilterMenuOpen) {
      doc?.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      doc?.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showCustomDatePicker, showHelpMenu, showUserMenu, showNotificationMenu, creatorFilterMenuOpen]);

  useEffect(() => {
    if (!showCreatorDashboard) setCreatorFilterMenuOpen(false);
  }, [showCreatorDashboard]);

  // Use filtered revenue data with spend calculation (moved after filteredRevenueData definition)
  // This will be defined later after filteredRevenueData

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

  // Build menu items organized by sections
  const generalItems = [
    { 
      id: 'dashboard', 
      label: settingsCopy.navDashboard, 
      icon: Dashboard, 
      active: true,
      planBadge: null,
      badge: null,
      locked: false,
      subItems: null
    },
    {
      id: 'shop-performance',
      label: settingsCopy.navShopPerformance,
      icon: ShoppingCart,
      active: true,
      planBadge: null,
      badge: null,
      locked: false,
      subItems: [
        {
          id: 'shop-detail-reports',
          label: settingsCopy.navDetailReports,
          active: true,
          locked: false
        },
        {
          id: 'shop-bid-campaign',
          label: settingsCopy.navCampaigns,
          active: false,
          locked: true
        },
        {
          id: 'shop-update-images',
          label: settingsCopy.navContentManagement,
          active: false,
          locked: true
        }
      ]
    },
    {
      id: 'creator-performance',
      label: settingsCopy.navCreatorPerformance,
      icon: User,
      active: hasCreatorPlan(),
      planBadge: null,
      badge: null,
      locked: !hasCreatorPlan(),
      subItems: [
        {
          id: 'creator-overview',
          label: settingsCopy.navOverview,
          active: true,
          locked: false
        },
        {
          id: 'creator-detail-reports',
          label: settingsCopy.navDetailReports,
          active: true,
          locked: false
        },
        {
          id: 'creator-campaigns',
          label: settingsCopy.navCampaigns,
          active: false,
          locked: true
        },
        {
          id: 'creator-content-mgmt',
          label: settingsCopy.navContentManagement,
          active: false,
          locked: true
        }
      ]
    },
  ];

  const toolsItems = [
    {
      id: 'documents',
      label: settingsCopy.navApis,
      icon: Document,
      active: true,
      planBadge: null,
      badge: null,
      locked: false
    },
    {
      id: 'analytics',
      label: settingsCopy.navAnalytics,
      icon: Analytics,
      active: false,
      planBadge: null,
      badge: null,
      locked: false
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
    const trendData = filteredRevenueData.map((row, index) => ({
      date: row.date,
      value: metric.trendData[index] || 0,
      revenueNew: row.revenueNew || 0,
      revenueReturning: row.revenueReturning || 0,
      index
    }));

    // Check if this is the Total Revenue card
    const isTotalRevenueCard = metric.key === 'totalRevenue';

    return (
      <div className="shopify-metric-card">
        {/* Header with title, info icon, and value */}
        <div style={{ padding: '16px 16px 0 16px', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
            <MetricTooltip
              formulaLabel={settingsCopy.formulaLabel}
              metric={
              metric.key === 'totalRevenue' ? 'Revenue' :
              metric.key === 'roas' ? 'ROAS' :
              metric.key === 'cvr' ? 'CVR' :
              metric.key === 'ctr' ? 'CTR' :
              metric.title
            }
            >
              <div className="shopify-metric-label">{metric.title}</div>
            </MetricTooltip>
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
                  tickFormatter={(value: number) => formatCurrency(value, { compact: true })}
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
                            {settingsCopy.totalLabel}: {formatCurrency(total)}
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                            <div style={{ width: '12px', height: '12px', backgroundColor: '#0f62fe', borderRadius: '2px' }}></div>
                            <span style={{ color: '#5f6368', fontSize: '13px' }}>{settingsCopy.newUsers}:</span>
                            <span style={{ fontWeight: '600', color: '#202124', marginLeft: 'auto' }}>{formatCurrency(data.revenueNew)}</span>
                            <span style={{ color: '#5f6368', fontSize: '12px' }}>({newPercent}%)</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{ width: '12px', height: '12px', backgroundColor: '#a6c8ff', borderRadius: '2px' }}></div>
                            <span style={{ color: '#5f6368', fontSize: '13px' }}>{settingsCopy.returningUsers}:</span>
                            <span style={{ fontWeight: '600', color: '#202124', marginLeft: 'auto' }}>{formatCurrency(data.revenueReturning)}</span>
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
                    if (value === 'revenueNew') return settingsCopy.newUsers;
                    if (value === 'revenueReturning') return settingsCopy.returningUsers;
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
                    if (metric.title.includes('Revenue')) return formatCurrency(value, { compact: true });
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
                  if (metric.title.includes('Revenue')) return formatCurrency(value);
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
    <div
      style={{
        display: 'flex',
        width: '100%',
        maxWidth: '100%',
        minHeight: '100vh',
        minWidth: 0,
        overflowX: 'clip',
        backgroundColor: '#f6f6f7',
      }}
    >
      {/* Shopify-style Sidebar */}
      <aside 
        className="shopify-sidebar"
        style={{ 
          width: sidebarOpen ? '240px' : '64px',
          minWidth: sidebarOpen ? '240px' : '64px',
          maxWidth: sidebarOpen ? '240px' : '64px',
          flexShrink: 0,
          boxSizing: 'border-box',
          transition: 'width 0.3s ease, min-width 0.3s ease, max-width 0.3s ease',
          position: 'sticky',
          top: 0,
          height: '100vh',
          overflowX: 'hidden',
          overflowY: 'auto',
          alignSelf: 'stretch',
        }}
      >
        <div style={{ 
          height: '64px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: sidebarOpen ? 'space-between' : 'center',
          padding: sidebarOpen ? '0 24px' : '0',
          borderBottom: '1px solid var(--shopify-border)'
        }}>
          {sidebarOpen && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <img 
                src="/logo.svg" 
                alt="Seris Logo" 
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
            onClick={(e) => {
              setSidebarOpen(!sidebarOpen);
              // Blur the button to remove focus state
              const target = e.currentTarget as unknown as { blur(): void };
              if (target) {
                setTimeout(() => target.blur(), 0);
              }
            }}
            onMouseDown={(e) => {
              // Prevent focus on mouse down
              e.preventDefault();
            }}
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
            const isExpanded = expandedMenus.has(item.id);
            const hasSubItems = item.subItems && item.subItems.length > 0;
            
            return (
              <div key={item.id}>
                <button
                  onClick={(e) => {
                    if (!item.active) {
                      e.preventDefault();
                      return;
                    }
                    if (hasSubItems) {
                      // If sidebar is collapsed, expand it first
                      if (!sidebarOpen) {
                        setSidebarOpen(true);
                        // Then expand the menu after a short delay to allow sidebar animation
                        setTimeout(() => {
                          const newExpanded = new Set(expandedMenus);
                          newExpanded.add(item.id);
                          setExpandedMenus(newExpanded);
                        }, 150); // Wait for sidebar expansion animation
                      } else {
                        // Toggle sub-menu expansion when sidebar is already open
                        const newExpanded = new Set(expandedMenus);
                        if (isExpanded) {
                          newExpanded.delete(item.id);
                        } else {
                          newExpanded.add(item.id);
                        }
                        setExpandedMenus(newExpanded);
                      }
                    } else {
                      setActiveSection(item.id);
                    }
                  }}
                  disabled={!item.active}
                  className={`shopify-nav-item ${isActive && !hasSubItems ? 'active' : ''}`}
                  style={{
                    marginBottom: '2px',
                    opacity: !item.active ? 0.6 : 1,
                    cursor: !item.active ? 'not-allowed' : 'pointer',
                    justifyContent: sidebarOpen ? 'flex-start' : 'center',
                    padding: sidebarOpen ? '10px 12px' : '10px 0'
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
                        paddingLeft: '0px',
                        textAlign: 'left',
                        lineHeight: '20px'
                      }}>
                        {item.label}
                      </span>
                      {hasSubItems && (
                        <ChevronRight 
                          size={16} 
                          style={{ 
                            marginLeft: '8px',
                            color: 'var(--shopify-text-secondary)',
                            flexShrink: 0,
                            transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
                            transition: 'transform 0.2s ease'
                          }} 
                        />
                      )}
                      {item.locked && (
                        <Locked 
                          size={14} 
                          style={{ 
                            marginLeft: '8px',
                            color: 'var(--shopify-text-secondary)',
                            flexShrink: 0
                          }} 
                        />
                      )}
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
                {sidebarOpen && hasSubItems && isExpanded && (
                  <div style={{ 
                    marginLeft: '0px',
                    marginTop: '2px',
                    marginBottom: '2px'
                  }}>
                    {item.subItems.map((subItem) => {
                      const isSubActive = activeSection === subItem.id;
                      return (
                        <button
                          key={subItem.id}
                          onClick={(e) => {
                            if (!subItem.active) {
                              e.preventDefault();
                              return;
                            }
                            setActiveSection(subItem.id);
                          }}
                          disabled={!subItem.active}
                          className={`shopify-nav-item ${isSubActive ? 'active' : ''}`}
                          style={{
                            marginBottom: '2px',
                            opacity: !subItem.active ? 0.6 : 1,
                            cursor: !subItem.active ? 'not-allowed' : 'pointer',
                            paddingLeft: '12px',
                            fontSize: '13px'
                          }}
                        >
                          <span style={{ 
                            flex: 1, 
                            // "Hanging" text: shift only the label left,
                            // while keeping the whole tab/button background aligned.
                            position: 'relative',
                            left: '40px',
                            textAlign: 'left',
                            lineHeight: '20px'
                          }}>
                            {subItem.label}
                          </span>
                          {subItem.locked && (
                            <Locked 
                              size={14} 
                              style={{ 
                                marginLeft: '8px',
                                color: 'var(--shopify-text-secondary)',
                                flexShrink: 0
                              }} 
                            />
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
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
                onClick={(e) => {
                  if (!item.active) {
                    e.preventDefault();
                    return;
                  }
                  setActiveSection(item.id);
                }}
                disabled={!item.active}
                className={`shopify-nav-item ${isActive ? 'active' : ''}`}
                style={{
                  marginBottom: '2px',
                  opacity: !item.active ? 0.6 : 1,
                  cursor: !item.active ? 'not-allowed' : 'pointer',
                  justifyContent: sidebarOpen ? 'flex-start' : 'center',
                  padding: sidebarOpen ? '10px 12px' : '10px 0'
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
                    {item.locked && (
                      <Locked 
                        size={14} 
                        style={{ 
                          marginLeft: '8px',
                          color: 'var(--shopify-text-secondary)',
                          flexShrink: 0
                        }} 
                      />
                    )}
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
      <main
        style={{
          flex: 1,
          width: '100%',
          maxWidth: '100%',
          minWidth: 0,
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',
          minHeight: '100vh',
          maxHeight: '100vh',
          overflowY: 'auto',
          overflowX: 'clip',
        }}
      >
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
              (e.currentTarget as unknown as { style: Record<string, string> }).style.backgroundColor = 'white';
              (e.currentTarget as unknown as { style: Record<string, string> }).style.borderColor = '#7256F6';
            }}
            onBlur={(e) => {
              (e.currentTarget as unknown as { style: Record<string, string> }).style.backgroundColor = 'var(--shopify-gray-50)';
              (e.currentTarget as unknown as { style: Record<string, string> }).style.borderColor = 'var(--shopify-border)';
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
            {/* Notification Button */}
            <div ref={notificationMenuRef} style={{ position: 'relative' }}>
              <button
                onClick={() => setShowNotificationMenu(!showNotificationMenu)}
                onMouseDown={(e) => {
                  e.preventDefault();
                }}
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
                  (e.currentTarget as unknown as { style: Record<string, string> }).style.backgroundColor = 'var(--shopify-gray-50)';
                  (e.currentTarget as unknown as { style: Record<string, string> }).style.color = 'var(--shopify-text-primary)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as unknown as { style: Record<string, string> }).style.backgroundColor = 'transparent';
                  (e.currentTarget as unknown as { style: Record<string, string> }).style.color = 'var(--shopify-text-secondary)';
                }}
              >
                <Notification size={18} />
                {unreadCount > 0 && (
                  <span style={{
                    position: 'absolute',
                    top: '6px',
                    right: '6px',
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: '#d72c0d',
                    border: '2px solid white',
                    boxShadow: '0 0 0 1px var(--shopify-gray-50)'
                  }} />
                )}
              </button>
              
              {/* Notification Dropdown Menu */}
              {showNotificationMenu && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  marginTop: '8px',
                  backgroundColor: 'white',
                  border: '1px solid var(--shopify-border)',
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                  minWidth: '320px',
                  maxWidth: '400px',
                  maxHeight: '500px',
                  overflowY: 'auto',
                  zIndex: 1000
                }}>
                  {/* Header */}
                  <div style={{
                    padding: '16px',
                    borderBottom: '1px solid var(--shopify-border)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <h3 style={{
                      fontSize: '16px',
                      fontWeight: '600',
                      color: 'var(--shopify-text-primary)',
                      margin: 0
                    }}>
                      Notifications
                    </h3>
                    {unreadCount > 0 && (
                      <span style={{
                        fontSize: '12px',
                        color: 'var(--shopify-text-secondary)',
                        fontWeight: '500'
                      }}>
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  
                  {/* Notifications List */}
                  <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                    {mockNotifications.length === 0 ? (
                      <div style={{
                        padding: '24px',
                        textAlign: 'center',
                        color: 'var(--shopify-text-secondary)',
                        fontSize: '14px'
                      }}>
                        No notifications
                      </div>
                    ) : (
                      mockNotifications.map((notification) => (
                        <div
                          key={notification.id}
                          onClick={() => {
                            // Mark as read when clicked
                            // In real app, this would update the notification state
                            setShowNotificationMenu(false);
                          }}
                          style={{
                            padding: '12px 16px',
                            borderBottom: '1px solid var(--shopify-border)',
                            cursor: 'pointer',
                            backgroundColor: notification.read ? 'transparent' : 'var(--shopify-gray-50)',
                            transition: 'background-color 0.15s ease',
                            display: 'flex',
                            gap: '12px',
                            alignItems: 'flex-start'
                          }}
                          onMouseEnter={(e) => {
                            (e.currentTarget as unknown as { style: Record<string, string> }).style.backgroundColor = notification.read ? 'var(--shopify-gray-50)' : '#f0f0f0';
                          }}
                          onMouseLeave={(e) => {
                            (e.currentTarget as unknown as { style: Record<string, string> }).style.backgroundColor = notification.read ? 'transparent' : 'var(--shopify-gray-50)';
                          }}
                        >
                          <div style={{
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            backgroundColor: 
                              notification.type === 'warning' ? '#f49342' :
                              notification.type === 'success' ? '#008060' :
                              '#0f62fe',
                            marginTop: '6px',
                            flexShrink: 0,
                            opacity: notification.read ? 0.3 : 1
                          }} />
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{
                              fontSize: '14px',
                              fontWeight: notification.read ? '400' : '600',
                              color: 'var(--shopify-text-primary)',
                              marginBottom: '4px',
                              lineHeight: '1.4'
                            }}>
                              {notification.title}
                            </div>
                            <div style={{
                              fontSize: '13px',
                              color: 'var(--shopify-text-secondary)',
                              marginBottom: '4px',
                              lineHeight: '1.4'
                            }}>
                              {notification.message}
                            </div>
                            <div style={{
                              fontSize: '11px',
                              color: 'var(--shopify-text-secondary)',
                              opacity: 0.7
                            }}>
                              {notification.time}
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  
                  {/* Footer */}
                  {mockNotifications.length > 0 && (
                    <div style={{
                      padding: '12px 16px',
                      borderTop: '1px solid var(--shopify-border)',
                      textAlign: 'center'
                    }}>
                      <button
                        onClick={() => {
                          (globalThis as unknown as { alert?(m: string): void }).alert?.('View all notifications');
                          setShowNotificationMenu(false);
                        }}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: '#7256F6',
                          fontSize: '13px',
                          fontWeight: '500',
                          cursor: 'pointer',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          transition: 'background-color 0.15s ease'
                        }}
                        onMouseEnter={(e) => {
                          (e.currentTarget as unknown as { style: Record<string, string> }).style.backgroundColor = 'var(--shopify-gray-50)';
                        }}
                        onMouseLeave={(e) => {
                          (e.currentTarget as unknown as { style: Record<string, string> }).style.backgroundColor = 'transparent';
                        }}
                      >
                        View all notifications
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Help Menu Button */}
            <div ref={helpMenuRef} style={{ position: 'relative' }}>
              <button
                onClick={() => setShowHelpMenu(!showHelpMenu)}
                onMouseDown={(e) => {
                  e.preventDefault();
                }}
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
                  (e.currentTarget as unknown as { style: Record<string, string> }).style.backgroundColor = 'var(--shopify-gray-50)';
                  (e.currentTarget as unknown as { style: Record<string, string> }).style.color = 'var(--shopify-text-primary)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as unknown as { style: Record<string, string> }).style.backgroundColor = 'transparent';
                  (e.currentTarget as unknown as { style: Record<string, string> }).style.color = 'var(--shopify-text-secondary)';
                }}
              >
                <Help size={18} />
              </button>
              
              {/* Dropdown Menu */}
              {showHelpMenu && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  marginTop: '8px',
                  backgroundColor: 'white',
                  border: '1px solid var(--shopify-border)',
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                  minWidth: '180px',
                  zIndex: 1000,
                  overflow: 'hidden'
                }}>
                  <button
                    onClick={() => {
                      (globalThis as unknown as { alert?(m: string): void }).alert?.('Get more help');
                      setShowHelpMenu(false);
                    }}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: 'none',
                      background: 'transparent',
                      textAlign: 'left',
                      cursor: 'pointer',
                      fontSize: '14px',
                      color: 'var(--shopify-text-primary)',
                      transition: 'background-color 0.15s ease',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as unknown as { style: Record<string, string> }).style.backgroundColor = 'var(--shopify-gray-50)';
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as unknown as { style: Record<string, string> }).style.backgroundColor = 'transparent';
                    }}
                  >
                    Get more help
                  </button>
                  <button
                    onClick={() => {
                      (globalThis as unknown as { alert?(m: string): void }).alert?.('Send feedback');
                      setShowHelpMenu(false);
                    }}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: 'none',
                      background: 'transparent',
                      textAlign: 'left',
                      cursor: 'pointer',
                      fontSize: '14px',
                      color: 'var(--shopify-text-primary)',
                      transition: 'background-color 0.15s ease',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      borderTop: '1px solid var(--shopify-border)'
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as unknown as { style: Record<string, string> }).style.backgroundColor = 'var(--shopify-gray-50)';
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as unknown as { style: Record<string, string> }).style.backgroundColor = 'transparent';
                    }}
                  >
                    Send feedback
                  </button>
                </div>
              )}
            </div>

            {/* Settings Button - between avatar and info (help) icon */}
            <button
              onClick={() => setActiveSection('settings')}
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
                (e.currentTarget as unknown as { style: Record<string, string> }).style.backgroundColor = 'var(--shopify-gray-50)';
                (e.currentTarget as unknown as { style: Record<string, string> }).style.color = 'var(--shopify-text-primary)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as unknown as { style: Record<string, string> }).style.backgroundColor = 'transparent';
                (e.currentTarget as unknown as { style: Record<string, string> }).style.color = 'var(--shopify-text-secondary)';
              }}
            >
              <Settings size={18} />
            </button>

            {/* User Profile */}
            <div ref={userMenuRef} style={{ position: 'relative' }}>
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                onMouseDown={(e) => {
                  e.preventDefault();
                }}
                style={{
                  width: '36px',
                  height: '36px',
                  border: 'none',
                  background: 'transparent',
                  borderRadius: '50%',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '2px',
                  transition: 'all 0.15s ease',
                  position: 'relative'
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as unknown as { style: Record<string, string> }).style.backgroundColor = 'var(--shopify-gray-50)';
                }}
                onMouseLeave={(e) => {
                  if (!showUserMenu) {
                    (e.currentTarget as unknown as { style: Record<string, string> }).style.backgroundColor = 'transparent';
                  }
                }}
              >
                <img 
                  src="/avatar.png" 
                  alt="User avatar"
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    objectFit: 'cover'
                  }}
                />
              </button>
              
              {/* User Dropdown Menu */}
              {showUserMenu && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  marginTop: '8px',
                  backgroundColor: 'white',
                  border: '1px solid var(--shopify-border)',
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                  minWidth: '220px',
                  zIndex: 1000,
                  overflow: 'hidden'
                }}>
                  {/* User Info Section */}
                  <div style={{
                    padding: '16px',
                    borderBottom: '1px solid var(--shopify-border)'
                  }}>
                    <div
                      onClick={() => {
                        setActiveSection('settings');
                        setSettingsNavTab('account');
                        setShowUserMenu(false);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          setActiveSection('settings');
                          setSettingsNavTab('account');
                          setShowUserMenu(false);
                        }
                      }}
                      role="button"
                      tabIndex={0}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        marginBottom: '8px',
                        cursor: 'pointer'
                      }}
                    >
                      <img 
                        src="/avatar.png" 
                        alt="User avatar"
                        style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '50%',
                          objectFit: 'cover'
                        }}
                      />
                      <div style={{ flex: 1 }}>
                        <div style={{
                          fontSize: '14px',
                          fontWeight: '600',
                          color: 'var(--shopify-text-primary)',
                          lineHeight: '1.4',
                          marginBottom: '2px'
                        }}>
                          Partner Demo
                        </div>
                        <div style={{
                          fontSize: '12px',
                          color: 'var(--shopify-text-secondary)',
                          lineHeight: '1.4'
                        }}>
                          Business
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Menu Items */}
                  <div style={{ padding: '4px 0' }}>
                    <button
                      onClick={() => {
                        (globalThis as unknown as { alert?(m: string): void }).alert?.('Sign out');
                        setShowUserMenu(false);
                      }}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        border: 'none',
                        background: 'transparent',
                        textAlign: 'left',
                        cursor: 'pointer',
                        fontSize: '14px',
                        color: 'var(--shopify-text-primary)',
                        transition: 'background-color 0.15s ease',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as unknown as { style: Record<string, string> }).style.backgroundColor = 'var(--shopify-gray-50)';
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as unknown as { style: Record<string, string> }).style.backgroundColor = 'transparent';
                      }}
                    >
                      Sign out
                    </button>
                  </div>
                </div>
              )}
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
                        onChange={(e) => setCustomStartDate((e.target as unknown as { value: string }).value)}
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
                        onFocus={(e) => (e.target as unknown as { style: Record<string, string> }).style.borderColor = '#7256F6'}
                        onBlur={(e) => (e.target as unknown as { style: Record<string, string> }).style.borderColor = 'var(--shopify-border)'}
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
                        onChange={(e) => setCustomEndDate((e.target as unknown as { value: string }).value)}
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
                        onFocus={(e) => (e.target as unknown as { style: Record<string, string> }).style.borderColor = '#7256F6'}
                        onBlur={(e) => (e.target as unknown as { style: Record<string, string> }).style.borderColor = 'var(--shopify-border)'}
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
          minHeight: 0,
          minWidth: 0,
          overflowX: 'hidden',
          overflowY: 'auto',
          backgroundColor: '#f6f6f7'
        }}>
          {/* Detail Reports */}
          {activeSection === 'shop-detail-reports' && (
            <div style={{ width: '100%', minWidth: 0, flex: 1, height: '100%', maxHeight: '100%', display: 'flex', flexDirection: 'column', minHeight: 0, overflow: 'hidden' }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '12px',
                padding: '12px 24px',
                borderBottom: '1px solid var(--shopify-border)',
                position: 'sticky',
                top: 0,
                zIndex: 4,
                background: 'unset',
                backgroundColor: 'var(--cds-layer-01)',
              }}>
                <div>
                  <h2 style={{
                    fontSize: '24px',
                    fontWeight: '600',
                    color: 'var(--shopify-text-primary)',
                    margin: 0,
                    letterSpacing: '-0.02em'
                  }}>
                    {settingsCopy.detailReportsTitle}
                  </h2>
                </div>
                <select
                  value={detailReportDateFilter}
                  onChange={(e) => setDetailReportDateFilter((e.target as unknown as { value: string }).value as typeof detailReportDateFilter)}
                  style={DASHBOARD_PERIOD_SELECT_STYLE}
                  {...dashboardPeriodSelectInteractionProps}
                >
                  <option value="7d">Last 7 days</option>
                  <option value="14d">Last 14 days</option>
                  <option value="30d">Last 30 days</option>
                  <option value="thisMonth">This month</option>
                  <option value="lastMonth">Last month</option>
                </select>
              </div>
              <div
                style={{
                  display: 'flex',
                  width: '100%',
                  maxWidth: '100%',
                  alignItems: 'stretch',
                  flex: 1,
                  minWidth: 0,
                  minHeight: 0,
                  gap: 0,
                  overflow: 'hidden',
                }}
              >
                <nav
                  aria-label={settingsCopy.detailReportSectionsAriaLabel}
                  style={{
                    width: '200px',
                    flexShrink: 0,
                    alignSelf: 'flex-start',
                    position: 'sticky',
                    top: 0,
                    zIndex: 3,
                    backgroundColor: 'var(--cds-layer)',
                    padding: '16px 12px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                  }}
                >
                  {([
                    { id: 'weekday-weekend' as const, label: settingsCopy.tabWeekdayWeekend },
                    { id: 'customer-interests' as const, label: settingsCopy.tabCustomerInterests },
                    { id: 'product-content' as const, label: settingsCopy.tabProductContent },
                    { id: 'high-ctr-low-cvr' as const, label: settingsCopy.tabHighCtrLowCvr },
                    { id: 'high-cvr-low-ctr' as const, label: settingsCopy.tabHighCvrLowCtr },
                    { id: 'spreadsheet' as const, label: settingsCopy.tabDetailSpreadsheet },
                  ] as const).map(({ id, label }) => {
                    const isActive = detailReportTab === id;
                    return (
                      <button
                        key={id}
                        type="button"
                        onClick={() => setDetailReportTab(id)}
                        style={{
                          textAlign: 'left',
                          width: '100%',
                          padding: '10px 14px',
                          border: 'none',
                          borderRadius: '6px',
                          fontSize: '14px',
                          fontWeight: isActive ? 600 : 400,
                          fontFamily: "'IBM Plex Sans', sans-serif",
                          color: isActive ? '#161616' : '#525252',
                          backgroundColor: isActive ? '#e8e8e8' : 'transparent',
                          cursor: 'pointer',
                          transition: 'background-color 0.15s ease, color 0.15s ease',
                        }}
                      >
                        {label}
                      </button>
                    );
                  })}
                </nav>
                <div
                  style={{
                    flex: '1 1 0%',
                    minWidth: 0,
                    height: '100%',
                    minHeight: '100%',
                    padding: '16px 12px',
                    boxSizing: 'border-box',
                    overflowX: 'hidden',
                    overflowY: 'auto',
                    backgroundColor: 'var(--cds-layer)',
                  }}
                >
                {/* Weekday vs Weekend - full report */}
                {detailReportTab === 'weekday-weekend' && (() => {
                  const aggregatedData = aggregateWeekendWeekdayData(weekendWeekdayPerformanceWeekly);
                  const weekendAOV = aggregatedData.weekend.conversions > 0 ? aggregatedData.weekend.revenue / aggregatedData.weekend.conversions : 0;
                  const weekdayAOV = aggregatedData.weekday.conversions > 0 ? aggregatedData.weekday.revenue / aggregatedData.weekday.conversions : 0;
                  const weekendRPC = aggregatedData.weekend.clicks > 0 ? aggregatedData.weekend.revenue / aggregatedData.weekend.clicks : 0;
                  const weekdayRPC = aggregatedData.weekday.clicks > 0 ? aggregatedData.weekday.revenue / aggregatedData.weekday.clicks : 0;
                  return (
                    <div style={{ backgroundColor: 'white', width: '100%', maxWidth: '100%', minWidth: 0, boxSizing: 'border-box', padding: '24px', borderRadius: '8px', border: '1px solid var(--shopify-border)' }}>
                      <h3 style={{ fontSize: '18px', fontWeight: '600', color: 'var(--shopify-text-primary)', margin: '0 0 16px 0' }}>{settingsCopy.weekdayWeekendPerformanceTitle}</h3>
                      <p style={{ fontSize: '13px', color: 'var(--shopify-text-secondary)', margin: '0 0 20px 0' }}>{settingsCopy.weekdayWeekendPerformanceDescription}</p>
                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
                          gap: '16px',
                          marginBottom: '24px',
                          width: '100%',
                          boxSizing: 'border-box',
                          background: 'unset',
                          backgroundColor: 'var(--cds-layer-01)',
                        }}
                      >
                        <div className="shopify-metric-card" style={{ padding: '16px', minWidth: 0, width: '100%', boxSizing: 'border-box' }}>
                          <div className="shopify-metric-label" style={{ marginBottom: '8px' }}>{settingsCopy.revenueWeekdayWeekend}</div>
                          <div className="shopify-metric-value" style={{ fontSize: '20px' }}>{formatCurrency(aggregatedData.weekday.revenue, { compact: true })} / {formatCurrency(aggregatedData.weekend.revenue, { compact: true })}</div>
                          <div style={{ height: '160px', marginTop: '12px', width: '100%', minWidth: 0 }}>
                            <ResponsiveContainer width="100%" height="100%">
                              <BarChart data={[{ name: settingsCopy.weekday, value: aggregatedData.weekday.revenue }, { name: settingsCopy.weekend, value: aggregatedData.weekend.revenue }]} margin={{ top: 5, right: 10, left: 10, bottom: 25 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e1e3e5" vertical={false} />
                                <XAxis dataKey="name" stroke="#6d7175" tick={{ fontSize: 12 }} tickLine={{ stroke: '#6d7175' }} />
                                <YAxis stroke="#6d7175" tick={{ fontSize: 12 }} width={40} tickFormatter={(v: number) => formatCurrency(v, { compact: true })} />
                                <Tooltip formatter={(v: number) => [formatCurrency(Number(v)), '']} />
                                <Bar dataKey="value" radius={[4,4,0,0]}><Cell fill="#6fa8ff" /><Cell fill="#0f62fe" /></Bar>
                              </BarChart>
                            </ResponsiveContainer>
                          </div>
                        </div>
                        <div className="shopify-metric-card" style={{ padding: '16px', minWidth: 0, width: '100%', boxSizing: 'border-box' }}>
                          <div className="shopify-metric-label" style={{ marginBottom: '8px' }}>{settingsCopy.metricConversions}</div>
                          <div className="shopify-metric-value" style={{ fontSize: '20px' }}>{aggregatedData.weekday.conversions.toLocaleString()} / {aggregatedData.weekend.conversions.toLocaleString()}</div>
                          <div style={{ height: '160px', marginTop: '12px', width: '100%', minWidth: 0 }}>
                            <ResponsiveContainer width="100%" height="100%">
                              <BarChart data={[{ name: settingsCopy.weekday, value: aggregatedData.weekday.conversions }, { name: settingsCopy.weekend, value: aggregatedData.weekend.conversions }]} margin={{ top: 5, right: 10, left: 0, bottom: 25 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e1e3e5" vertical={false} />
                                <XAxis dataKey="name" stroke="#6d7175" tick={{ fontSize: 12 }} tickLine={{ stroke: '#6d7175' }} />
                                <YAxis stroke="#6d7175" tick={{ fontSize: 12 }} width={40} />
                                <Tooltip />
                                <Bar dataKey="value" radius={[4,4,0,0]}><Cell fill="#6fa8ff" /><Cell fill="#0f62fe" /></Bar>
                              </BarChart>
                            </ResponsiveContainer>
                          </div>
                        </div>
                        <div className="shopify-metric-card" style={{ padding: '16px', minWidth: 0, width: '100%', boxSizing: 'border-box' }}>
                          <div className="shopify-metric-label" style={{ marginBottom: '8px' }}>{settingsCopy.rpcWeekdayWeekend}</div>
                          <div className="shopify-metric-value" style={{ fontSize: '20px' }}>{formatCurrency(weekdayRPC)} / {formatCurrency(weekendRPC)}</div>
                          <div style={{ height: '160px', marginTop: '12px', width: '100%', minWidth: 0 }}>
                            <ResponsiveContainer width="100%" height="100%">
                              <BarChart data={[{ name: settingsCopy.weekday, value: weekdayRPC }, { name: settingsCopy.weekend, value: weekendRPC }]} margin={{ top: 5, right: 10, left: 0, bottom: 25 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e1e3e5" vertical={false} />
                                <XAxis dataKey="name" stroke="#6d7175" tick={{ fontSize: 12 }} tickLine={{ stroke: '#6d7175' }} />
                                <YAxis stroke="#6d7175" tick={{ fontSize: 12 }} width={40} tickFormatter={(v: number) => formatCurrency(v)} />
                                <Tooltip formatter={(v: number) => [formatCurrency(Number(v)), '']} />
                                <Bar dataKey="value" radius={[4,4,0,0]}><Cell fill="#6fa8ff" /><Cell fill="#0f62fe" /></Bar>
                              </BarChart>
                            </ResponsiveContainer>
                          </div>
                        </div>
                        <div className="shopify-metric-card" style={{ padding: '16px', minWidth: 0, width: '100%', boxSizing: 'border-box' }}>
                          <div className="shopify-metric-label" style={{ marginBottom: '8px' }}>{settingsCopy.aovLabel} ({settingsCopy.weekday} / {settingsCopy.weekend})</div>
                          <div className="shopify-metric-value" style={{ fontSize: '20px' }}>{formatCurrency(weekdayAOV)} / {formatCurrency(weekendAOV)}</div>
                          <div style={{ height: '160px', marginTop: '12px', width: '100%', minWidth: 0 }}>
                            <ResponsiveContainer width="100%" height="100%">
                              <BarChart data={[{ name: settingsCopy.weekday, value: weekdayAOV }, { name: settingsCopy.weekend, value: weekendAOV }]} margin={{ top: 5, right: 10, left: 0, bottom: 25 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e1e3e5" vertical={false} />
                                <XAxis dataKey="name" stroke="#6d7175" tick={{ fontSize: 12 }} tickLine={{ stroke: '#6d7175' }} />
                                <YAxis stroke="#6d7175" tick={{ fontSize: 12 }} width={40} tickFormatter={(v: number) => formatCurrency(v)} />
                                <Tooltip formatter={(v: number) => [formatCurrency(Number(v)), '']} />
                                <Bar dataKey="value" radius={[4,4,0,0]}><Cell fill="#6fa8ff" /><Cell fill="#0f62fe" /></Bar>
                              </BarChart>
                            </ResponsiveContainer>
                          </div>
                        </div>
                      </div>
                      <h4 style={{ fontSize: '14px', fontWeight: '600', margin: '0 0 8px 0', color: 'var(--shopify-text-primary)' }}>{settingsCopy.detailTableByDay}</h4>
                      <p style={{ fontSize: '12px', color: 'var(--shopify-text-secondary)', margin: '0 0 12px 0' }}>{settingsCopy.mondaySundayByDate}</p>
                      <div style={{ overflowX: 'auto', border: '1px solid var(--shopify-border)', borderRadius: '8px' }}>
                        <div style={{ minWidth: '980px', width: 'max-content' }}>
                        <Table size="sm">
                          <TableHead>
                            <TableRow>
                              <TableHeader>{settingsCopy.dateLabel}</TableHeader>
                              <TableHeader>{settingsCopy.dayLabel}</TableHeader>
                              <TableHeader>{settingsCopy.weekendWeekdayLabel}</TableHeader>
                              <TableHeader>{settingsCopy.metricTotalRevenue}</TableHeader>
                              <TableHeader>{settingsCopy.metricConversions}</TableHeader>
                              <TableHeader>{settingsCopy.cvrLabel}</TableHeader>
                              <TableHeader>{settingsCopy.aovLabel}</TableHeader>
                              <TableHeader>RPC</TableHeader>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {weekdayWeekendDailyData.map((row, index) => (
                              <TableRow key={row.date} style={{ backgroundColor: index % 2 === 0 ? 'white' : '#f9f9f9' }}>
                                <TableCell>{row.dateLabel}</TableCell>
                                <TableCell>{row.dayOfWeek}</TableCell>
                                <TableCell>{row.dayOfWeek === 'Saturday' || row.dayOfWeek === 'Sunday' ? settingsCopy.weekend : settingsCopy.weekday}</TableCell>
                                <TableCell>{formatCurrency(row.revenue)}</TableCell>
                                <TableCell>{row.conversions.toLocaleString()}</TableCell>
                                <TableCell>{row.cvr.toFixed(1)}%</TableCell>
                                <TableCell>{formatCurrency(row.aov)}</TableCell>
                                <TableCell>{formatCurrency(row.rpc)}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                        </div>
                      </div>
                    </div>
                  );
                })()}

                {/* Customer Interests - full report */}
                {detailReportTab === 'customer-interests' && (
                  <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '8px', border: '1px solid var(--shopify-border)' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: '600', color: 'var(--shopify-text-primary)', margin: '0 0 16px 0' }}>{settingsCopy.customerInterestsTitle}</h3>
                    <Grid narrow style={{ marginBottom: '24px' }}>
                      <Column lg={8}>
                        <div style={{ height: '280px' }}>
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie data={customerDemographics.interests} cx="50%" cy="50%" labelLine={false} outerRadius={110} fill="#8884d8" dataKey="value" label={(props: any) => { const { cx, cy, midAngle, outerRadius, value } = props; const name = props.payload?.category ?? ''; const RADIAN = Math.PI / 180; const r = outerRadius + 10; const x = cx + r * Math.cos(-midAngle * RADIAN); const y = cy + r * Math.sin(-midAngle * RADIAN); return <text x={x} y={y} fill="#6d7175" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" fontSize="11px">{`${name}: ${value}%`}</text>; }}>
                                {customerDemographics.interests.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                              </Pie>
                              <Tooltip formatter={(value: any, _: any, props: any) => [`${value}%`, props?.payload?.category || 'Interest']} />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                      </Column>
                      <Column lg={8}>
                        <div style={{ padding: '16px', backgroundColor: '#f6f6f7', borderRadius: '8px', border: '1px solid #e0e0e0' }}>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginBottom: '12px' }}>
                            <div><div style={{ fontSize: '12px', color: 'var(--shopify-text-secondary)', marginBottom: '4px' }}>{settingsCopy.peakShoppingTime}</div><div style={{ fontSize: '16px', fontWeight: '600' }}>7-9 PM</div></div>
                            <div><div style={{ fontSize: '12px', color: 'var(--shopify-text-secondary)', marginBottom: '4px' }}>{settingsCopy.peakShoppingDay}</div><div style={{ fontSize: '16px', fontWeight: '600' }}>Fri, Sat, Sun</div></div>
                            <div><div style={{ fontSize: '12px', color: 'var(--shopify-text-secondary)', marginBottom: '4px' }}>{settingsCopy.preferredDevice}</div><div style={{ fontSize: '16px', fontWeight: '600' }}>Mobile (68%)</div></div>
                            <div><div style={{ fontSize: '12px', color: 'var(--shopify-text-secondary)', marginBottom: '4px' }}>{settingsCopy.mostPopular}</div><div style={{ fontSize: '16px', fontWeight: '600' }}>Clothing</div></div>
                          </div>
                          <div style={{ fontSize: '11px', color: 'var(--shopify-text-secondary)', fontStyle: 'italic', borderTop: '1px solid #e0e0e0', paddingTop: '8px' }}>{settingsCopy.localTimeNote}</div>
                        </div>
                      </Column>
                    </Grid>
                    <h4 style={{ fontSize: '14px', fontWeight: '600', margin: '0 0 8px 0', color: 'var(--shopify-text-primary)' }}>{settingsCopy.detailTable}</h4>
                    <p style={{ fontSize: '12px', color: 'var(--shopify-text-secondary)', margin: '0 0 12px 0' }}>{settingsCopy.perUserInterestDescription}</p>
                    <div style={{ overflowX: 'auto', border: '1px solid var(--shopify-border)', borderRadius: '8px', maxHeight: '400px', overflowY: 'auto' }}>
                      <Table size="sm">
                        <TableHead>
                          <TableRow>
                            <TableHeader>{settingsCopy.userId}</TableHeader>
                            <TableHeader>{settingsCopy.productCategory}</TableHeader>
                            <TableHeader>{settingsCopy.productItem}</TableHeader>
                            <TableHeader>{settingsCopy.shoppingTime}</TableHeader>
                            <TableHeader>{settingsCopy.shoppingDay}</TableHeader>
                            <TableHeader>{settingsCopy.deviceLabel}</TableHeader>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {customerInterestsDetailData.map((row, index) => (
                            <TableRow key={`${row.userId}-${index}`} style={{ backgroundColor: index % 2 === 0 ? 'white' : '#f9f9f9' }}>
                              <TableCell style={{ fontFamily: 'monospace', fontSize: '12px' }}>{row.userId}</TableCell>
                              <TableCell>{row.productCategory}</TableCell>
                              <TableCell>{row.productItem}</TableCell>
                              <TableCell>{row.shoppingTime}</TableCell>
                              <TableCell>{row.shoppingDay}</TableCell>
                              <TableCell>{row.device}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                )}

                {/* Product & Content - full report with tables */}
                {detailReportTab === 'product-content' && (
                  <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '8px', border: '1px solid var(--shopify-border)' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: '600', color: 'var(--shopify-text-primary)', margin: '0 0 8px 0' }}>{settingsCopy.productContentPerformanceTitle}</h3>
                    <p style={{ fontSize: '13px', color: 'var(--shopify-text-secondary)', margin: '0 0 16px 0' }}>{settingsCopy.productContentTrafficSourceDescription}</p>
                    {(['Product', 'Content'] as const).map((itemType) => {
                      const sortState = itemType === 'Product' ? productItemsSort : contentItemsSort;
                      const itemTypeLabel = itemType === 'Product' ? settingsCopy.reportProduct : settingsCopy.reportContent;
                      return (
                        <div key={itemType} style={{ marginBottom: '24px' }}>
                          <h4 style={{ fontSize: '14px', fontWeight: '600', margin: '0 0 8px 0', color: 'var(--shopify-text-primary)' }}>{itemTypeLabel} {settingsCopy.performanceSuffix}</h4>
                          <div style={{ overflowX: 'auto', border: '1px solid var(--shopify-border)', borderRadius: '8px' }}>
                            <Table size="sm">
                              <TableHead>
                                <TableRow>
                                  <TableHeader onClick={() => sortState.handleSort('name' as any)} style={{ cursor: 'pointer', ...ITEM_NAME_COLUMN_STYLE }}>{settingsCopy.itemName}</TableHeader>
                                  <TableHeader onClick={() => sortState.handleSort('impressions' as any)} style={{ cursor: 'pointer' }}>{settingsCopy.metricImpressions}</TableHeader>
                                  <TableHeader onClick={() => sortState.handleSort('clicks' as any)} style={{ cursor: 'pointer' }}>{settingsCopy.metricClicks}</TableHeader>
                                  <TableHeader onClick={() => sortState.handleSort('revenue' as any)} style={{ cursor: 'pointer' }}>{settingsCopy.metricTotalRevenue}</TableHeader>
                                  <TableHeader onClick={() => sortState.handleSort('ctr' as any)} style={{ cursor: 'pointer' }}>{settingsCopy.ctrLabel}</TableHeader>
                                  <TableHeader onClick={() => sortState.handleSort('cvr' as any)} style={{ cursor: 'pointer' }}>{settingsCopy.cvrLabel}</TableHeader>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {sortState.sortedData.map((item, index) => (
                                  <TableRow key={index} style={{ backgroundColor: index % 2 === 0 ? 'white' : '#f9f9f9' }}>
                                    <TableCell style={ITEM_NAME_COLUMN_STYLE}>{item.name}</TableCell>
                                    <TableCell>{item.impressions.toLocaleString()}</TableCell>
                                    <TableCell>{item.clicks.toLocaleString()}</TableCell>
                                    <TableCell style={{ fontWeight: '600' }}>{formatCurrency(item.revenue)}</TableCell>
                                    <TableCell>{item.impressions > 0 ? `${((item.clicks / item.impressions) * 100).toFixed(2)}%` : '-'}</TableCell>
                                    <TableCell style={{ fontWeight: '600', color: item.cvr >= 14 ? '#16a34a' : 'inherit' }}>{item.cvr}%</TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* High CTR Low CVR - full report */}
                {detailReportTab === 'high-ctr-low-cvr' && (
                  <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '8px', border: '1px solid var(--shopify-border)' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: '600', color: 'var(--shopify-text-primary)', margin: '0 0 8px 0' }}>{settingsCopy.highCtrLowCvrTitle}</h3>
                    <p style={{ fontSize: '13px', color: 'var(--shopify-text-secondary)', margin: '0 0 16px 0' }}>{settingsCopy.highCtrLowCvrDescription}</p>
                    <div style={{ overflowX: 'auto', border: '1px solid var(--shopify-border)', borderRadius: '8px' }}>
                      <Table size="sm">
                        <TableHead>
                          <TableRow>
                            <TableHeader onClick={() => highCTRLowCVRSort.handleSort('name' as any)} style={{ cursor: 'pointer', ...ITEM_NAME_COLUMN_STYLE }}>{settingsCopy.itemName}</TableHeader>
                            <TableHeader onClick={() => highCTRLowCVRSort.handleSort('impressions' as any)} style={{ cursor: 'pointer' }}>{settingsCopy.metricImpressions}</TableHeader>
                            <TableHeader onClick={() => highCTRLowCVRSort.handleSort('clicks' as any)} style={{ cursor: 'pointer' }}>{settingsCopy.metricClicks}</TableHeader>
                            <TableHeader onClick={() => highCTRLowCVRSort.handleSort('revenue' as any)} style={{ cursor: 'pointer' }}>{settingsCopy.metricTotalRevenue}</TableHeader>
                            <TableHeader onClick={() => highCTRLowCVRSort.handleSort('ctr' as any)} style={{ cursor: 'pointer' }}>{settingsCopy.ctrLabel}</TableHeader>
                            <TableHeader onClick={() => highCTRLowCVRSort.handleSort('cvr' as any)} style={{ cursor: 'pointer' }}>{settingsCopy.cvrLabel}</TableHeader>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {highCTRLowCVRSort.sortedData.map((item, index) => (
                            <TableRow key={index} style={{ backgroundColor: index % 2 === 0 ? 'white' : '#f9f9f9' }}>
                              <TableCell style={ITEM_NAME_COLUMN_STYLE}>{item.name}</TableCell>
                              <TableCell>{item.impressions.toLocaleString()}</TableCell>
                              <TableCell>{item.clicks.toLocaleString()}</TableCell>
                              <TableCell style={{ fontWeight: '600' }}>{formatCurrency(item.revenue)}</TableCell>
                              <TableCell style={{ fontWeight: '600', color: '#16a34a' }}>{(item as any).ctr?.toFixed(2) ?? ((item.impressions > 0 ? (item.clicks / item.impressions) * 100 : 0).toFixed(2))}%</TableCell>
                              <TableCell style={{ fontWeight: '600', color: '#dc2626' }}>{item.cvr}%</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                )}

                {/* High CVR Low CTR - full report */}
                {detailReportTab === 'high-cvr-low-ctr' && (
                  <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '8px', border: '1px solid var(--shopify-border)' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: '600', color: 'var(--shopify-text-primary)', margin: '0 0 8px 0' }}>{settingsCopy.highCvrLowCtrTitle}</h3>
                    <p style={{ fontSize: '13px', color: 'var(--shopify-text-secondary)', margin: '0 0 16px 0' }}>{settingsCopy.highCvrLowCtrDescription}</p>
                    <div style={{ overflowX: 'auto', border: '1px solid var(--shopify-border)', borderRadius: '8px' }}>
                      <Table size="sm">
                        <TableHead>
                          <TableRow>
                            <TableHeader onClick={() => highCVRLowCTRSort.handleSort('name' as any)} style={{ cursor: 'pointer', ...ITEM_NAME_COLUMN_STYLE }}>{settingsCopy.itemName}</TableHeader>
                            <TableHeader onClick={() => highCVRLowCTRSort.handleSort('impressions' as any)} style={{ cursor: 'pointer' }}>{settingsCopy.metricImpressions}</TableHeader>
                            <TableHeader onClick={() => highCVRLowCTRSort.handleSort('clicks' as any)} style={{ cursor: 'pointer' }}>{settingsCopy.metricClicks}</TableHeader>
                            <TableHeader onClick={() => highCVRLowCTRSort.handleSort('revenue' as any)} style={{ cursor: 'pointer' }}>{settingsCopy.metricTotalRevenue}</TableHeader>
                            <TableHeader onClick={() => highCVRLowCTRSort.handleSort('ctr' as any)} style={{ cursor: 'pointer' }}>{settingsCopy.ctrLabel}</TableHeader>
                            <TableHeader onClick={() => highCVRLowCTRSort.handleSort('cvr' as any)} style={{ cursor: 'pointer' }}>{settingsCopy.cvrLabel}</TableHeader>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {highCVRLowCTRSort.sortedData.map((item, index) => (
                            <TableRow key={index} style={{ backgroundColor: index % 2 === 0 ? 'white' : '#f9f9f9' }}>
                              <TableCell style={ITEM_NAME_COLUMN_STYLE}>{item.name}</TableCell>
                              <TableCell>{item.impressions.toLocaleString()}</TableCell>
                              <TableCell>{item.clicks.toLocaleString()}</TableCell>
                              <TableCell style={{ fontWeight: '600' }}>{formatCurrency(item.revenue)}</TableCell>
                              <TableCell style={{ fontWeight: '600', color: '#dc2626' }}>{(item as any).ctr?.toFixed(2) ?? ((item.impressions > 0 ? (item.clicks / item.impressions) * 100 : 0).toFixed(2))}%</TableCell>
                              <TableCell style={{ fontWeight: '600', color: '#16a34a' }}>{item.cvr}%</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                )}

                {/* Detail Spreadsheet - combined data */}
                {detailReportTab === 'spreadsheet' && (() => {
                  const allRows = [
                    ...productItemsSort.sortedData.map((item) => ({ ...item, report: settingsCopy.reportProduct })),
                    ...contentItemsSort.sortedData.map((item) => ({ ...item, report: settingsCopy.reportContent })),
                    ...highCTRLowCVRSort.sortedData.map((item) => ({ ...item, report: settingsCopy.reportHighCtrLowCvr })),
                    ...highCVRLowCTRSort.sortedData.map((item) => ({ ...item, report: settingsCopy.reportHighCvrLowCtr }))
                  ];
                  return (
                    <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '8px', border: '1px solid var(--shopify-border)' }}>
                      <h3 style={{ fontSize: '18px', fontWeight: '600', color: 'var(--shopify-text-primary)', margin: '0 0 8px 0' }}>{settingsCopy.detailSpreadsheetTitle}</h3>
                      <p style={{ fontSize: '13px', color: 'var(--shopify-text-secondary)', margin: '0 0 16px 0' }}>{settingsCopy.detailSpreadsheetDescription}</p>
                      <div style={{ overflowX: 'auto', border: '1px solid var(--shopify-border)', borderRadius: '8px', maxHeight: '60vh', overflowY: 'auto' }}>
                        <Table size="sm">
                          <TableHead>
                            <TableRow>
                              <TableHeader>{settingsCopy.reportLabel}</TableHeader>
                              <TableHeader style={ITEM_NAME_COLUMN_STYLE}>{settingsCopy.itemName}</TableHeader>
                              <TableHeader>{settingsCopy.metricImpressions}</TableHeader>
                              <TableHeader>{settingsCopy.metricClicks}</TableHeader>
                              <TableHeader>{settingsCopy.metricTotalRevenue}</TableHeader>
                              <TableHeader>{settingsCopy.ctrLabel}</TableHeader>
                              <TableHeader>{settingsCopy.cvrLabel}</TableHeader>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {allRows.map((item, index) => (
                              <TableRow key={index} style={{ backgroundColor: index % 2 === 0 ? 'white' : '#f9f9f9' }}>
                                <TableCell>{(item as any).report}</TableCell>
                                <TableCell style={ITEM_NAME_COLUMN_STYLE}>{item.name}</TableCell>
                                <TableCell>{item.impressions.toLocaleString()}</TableCell>
                                <TableCell>{item.clicks.toLocaleString()}</TableCell>
                                <TableCell style={{ fontWeight: '600' }}>{formatCurrency(item.revenue)}</TableCell>
                                <TableCell>{item.impressions > 0 ? `${((item.clicks / item.impressions) * 100).toFixed(2)}%` : '-'}</TableCell>
                                <TableCell style={{ fontWeight: '600' }}>{item.cvr}%</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </div>
                  );
                })()}
                </div>
              </div>
            </div>
          )}

          <FeatureGate feature="shop-performance">
            {activeSection === 'shop-performance' && (
              <div style={{ width: '100%' }}>
                <div style={{ padding: '24px', borderBottom: '1px solid var(--shopify-border)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <h1 style={{ 
                      fontSize: '24px', 
                      fontWeight: '600', 
                      color: 'var(--shopify-text-primary)',
                      margin: 0,
                      letterSpacing: '-0.02em'
                    }}>
                      Shop Performance
                    </h1>
                    <select
                      value={shopPerformanceDateFilter}
                      onChange={(e) => setShopPerformanceDateFilter((e.target as unknown as { value: string }).value as '7d' | '14d' | '30d' | 'thisMonth' | 'lastMonth' | 'thisQ' | 'lastQ')}
                      style={DASHBOARD_PERIOD_SELECT_STYLE}
                      {...dashboardPeriodSelectInteractionProps}
                    >
                      <option value="7d">Last 7 days</option>
                      <option value="14d">Last 14 days</option>
                      <option value="30d">Last 30 days</option>
                      <option value="thisMonth">This month</option>
                      <option value="lastMonth">Last month</option>
                      <option value="thisQ">This Q</option>
                      <option value="lastQ">Last Q</option>
                    </select>
                  </div>
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
                        <div className="shopify-metric-label">{settingsCopy.metricTotalRevenue}</div>
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
                        <div className="shopify-metric-label">{settingsCopy.metricConversions}</div>
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
                      {settingsCopy.performanceFunnelTitle}
                    </h3>
                    <p style={{ 
                      fontSize: '13px', 
                      color: 'var(--shopify-text-secondary)',
                      marginBottom: '24px'
                    }}>
                      {settingsCopy.performanceFunnelDescription}
                    </p>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={[
                        { 
                          name: settingsCopy.metricClicks, 
                          value: mockWebsitePerformance.funnel.clicks,
                          fill: '#0f62fe'
                        },
                        { 
                          name: settingsCopy.metricConversions, 
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
                        <YAxis 
                          stroke="#6d7175"
                          tickFormatter={(value: number) => {
                            // Format numbers with commas, add % for CVR
                            if (value < 100) {
                              return `${value}%`;
                            }
                            return value.toLocaleString();
                          }}
                        />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'white', 
                            border: '1px solid #e1e3e5',
                            borderRadius: '6px'
                          }}
                          formatter={(value: number, name: string, props: any) => {
                            // Add % for CVR, otherwise just format number
                            if (props.payload.name === 'CVR') {
                              return `${value}%`;
                            }
                            return value.toLocaleString();
                          }}
                        />
                        <Bar dataKey="value" radius={[6, 6, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                    <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'space-around', fontSize: '13px', color: 'var(--shopify-text-secondary)' }}>
                      <div>
                        <strong style={{ color: 'var(--shopify-text-primary)' }}>{mockWebsitePerformance.funnel.clicks.toLocaleString()}</strong> {settingsCopy.metricClicks}
                      </div>
                      <div>
                        <strong style={{ color: 'var(--shopify-text-primary)' }}>{mockWebsitePerformance.funnel.conversions.toLocaleString()}</strong> {settingsCopy.metricConversions}
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
                      {settingsCopy.revenueTrendTitle}
                    </h3>
                    <p style={{ 
                      fontSize: '13px', 
                      color: 'var(--shopify-text-secondary)',
                      marginBottom: '24px'
                    }}>
                      {settingsCopy.revenueTrendDescription}
                    </p>
                    <ResponsiveContainer width="100%" height={400}>
                      <AreaChart data={filteredRevenueData}>
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
                        <YAxis 
                          stroke="#6d7175"
                          tickFormatter={(value: number) => {
                            if (value >= 1000) return `$${(value / 1000).toFixed(0)}k`;
                            return `$${value}`;
                          }}
                        />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'white', 
                            border: '1px solid #e1e3e5',
                            borderRadius: '6px'
                          }}
                          formatter={(value: number) => `$${value.toLocaleString()}`}
                        />
                        <Legend />
                        <Area 
                          type="monotone" 
                          dataKey="revenue" 
                          stroke="#0f62fe" 
                          fillOpacity={1} 
                          fill="url(#colorCurrent)"
                          strokeWidth={2}
                          name={settingsCopy.currentPeriod}
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
                      {settingsCopy.revenueDataTitle}
                    </h3>
                    <p style={{ 
                      fontSize: '14px', 
                      color: 'var(--shopify-text-secondary)',
                      margin: 0,
                      lineHeight: '1.5'
                    }}>
                      {settingsCopy.revenueDataDescription}
                    </p>
                  </div>
                  <Table>
                        <TableHead>
                          <TableRow>
                            <TableHeader 
                              style={{ cursor: 'pointer', userSelect: 'none' }}
                              onClick={() => revenueTableSort.handleSort('date' as keyof typeof revenueData[0])}
                            >
                              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                {settingsCopy.dateLabel}
                                {revenueTableSort.sortConfig?.key === 'date' && (
                                  revenueTableSort.sortConfig.direction === 'asc' ? <ArrowUp size={16} /> : <ArrowDown size={16} />
                                )}
                              </div>
                            </TableHeader>
                            <TableHeader 
                              style={{ cursor: 'pointer', userSelect: 'none' }}
                              onClick={() => revenueTableSort.handleSort('revenue' as keyof typeof revenueData[0])}
                            >
                              <MetricTooltip metric="Revenue">
                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                  Revenue
                                  {revenueTableSort.sortConfig?.key === 'revenue' && (
                                    revenueTableSort.sortConfig.direction === 'asc' ? <ArrowUp size={16} /> : <ArrowDown size={16} />
                                  )}
                                </div>
                              </MetricTooltip>
                            </TableHeader>
                            <TableHeader 
                              style={{ cursor: 'pointer', userSelect: 'none' }}
                              onClick={() => revenueTableSort.handleSort('clicks' as keyof typeof revenueData[0])}
                            >
                              <MetricTooltip metric="Clicks">
                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                  Clicks
                                  {revenueTableSort.sortConfig?.key === 'clicks' && (
                                    revenueTableSort.sortConfig.direction === 'asc' ? <ArrowUp size={16} /> : <ArrowDown size={16} />
                                  )}
                                </div>
                              </MetricTooltip>
                            </TableHeader>
                            <TableHeader 
                              style={{ cursor: 'pointer', userSelect: 'none' }}
                              onClick={() => revenueTableSort.handleSort('conversions' as keyof typeof revenueData[0])}
                            >
                              <MetricTooltip metric="Conversions">
                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                  Conversions
                                  {revenueTableSort.sortConfig?.key === 'conversions' && (
                                    revenueTableSort.sortConfig.direction === 'asc' ? <ArrowUp size={16} /> : <ArrowDown size={16} />
                                  )}
                                </div>
                              </MetricTooltip>
                            </TableHeader>
                            <TableHeader 
                              style={{ cursor: 'pointer', userSelect: 'none' }}
                              onClick={() => revenueTableSort.handleSort('roas' as keyof typeof revenueData[0])}
                            >
                              <MetricTooltip metric="ROAS">
                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                  ROAS
                                  {revenueTableSort.sortConfig?.key === 'roas' && (
                                    revenueTableSort.sortConfig.direction === 'asc' ? <ArrowUp size={16} /> : <ArrowDown size={16} />
                                  )}
                                </div>
                              </MetricTooltip>
                            </TableHeader>
                            <TableHeader style={{ cursor: 'pointer', userSelect: 'none' }}>
                              <MetricTooltip metric="CVR">
                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                  CVR
                                </div>
                              </MetricTooltip>
                            </TableHeader>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {revenueTableSort.sortedData.map((row, index) => (
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
                        {settingsCopy.sourceOfTruthCampaignMetrics}
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
                            <TableHeader 
                              style={{ cursor: 'pointer', userSelect: 'none' }}
                              onClick={() => campaignTableSort.handleSort('name' as keyof typeof filteredCampaigns[0])}
                            >
                              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                Campaign Name
                                {campaignTableSort.sortConfig?.key === 'name' && (
                                  campaignTableSort.sortConfig.direction === 'asc' ? <ArrowUp size={16} /> : <ArrowDown size={16} />
                                )}
                              </div>
                            </TableHeader>
                            <TableHeader 
                              style={{ cursor: 'pointer', userSelect: 'none' }}
                              onClick={() => campaignTableSort.handleSort('type' as keyof typeof filteredCampaigns[0])}
                            >
                              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                Type
                                {campaignTableSort.sortConfig?.key === 'type' && (
                                  campaignTableSort.sortConfig.direction === 'asc' ? <ArrowUp size={16} /> : <ArrowDown size={16} />
                                )}
                              </div>
                            </TableHeader>
                            <TableHeader 
                              style={{ cursor: 'pointer', userSelect: 'none' }}
                              onClick={() => campaignTableSort.handleSort('status' as keyof typeof filteredCampaigns[0])}
                            >
                              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                Status
                                {campaignTableSort.sortConfig?.key === 'status' && (
                                  campaignTableSort.sortConfig.direction === 'asc' ? <ArrowUp size={16} /> : <ArrowDown size={16} />
                                )}
                              </div>
                            </TableHeader>
                            <TableHeader 
                              style={{ cursor: 'pointer', userSelect: 'none' }}
                              onClick={() => campaignTableSort.handleSort('clicks' as keyof typeof filteredCampaigns[0])}
                            >
                              <MetricTooltip metric="Clicks">
                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                  Clicks
                                  {campaignTableSort.sortConfig?.key === 'clicks' && (
                                    campaignTableSort.sortConfig.direction === 'asc' ? <ArrowUp size={16} /> : <ArrowDown size={16} />
                                  )}
                                </div>
                              </MetricTooltip>
                            </TableHeader>
                            <TableHeader 
                              style={{ cursor: 'pointer', userSelect: 'none' }}
                              onClick={() => campaignTableSort.handleSort('conversions' as keyof typeof filteredCampaigns[0])}
                            >
                              <MetricTooltip metric="Conversions">
                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                  Conversions
                                  {campaignTableSort.sortConfig?.key === 'conversions' && (
                                    campaignTableSort.sortConfig.direction === 'asc' ? <ArrowUp size={16} /> : <ArrowDown size={16} />
                                  )}
                                </div>
                              </MetricTooltip>
                            </TableHeader>
                            <TableHeader 
                              style={{ cursor: 'pointer', userSelect: 'none' }}
                              onClick={() => campaignTableSort.handleSort('revenue' as keyof typeof filteredCampaigns[0])}
                            >
                              <MetricTooltip metric="Revenue">
                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                  Revenue
                                  {campaignTableSort.sortConfig?.key === 'revenue' && (
                                    campaignTableSort.sortConfig.direction === 'asc' ? <ArrowUp size={16} /> : <ArrowDown size={16} />
                                  )}
                                </div>
                              </MetricTooltip>
                            </TableHeader>
                            <TableHeader 
                              style={{ cursor: 'pointer', userSelect: 'none' }}
                              onClick={() => campaignTableSort.handleSort('roas' as keyof typeof filteredCampaigns[0])}
                            >
                              <MetricTooltip metric="ROAS">
                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                  ROAS
                                  {campaignTableSort.sortConfig?.key === 'roas' && (
                                    campaignTableSort.sortConfig.direction === 'asc' ? <ArrowUp size={16} /> : <ArrowDown size={16} />
                                  )}
                                </div>
                              </MetricTooltip>
                            </TableHeader>
                            <TableHeader 
                              style={{ cursor: 'pointer', userSelect: 'none' }}
                              onClick={() => campaignTableSort.handleSort('spend' as keyof typeof filteredCampaigns[0])}
                            >
                              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                Spend
                                {campaignTableSort.sortConfig?.key === 'spend' && (
                                  campaignTableSort.sortConfig.direction === 'asc' ? <ArrowUp size={16} /> : <ArrowDown size={16} />
                                )}
                              </div>
                            </TableHeader>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {campaignTableSort.sortedData.map((campaign) => (
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
                      {settingsCopy.sourceOfTruthTopProducts}
                    </p>
                  </div>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableHeader>{settingsCopy.productName}</TableHeader>
                        <TableHeader>{settingsCopy.viewsLabel}</TableHeader>
                        <TableHeader>{settingsCopy.metricClicks}</TableHeader>
                        <TableHeader>{settingsCopy.metricConversions}</TableHeader>
                        <TableHeader>{settingsCopy.metricTotalRevenue}</TableHeader>
                        <TableHeader>{settingsCopy.metricConversionRate}</TableHeader>
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
                        {settingsCopy.adsPerformanceTitle}
                      </h3>
                    <p style={{ 
                      fontSize: '14px', 
                      color: 'var(--shopify-text-secondary)',
                      margin: 0,
                      lineHeight: '1.5'
                    }}>
                      {settingsCopy.sourceOfTruthAdMetrics}
                    </p>
                  </div>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableHeader>{settingsCopy.metricLabel}</TableHeader>
                        <TableHeader>{settingsCopy.valueLabel}</TableHeader>
                        <TableHeader>{settingsCopy.rateLabel}</TableHeader>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell>{settingsCopy.metricImpressions}</TableCell>
                        <TableCell>{mockWebsitePerformance.ads.impressions.toLocaleString()}</TableCell>
                        <TableCell>-</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>{settingsCopy.metricClicks}</TableCell>
                        <TableCell>{mockWebsitePerformance.ads.clicks.toLocaleString()}</TableCell>
                        <TableCell>{mockWebsitePerformance.ads.ctr.toFixed(2)}% {settingsCopy.ctrLabel}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>{settingsCopy.spendLabel}</TableCell>
                        <TableCell>${mockWebsitePerformance.ads.spend.toLocaleString()}</TableCell>
                        <TableCell>${mockWebsitePerformance.ads.cpc.toFixed(2)} {settingsCopy.cpcLabel}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>{settingsCopy.metricTotalRevenue}</TableCell>
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
            <div
              style={{
                width: '100%',
                minHeight: 0,
                background: 'unset',
                backgroundColor: 'var(--cds-layer-01)',
              }}
            >
            {activeSection === 'creator-detail-reports' && (
              <div style={{ width: '100%' }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '12px 24px',
                  borderBottom: '1px solid var(--shopify-border)',
                  background: 'unset',
                  backgroundColor: 'var(--cds-layer-01)',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                    <h2 style={{
                      fontSize: '24px',
                      fontWeight: '600',
                      color: 'var(--shopify-text-primary)',
                      margin: 0,
                      letterSpacing: '-0.02em'
                    }}>
                      {settingsCopy.creatorDetailReportsTitle}
                    </h2>
                  </div>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
                    <select
                      value={creatorPerformanceDateFilter}
                      onChange={(e) => setCreatorPerformanceDateFilter((e.target as unknown as { value: string }).value as typeof creatorPerformanceDateFilter)}
                      style={DASHBOARD_PERIOD_SELECT_STYLE}
                      {...dashboardPeriodSelectInteractionProps}
                    >
                      <option value="7d">{settingsCopy.periodLast7Days}</option>
                      <option value="14d">{settingsCopy.periodLast14Days}</option>
                      <option value="30d">{settingsCopy.periodLast30Days}</option>
                      <option value="thisMonth">{settingsCopy.periodThisMonth}</option>
                      <option value="lastMonth">{settingsCopy.periodLastMonth}</option>
                      <option value="thisQ">{settingsCopy.periodThisQuarter}</option>
                      <option value="lastQ">{settingsCopy.periodLastQuarter}</option>
                    </select>
                  </div>
                </div>
                <div style={{ padding: '24px', backgroundColor: '#f6f6f7', minHeight: '400px' }}>
                  <div style={{
                    backgroundColor: 'white',
                    padding: '24px',
                    borderRadius: '8px',
                    border: '1px solid var(--shopify-border)',
                    fontSize: '14px',
                    color: 'var(--shopify-text-secondary)'
                  }}>
                    {settingsCopy.creatorDetailReportsPlaceholder}
                  </div>
                </div>
              </div>
            )}
            {activeSection === 'creator-overview' && (
              <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <CreatorDashboardView
                  variant="full"
                  currency={currency}
                  locale={displayLanguage}
                  excludeCancelled={creatorExcludeCancelled}
                  onExcludeCancelledChange={setCreatorExcludeCancelled}
                />
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '0 24px 24px' }}>

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
                            (e.currentTarget as unknown as { style: Record<string, string> }).style.borderColor = '#7256F6';
                            (e.currentTarget as unknown as { style: Record<string, string> }).style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
                          }}
                          onMouseLeave={(e) => {
                            (e.currentTarget as unknown as { style: Record<string, string> }).style.borderColor = 'var(--shopify-border)';
                            (e.currentTarget as unknown as { style: Record<string, string> }).style.boxShadow = 'none';
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
            </div>
            )}
            </div>
          </FeatureGate>

          {activeSection === 'documents' && (
            <div style={{ width: '100%' }}>
              {/* APIs Title and Controls */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '12px 24px',
                borderBottom: '1px solid var(--shopify-border)',
                background: 'unset',
                backgroundColor: 'var(--cds-layer-01)',
              }}>
                <h2 style={{
                  fontSize: '24px',
                  fontWeight: '600',
                  color: 'var(--shopify-text-primary)',
                  margin: 0,
                  letterSpacing: '-0.02em'
                }}>
                  {settingsCopy.titleApis}
                </h2>
              </div>
              <div style={{ 
                padding: '24px',
                minHeight: '400px'
              }}>
                <div style={{
                  fontSize: '16px',
                  color: 'var(--shopify-text-secondary)',
                  fontStyle: 'italic'
                }}>
                  {settingsCopy.workInProgress}
                </div>
              </div>
            </div>
          )}

          {/* Settings — two-column layout (nav + panel); General = currency & timezone */}
          {activeSection === 'settings' && (
            <div
              style={{
                width: '100%',
                minHeight: 'calc(100vh - 64px)',
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: '#f4f4f4',
              }}
            >
              <div
                style={{
                  background: 'unset',
                  backgroundColor: 'var(--cds-layer-01)',
                  borderBottom: '1px solid #e0e0e0',
                  padding: '12px 24px',
                  flexShrink: 0,
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '0px', alignItems: 'flex-start' }}>
                  <h2
                    style={{
                      fontFamily: "'IBM Plex Sans Condensed', 'IBM Plex Sans', sans-serif",
                      fontSize: '25.375px',
                      fontWeight: 600,
                      lineHeight: '25.375px',
                      height: '36.5px',
                      width: '100%',
                      display: 'flex',
                      alignItems: 'left',
                      justifyContent: 'left',
                      letterSpacing: '0.32px',
                      color: '#161616',
                      margin: 0,
                    }}
                  >
                    {settingsCopy.titleSettings}
                  </h2>
                  <p
                    style={{
                      fontFamily: "'IBM Plex Sans Condensed', 'IBM Plex Sans', sans-serif",
                      fontSize: '14px',
                      lineHeight: '20px',
                      letterSpacing: '0.32px',
                      color: '#525252',
                      margin: 0,
                      maxWidth: '736px',
                    }}
                  >
                    {settingsCopy.settingsDescription}
                  </p>
                </div>
              </div>
              <div
                className="settings-page-tabs-vertical"
                style={{
                  display: 'flex',
                  alignItems: 'stretch',
                  flex: 1,
                  minHeight: 0,
                  gap: 0,
                  minWidth: 0,
                }}
              >
                <TabsVertical
                  selectedIndex={Math.max(0, SETTINGS_NAV_ITEMS.findIndex((i) => i === settingsNavTab))}
                  onChange={({ selectedIndex }) => setSettingsNavTab(SETTINGS_NAV_ITEMS[selectedIndex])}
                  height="100%"
                >
                  <nav
                    aria-label="Settings sections"
                    style={{
                      width: '200px',
                      flexShrink: 0,
                      alignSelf: 'stretch',
                      minHeight: '100%',
                      backgroundColor: 'var(--cds-layer)',
                      borderRight: '1px solid #e0e0e0',
                      padding: '16px 12px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px',
                    }}
                  >
                    {SETTINGS_NAV_ITEMS.map((item) => {
                      const isActive = settingsNavTab === item;
                      return (
                        <button
                          key={item}
                          type="button"
                          aria-selected={isActive}
                          onClick={() => setSettingsNavTab(item)}
                          style={{
                            textAlign: 'left',
                            width: '100%',
                            padding: '10px 14px',
                            border: 'none',
                            borderRadius: '6px',
                            fontSize: '14px',
                            fontWeight: isActive ? 600 : 400,
                            fontFamily: "'IBM Plex Sans', sans-serif",
                            color: isActive ? '#161616' : '#525252',
                            backgroundColor: isActive ? '#e8e8e8' : 'transparent',
                            cursor: 'pointer',
                            transition: 'background-color 0.15s ease, color 0.15s ease',
                          }}
                        >
                          {settingsNavLabels[item]}
                        </button>
                      );
                    })}
                  </nav>
                  <TabPanels>
                    <TabPanel
                      style={{
                        flex: 1,
                        minWidth: 0,
                        minHeight: 0,
                        padding: '16px 12px',
                        overflowY: 'auto',
                        backgroundColor: 'var(--cds-layer)',
                      }}
                    >
                    <div
                      style={{
                        maxWidth: '980px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '16px',
                      }}
                    >
                      <div
                        style={{
                          backgroundColor: 'var(--shopify-white)',
                          border: '1px solid #e0e0e0',
                          borderRadius: '8px',
                          padding: '16px 20px',
                        }}
                      >
                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(2, minmax(260px, 1fr))',
                          gap: '16px 32px',
                        }}
                      >
                        <TextInput
                          id="settings-account-full-name"
                          labelText={settingsCopy.accountFullName}
                          value="Admin"
                          readOnly
                          size="md"
                        />
                        <TextInput
                          id="settings-account-email"
                          labelText={settingsCopy.accountEmailAddress}
                          value="uniqlo_manager@realry.com"
                          readOnly
                          size="md"
                        />
                      </div>
                      </div>
                      <div
                        style={{
                          backgroundColor: 'var(--shopify-white)',
                          border: '1px solid #e0e0e0',
                          borderRadius: '8px',
                          padding: '16px 20px',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '20px',
                        }}
                      >
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          <h4
                            style={{
                              fontFamily: "'IBM Plex Sans', sans-serif",
                              fontSize: '20px',
                              fontWeight: 600,
                              color: '#161616',
                              margin: '0 0 8px 0',
                            }}
                          >
                            {settingsCopy.displayLanguageTitle}
                          </h4>
                          <p
                            style={{
                              fontSize: '14px',
                              color: '#525252',
                              margin: '0 0 0 0',
                              lineHeight: 1.5,
                            }}
                          >
                            {settingsCopy.displayLanguageDescription}
                          </p>
                        </div>
                        <div style={{ width: '100%', maxWidth: '560px' }}>
                          <Dropdown<DisplayLanguageOption>
                            id="settings-account-display-language"
                            label="Select language"
                            titleText=""
                            items={[...DISPLAY_LANGUAGE_OPTIONS]}
                            itemToString={(item) => (item ? item.label : '')}
                            selectedItem={selectedDisplayLanguageItem ?? undefined}
                            onChange={({ selectedItem }) => {
                              if (selectedItem) {
                                const next = selectedItem.value as SupportedLocale;
                                setDisplayLanguage(next);
                                if (typeof (globalThis as unknown as { window?: unknown }).window !== 'undefined') {
                                  (globalThis as unknown as { localStorage?: { setItem(key: string, value: string): void } }).localStorage?.setItem(
                                    'dashboard-display-language',
                                    next
                                  );
                                }
                              }
                            }}
                            size="md"
                          />
                        </div>
                      </div>
                    </div>
                    </TabPanel>
                    <TabPanel
                      style={{
                        flex: 1,
                        minWidth: 0,
                        minHeight: 0,
                        padding: '24px',
                        overflowY: 'auto',
                        backgroundColor: 'var(--cds-layer)',
                      }}
                    >
                    <>
                      <div
                        style={{
                          backgroundColor: 'var(--shopify-white)',
                          border: '1px solid #e0e0e0',
                          borderRadius: '8px',
                          padding: '16px 20px',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '20px',
                          maxWidth: '720px',
                        }}
                      >
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          <h3
                          style={{
                            fontFamily: "'IBM Plex Sans', sans-serif",
                            fontSize: '20px',
                            fontWeight: 600,
                            color: '#161616',
                            margin: '0 0 8px 0',
                          }}
                        >
                            {settingsCopy.reportDisplayDetailsTitle}
                        </h3>
                          <p
                            style={{
                              fontFamily: "'IBM Plex Sans Condensed', 'IBM Plex Sans', sans-serif",
                              fontSize: '14px',
                              lineHeight: '14px',
                              letterSpacing: '0.32px',
                              color: '#525252',
                              margin: 0,
                            }}
                          >
                            {settingsCopy.reportDisplayDetailsDescription}
                          </p>
                        </div>
                        <div style={{ width: '100%', maxWidth: '560px' }}>
                          <SettingsFilterableSelect
                            id="dashboard-settings-currency"
                            titleText={settingsCopy.currencyDisplayedAs}
                            placeholder="Select currency"
                            items={[...CURRENCY_COMBO_ITEMS]}
                            selectedItem={selectedCurrencyItem ?? null}
                            itemToString={(item) => item.label}
                            filterItem={(item, q) =>
                              `${item.label} ${item.value}`.toLowerCase().includes(q)
                            }
                            onSelect={(item) => {
                              const nextCurrency = item.value;
                              setCurrency(nextCurrency);
                              persistDashboardSettings(nextCurrency, timezone);
                            }}
                            size="md"
                          />
                        </div>
                        <div style={{ width: '100%', maxWidth: '560px' }}>
                          <SettingsFilterableSelect
                            id="dashboard-settings-timezone"
                            titleText={settingsCopy.reportingTimezone}
                            placeholder="Select timezone"
                            items={timezoneComboItems}
                            selectedItem={selectedTimezoneItem ?? null}
                            itemToString={(item) => item.label}
                            itemToElement={(item) => (
                              <span title={item.label}>{item.label}</span>
                            )}
                            filterItem={(item, q) => {
                              const fromString = getTimezoneTypeaheadString(
                                item.label,
                                item.value
                              ).toLowerCase();
                              return (
                                fromString.includes(q) ||
                                item.label.toLowerCase().includes(q) ||
                                item.value.toLowerCase().includes(q)
                              );
                            }}
                            onSelect={(item) => {
                              const nextTimezone = item.value;
                              setTimezone(nextTimezone);
                              persistDashboardSettings(currency, nextTimezone);
                            }}
                            size="md"
                          />
                        </div>
                      </div>
                    </>
                    </TabPanel>
                    <TabPanel
                      style={{
                        flex: 1,
                        minWidth: 0,
                        minHeight: 0,
                        padding: '24px',
                        overflowY: 'auto',
                        backgroundColor: 'var(--cds-layer)',
                      }}
                    >
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '24px',
                        maxWidth: '960px',
                      }}
                    >
                      <div
                        style={{
                          backgroundColor: 'var(--shopify-white)',
                          border: '1px solid #e0e0e0',
                          borderRadius: '8px',
                          padding: '16px 20px',
                        }}
                      >
                        <h3
                          style={{
                            fontFamily: "'IBM Plex Sans', sans-serif",
                            fontSize: '20px',
                            fontWeight: 600,
                            color: '#161616',
                            margin: '0 0 8px 0',
                          }}
                        >
                          {settingsCopy.organizationTitle}
                        </h3>
                        <p
                          style={{
                            fontSize: '14px',
                            color: '#525252',
                            margin: '0 0 24px 0',
                            lineHeight: 1.5,
                          }}
                        >
                          {settingsCopy.organizationDescription}
                        </p>
                        <div
                          style={{
                            maxWidth: '560px',
                            padding: '12px',
                            borderRadius: '6px',
                            background: 'unset',
                            backgroundColor: 'var(--cds-layer-01)',
                          }}
                        >
                          <TextInput
                            id="settings-org-name"
                            labelText={settingsCopy.organizationName}
                            readOnly
                            value={mockOrganizationSettings.organizationName}
                            size="md"
                            helperText={
                              <span style={{ fontStyle: 'italic' }}>
                                {settingsCopy.orgDetailsReadonlyHint}
                              </span>
                            }
                          />
                          <div style={{ marginTop: '16px' }}>
                            <SettingsFilterableSelect
                              id="settings-org-country-of-business"
                              titleText={settingsCopy.countryOfBusiness}
                              placeholder={settingsCopy.selectCountry}
                              items={countryOfBusinessItems}
                              selectedItem={selectedCountryOfBusinessItem ?? null}
                              itemToString={(item) => item.label}
                              filterItem={(item, q) =>
                                `${item.label} ${item.value}`.toLowerCase().includes(q)
                              }
                              onSelect={(item) => setCountryOfBusiness(item.value)}
                              size="md"
                            />
                          </div>
                        </div>
                      </div>

                      <div
                        style={{
                          backgroundColor: 'var(--shopify-white)',
                          border: '1px solid #e0e0e0',
                          borderRadius: '8px',
                          padding: '24px',
                        }}
                      >
                        <h3
                          style={{
                            fontFamily: "'IBM Plex Sans', sans-serif",
                            fontSize: '18px',
                            fontWeight: 600,
                            color: '#161616',
                            margin: '0 0 8px 0',
                          }}
                        >
                          {settingsCopy.associatedEntitiesTitle}
                        </h3>
                        <p
                          style={{
                            fontSize: '14px',
                            color: '#525252',
                            margin: '0 0 20px 0',
                            lineHeight: 1.5,
                          }}
                        >
                          {settingsCopy.associatedEntitiesDescription}
                        </p>
                        <div style={{ width: '100%', overflowX: 'auto' }}>
                        <Table size="sm">
                          <TableHead>
                            <TableRow>
                              <TableHeader
                                style={{
                                  fontSize: '11px',
                                  fontWeight: 600,
                                  letterSpacing: '0.32px',
                                  textTransform: 'uppercase',
                                  color: '#6d7175',
                                }}
                              >
                                {settingsCopy.shopNameFixed}
                              </TableHeader>
                              <TableHeader
                                style={{
                                  fontSize: '11px',
                                  fontWeight: 600,
                                  letterSpacing: '0.32px',
                                  textTransform: 'uppercase',
                                  color: '#6d7175',
                                }}
                              >
                                {settingsCopy.displayNameLabel}
                              </TableHeader>
                              <TableHeader
                                style={{
                                  fontSize: '11px',
                                  fontWeight: 600,
                                  letterSpacing: '0.32px',
                                  textTransform: 'uppercase',
                                  color: '#6d7175',
                                }}
                              >
                                {settingsCopy.logoLabel}
                              </TableHeader>
                              <TableHeader
                                style={{
                                  fontSize: '11px',
                                  fontWeight: 600,
                                  letterSpacing: '0.32px',
                                  textTransform: 'uppercase',
                                  color: '#6d7175',
                                }}
                              >
                                {settingsCopy.backgroundLabel}
                              </TableHeader>
                              <TableHeader
                                style={{
                                  fontSize: '11px',
                                  fontWeight: 600,
                                  letterSpacing: '0.32px',
                                  textTransform: 'uppercase',
                                  color: '#6d7175',
                                  width: '80px',
                                  textAlign: 'center',
                                }}
                              >
                                {settingsCopy.actionLabel}
                              </TableHeader>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {mockOrganizationSettings.associatedEntities.map((row) => (
                              <TableRow key={row.id}>
                                <TableCell>
                                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                    <span
                                      style={{
                                        fontWeight: 600,
                                        color: 'var(--shopify-text-primary)',
                                        fontSize: '14px',
                                      }}
                                    >
                                      {row.shopName}
                                    </span>
                                    <span style={{ fontSize: '12px', color: '#6d7175' }}>{row.email}</span>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <TextInput
                                    id={`settings-entity-display-${row.id}`}
                                    labelText=""
                                    hideLabel
                                    value={orgEntityDisplayNames[row.id] ?? row.displayName}
                                    onChange={(e) =>
                                      setOrgEntityDisplayNames((prev) => ({
                                        ...prev,
                                        [row.id]: (e.target as HTMLInputElement).value,
                                      }))
                                    }
                                    size="sm"
                                    style={{ minWidth: '140px', borderRadius: '0px' }}
                                  />
                                </TableCell>
                                <TableCell>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <div
                                      style={{
                                        width: 36,
                                        height: 36,
                                        borderRadius: '6px',
                                        backgroundColor: 'var(--shopify-gray-100)',
                                        border: '1px solid var(--shopify-border)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                      }}
                                      aria-hidden
                                    >
                                      <Image size={18} style={{ color: '#9ca3af' }} />
                                    </div>
                                    <IconButton
                                      kind="ghost"
                                      size="sm"
                                      label={settingsCopy.uploadLogoLabel}
                                      onClick={() => {}}
                                    >
                                      <Upload size={16} />
                                    </IconButton>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <div
                                      style={{
                                        width: 56,
                                        height: 32,
                                        borderRadius: '6px',
                                        backgroundColor: 'var(--shopify-gray-100)',
                                        border: '1px solid var(--shopify-border)',
                                      }}
                                      aria-hidden
                                    />
                                    <IconButton
                                      kind="ghost"
                                      size="sm"
                                      label={settingsCopy.uploadBackgroundLabel}
                                      onClick={() => {}}
                                    >
                                      <Upload size={16} />
                                    </IconButton>
                                  </div>
                                </TableCell>
                                <TableCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                                  <CheckmarkFilled
                                    size={20}
                                    style={{ color: 'var(--brand-primary)' }}
                                    aria-label={settingsCopy.savedLabel}
                                  />
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                        </div>
                      </div>
                    </div>
                    </TabPanel>
                    <TabPanel
                      style={{
                        flex: 1,
                        minWidth: 0,
                        minHeight: 0,
                        padding: '24px',
                        overflowY: 'auto',
                        backgroundColor: 'var(--cds-layer)',
                      }}
                    >
                    <div
                      style={{
                        backgroundColor: 'var(--shopify-white)',
                        border: '1px solid #e0e0e0',
                        borderRadius: '12px',
                        maxWidth: '960px',
                        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.06)',
                        overflow: 'hidden',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'flex-start',
                          gap: '16px',
                          flexWrap: 'wrap',
                          padding: '24px',
                          borderBottom: '1px solid #e8e8e8',
                        }}
                      >
                        <div>
                          <h3
                            style={{
                              fontFamily: "'IBM Plex Sans', sans-serif",
                              fontSize: '20px',
                              fontWeight: 600,
                              color: '#161616',
                              margin: '0 0 6px 0',
                              lineHeight: 1.3,
                            }}
                          >
                            {settingsCopy.teamManagementTitle}
                          </h3>
                          <p
                            style={{
                              fontSize: '14px',
                              color: '#6d7175',
                              margin: 0,
                              lineHeight: 1.5,
                            }}
                          >
                            {settingsCopy.teamManagementDescription}
                          </p>
                        </div>
                        <Button
                          kind="primary"
                          size="md"
                          renderIcon={Add}
                          onClick={() => {
                            setInviteMemberEmail('');
                            setSettingsModal('invite');
                          }}
                          style={{
                            borderRadius: '8px',
                            backgroundColor: '#7256F6',
                            fontWeight: 400,
                            boxShadow: '0 1px 2px rgba(114, 86, 246, 0.25)',
                          }}
                        >
                          {settingsCopy.inviteMemberLabel}
                        </Button>
                      </div>
                      <div style={{ padding: '24px 24px 24px' }}>
                        <div
                          style={{
                            border: '1px solid #e0e0e0',
                            borderRadius: '8px',
                            overflow: 'hidden',
                          }}
                        >
                          <Table>
                            <TableHead>
                              <TableRow>
                                <TableHeader
                                  style={{
                                    fontSize: '11px',
                                    fontWeight: 600,
                                    letterSpacing: '0.5px',
                                    textTransform: 'uppercase',
                                    color: '#6d7175',
                                    backgroundColor: '#fafafa',
                                  }}
                                >
                                  {settingsCopy.memberLabel}
                                </TableHeader>
                                <TableHeader
                                  style={{
                                    fontSize: '11px',
                                    fontWeight: 600,
                                    letterSpacing: '0.5px',
                                    textTransform: 'uppercase',
                                    color: '#6d7175',
                                    backgroundColor: '#fafafa',
                                  }}
                                >
                                  {settingsCopy.roleLabel}
                                </TableHeader>
                                <TableHeader
                                  style={{
                                    fontSize: '11px',
                                    fontWeight: 600,
                                    letterSpacing: '0.5px',
                                    textTransform: 'uppercase',
                                    color: '#6d7175',
                                    backgroundColor: '#fafafa',
                                  }}
                                >
                                  {settingsCopy.joinedLabel}
                                </TableHeader>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {mockTeamMembers.map((member) => (
                                <TableRow key={member.id}>
                                  <TableCell>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                      <div
                                        style={{
                                          width: 40,
                                          height: 40,
                                          borderRadius: '50%',
                                          backgroundColor: '#dbeafe',
                                          color: '#1e40af',
                                          display: 'flex',
                                          alignItems: 'center',
                                          justifyContent: 'center',
                                          fontSize: '16px',
                                          fontWeight: 600,
                                          flexShrink: 0,
                                        }}
                                        aria-hidden
                                      >
                                        {member.name.replace(/\s*\(You\)\s*/i, '').trim().charAt(0).toUpperCase() || '?'}
                                      </div>
                                      <div>
                                        <div
                                          style={{
                                            fontSize: '14px',
                                            fontWeight: 600,
                                            color: '#161616',
                                            lineHeight: 1.3,
                                          }}
                                        >
                                          {member.name}
                                        </div>
                                        <div style={{ fontSize: '13px', color: '#6d7175', marginTop: '2px' }}>
                                          {member.email}
                                        </div>
                                      </div>
                                    </div>
                                  </TableCell>
                                  <TableCell>
                                    <span
                                      style={{
                                        display: 'inline-block',
                                        padding: '4px 10px',
                                        borderRadius: '6px',
                                        fontSize: '12px',
                                        fontWeight: 600,
                                        letterSpacing: '0.02em',
                                        backgroundColor: '#fce7f3',
                                        color: '#be185d',
                                      }}
                                    >
                                      {member.role}
                                    </span>
                                  </TableCell>
                                  <TableCell style={{ fontSize: '14px', color: '#525252' }}>{member.joined}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      </div>
                    </div>
                    </TabPanel>
                    <TabPanel
                      style={{
                        flex: 1,
                        minWidth: 0,
                        minHeight: 0,
                        padding: '24px',
                        overflowY: 'auto',
                        backgroundColor: 'var(--cds-layer)',
                      }}
                    >
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '16px',
                        maxWidth: '960px',
                        width: '100%',
                      }}
                    >
                      <div
                        style={{
                          backgroundColor: 'var(--shopify-white)',
                          border: '1px solid #e0e0e0',
                          borderRadius: '12px',
                          padding: '24px',
                        }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            justifyContent: 'space-between',
                            gap: '16px',
                            flexWrap: 'wrap',
                            marginBottom: '16px',
                          }}
                        >
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            <h3
                              style={{
                                fontFamily: "'IBM Plex Sans', sans-serif",
                                fontSize: '20px',
                                fontWeight: 600,
                                color: '#161616',
                                margin: 0,
                              }}
                            >
                              {settingsCopy.recentInquiriesTitle}
                            </h3>
                            <p
                            style={{
                              fontSize: '14px',
                              color: '#6d7175',
                              margin: 0,
                                fontWeight: 400,
                              lineHeight: 1.5,
                            }}
                          >
                            {settingsCopy.recentInquiriesDescription}
                          </p>

                          </div>

                          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <Button
                              kind="primary"
                              size="md"
                              renderIcon={Chat}
                              onClick={() => {
                                resetContactSupportForm();
                                setSettingsModal('contact');
                              }}
                              style={{
                                borderRadius: '8px',
                                backgroundColor: '#7256F6',
                                fontWeight: 400,
                                boxShadow: '0 1px 2px rgba(114, 86, 246, 0.25)',
                              }}
                            >
                              {settingsCopy.contactUsLabel}
                            </Button>
                          </div>
                        </div>

                        {inquiries.length === 0 ? (
                          <div
                            style={{
                              border: '1px dashed #d8dbe0',
                              borderRadius: '10px',
                              padding: '32px 16px',
                              textAlign: 'center',
                              color: '#6d7175',
                              backgroundColor: 'var(--cds-layer-01)',
                            }}
                          >
                            {settingsCopy.noInquiriesLabel}
                          </div>
                        ) : (
                          <div style={{ width: '100%', overflowX: 'auto' }}>
                            <Table size="sm">
                              <TableHead>
                                <TableRow>
                                  <TableHeader
                                    style={{
                                      fontSize: '11px',
                                      fontWeight: 600,
                                      letterSpacing: '0.32px',
                                      textTransform: 'uppercase',
                                      color: '#6d7175',
                                      backgroundColor: '#fafafa',
                                    }}
                                  >
                                    Date
                                  </TableHeader>
                                  <TableHeader
                                    style={{
                                      fontSize: '11px',
                                      fontWeight: 600,
                                      letterSpacing: '0.32px',
                                      textTransform: 'uppercase',
                                      color: '#6d7175',
                                      backgroundColor: '#fafafa',
                                    }}
                                  >
                                    {settingsCopy.inquiryCategoryLabel}
                                  </TableHeader>
                                  <TableHeader
                                    style={{
                                      fontSize: '11px',
                                      fontWeight: 600,
                                      letterSpacing: '0.32px',
                                      textTransform: 'uppercase',
                                      color: '#6d7175',
                                      backgroundColor: '#fafafa',
                                    }}
                                  >
                                    {settingsCopy.subjectLabel}
                                  </TableHeader>
                                  <TableHeader
                                    style={{
                                      fontSize: '11px',
                                      fontWeight: 600,
                                      letterSpacing: '0.32px',
                                      textTransform: 'uppercase',
                                      color: '#6d7175',
                                      backgroundColor: '#fafafa',
                                      width: '260px',
                                    }}
                                  >
                                    {settingsCopy.messageLabel}
                                  </TableHeader>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {inquiries.map((inq) => (
                                  <TableRow key={inq.id}>
                                    <TableCell style={{ fontSize: '14px', color: '#525252' }}>
                                      {formatSupportInquiryDate(inq.submittedAt)}
                                    </TableCell>
                                    <TableCell style={{ fontSize: '14px', color: '#161616' }}>{inq.category}</TableCell>
                                    <TableCell style={{ fontSize: '14px', color: '#161616' }}>{inq.subject}</TableCell>
                                    <TableCell>
                                      <span
                                        style={{
                                          display: 'block',
                                          maxWidth: '260px',
                                          overflow: 'hidden',
                                          textOverflow: 'ellipsis',
                                          whiteSpace: 'nowrap',
                                          color: '#525252',
                                          fontSize: '14px',
                                        }}
                                        title={inq.messagePreview}
                                      >
                                        {inq.messagePreview}
                                      </span>
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                        )}
                      </div>
                    </div>
                    </TabPanel>
                  </TabPanels>
                </TabsVertical>
              </div>
            </div>
          )}

          {activeSection === 'dashboard' && (
            <div style={{ width: '100%' }}>
              {!canViewSalesDashboard && !canViewCreatorDashboard ? (
                <div style={{ padding: '48px 24px', textAlign: 'center' }}>
                  <p style={{ fontSize: '14px', color: 'var(--shopify-text-secondary)', margin: 0 }}>
                    {settingsCopy.dashboardNoAccess}
                  </p>
                </div>
              ) : (
              <>
              {/* Dashboard Title and Controls */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '12px 24px',
                borderBottom: '1px solid var(--shopify-border)',
                background: 'unset',
                backgroundColor: 'var(--cds-layer-01)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                  <h2 style={{
                    fontSize: '24px',
                    fontWeight: '600',
                    color: 'var(--shopify-text-primary)',
                    margin: 0,
                    letterSpacing: '-0.02em'
                  }}>
                    {settingsCopy.titleDashboard}
                  </h2>
                  {canViewSalesDashboard && canViewCreatorDashboard && (
                    <div
                      className="dashboard-view-tabs"
                      style={{ marginLeft: '4px' }}
                      role="tablist"
                      aria-label={settingsCopy.dashboardViewLabel}
                    >
                      <button
                        type="button"
                        role="tab"
                        aria-selected={dashboardView === 'sales'}
                        className={cn(
                          dashboardView === 'sales' && 'dashboard-view-tabs__segment--selected'
                        )}
                        onClick={() => setDashboardView('sales')}
                      >
                        {settingsCopy.dashboardViewSales}
                      </button>
                      <button
                        type="button"
                        role="tab"
                        aria-selected={dashboardView === 'creators'}
                        className={cn(
                          dashboardView === 'creators' && 'dashboard-view-tabs__segment--selected'
                        )}
                        onClick={() => setDashboardView('creators')}
                      >
                        {settingsCopy.dashboardViewCreators}
                      </button>
                    </div>
                  )}
                  
                  {/* Performance Rank Badge - Inline */}
                  {performanceRankByTimeRange && showSalesDashboard && (
                    <div style={{ 
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '4px 12px',
                      backgroundColor: performanceRankByTimeRange.percentile >= 75 
                        ? '#f0edff'
                        : performanceRankByTimeRange.percentile >= 50
                        ? '#e8f4f8'
                        : '#f6f6f7',
                      border: '1px solid var(--shopify-border)',
                      borderRadius: '12px',
                      fontSize: '12px',
                      color: 'var(--shopify-text-secondary)'
                    }}>
                      <span style={{ 
                        fontWeight: '500',
                        color: 'var(--shopify-text-primary)'
                      }}>
                        {settingsCopy.performanceRank}
                      </span>
                      <span style={{ 
                        fontWeight: '600',
                        color: performanceRankByTimeRange.percentile >= 75 
                          ? '#7256F6'
                          : performanceRankByTimeRange.percentile >= 50
                          ? '#0072c3'
                          : '#6d7175'
                      }}>
                        Top {100 - performanceRankByTimeRange.percentile}%
                      </span>
                    </div>
                  )}
                </div>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
                  {/* Date Range Dropdown */}
                  <select
                    value={timeRange}
                    onChange={(e) => handleTimeRangeChange((e.target as unknown as { value: string }).value as 'hourly' | '7d' | '14d' | '30d' | 'thisMonth' | 'lastMonth' | 'thisQ' | 'lastQ' | 'custom')}
                    style={DASHBOARD_PERIOD_SELECT_STYLE}
                    {...dashboardPeriodSelectInteractionProps}
                  >
                    <option value="hourly">{settingsCopy.periodHourly}</option>
                    <option value="7d">{settingsCopy.periodLast7Days}</option>
                    <option value="14d">{settingsCopy.periodLast14Days}</option>
                    <option value="30d">{settingsCopy.periodLast30Days}</option>
                    <option value="thisMonth">{settingsCopy.periodThisMonth}</option>
                    <option value="lastMonth">{settingsCopy.periodLastMonth}</option>
                    <option value="thisQ">{settingsCopy.periodThisQuarter}</option>
                    <option value="lastQ">{settingsCopy.periodLastQuarter}</option>
                    <option value="custom">{settingsCopy.periodCustomRange}</option>
                  </select>
                  
                  {/* Custom Date Range Picker - shown when custom is selected */}
                  {timeRange === 'custom' && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <input
                        type="date"
                        value={customStartDate}
                        onChange={(e) => setCustomStartDate((e.target as unknown as { value: string }).value)}
                        style={{
                          padding: '8px 12px',
                          border: '1px solid var(--shopify-border)',
                          borderRadius: '6px',
                          fontSize: '14px',
                          color: 'var(--shopify-text-primary)',
                          outline: 'none',
                          transition: 'border-color 0.15s ease'
                        }}
                        onFocus={(e) => (e.target as unknown as { style: Record<string, string> }).style.borderColor = '#7256F6'}
                        onBlur={(e) => (e.target as unknown as { style: Record<string, string> }).style.borderColor = 'var(--shopify-border)'}
                        onMouseEnter={(e) => {
                          (e.currentTarget as unknown as { style: Record<string, string> }).style.borderColor = '#7256F6';
                        }}
                        onMouseLeave={(e) => {
                          if ((globalThis as unknown as { document?: { addEventListener(type: string, listener: EventListener): void; removeEventListener(type: string, listener: EventListener): void; activeElement?: EventTarget | null } }).document?.activeElement !== e.currentTarget) {
                            (e.currentTarget as unknown as { style: Record<string, string> }).style.borderColor = 'var(--shopify-border)';
                          }
                        }}
                      />
                      <span style={{ fontSize: '14px', color: 'var(--shopify-text-secondary)' }}>{settingsCopy.to}</span>
                      <input
                        type="date"
                        value={customEndDate}
                        onChange={(e) => setCustomEndDate((e.target as unknown as { value: string }).value)}
                        style={{
                          padding: '8px 12px',
                          border: '1px solid var(--shopify-border)',
                          borderRadius: '6px',
                          fontSize: '14px',
                          color: 'var(--shopify-text-primary)',
                          outline: 'none',
                          transition: 'border-color 0.15s ease'
                        }}
                        onFocus={(e) => (e.target as unknown as { style: Record<string, string> }).style.borderColor = '#7256F6'}
                        onBlur={(e) => (e.target as unknown as { style: Record<string, string> }).style.borderColor = 'var(--shopify-border)'}
                        onMouseEnter={(e) => {
                          (e.currentTarget as unknown as { style: Record<string, string> }).style.borderColor = '#7256F6';
                        }}
                        onMouseLeave={(e) => {
                          if ((globalThis as unknown as { document?: { addEventListener(type: string, listener: EventListener): void; removeEventListener(type: string, listener: EventListener): void; activeElement?: EventTarget | null } }).document?.activeElement !== e.currentTarget) {
                            (e.currentTarget as unknown as { style: Record<string, string> }).style.borderColor = 'var(--shopify-border)';
                          }
                        }}
                      />
                      <button
                        onClick={handleCustomDateRangeApply}
                        style={{
                          padding: '8px 16px',
                          border: '1px solid var(--shopify-border)',
                          borderRadius: '6px',
                          backgroundColor: '#7256F6',
                          color: 'white',
                          fontSize: '14px',
                          cursor: 'pointer',
                          outline: 'none',
                          transition: 'all 0.15s ease'
                        }}
                        onMouseEnter={(e) => {
                          (e.currentTarget as unknown as { style: Record<string, string> }).style.backgroundColor = '#5a3fd4';
                        }}
                        onMouseLeave={(e) => {
                          (e.currentTarget as unknown as { style: Record<string, string> }).style.backgroundColor = '#7256F6';
                        }}
                      >
                        {settingsCopy.apply}
                      </button>
                    </div>
                  )}

                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '12px',
                      flexWrap: 'wrap',
                    }}
                  >
                    {showCreatorDashboard ? (
                      <div ref={creatorFilterMenuRef} style={{ position: 'relative' }}>
                        <button
                          type="button"
                          className="shopify-time-button"
                          style={{
                            padding: '8px 16px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            fontSize: '14px',
                            ...(creatorFilterMenuOpen
                              ? {
                                  borderColor: 'var(--brand-primary)',
                                  boxShadow: '0 0 0 1px rgba(114, 86, 246, 0.35)',
                                }
                              : {}),
                          }}
                          aria-expanded={creatorFilterMenuOpen}
                          aria-haspopup="true"
                          aria-controls="creator-dashboard-filter-menu"
                          id="creator-dashboard-filter-trigger"
                          aria-label={
                            creatorFilterSelectedCount > 0
                              ? `Filter, ${creatorFilterSelectedCount} active`
                              : settingsCopy.filter
                          }
                          onClick={() => setCreatorFilterMenuOpen((o) => !o)}
                        >
                          <Filter size={16} />
                          <span>{settingsCopy.filter}</span>
                          {creatorFilterSelectedCount > 0 && (
                            <span
                              aria-hidden
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                minWidth: '18px',
                                height: '18px',
                                padding: '0 5px',
                                borderRadius: '9px',
                                backgroundColor: 'var(--brand-primary)',
                                color: 'white',
                                fontSize: '11px',
                                fontWeight: 600,
                                lineHeight: 1,
                              }}
                            >
                              {creatorFilterSelectedCount}
                            </span>
                          )}
                        </button>
                        {creatorFilterMenuOpen && (
                          <div
                            id="creator-dashboard-filter-menu"
                            role="menu"
                            aria-labelledby="creator-dashboard-filter-trigger"
                            style={{
                              position: 'absolute',
                              top: '100%',
                              right: 0,
                              marginTop: '8px',
                              backgroundColor: 'white',
                              border: '1px solid var(--shopify-border)',
                              borderRadius: '8px',
                              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                              minWidth: '240px',
                              zIndex: 1000,
                              padding: '4px 0',
                            }}
                          >
                            <label
                              role="menuitemcheckbox"
                              aria-checked={creatorExcludeCancelled}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                padding: '10px 14px',
                                cursor: 'pointer',
                                fontSize: '14px',
                                color: 'var(--shopify-text-primary)',
                                margin: 0,
                                width: '100%',
                                boxSizing: 'border-box',
                              }}
                            >
                              <input
                                type="checkbox"
                                checked={creatorExcludeCancelled}
                                onChange={(e) => setCreatorExcludeCancelled(e.target.checked)}
                                style={{
                                  width: 16,
                                  height: 16,
                                  cursor: 'pointer',
                                  accentColor: 'var(--brand-primary)',
                                  flexShrink: 0,
                                }}
                              />
                              <span>{settingsCopy.excludeCancelledOrders}</span>
                            </label>
                          </div>
                        )}
                      </div>
                    ) : (
                      <button
                        type="button"
                        className="shopify-time-button"
                        style={{
                          padding: '8px 16px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          fontSize: '14px',
                        }}
                      >
                        <Filter size={16} />
                        {settingsCopy.filter}
                      </button>
                    )}
                  </div>

                  <button
                    type="button"
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
                    {extraCopy.export}
                  </button>
                </div>
              </div>

              {showSalesDashboard && (
              <React.Fragment>
              {/* 1. Recent Activity & Live Performance */}
              <div style={{ 
                marginTop: '16px',
                marginLeft: '24px',
                marginRight: '24px',
                marginBottom: '16px',
              }}>
                <Grid narrow style={{ marginLeft: 0, marginRight: 0, paddingLeft: 0, paddingRight: 0 }}>
                  {/* Left Panel - Historical Comparison */}
                  <Column lg={11} style={{ paddingLeft: 0, paddingRight: 0 }}>
                    <div style={{ 
                      backgroundColor: 'white',
                      borderRadius: '8px',
                      border: '1px solid var(--shopify-border)',
                      padding: '16px',
                      height: '100%'
                    }}>
                      <h4 style={{ fontSize: '13px', fontWeight: '400', color: '#202124', marginBottom: '12px' }}>
                        {isCustomRange ? formatCustomDateRange() : getTimeRangeLabel(timeRange)} vs. {settingsCopy.previousPeriod}
                      </h4>
                      
                      {/* Metric data configuration */}
                      {(() => {
                        // Generate metric data from filtered revenue data
                        const generateMetricData = (metricType: 'newUsers' | 'totalUsers' | 'impressions' | 'returningUsers') => {
                          return filteredRevenueData.map((d, index) => {
                            // Base values on revenue data with multipliers
                            let current: number;
                            let previous: number;
                            
                            // Use index as seed for deterministic randomness
                            const seed = index * 1000 + (metricType === 'newUsers' ? 1 : metricType === 'totalUsers' ? 2 : metricType === 'impressions' ? 3 : 4);
                            switch (metricType) {
                              case 'newUsers':
                                current = d.clicks * 4.2 + seededRandom(seed) * 2000;
                                previous = current * 0.9;
                                break;
                              case 'totalUsers':
                                current = d.clicks * 4.6 + seededRandom(seed) * 2000;
                                previous = current * 0.9;
                                break;
                              case 'impressions':
                                current = d.clicks * 14 + seededRandom(seed) * 5000;
                                previous = current * 0.9;
                                break;
                              case 'returningUsers':
                                current = d.conversions * 0.4 + seededRandom(seed) * 200;
                                previous = current * 0.75;
                                break;
                            }
                            
                            return {
                              date: d.date,
                              current: Math.round(current),
                              previous: Math.round(previous)
                            };
                          });
                        };

                        const metricData = {
                          newUsers: {
                            data: generateMetricData('newUsers'),
                            label: extraCopy.newUsers,
                            yAxisLabel: extraCopy.users,
                            formatValue: (value: number) => `${(value / 1000).toFixed(1)}K`
                          },
                          totalUsers: {
                            data: generateMetricData('totalUsers'),
                            label: extraCopy.totalUsers,
                            yAxisLabel: extraCopy.users,
                            formatValue: (value: number) => `${(value / 1000).toFixed(1)}K`
                          },
                          impressions: {
                            data: generateMetricData('impressions'),
                            label: extraCopy.impressions,
                            yAxisLabel: extraCopy.impressions,
                            formatValue: (value: number) => `${(value / 1000).toFixed(0)}K`
                          },
                          returningUsers: {
                            data: generateMetricData('returningUsers'),
                            label: extraCopy.returningUsers,
                            yAxisLabel: extraCopy.users,
                            formatValue: (value: number) => `${(value / 1000).toFixed(1)}K`
                          }
                        };

                        // Calculate aggregated metric info
                        const calculateMetricInfo = (metricType: 'newUsers' | 'totalUsers' | 'impressions' | 'returningUsers') => {
                          const data = metricData[metricType].data;
                          const totalCurrent = data.reduce((sum, d) => sum + d.current, 0);
                          const totalPrevious = data.reduce((sum, d) => sum + d.previous, 0);
                          const change = totalPrevious > 0 ? ((totalCurrent - totalPrevious) / totalPrevious) * 100 : 0;
                          
                          return {
                            label: metricData[metricType].label,
                            value: metricData[metricType].formatValue(totalCurrent),
                            change: `${change >= 0 ? '+' : ''}${change.toFixed(1)}%`
                          };
                        };

                        const metricInfo = {
                          newUsers: calculateMetricInfo('newUsers'),
                          totalUsers: calculateMetricInfo('totalUsers'),
                          impressions: calculateMetricInfo('impressions'),
                          returningUsers: calculateMetricInfo('returningUsers'),
                        };

                        return (
                          <>
                            {/* KPI Cards - Last 7 Days vs Previous */}
                            <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
                              {(['newUsers', 'totalUsers', 'impressions', 'returningUsers'] as const).map((metric) => {
                                const isSelected = dashboardMetric === metric;
                                const info = metricInfo[metric];

                                return (
                                  <div 
                                    key={metric}
                                    onClick={() => setDashboardMetric(metric)}
                                    style={{ 
                                      flex: 1,
                                      cursor: 'pointer',
                                      padding: '12px',
                                      borderRadius: '6px',
                                      border: isSelected ? '1px solid #e8f0fe' : '1px solid transparent',
                                      borderLeft: isSelected ? '3px solid #1a73e8' : '3px solid transparent',
                                      backgroundColor: isSelected ? '#f8f9ff' : 'transparent',
                                      boxShadow: isSelected ? '0 1px 3px rgba(26, 115, 232, 0.12)' : 'none',
                                      transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                                      position: 'relative'
                                    }}
                                    onMouseEnter={(e) => {
                                      if (!isSelected) {
                                        (e.currentTarget as unknown as { style: Record<string, string> }).style.backgroundColor = '#fafbfc';
                                        (e.currentTarget as unknown as { style: Record<string, string> }).style.borderColor = '#e8eaed';
                                      }
                                    }}
                                    onMouseLeave={(e) => {
                                      if (!isSelected) {
                                        (e.currentTarget as unknown as { style: Record<string, string> }).style.backgroundColor = 'transparent';
                                        (e.currentTarget as unknown as { style: Record<string, string> }).style.borderColor = 'transparent';
                                      }
                                    }}
                                  >
                                    {isSelected && (
                                      <div style={{
                                        position: 'absolute',
                                        top: '8px',
                                        right: '8px',
                                        width: '5px',
                                        height: '5px',
                                        borderRadius: '50%',
                                        backgroundColor: '#1a73e8',
                                        boxShadow: '0 0 0 2px rgba(26, 115, 232, 0.2)'
                                      }} />
                                    )}
                                    <div style={{ 
                                      fontSize: '12px', 
                                      color: isSelected ? '#1a73e8' : '#5f6368', 
                                      marginBottom: '4px', 
                                      fontWeight: isSelected ? '500' : '400',
                                      transition: 'all 0.2s ease'
                                    }}>
                                      {info.label}
                                    </div>
                                    <div style={{ 
                                      fontSize: '22px', 
                                      fontWeight: isSelected ? '500' : '400', 
                                      color: '#202124', 
                                      lineHeight: '1.2', 
                                      marginBottom: '2px',
                                      transition: 'all 0.2s ease'
                                    }}>
                                      {info.value}
                                    </div>
                                    <div style={{ fontSize: '12px', color: '#d93025', display: 'flex', alignItems: 'center', gap: '3px', fontWeight: '400' }}>
                                      <svg width="8" height="8" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M5 8L1 4H9L5 8Z" fill="#d93025"/>
                                      </svg>
                                      {info.change}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>  

                            {/* Comparison Line Chart */}
                            <div style={{ marginTop: '12px' }}>
                              <ResponsiveContainer width="100%" height={200}>
                                <LineChart 
                                  data={metricData[dashboardMetric].data}
                                  margin={{ top: 20, right: 10, left: 25, bottom: 5 }}
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
                                    tickFormatter={metricData[dashboardMetric].formatValue}
                                    width={60}
                                    label={{ 
                                      value: metricData[dashboardMetric].yAxisLabel, 
                                      angle: -90, 
                                      position: 'insideLeft',
                                      offset: 0,
                                      style: { textAnchor: 'middle', fill: '#5f6368', fontSize: 12 }
                                    }}
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
                                      const formattedValue = metricData[dashboardMetric].formatValue(value);
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
                                    name={isCustomRange ? formatCustomDateRange() : getTimeRangeLabel(timeRange)}
                                  />
                                </LineChart>
                              </ResponsiveContainer>
                              <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginTop: '8px' }}>
                                <div style={{ fontSize: '12px', color: '#1a73e8', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                  {settingsCopy.viewReportsSnapshot}
                                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M6 3L11 8L6 13" stroke="#1a73e8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                  </svg>
                                </div>
                              </div>
                            </div>
                          </>
                        );
                      })()}
                    </div>
                  </Column>

                  {/* Right Panel - Real-time Activity */}
                  <Column lg={5} style={{ paddingLeft: 0, paddingRight: 0 }}>
                    <div style={{ 
                      backgroundColor: 'white',
                      borderRadius: '8px',
                      border: '1px solid var(--shopify-border)',
                      padding: '16px',
                      height: '100%'
                    }}>
                      {/* Live Metric */}
                      <div style={{ marginBottom: '16px' }}>
                        <div style={{ fontSize: '12px', color: '#5f6368', marginBottom: '6px', fontWeight: '400', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M8 14C11.3137 14 14 11.3137 14 8C14 4.68629 11.3137 2 8 2C4.68629 2 2 4.68629 2 8C2 11.3137 4.68629 14 8 14Z" fill="#34a853"/>
                            <path d="M8 14C11.3137 14 14 11.3137 14 8C14 4.68629 11.3137 2 8 2C4.68629 2 2 4.68629 2 8C2 11.3137 4.68629 14 8 14Z" stroke="white" strokeWidth="2"/>
                          </svg>
                          {extraCopy.activeUsersLast30m}
                        </div>
                        <div style={{ fontSize: '32px', fontWeight: '400', color: '#202124', lineHeight: 1 }}>436</div>
                      </div>

                      {/* Orders Per Minute Chart */}
                      <div style={{ marginBottom: '16px' }}>
                        <div style={{ fontSize: '12px', color: '#5f6368', marginBottom: '8px', fontWeight: '400' }}>
                          {extraCopy.activeUsersPerMinute}
                        </div>
                        <ResponsiveContainer width="100%" height={60}>
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
                          marginBottom: '8px',
                          fontWeight: '600',
                          textTransform: 'uppercase',
                          borderBottom: '1px solid var(--shopify-border)',
                          paddingBottom: '6px'
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
                            <div key={index} style={{ marginBottom: '8px' }}>
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

                        <div style={{ fontSize: '12px', color: '#1a73e8', textAlign: 'right', marginTop: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '4px' }}>
                          {extraCopy.viewRealtime}
                          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
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
                  padding: '0 0 16px 0',
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

              {/* Weekend vs Weekday Performance */}
              <div style={{ 
                marginTop: '16px',
                marginLeft: '24px',
                marginRight: '24px',
                marginBottom: '16px',
              }}>
                <div style={{ 
                  backgroundColor: 'white',
                  borderRadius: '8px',
                  border: '1px solid var(--shopify-border)',
                  padding: '16px'
                }}>
                  <div style={{ marginBottom: '12px', paddingLeft: '0px', paddingRight: '0px' }}>
                    <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#202124', margin: 0, marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Calendar size={20} style={{ color: '#8a3ffc' }} />
                      {settingsCopy.weekendVsWeekdayTitle}
                    </h4>
                    <p style={{ fontSize: '12px', color: 'var(--shopify-text-secondary)', margin: 0 }}>
                      {settingsCopy.weekendsDefinition}
                    </p>
                  </div>
                  
                  {(() => {
                    // Use default 1 month period (no dropdown selection)
                    const chartData = weekendWeekdayPerformanceWeekly.map(week => ({
                      period: week.week,
                      weekend: week.weekend,
                      weekday: week.weekday
                    }));
                    const aggregatedData = aggregateWeekendWeekdayData(weekendWeekdayPerformanceWeekly);

                    // Calculate AOV and RPC for weekend and weekday
                    const weekendAOV = aggregatedData.weekend.conversions > 0 ? aggregatedData.weekend.revenue / aggregatedData.weekend.conversions : 0;
                    const weekdayAOV = aggregatedData.weekday.conversions > 0 ? aggregatedData.weekday.revenue / aggregatedData.weekday.conversions : 0;
                    const weekendRPC = aggregatedData.weekend.clicks > 0 ? aggregatedData.weekend.revenue / aggregatedData.weekend.clicks : 0;
                    const weekdayRPC = aggregatedData.weekday.clicks > 0 ? aggregatedData.weekday.revenue / aggregatedData.weekday.clicks : 0;

                    return (
                      <>
                        <Grid narrow style={{ paddingLeft: 0, paddingRight: 0 }}>
                    {/* Revenue */}
                    <Column lg={4} md={6} sm={12}>
                      <div className="shopify-metric-card">
                        <div style={{ padding: '12px 12px 0 12px', marginBottom: '12px' }}>
                          <div className="shopify-metric-label" style={{ marginBottom: '4px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <MetricTooltip metric="Revenue" formulaLabel={settingsCopy.formulaLabel}>
                              {settingsCopy.metricTotalRevenue}
                            </MetricTooltip>
                          </div>
                          <div className="shopify-metric-value" style={{ marginBottom: '4px', fontSize: '22px' }}>
                            {formatCurrency(aggregatedData.weekday.revenue, { compact: true })} / {formatCurrency(aggregatedData.weekend.revenue, { compact: true })}
                          </div>
                        </div>
                        <div style={{ 
                          width: '100%', 
                          height: '180px',
                          padding: '0 12px 0 12px'
                        }}>
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={[{ name: settingsCopy.weekday, value: aggregatedData.weekday.revenue }, { name: settingsCopy.weekend, value: aggregatedData.weekend.revenue }]} margin={{ top: 5, right: 10, left: 10, bottom: 25 }}>
                              <CartesianGrid strokeDasharray="3 3" stroke="#e1e3e5" vertical={false} />
                              <XAxis 
                                dataKey="name" 
                                stroke="#6d7175" 
                                tick={{ fontSize: 12, fill: '#6d7175' }}
                                tickLine={{ stroke: '#6d7175' }}
                              />
                              <YAxis 
                                stroke="#6d7175" 
                                tick={{ fontSize: 12, fill: '#6d7175' }}
                                tickLine={{ stroke: '#6d7175' }}
                                width={40}
                                tickFormatter={(value: number) => formatCurrency(value, { compact: true })}
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
                                formatter={(value: number) => formatCurrency(Number(value))}
                              />
                              <Bar 
                                dataKey="value" 
                                radius={[4, 4, 0, 0]}
                              >
                                <Cell fill="#6fa8ff" />
                                <Cell fill="#0f62fe" />
                              </Bar>
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    </Column>

                    {/* Conversions */}
                    <Column lg={4} md={6} sm={12}>
                      <div className="shopify-metric-card">
                        <div style={{ padding: '12px 12px 0 12px', marginBottom: '12px' }}>
                          <div className="shopify-metric-label" style={{ marginBottom: '4px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <MetricTooltip metric="Conversions" formulaLabel={settingsCopy.formulaLabel}>
                              {settingsCopy.metricConversions}
                            </MetricTooltip>
                          </div>
                          <div className="shopify-metric-value" style={{ marginBottom: '4px', fontSize: '22px' }}>
                            {aggregatedData.weekday.conversions.toLocaleString()} / {aggregatedData.weekend.conversions.toLocaleString()}
                          </div>
                        </div>
                        <div style={{ 
                          width: '100%', 
                          height: '180px',
                          padding: '0 12px 0 12px'
                        }}>
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={[{ name: settingsCopy.weekday, value: aggregatedData.weekday.conversions }, { name: settingsCopy.weekend, value: aggregatedData.weekend.conversions }]} margin={{ top: 5, right: 10, left: 0, bottom: 25 }}>
                              <CartesianGrid strokeDasharray="3 3" stroke="#e1e3e5" vertical={false} />
                              <XAxis 
                                dataKey="name" 
                                stroke="#6d7175" 
                                tick={{ fontSize: 12, fill: '#6d7175' }}
                                tickLine={{ stroke: '#6d7175' }}
                              />
                              <YAxis 
                                stroke="#6d7175" 
                                tick={{ fontSize: 12, fill: '#6d7175' }}
                                tickLine={{ stroke: '#6d7175' }}
                                width={40}
                                tickFormatter={(value: number) => {
                                  if (value >= 1000) return `${(value / 1000).toFixed(0)}k`;
                                  return value.toString();
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
                                formatter={(value: number) => value.toLocaleString()}
                              />
                              <Bar 
                                dataKey="value" 
                                radius={[4, 4, 0, 0]}
                              >
                                <Cell fill="#6fa8ff" />
                                <Cell fill="#0f62fe" />
                              </Bar>
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    </Column>

                    {/* AOV */}
                    <Column lg={4} md={6} sm={12}>
                      <div className="shopify-metric-card">
                        <div style={{ padding: '12px 12px 0 12px', marginBottom: '12px' }}>
                          <div className="shopify-metric-label" style={{ marginBottom: '4px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <MetricTooltip metric="AOV">
                              AOV
                            </MetricTooltip>
                          </div>
                          <div className="shopify-metric-value" style={{ marginBottom: '4px', fontSize: '22px' }}>
                            ${weekdayAOV.toFixed(2)} / ${weekendAOV.toFixed(2)}
                          </div>
                        </div>
                        <div style={{ 
                          width: '100%', 
                          height: '180px',
                          padding: '0 12px 0 12px'
                        }}>
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={[{ name: 'Weekday', value: weekdayAOV }, { name: 'Weekend', value: weekendAOV }]} margin={{ top: 5, right: 10, left: 0, bottom: 25 }}>
                              <CartesianGrid strokeDasharray="3 3" stroke="#e1e3e5" vertical={false} />
                              <XAxis 
                                dataKey="name" 
                                stroke="#6d7175" 
                                tick={{ fontSize: 12, fill: '#6d7175' }}
                                tickLine={{ stroke: '#6d7175' }}
                              />
                              <YAxis 
                                stroke="#6d7175" 
                                tick={{ fontSize: 12, fill: '#6d7175' }}
                                tickLine={{ stroke: '#6d7175' }}
                                width={40}
                                tickFormatter={(value: number) => `$${value.toFixed(0)}`}
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
                                formatter={(value: number) => `$${value.toFixed(2)}`}
                              />
                              <Bar 
                                dataKey="value" 
                                radius={[4, 4, 0, 0]}
                              >
                                <Cell fill="#6fa8ff" />
                                <Cell fill="#0f62fe" />
                              </Bar>
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    </Column>

                    {/* RPC */}
                    <Column lg={4} md={6} sm={12}>
                      <div className="shopify-metric-card">
                        <div style={{ padding: '12px 12px 0 12px', marginBottom: '12px' }}>
                          <div className="shopify-metric-label" style={{ marginBottom: '4px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <MetricTooltip metric="RPC">
                              RPC
                            </MetricTooltip>
                          </div>
                          <div className="shopify-metric-value" style={{ marginBottom: '4px', fontSize: '22px' }}>
                            ${weekdayRPC.toFixed(2)} / ${weekendRPC.toFixed(2)}
                          </div>
                        </div>
                        <div style={{ 
                          width: '100%', 
                          height: '180px',
                          padding: '0 12px 0 12px'
                        }}>
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={[{ name: 'Weekday', value: weekdayRPC }, { name: 'Weekend', value: weekendRPC }]} margin={{ top: 5, right: 10, left: 0, bottom: 25 }}>
                              <CartesianGrid strokeDasharray="3 3" stroke="#e1e3e5" vertical={false} />
                              <XAxis 
                                dataKey="name" 
                                stroke="#6d7175" 
                                tick={{ fontSize: 12, fill: '#6d7175' }}
                                tickLine={{ stroke: '#6d7175' }}
                              />
                              <YAxis 
                                stroke="#6d7175" 
                                tick={{ fontSize: 12, fill: '#6d7175' }}
                                tickLine={{ stroke: '#6d7175' }}
                                width={40}
                                tickFormatter={(value: number) => `$${value.toFixed(1)}`}
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
                                formatter={(value: number) => `$${value.toFixed(2)}`}
                              />
                              <Bar 
                                dataKey="value" 
                                radius={[4, 4, 0, 0]}
                              >
                                <Cell fill="#6fa8ff" />
                                <Cell fill="#0f62fe" />
                              </Bar>
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    </Column>
                        </Grid>
                        {aggregatedData.trend === 'up' && (
                          <div style={{ 
                            marginTop: '12px',
                            padding: '8px 16px',
                            backgroundColor: '#e8f5e9',
                            borderRadius: '6px',
                            fontSize: '12px',
                            color: '#16a34a',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px'
                          }}>
                            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M8 12L4 8H12L8 12Z" fill="#16a34a"/>
                            </svg>
                            Weekend performance trending up compared to weekdays
                          </div>
                        )}
                      </>
                    );
                  })()}
                  
                  {/* View Full Report Link */}
                  <div style={{ 
                    marginTop: '12px',
                    textAlign: 'center'
                  }}>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveSection('shop-detail-reports');
                        setDetailReportTab('weekday-weekend');
                      }}
                      style={{ 
                        fontSize: '12px',
                        color: '#0f62fe',
                        textDecoration: 'none',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontWeight: '500',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: 0
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as unknown as { style: Record<string, string> }).style.textDecoration = 'underline';
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as unknown as { style: Record<string, string> }).style.textDecoration = 'none';
                      }}
                    >
                      View full report
                      <svg width="12" height="12" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M7 3L12 8L7 13" stroke="#0f62fe" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              {/* Seller-Focused Dashboard Sections */}
              
              {/* 2. Performance Overview */}
              <div style={{ 
                marginLeft: '24px',
                marginRight: '24px',
                backgroundColor: 'white',
                borderRadius: '8px',
                border: '1px solid var(--shopify-border)',
                padding: '16px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <div>
                    <h3 style={{ fontSize: '16px', fontWeight: '600', color: 'var(--shopify-text-primary)', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Currency size={20} style={{ color: '#7256F6' }} />
                      {settingsCopy.salesPerformanceOverviewTitle}
                    </h3>
                    <p style={{ fontSize: '12px', color: 'var(--shopify-text-secondary)', margin: 0 }}>
                      {settingsCopy.salesPerformanceOverviewDescription}
                    </p>
                  </div>
                  <Tag type="green">+12.5% vs last period</Tag>
                </div>
                
                {/* Grid of earning metrics */}
                <Grid narrow style={{ marginBottom: '12px' }}>
                  <Column lg={3} style={{ height: '100%' }}>
                    <div style={{ padding: '12px', backgroundColor: '#f0edff', borderRadius: '8px', border: '1px solid #e0d9ff', height: '100%', minHeight: '100px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <div style={{ fontSize: '12px', color: 'var(--shopify-text-secondary)', marginBottom: '4px' }}>Total Conversions</div>
                      <div style={{ fontSize: '22px', fontWeight: '600', color: '#7256F6' }}>{mockWebsitePerformance.conversions.toLocaleString()}</div>
                      <div style={{ fontSize: '12px', color: '#16a34a', marginTop: '4px' }}>↑ {Math.round(mockWebsitePerformance.conversions * 0.15).toLocaleString()} from last period</div>
                    </div>
                  </Column>
                  <Column lg={3} style={{ height: '100%' }}>
                    <div style={{ padding: '12px', backgroundColor: '#f6f6f7', borderRadius: '8px', border: '1px solid #e0e0e0', height: '100%', minHeight: '100px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <div style={{ fontSize: '12px', color: 'var(--shopify-text-secondary)', marginBottom: '4px' }}>Avg Order Value</div>
                      <div style={{ fontSize: '22px', fontWeight: '600', color: 'var(--shopify-text-primary)' }}>$38.02</div>
                      <div style={{ fontSize: '12px', color: '#6d7175', marginTop: '4px' }}>Per transaction</div>
                    </div>
                  </Column>
                  <Column lg={3} style={{ height: '100%' }}>
                    <div style={{ padding: '12px', backgroundColor: '#f6f6f7', borderRadius: '8px', border: '1px solid #e0e0e0', height: '100%', minHeight: '100px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <div style={{ fontSize: '12px', color: 'var(--shopify-text-secondary)', marginBottom: '4px' }}>Revenue Per Click</div>
                      <div style={{ fontSize: '22px', fontWeight: '600', color: 'var(--shopify-text-primary)' }}>$5.29</div>
                      <div style={{ fontSize: '12px', color: '#6d7175', marginTop: '4px' }}>Per click</div>
                    </div>
                  </Column>
                  <Column lg={3} style={{ height: '100%' }}>
                    <div style={{ padding: '12px', backgroundColor: '#f6f6f7', borderRadius: '8px', border: '1px solid #e0e0e0', height: '100%', minHeight: '100px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <div style={{ fontSize: '12px', color: 'var(--shopify-text-secondary)', marginBottom: '4px' }}>Cost Per Action</div>
                      <div style={{ fontSize: '22px', fontWeight: '600', color: 'var(--shopify-text-primary)' }}>$5.29</div>
                      <div style={{ fontSize: '12px', color: '#6d7175', marginTop: '4px' }}>Cost to acquire one customer</div>
                    </div>
                  </Column>
                  <Column lg={3} style={{ height: '100%' }}>
                    <div style={{ padding: '12px', backgroundColor: '#f6f6f7', borderRadius: '8px', border: '1px solid #e0e0e0', height: '100%', minHeight: '100px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <div style={{ fontSize: '12px', color: 'var(--shopify-text-secondary)', marginBottom: '4px' }}>Return Rate</div>
                      <div style={{ fontSize: '22px', fontWeight: '600', color: 'var(--shopify-text-primary)' }}>3.2%</div>
                      <div style={{ fontSize: '12px', color: '#16a34a', marginTop: '4px' }}>↓ 0.4% from last period</div>
                    </div>
                  </Column>
                </Grid>
                
                {/* Revenue trend chart */}
                <div style={{ marginTop: '12px' }}>
                  <div style={{ fontSize: '13px', fontWeight: '400', color: 'var(--shopify-text-primary)', marginBottom: '12px' }}>
                    Revenue Trend
                  </div>
                  <ResponsiveContainer width="100%" height={200}>
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

              {/* 3. Your Customers */}
              <div style={{ 
                marginTop: '24px',
                marginLeft: '24px',
                marginRight: '24px',
                backgroundColor: 'white',
                borderRadius: '8px',
                border: '1px solid var(--shopify-border)',
                padding: '16px'
              }}>
                <div style={{ marginBottom: '12px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: '600', color: 'var(--shopify-text-primary)', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <UserMultiple size={20} style={{ color: '#0f62fe' }} />
                    {settingsCopy.salesYourCustomersTitle}
                  </h3>
                  <p style={{ fontSize: '12px', color: 'var(--shopify-text-secondary)', margin: 0 }}>
                    {settingsCopy.salesYourCustomersDescription}
                  </p>
                </div>

                {/* Global Customer Distribution - World Map */}
                <div style={{ marginBottom: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <div style={{ fontSize: '14px', fontWeight: '600' }}>{extraCopy.globalCustomerDistribution}</div>
                    {/* Metric and Region Filters */}
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                      {/* Metric Switcher */}
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <span style={{ fontSize: '13px', color: 'var(--shopify-text-secondary)' }}>{extraCopy.viewBy}</span>
                        <select
                          value={selectedMetric}
                          onChange={(e) => setSelectedMetric((e.target as unknown as { value: string }).value as 'orders' | 'customers' | 'revenue' | 'cvr')}
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
                          <option value="orders">{extraCopy.orders}</option>
                          <option value="customers">{extraCopy.customers}</option>
                          <option value="revenue">Revenue</option>
                          <option value="cvr">{settingsCopy.metricConversionRate}</option>
                        </select>
                      </div>
                      {/* Region Filter */}
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <span style={{ fontSize: '13px', color: 'var(--shopify-text-secondary)' }}>{extraCopy.region}</span>
                        <select
                        value={mapRegion}
                        onChange={(e) => {
                          const region = (e.target as unknown as { value: string }).value;
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
                          } else if (region === 'africa') {
                            setMapCenter([20, 0]);
                            setMapZoom(2.5);
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
                        <option value="north-america">{extraCopy.northAmerica}</option>
                        <option value="europe">{extraCopy.europe}</option>
                        <option value="asia">{extraCopy.asia}</option>
                        <option value="oceania">{extraCopy.oceania}</option>
                        <option value="africa">{extraCopy.africa}</option>
                        <option value="global">{extraCopy.globalView}</option>
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
                        height: '240px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative'
                      }}>
                        {/* Zoom controls - only for world map */}
                        {mapType !== 'usa-states' && (
                          <div style={{
                            position: 'absolute',
                            top: '12px',
                            right: '12px',
                            zIndex: 10,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '2px',
                            backgroundColor: 'white',
                            border: '1px solid var(--shopify-border)',
                            borderRadius: '6px',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                            overflow: 'hidden'
                          }}>
                            <button
                              type="button"
                              onClick={() => setMapZoom((z) => Math.min(8, z + 1))}
                              style={{
                                width: '32px',
                                height: '28px',
                                border: 'none',
                                background: 'transparent',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '18px',
                                lineHeight: 1,
                                color: 'var(--shopify-text-primary)',
                                padding: 0
                              }}
                              onMouseEnter={(e) => { (e.currentTarget as unknown as { style: Record<string, string> }).style.backgroundColor = 'var(--shopify-gray-50)'; }}
                              onMouseLeave={(e) => { (e.currentTarget as unknown as { style: Record<string, string> }).style.backgroundColor = 'transparent'; }}
                            >
                              +
                            </button>
                            <div style={{ height: '1px', backgroundColor: 'var(--shopify-border)' }} />
                            <button
                              type="button"
                              onClick={() => setMapZoom((z) => Math.max(1, z - 1))}
                              style={{
                                width: '32px',
                                height: '28px',
                                border: 'none',
                                background: 'transparent',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '18px',
                                lineHeight: 1,
                                color: 'var(--shopify-text-primary)',
                                padding: 0
                              }}
                              onMouseEnter={(e) => { (e.currentTarget as unknown as { style: Record<string, string> }).style.backgroundColor = 'var(--shopify-gray-50)'; }}
                              onMouseLeave={(e) => { (e.currentTarget as unknown as { style: Record<string, string> }).style.backgroundColor = 'transparent'; }}
                            >
                              −
                            </button>
                          </div>
                        )}
                        <ComposableMap
                          projection={mapType === 'usa-states' ? "geoAlbersUsa" : "geoMercator"}
                          style={{ width: '100%', height: '100%' }}
                        >
                          <ZoomableGroup
                            center={mapType === 'usa-states' ? [-95, 40] : mapCenter}
                            zoom={mapType === 'usa-states' ? 1 : mapZoom}
                            minZoom={1}
                            maxZoom={8}
                            filterZoomEvent={(ev: any) => ev.type !== 'wheel'}
                          >
                            {/* Full-area rect so drag-to-pan works on empty space (e.g. ocean) */}
                            <rect
                              x={-2000}
                              y={-1000}
                              width={4000}
                              height={2000}
                              fill="transparent"
                              style={{ cursor: 'grab' }}
                              pointerEvents="all"
                            />
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
                                  'Japan': 'Japan',
                                  'Netherlands': 'Netherlands',
                                  'Italy': 'Italy',
                                  'Spain': 'Spain',
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
                                      onMouseDown={(e: any) => {
                                        isDraggingRef.current = false;
                                        if (e.clientX && e.clientY) {
                                          setMouseDownPos({ x: e.clientX, y: e.clientY });
                                        }
                                      }}
                                      onMouseMove={(e: any) => {
                                        // Track if we're dragging
                                        if (mouseDownPos && e.clientX && e.clientY) {
                                          const deltaX = Math.abs(e.clientX - mouseDownPos.x);
                                          const deltaY = Math.abs(e.clientY - mouseDownPos.y);
                                          if (deltaX > 3 || deltaY > 3) {
                                            isDraggingRef.current = true;
                                          }
                                        }
                                        
                                        // Show tooltip on hover
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
                                      onMouseUp={(e: any) => {
                                        if (mouseDownPos && e.clientX && e.clientY) {
                                          // Check if this was a click (not a drag)
                                          const deltaX = Math.abs(e.clientX - mouseDownPos.x);
                                          const deltaY = Math.abs(e.clientY - mouseDownPos.y);
                                          const isClick = deltaX < 5 && deltaY < 5 && !isDraggingRef.current; // Threshold for click vs drag
                                          
                                          if (isClick && countryData) {
                                            e.stopPropagation(); // Prevent map dragging
                                            e.preventDefault(); // Prevent default behavior
                                            handleCountryClick(countryData.country);
                                          }
                                          setMouseDownPos(null);
                                          isDraggingRef.current = false;
                                        }
                                      }}
                                      onClick={(e: any) => {
                                        // Fallback click handler - only if we didn't just drag
                                        if (countryData && !isDraggingRef.current) {
                                          e.stopPropagation();
                                          e.preventDefault();
                                          handleCountryClick(countryData.country);
                                        }
                                      }}
                                      onMouseOut={() => {
                                        setHoveredRegion(null);
                                        setMouseDownPos(null);
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
                              (e.currentTarget as unknown as { style: Record<string, string> }).style.backgroundColor = '#f6f6f7';
                            }}
                            onMouseLeave={(e) => {
                              (e.currentTarget as unknown as { style: Record<string, string> }).style.backgroundColor = 'white';
                            }}
                          >
                            ← Back to World Map
                          </button>
                        )}
                        
                        {/* Map Type Indicator */}
                        {mapType === 'usa-states' && (
                          <div style={{
                            position: 'absolute',
                            top: '16px',
                            right: '16px',
                            backgroundColor: 'rgba(114, 86, 246, 0.9)',
                            padding: '6px 12px',
                            borderRadius: '6px',
                            fontSize: '11px',
                            color: 'white',
                            fontWeight: '600',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                            zIndex: 10
                          }}>
                            🇺🇸 USA States
                          </div>
                        )}
                        
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
                            <span>Drag to pan, use +/− to zoom</span>
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
                        height: '240px',
                        overflowY: 'auto'
                      }}>
                        <div style={{ fontSize: '13px', fontWeight: '400', marginBottom: '12px', color: 'var(--shopify-text-primary)' }}>
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
                                  (e.currentTarget as unknown as { style: Record<string, string> }).style.backgroundColor = '#f9f9f9';
                                }
                              }}
                              onMouseLeave={(e) => {
                                if (selectedCountry !== country.country) {
                                  (e.currentTarget as unknown as { style: Record<string, string> }).style.backgroundColor = 'transparent';
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
                      {/* Device Distribution by Country */}
                      <div className="subtle-scrollbar" style={{ 
                        padding: '12px', 
                        backgroundColor: 'white',
                        border: '1px solid var(--shopify-border)',
                        borderRadius: '8px',
                        height: '240px',
                        overflowY: 'auto'
                      }}>
                        <div style={{ fontSize: '13px', fontWeight: '400', marginBottom: '12px', color: 'var(--shopify-text-primary)' }}>
                          Device Distribution by {selectedMetric === 'orders' ? 'Orders' : selectedMetric === 'customers' ? 'Customers' : selectedMetric === 'revenue' ? 'Revenue' : 'CVR'}
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
                              onClick={() => handleCountryClick(country.country)}
                              style={{ 
                                padding: '8px 0px',
                                borderBottom: index < customerDemographics.topCountries.length - 1 ? '1px solid #f0f0f0' : 'none',
                                cursor: 'pointer',
                                borderRadius: '6px',
                                transition: 'background-color 0.15s ease',
                                backgroundColor: selectedCountry === country.country ? 'rgba(114, 86, 246, 0.08)' : 'transparent'
                              }}
                              onMouseEnter={(e) => {
                                if (selectedCountry !== country.country) {
                                  (e.currentTarget as unknown as { style: Record<string, string> }).style.backgroundColor = '#f6f6f7';
                                }
                              }}
                              onMouseLeave={(e) => {
                                if (selectedCountry !== country.country) {
                                  (e.currentTarget as unknown as { style: Record<string, string> }).style.backgroundColor = 'transparent';
                                }
                              }}
                            >
                              {/* Top row: rank, country name, value */}
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
                                      fontWeight: (index === 0 || selectedCountry === country.country) ? '600' : '500',
                                      color: selectedCountry === country.country ? '#7256F6' : 'var(--shopify-text-primary)',
                                      overflow: 'hidden',
                                      textOverflow: 'ellipsis',
                                      whiteSpace: 'nowrap'
                                    }}>
                                      {country.country}
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
                                    {selectedMetric === 'orders' ? country.sales.toLocaleString() :
                                     selectedMetric === 'customers' ? country.customers.toLocaleString() :
                                     selectedMetric === 'revenue' ? `$${country.revenue.toLocaleString()}` :
                                     `${country.cvr.toFixed(1)}%`}
                                  </span>
                                </div>
                              </div>
                              
                              {/* Device distribution bar: mobile (left, blue) vs desktop (right, gray) */}
                              <div style={{ 
                                width: 'calc(100% - 28px)',
                                height: '6px', 
                                backgroundColor: '#e8e8e8', 
                                borderRadius: '3px',
                                overflow: 'hidden',
                                marginLeft: '28px',
                                marginBottom: '4px',
                                display: 'flex'
                              }}>
                                <div style={{ 
                                  width: `${country.mobile}%`, 
                                  height: '100%', 
                                  backgroundColor: selectedCountry === country.country ? '#0f62fe' : '#1192E8',
                                  transition: 'width 0.3s ease'
                                }} />
                                <div style={{ 
                                  width: `${country.desktop}%`, 
                                  height: '100%', 
                                  backgroundColor: selectedCountry === country.country ? '#8d8d8d' : '#a6a6a6',
                                  transition: 'width 0.3s ease'
                                }} />
                              </div>
                              
                              {/* Device percentages */}
                              <div style={{ 
                                marginLeft: '28px',
                                fontSize: '10px',
                                color: 'var(--shopify-text-secondary)',
                                display: 'flex',
                                gap: '8px'
                              }}>
                                <span>{country.mobile}% Mobile</span>
                                <span>{country.desktop}% Desktop</span>
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
                  </Grid>
                </div>

                {/* Regional Performance Insights */}
                <div style={{ marginBottom: '12px' }}>
                  <Grid narrow style={{ marginLeft: 0, marginRight: 0, paddingLeft: 0, paddingRight: 0 }}>
                    <Column lg={16} style={{ paddingLeft: 0, paddingRight: 0 }}>
                      <div style={{ 
                        backgroundColor: 'white', 
                        padding: '12px 16px',
                        borderRadius: '8px',
                        border: '1px solid var(--shopify-border)'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                          <ChartLineSmooth size={16} style={{ color: '#7256F6' }} />
                          <span style={{ fontSize: '14px', fontWeight: '600', color: 'var(--shopify-text-primary)' }}>
                            {extraCopy.regionalPerformanceInsights}
                          </span>
                        </div>
                        
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px' }}>
                          {/* Highest CVR */}
                          <div style={{ 
                            padding: '10px 12px',
                            backgroundColor: '#fef3f2',
                            borderRadius: '6px',
                            borderLeft: '3px solid #F97316'
                          }}>
                            <div style={{ fontSize: '11px', color: 'var(--shopify-text-secondary)', marginBottom: '4px', fontWeight: '500' }}>
                              🎯 {extraCopy.highestConversionRate}
                            </div>
                            <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--shopify-text-primary)' }}>
                              {(() => {
                                const highest = [...customerDemographics.topCountries].sort((a, b) => b.cvr - a.cvr)[0];
                                return `${highest.country} (${highest.cvr.toFixed(1)}%)`;
                              })()}
                            </div>
                          </div>

                          {/* Most Customers */}
                          <div style={{ 
                            padding: '10px 12px',
                            backgroundColor: '#eff8ff',
                            borderRadius: '6px',
                            borderLeft: '3px solid #1192E8'
                          }}>
                            <div style={{ fontSize: '11px', color: 'var(--shopify-text-secondary)', marginBottom: '4px', fontWeight: '500' }}>
                              👥 {extraCopy.mostCustomers}
                            </div>
                            <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--shopify-text-primary)' }}>
                              {(() => {
                                const highest = [...customerDemographics.topCountries].sort((a, b) => b.customers - a.customers)[0];
                                return `${highest.country} (${highest.customers.toLocaleString()} unique)`;
                              })()}
                            </div>
                          </div>

                          {/* Highest Revenue */}
                          <div style={{ 
                            padding: '10px 12px',
                            backgroundColor: '#f0fdf4',
                            borderRadius: '6px',
                            borderLeft: '3px solid #16A34A'
                          }}>
                            <div style={{ fontSize: '11px', color: 'var(--shopify-text-secondary)', marginBottom: '4px', fontWeight: '500' }}>
                              💰 {extraCopy.highestRevenue}
                            </div>
                            <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--shopify-text-primary)' }}>
                              {(() => {
                                const highest = [...customerDemographics.topCountries].sort((a, b) => b.revenue - a.revenue)[0];
                                return `${highest.country} ($${highest.revenue.toLocaleString()})`;
                              })()}
                            </div>
                          </div>

                          {/* Fastest Growing */}
                          <div style={{ 
                            padding: '10px 12px',
                            backgroundColor: '#faf5ff',
                            borderRadius: '6px',
                            borderLeft: '3px solid #7256F6'
                          }}>
                            <div style={{ fontSize: '11px', color: 'var(--shopify-text-secondary)', marginBottom: '4px', fontWeight: '500' }}>
                              📈 {extraCopy.fastestGrowing}
                            </div>
                            <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--shopify-text-primary)' }}>
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

                {/* Active users by Gender + Search → Click Efficiency by Keyword - horizontal row */}
                <Grid narrow style={{ marginTop: '12px', marginLeft: 0, marginRight: 0, paddingLeft: 0, paddingRight: 0 }}>
                  <Column lg={5} style={{ paddingLeft: 0, paddingRight: '6px' }}>
                    <div style={{ 
                      padding: '16px',
                      backgroundColor: 'white',
                      borderRadius: '8px',
                      border: '1px solid var(--shopify-border)',
                      minHeight: '440px',
                      display: 'flex',
                      flexDirection: 'column'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
                          <g fill="none" stroke="#7256F6" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}>
                            <path d="M12 6.569a6 6 0 1 1-7.165-.256M8.25 17.25v6" />
                            <path d="M9.634 13.824a6 6 0 1 1 8.6-.9m-.491-7.932L21.75.75M18 .75h3.75V4.5M5.25 20.25h6" />
                          </g>
                        </svg>
                        <span style={{ fontSize: '14px', fontWeight: '600', color: 'var(--shopify-text-primary)' }}>{extraCopy.activeUsersByGender}</span>
                      </div>
                      <div style={{ flex: 1, width: '100%', minHeight: 280 }}>
                        <ResponsiveContainer width="100%" height={280}>
                          <PieChart>
                            <Pie
                              data={customerDemographics.gender}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              label={(props: any) => {
                                const { cx, cy, midAngle, outerRadius, value } = props;
                                const name = props.payload?.name ?? props.name ?? '';
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
                                    {`${name}: ${value}%`}
                                  </text>
                                );
                              }}
                              outerRadius={110}
                              fill="#8884d8"
                              dataKey="value"
                              startAngle={90}
                              endAngle={450}
                            >
                              {customerDemographics.gender.map((entry: { name: string; value: number; color: string }, index: number) => (
                                <Cell key={`gender-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                            <Tooltip 
                              formatter={(value: any, _name: any, props: any) => {
                                const labelName = props?.payload?.name ?? 'Gender';
                                return [`${value}%`, labelName];
                              }}
                            />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '12px 16px', padding: '8px 0 0', fontSize: '11px', color: '#6d7175', borderTop: '1px solid #e5e5e5', marginTop: '8px' }}>
                        {customerDemographics.gender.map((entry: { name: string; value: number; color: string }) => (
                          <span key={entry.name} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                            <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: entry.color, flexShrink: 0 }} />
                            {entry.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  </Column>
                  <Column lg={11} style={{ paddingLeft: '6px', paddingRight: 0 }}>
                    <div style={{ 
                      padding: '16px',
                      backgroundColor: 'white',
                      borderRadius: '8px',
                      border: '1px solid var(--shopify-border)',
                      minHeight: '440px'
                    }}>
                      <div style={{ padding: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: '600', marginBottom: '4px', color: 'var(--shopify-text-primary)' }}>
                          <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 16 16" style={{ flexShrink: 0 }}>
                            <path fill="#7256F6" fillRule="evenodd" d="M0 2.965C0 1.88.88 1 1.965 1h2.807c1.085 0 1.965.88 1.965 1.965v.561c0 1.086-.88 1.965-1.965 1.965H1.965A1.965 1.965 0 0 1 0 3.526v-.561Zm1.965-.28a.28.28 0 0 0-.28.28v.561a.28.28 0 0 0 .28.281h2.807a.28.28 0 0 0 .28-.28v-.562a.28.28 0 0 0-.28-.28H1.965Zm6.175.561c0-.465.377-.842.842-.842h6.176a.842.842 0 1 1 0 1.684H8.982a.842.842 0 0 1-.842-.842ZM.28 8.298c0-.465.378-.842.843-.842H11.79a.842.842 0 1 1 0 1.684H1.123a.842.842 0 0 1-.842-.842Zm0 5.052c0-.464.378-.841.843-.841h13.474a.842.842 0 1 1 0 1.684H1.123a.842.842 0 0 1-.842-.842Z" clipRule="evenodd" />
                            <path fill="#7256F6" d="M14.877 9.14a.842.842 0 1 0 0-1.684a.842.842 0 0 0 0 1.684Z" />
                          </svg>
                          {extraCopy.searchClickEfficiency}
                        </div>
                        <p style={{ fontSize: '12px', color: 'var(--shopify-text-secondary)', marginBottom: '12px' }}>
                          {extraCopy.searchClickEfficiencyDesc}
                        </p>
                        <div style={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e5e5e5', overflow: 'hidden' }}>
                          <div style={{ position: 'relative', width: '100%', height: 340 }}>
                          <ResponsiveContainer width="100%" height="100%">
                            <ScatterChart margin={{ top: 36, right: 20, left: 12, bottom: 28 }}>
                              {/* Quadrant zone fills (subtle) - render first so they sit behind grid */}
                              <ReferenceArea x1={keywordEfficiencyMinX} x2={keywordEfficiencyMidX} y1={keywordEfficiencyMinY} y2={keywordEfficiencyMidY} fill="rgba(0, 0, 0, 0.03)" fillOpacity={1} />
                              <ReferenceArea x1={keywordEfficiencyMinX} x2={keywordEfficiencyMidX} y1={keywordEfficiencyMidY} y2={keywordEfficiencyMaxY} fill="rgba(15, 98, 254, 0.05)" fillOpacity={1} />
                              <ReferenceArea x1={keywordEfficiencyMidX} x2={keywordEfficiencyMaxX} y1={keywordEfficiencyMinY} y2={keywordEfficiencyMidY} fill="rgba(191, 83, 0, 0.06)" fillOpacity={1} />
                              <ReferenceArea x1={keywordEfficiencyMidX} x2={keywordEfficiencyMaxX} y1={keywordEfficiencyMidY} y2={keywordEfficiencyMaxY} fill="rgba(22, 163, 74, 0.06)" fillOpacity={1} />
                              <CartesianGrid strokeDasharray="3 3" stroke="#e8e8e8" vertical={true} horizontal={true} />
                              <XAxis
                                type="number"
                                dataKey="x"
                                name="Search Volume"
                                unit=""
                                domain={['auto', 'auto']}
                                tick={{ fontSize: 11, fill: '#6d7175' }}
                                tickLine={{ stroke: '#c6c6c6' }}
                                axisLine={{ stroke: '#c6c6c6' }}
                                label={{ value: 'Search Volume', position: 'insideBottom', offset: -8, fontSize: 11, fill: '#6d7175' }}
                              />
                              <YAxis
                                type="number"
                                dataKey="y"
                                name="CTR"
                                unit="%"
                                domain={['auto', 'auto']}
                                tick={{ fontSize: 11, fill: '#6d7175' }}
                                tickLine={{ stroke: '#c6c6c6' }}
                                axisLine={{ stroke: '#c6c6c6' }}
                                label={{ value: 'CTR (%)', angle: -90, position: 'insideLeft', fontSize: 11, fill: '#6d7175' }}
                              />
                              <ZAxis type="number" dataKey="z" range={[80, 420]} name="Clicks" />
                              <Tooltip
                                cursor={{ strokeDasharray: '3 3', stroke: '#6d7175' }}
                                wrapperStyle={{ outline: 'none' }}
                                contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', border: '1px solid rgba(0, 0, 0, 0.1)', borderRadius: '6px', fontSize: '11px', boxShadow: '0 4px 16px rgba(0,0,0,0.12)', padding: '10px 12px' }}
                                content={({ active, payload }) => {
                                  if (!active || !payload?.length) return null;
                                  const p = payload[0].payload as { keyword?: string; x?: number; y?: number; z?: number; intent?: string };
                                  return (
                                    <div style={{ fontSize: '11px', boxShadow: '0 4px 16px rgba(0,0,0,0.12)', padding: 8, backgroundColor: 'rgba(255, 255, 255, 0.8)', borderRadius: '8px' }}>
                                      <div style={{ fontWeight: 600, marginBottom: 6 }}>{p.keyword}</div>
                                      <div>Search volume: {p.x?.toLocaleString()}</div>
                                      <div>CTR: {p.y?.toFixed(1)}%</div>
                                      <div>Clicks: {p.z?.toLocaleString()}</div>
                                      {p.intent && <div style={{ color: '#6d7175', marginTop: 4, fontSize: '11px' }}>{p.intent}</div>}
                                    </div>
                                  );
                                }}
                              />
                              <ReferenceLine x={keywordEfficiencyMidX} stroke="#c6c6c6" strokeDasharray="3 3" />
                              <ReferenceLine y={keywordEfficiencyMidY} stroke="#c6c6c6" strokeDasharray="3 3" />
                              {(['Product', 'Promotion'] as const).map((intent) => (
                                <Scatter
                                  key={intent}
                                  name={intent}
                                  data={keywordEfficiencyData.filter(d => d.intent === intent).map(d => ({ x: d.searchVolume, y: d.ctr, z: d.clicks, keyword: d.keyword, intent: d.intent }))}
                                  fill={KEYWORD_INTENT_COLORS[intent]}
                                  shape="circle"
                                />
                              ))}
                            </ScatterChart>
                          </ResponsiveContainer>
                          {/* Quadrant labels overlay */}
                          <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', borderRadius: '8px' }}>
                            <div style={{ position: 'absolute', left: '72%', top: '12%', maxWidth: '24%', textAlign: 'center' }}>
                              <div style={{ fontSize: '10px', fontWeight: '600', color: '#161616', marginBottom: 2 }}>Star Keywords</div>
                              <div style={{ fontSize: '9px', color: '#6d7175', lineHeight: 1.2 }}>High demand and high efficiency. Scale and prioritize.</div>
                            </div>
                            <div style={{ position: 'absolute', left: '72%', top: '62%', maxWidth: '24%', textAlign: 'center' }}>
                              <div style={{ fontSize: '10px', fontWeight: '600', color: '#161616', marginBottom: 2 }}>UX / Ranking Opportunity</div>
                              <div style={{ fontSize: '9px', color: '#6d7175', lineHeight: 1.2 }}>High demand but underperforming. Needs optimization.</div>
                            </div>
                            <div style={{ position: 'absolute', left: '8%', top: '12%', maxWidth: '24%', textAlign: 'center' }}>
                              <div style={{ fontSize: '10px', fontWeight: '600', color: '#161616', marginBottom: 2 }}>High-Intent Niche</div>
                              <div style={{ fontSize: '9px', color: '#6d7175', lineHeight: 1.2 }}>Low volume but efficient keywords.</div>
                            </div>
                            <div style={{ position: 'absolute', left: '8%', top: '62%', maxWidth: '24%', textAlign: 'center' }}>
                              <div style={{ fontSize: '10px', fontWeight: '600', color: '#161616', marginBottom: 2 }}>Low Priority</div>
                              <div style={{ fontSize: '9px', color: '#6d7175', lineHeight: 1.2 }}>Low search volume and low CTR.</div>
                            </div>
                          </div>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '12px 16px', padding: '8px 12px 12px', fontSize: '11px', color: '#6d7175', borderTop: '1px solid #e5e5e5' }}>
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                              <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: KEYWORD_INTENT_COLORS['Product'], flexShrink: 0 }} />
                              Product
                            </span>
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                              <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: KEYWORD_INTENT_COLORS['Promotion'], flexShrink: 0 }} />
                              Promotion
                            </span>
                            <span style={{ color: '#c6c6c6' }}>•</span>
                            <span>Bubble size represents click volume.</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Column>
                </Grid>

                {/* Customer Interests */}
                <div style={{ 
                  marginTop: '12px',
                  padding: '16px',
                  backgroundColor: 'white',
                  borderRadius: '8px',
                  border: '1px solid var(--shopify-border)'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <div style={{ fontSize: '14px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Favorite size={16} style={{ color: '#7256F6' }} />
                        {extraCopy.customerInterests}
                      </div>
                    </div>
                  <Grid narrow style={{ marginLeft: 0, marginRight: 0, paddingLeft: 0, paddingRight: 0 }}>
                    <Column lg={16} style={{ paddingLeft: 0, paddingRight: 0 }}>
                      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
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
                              <Tooltip 
                                formatter={(value: any, name: any, props: any) => {
                                  const categoryName = props?.payload?.category || 'Interest';
                                  return [`${value}%`, categoryName];
                                }}
                              />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                        <div style={{ 
                          flex: 1, 
                          display: 'grid', 
                          gridTemplateColumns: '1fr 1fr',
                          gap: '12px',
                          alignSelf: 'stretch',
                          alignItems: 'center'
                        }}>
                          <div style={{ 
                            display: 'flex', 
                            flexDirection: 'column', 
                            gap: '10px',
                            padding: '12px',
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
                          
                          {/* Shopping behavior insights */}
                          <div style={{ 
                            padding: '16px', 
                            backgroundColor: '#f6f6f7', 
                            borderRadius: '8px',
                            border: '1px solid #e0e0e0',
                            display: 'flex',
                            flexDirection: 'column'
                          }}>
                            <div style={{ 
                              display: 'grid',
                              gridTemplateColumns: 'repeat(2, 1fr)',
                              gap: '16px',
                              marginBottom: '12px'
                            }}>
                              <div>
                                <div style={{ fontSize: '13px', color: 'var(--shopify-text-secondary)', marginBottom: '4px' }}>Peak Shopping Time</div>
                                <div style={{ fontSize: '18px', fontWeight: '600', color: 'var(--shopify-text-primary)' }}>7-9 PM</div>
                              </div>
                              <div>
                                <div style={{ fontSize: '13px', color: 'var(--shopify-text-secondary)', marginBottom: '4px' }}>Peak Shopping Day</div>
                                <div style={{ fontSize: '18px', fontWeight: '600', color: 'var(--shopify-text-primary)' }}>Fri, Sat, Sun</div>
                              </div>
                              <div>
                                <div style={{ fontSize: '13px', color: 'var(--shopify-text-secondary)', marginBottom: '4px' }}>Preferred Device</div>
                                <div style={{ fontSize: '18px', fontWeight: '600', color: 'var(--shopify-text-primary)' }}>Mobile (68%)</div>
                              </div>
                              <div>
                                <div style={{ fontSize: '13px', color: 'var(--shopify-text-secondary)', marginBottom: '4px' }}>Most Popular</div>
                                <div style={{ fontSize: '18px', fontWeight: '600', color: 'var(--shopify-text-primary)' }}>Clothing</div>
                              </div>
                            </div>
                            <div style={{ 
                              fontSize: '11px', 
                              color: 'var(--shopify-text-secondary)', 
                              fontStyle: 'italic',
                              paddingTop: '8px',
                              borderTop: '1px solid #e0e0e0'
                            }}>
                              * Time is based on shopper's local time
                            </div>
                          </div>
                        </div>
                      </div>
                    </Column>
                  </Grid>
                  
                  {/* View Full Report Link */}
                  <div style={{ 
                    marginTop: '16px',
                    textAlign: 'center'
                  }}>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveSection('shop-detail-reports');
                        setDetailReportTab('customer-interests');
                      }}
                      style={{ 
                        fontSize: '12px',
                        color: '#0f62fe',
                        textDecoration: 'none',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontWeight: '500',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: 0
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as unknown as { style: Record<string, string> }).style.textDecoration = 'underline';
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as unknown as { style: Record<string, string> }).style.textDecoration = 'none';
                      }}
                    >
                      View full report
                      <svg width="12" height="12" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M7 3L12 8L7 13" stroke="#0f62fe" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              {/* 4. What's Working Best for You */}
              <div style={{ 
                marginTop: '24px',
                marginLeft: '24px',
                marginRight: '24px',
                backgroundColor: 'white',
                borderRadius: '8px',
                border: '1px solid var(--shopify-border)',
                padding: '16px'
              }}>
                <div style={{ marginBottom: '12px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: '600', color: 'var(--shopify-text-primary)', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <TargetIcon size={20} style={{ color: '#d97706' }} />
                    {settingsCopy.salesWhatsWorkingBestTitle}
                  </h3>
                  <p style={{ fontSize: '12px', color: 'var(--shopify-text-secondary)', margin: 0 }}>
                    {settingsCopy.salesWhatsWorkingBestDescription}
                  </p>
                </div>

                {/* Aggregate all items and group by Item Type */}
                {(() => {
                  // Aggregate all items from all traffic sources, excluding Banner items
                  const allItems = [
                    ...topPerformingItemsByTrafficSource.realry,
                    ...topPerformingItemsByTrafficSource.css,
                    ...topPerformingItemsByTrafficSource.instagramStories,
                    ...topPerformingItemsByTrafficSource.edm
                  ].filter(item => item.itemType !== 'Banner'); // Exclude Banner items

                  // Group by itemType (only Product and Content)
                  const itemsByType = {
                    Product: allItems.filter(item => item.itemType === 'Product'),
                    Content: allItems.filter(item => item.itemType === 'Content')
                  };

                  // Item type icons and colors
                  const typeConfig = {
                    'Product': { icon: ShoppingCart, color: '#7256F6' },
                    'Content': { icon: Document, color: '#16a34a' }
                  };

                  return Object.entries(itemsByType)
                    .filter(([itemType, items]) => items.length > 0) // Only show categories with items
                    .map(([itemType, items]) => {
                    const sortedItems = [...items].sort((a, b) => b.clicks - a.clicks).slice(0, 5);
                    const totals = sortedItems.reduce((acc, item) => ({
                      clicks: acc.clicks + item.clicks,
                      conversions: acc.conversions + item.conversions,
                      revenue: acc.revenue + item.revenue,
                    }), { clicks: 0, conversions: 0, revenue: 0 });

                    const IconComponent = typeConfig[itemType as keyof typeof typeConfig]?.icon || ShoppingCart;
                    const iconColor = typeConfig[itemType as keyof typeof typeConfig]?.color || '#7256F6';

                    return (
                      <div 
                        key={itemType}
                        style={{ 
                          marginBottom: '12px',
                          backgroundColor: '#f9f9f9',
                          borderRadius: '8px',
                          border: '1px solid #e0e0e0',
                          padding: '12px'
                        }}
                      >
                        {/* Section Header */}
                        <div style={{ marginBottom: '12px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                            <h4 style={{ fontSize: '14px', fontWeight: '600', color: 'var(--shopify-text-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <IconComponent size={16} style={{ color: iconColor }} />
                              {itemType === 'Product' ? extraCopy.product : extraCopy.content}
                            </h4>
                            <Tag type="blue" size="sm">
                              {totals.clicks.toLocaleString()} {settingsCopy.metricClicks.toLowerCase()}, ${totals.revenue.toLocaleString()} {extraCopy.revenueWord}
                            </Tag>
                          </div>
                          <p style={{ fontSize: '12px', color: 'var(--shopify-text-secondary)', margin: 0 }}>
                            {extraCopy.topPerformingItems
                              .replace('{count}', String(sortedItems.length))
                              .replace('{type}', (itemType === 'Product' ? extraCopy.product : extraCopy.content).toLowerCase())}
                          </p>
                        </div>

                        {/* Table */}
                        <div style={{ 
                          backgroundColor: 'white', 
                          borderRadius: '6px',
                          border: '1px solid #e0e0e0',
                          overflow: 'hidden'
                        }}>
                          <Table>
                                <TableHead>
                                  <TableRow>
                                    <TableHeader 
                                      style={{ cursor: 'pointer', userSelect: 'none', ...ITEM_NAME_COLUMN_STYLE }}
                                      onClick={() => (itemType === 'Product' ? productItemsSort : contentItemsSort).handleSort('name' as any)}
                                    >
                                      {extraCopy.itemName}
                                    </TableHeader>
                                    <TableHeader 
                                      style={{ cursor: 'pointer', userSelect: 'none' }}
                                      onClick={() => (itemType === 'Product' ? productItemsSort : contentItemsSort).handleSort('impressions' as any)}
                                    >
                                      {extraCopy.impressions}
                                    </TableHeader>
                                    <TableHeader 
                                      style={{ cursor: 'pointer', userSelect: 'none' }}
                                      onClick={() => (itemType === 'Product' ? productItemsSort : contentItemsSort).handleSort('clicks' as any)}
                                    >
                                      <MetricTooltip metric="Clicks">
                                        Clicks
                                      </MetricTooltip>
                                    </TableHeader>
                                    <TableHeader 
                                      style={{ cursor: 'pointer', userSelect: 'none' }}
                                      onClick={() => (itemType === 'Product' ? productItemsSort : contentItemsSort).handleSort('revenue' as any)}
                                    >
                                      <MetricTooltip metric="Revenue">
                                        Revenue
                                      </MetricTooltip>
                                    </TableHeader>
                                    <TableHeader>
                                      <MetricTooltip metric="CTR">
                                        CTR
                                      </MetricTooltip>
                                    </TableHeader>
                                    <TableHeader 
                                      style={{ cursor: 'pointer', userSelect: 'none' }}
                                      onClick={() => (itemType === 'Product' ? productItemsSort : contentItemsSort).handleSort('cvr' as any)}
                                    >
                                      <MetricTooltip metric="CVR">
                                        CVR
                                      </MetricTooltip>
                                    </TableHeader>
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  {(itemType === 'Product' ? productItemsSort : contentItemsSort).sortedData.map((item, index) => (
                                <TableRow 
                                  key={index}
                                  style={{ 
                                    backgroundColor: index % 2 === 0 ? 'white' : '#f9f9f9',
                                    minHeight: '48px',
                                    height: '48px'
                                  }}
                                >
                                  <TableCell style={{ verticalAlign: 'middle', ...ITEM_NAME_COLUMN_STYLE }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                      {/* Show image for Product items */}
                                      {item.itemType === 'Product' && (item as any).imageUrl && (
                                        <img 
                                          src={(item as any).imageUrl} 
                                          alt={item.name}
                                          style={{ 
                                            width: '32px', 
                                            height: '32px', 
                                            objectFit: 'cover',
                                            borderRadius: '4px',
                                            border: '1px solid #e0e0e0',
                                            flexShrink: 0
                                          }}
                                          onError={(e) => {
                                            // Fallback if image fails to load
                                            (e.target as unknown as { style: Record<string, string> }).style.display = 'none';
                                          }}
                                        />
                                      )}
                                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: 0 }}>
                                        {/* Make Product names clickable */}
                                        {item.itemType === 'Product' && (item as any).productUrl ? (
                                          <a 
                                            href={(item as any).productUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            style={{ 
                                              color: '#0f62fe',
                                              textDecoration: 'none',
                                              fontWeight: '500',
                                              overflow: 'hidden',
                                              textOverflow: 'ellipsis',
                                              whiteSpace: 'nowrap'
                                            }}
                                            onMouseEnter={(e) => {
                                              (e.currentTarget as unknown as { style: Record<string, string> }).style.textDecoration = 'underline';
                                            }}
                                            onMouseLeave={(e) => {
                                              (e.currentTarget as unknown as { style: Record<string, string> }).style.textDecoration = 'none';
                                            }}
                                          >
                                            {item.name}
                                          </a>
                                        ) : (
                                          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</span>
                                        )}
                                        {item.tag && (
                                          <Tag type="green" size="sm">{item.tag}</Tag>
                                        )}
                                      </div>
                                    </div>
                                  </TableCell>
                                  <TableCell style={{ verticalAlign: 'middle' }}>{item.impressions.toLocaleString()}</TableCell>
                                  <TableCell style={{ verticalAlign: 'middle' }}>{item.clicks.toLocaleString()}</TableCell>
                                  <TableCell style={{ fontWeight: '600', verticalAlign: 'middle' }}>{formatCurrency(item.revenue)}</TableCell>
                                  <TableCell style={{ verticalAlign: 'middle' }}>
                                    {item.impressions > 0 ? `${((item.clicks / item.impressions) * 100).toFixed(2)}%` : '-'}
                                  </TableCell>
                                  <TableCell style={{ verticalAlign: 'middle' }}>
                                    <span style={{ fontWeight: '600', color: item.cvr >= 14 ? '#16a34a' : 'inherit' }}>
                                      {item.cvr}%
                                    </span>
                                  </TableCell>
                                </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                        </div>

                        {/* Footer - View Full Report Link */}
                        <div style={{ 
                          marginTop: '12px',
                          textAlign: 'center'
                        }}>
                          <button
                            type="button"
                            onClick={() => {
                              setActiveSection('shop-detail-reports');
                              setDetailReportTab('product-content');
                            }}
                            style={{ 
                              fontSize: '12px',
                              color: '#0f62fe',
                              textDecoration: 'none',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              fontWeight: '500',
                              background: 'none',
                              border: 'none',
                              cursor: 'pointer',
                              padding: 0
                            }}
                            onMouseEnter={(e) => {
                              (e.currentTarget as unknown as { style: Record<string, string> }).style.textDecoration = 'underline';
                            }}
                            onMouseLeave={(e) => {
                              (e.currentTarget as unknown as { style: Record<string, string> }).style.textDecoration = 'none';
                            }}
                          >
                            View full report
                            <svg width="12" height="12" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M7 3L12 8L7 13" stroke="#0f62fe" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </button>
                        </div>
                      </div>
                    );
                  });
                })()}

                {/* Product Optimization Opportunities */}
                {(() => {
                  // Aggregate all items
                  const allItems = [
                    ...topPerformingItemsByTrafficSource.realry,
                    ...topPerformingItemsByTrafficSource.css,
                    ...topPerformingItemsByTrafficSource.instagramStories,
                    ...topPerformingItemsByTrafficSource.edm
                  ];

                  // Calculate CTR for all items
                  const itemsWithCTR = allItems.map(item => ({
                    ...item,
                    ctr: item.impressions > 0 ? (item.clicks / item.impressions) * 100 : 0
                  }));

                  // Sort by CTR and CVR to find thresholds
                  const sortedByCTR = [...itemsWithCTR].sort((a, b) => b.ctr - a.ctr);
                  const sortedByCVR = [...itemsWithCTR].sort((a, b) => b.cvr - a.cvr);
                  
                  // Calculate 25th and 75th percentiles
                  const ctr75th = sortedByCTR[Math.floor(sortedByCTR.length * 0.25)]?.ctr || 0;
                  const ctr25th = sortedByCTR[Math.floor(sortedByCTR.length * 0.75)]?.ctr || 0;
                  const cvr75th = sortedByCVR[Math.floor(sortedByCVR.length * 0.25)]?.cvr || 0;
                  const cvr25th = sortedByCVR[Math.floor(sortedByCVR.length * 0.75)]?.cvr || 0;

                  // High CTR but Low CVR (top 25% CTR, bottom 25% CVR)
                  const highCTRLowCVR = itemsWithCTR
                    .filter(item => item.ctr >= ctr75th && item.cvr <= cvr25th)
                    .sort((a, b) => b.ctr - a.ctr)
                    .slice(0, 3);

                  // High CVR but Low CTR (top 25% CVR, bottom 25% CTR)
                  const highCVRLowCTR = itemsWithCTR
                    .filter(item => item.cvr >= cvr75th && item.ctr <= ctr25th)
                    .sort((a, b) => b.cvr - a.cvr)
                    .slice(0, 3);

                  return (
                    <div style={{ marginTop: '32px' }}>
                      <div style={{ marginBottom: '20px' }}>
                        <h4 style={{ fontSize: '16px', fontWeight: '600', color: 'var(--shopify-text-primary)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <Idea size={20} style={{ color: '#d97706' }} />
                          {settingsCopy.salesProductOptimizationTitle}
                        </h4>
                        <p style={{ fontSize: '13px', color: 'var(--shopify-text-secondary)', margin: 0 }}>
                          {settingsCopy.salesProductOptimizationDescription}
                        </p>
                      </div>

                      <Grid narrow style={{ marginLeft: 0, marginRight: 0, paddingLeft: 0, paddingRight: 0 }}>
                        {/* High CTR, Low CVR */}
                        <Column lg={16} md={12} sm={12}>
                          <div style={{ 
                            backgroundColor: '#f9f9f9',
                            borderRadius: '8px',
                            border: '1px solid #e0e0e0',
                            padding: '16px',
                            marginBottom: '16px'
                          }}>
                            <div style={{ marginBottom: '16px' }}>
                              <h3 style={{ fontSize: '14px', fontWeight: '600', color: 'var(--shopify-text-primary)', marginBottom: '4px' }}>
                                {extraCopy.highCtrLowCvr}
                              </h3>
                              <p style={{ fontSize: '12px', color: 'var(--shopify-text-secondary)', margin: 0 }}>
                                {extraCopy.highCtrLowCvrDesc}
                              </p>
                            </div>
                            {allOptimizationItems.highCTRLowCVR.length > 0 ? (
                              <>
                                <div style={{ 
                                  backgroundColor: 'white', 
                                  borderRadius: '6px',
                                  border: '1px solid #e0e0e0',
                                  overflow: 'hidden'
                                }}>
                                  <Table>
                                        <TableHead>
                                          <TableRow>
                                            <TableHeader 
                                              style={{ cursor: 'pointer', userSelect: 'none', ...ITEM_NAME_COLUMN_STYLE }}
                                              onClick={() => highCTRLowCVRSort.handleSort('name' as any)}
                                            >
                                              {extraCopy.itemName}
                                            </TableHeader>
                                            <TableHeader 
                                              style={{ cursor: 'pointer', userSelect: 'none' }}
                                              onClick={() => highCTRLowCVRSort.handleSort('impressions' as any)}
                                            >
                                              {extraCopy.impressions}
                                            </TableHeader>
                                            <TableHeader 
                                              style={{ cursor: 'pointer', userSelect: 'none' }}
                                              onClick={() => highCTRLowCVRSort.handleSort('clicks' as any)}
                                            >
                                              <MetricTooltip metric="Clicks">
                                                Clicks
                                              </MetricTooltip>
                                            </TableHeader>
                                            <TableHeader 
                                              style={{ cursor: 'pointer', userSelect: 'none' }}
                                              onClick={() => highCTRLowCVRSort.handleSort('revenue' as any)}
                                            >
                                              <MetricTooltip metric="Revenue">
                                                Revenue
                                              </MetricTooltip>
                                            </TableHeader>
                                            <TableHeader 
                                              style={{ cursor: 'pointer', userSelect: 'none' }}
                                              onClick={() => highCTRLowCVRSort.handleSort('ctr' as any)}
                                            >
                                              <MetricTooltip metric="CTR">
                                                CTR
                                              </MetricTooltip>
                                            </TableHeader>
                                            <TableHeader 
                                              style={{ cursor: 'pointer', userSelect: 'none' }}
                                              onClick={() => highCTRLowCVRSort.handleSort('cvr' as any)}
                                            >
                                              <MetricTooltip metric="CVR">
                                                CVR
                                              </MetricTooltip>
                                            </TableHeader>
                                          </TableRow>
                                        </TableHead>
                                        <TableBody>
                                          {highCTRLowCVRSort.sortedData.map((item, index) => (
                                        <TableRow 
                                          key={index}
                                          style={{ 
                                            backgroundColor: index % 2 === 0 ? 'white' : '#f9f9f9' 
                                          }}
                                        >
                                          <TableCell style={ITEM_NAME_COLUMN_STYLE}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                              {/* Show image for Product items */}
                                              {item.itemType === 'Product' && (item as any).imageUrl && (
                                                <img 
                                                  src={(item as any).imageUrl} 
                                                  alt={item.name}
                                                  style={{ 
                                                    width: '40px', 
                                                    height: '40px', 
                                                    objectFit: 'cover',
                                                    borderRadius: '4px',
                                                    border: '1px solid #e0e0e0',
                                                    flexShrink: 0
                                                  }}
                                                  onError={(e) => {
                                                    (e.target as unknown as { style: Record<string, string> }).style.display = 'none';
                                                  }}
                                                />
                                              )}
                                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: 0 }}>
                                                {/* Make Product names clickable */}
                                                {item.itemType === 'Product' && (item as any).productUrl ? (
                                                  <a 
                                                    href={(item as any).productUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    style={{ 
                                                      color: '#0f62fe',
                                                      textDecoration: 'none',
                                                      fontWeight: '500',
                                                      overflow: 'hidden',
                                                      textOverflow: 'ellipsis',
                                                      whiteSpace: 'nowrap'
                                                    }}
                                                    onMouseEnter={(e) => {
                                                      (e.currentTarget as unknown as { style: Record<string, string> }).style.textDecoration = 'underline';
                                                    }}
                                                    onMouseLeave={(e) => {
                                                      (e.currentTarget as unknown as { style: Record<string, string> }).style.textDecoration = 'none';
                                                    }}
                                                  >
                                                    {item.name}
                                                  </a>
                                                ) : (
                                                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</span>
                                                )}
                                              </div>
                                            </div>
                                          </TableCell>
                                          <TableCell style={{ verticalAlign: 'middle' }}>{item.impressions.toLocaleString()}</TableCell>
                                          <TableCell style={{ verticalAlign: 'middle' }}>{item.clicks.toLocaleString()}</TableCell>
                                          <TableCell style={{ fontWeight: '600', verticalAlign: 'middle' }}>{formatCurrency(item.revenue)}</TableCell>
                                          <TableCell style={{ verticalAlign: 'middle' }}>
                                            <span style={{ fontWeight: '600', color: '#16a34a' }}>
                                              {item.ctr.toFixed(2)}%
                                            </span>
                                          </TableCell>
                                          <TableCell style={{ verticalAlign: 'middle' }}>
                                            <span style={{ fontWeight: '600', color: '#dc2626' }}>
                                              {item.cvr}%
                                            </span>
                                          </TableCell>
                                        </TableRow>
                                          ))}
                                        </TableBody>
                                      </Table>
                                </div>
                                <div style={{ marginTop: '12px', textAlign: 'center' }}>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setActiveSection('shop-detail-reports');
                                      setDetailReportTab('high-ctr-low-cvr');
                                    }}
                                    style={{ 
                                      fontSize: '12px',
                                      color: '#0f62fe',
                                      textDecoration: 'none',
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      gap: '4px',
                                      background: 'none',
                                      border: 'none',
                                      cursor: 'pointer',
                                      padding: 0
                                    }}
                                    onMouseEnter={(e) => {
                                      (e.currentTarget as unknown as { style: Record<string, string> }).style.textDecoration = 'underline';
                                    }}
                                    onMouseLeave={(e) => {
                                      (e.currentTarget as unknown as { style: Record<string, string> }).style.textDecoration = 'none';
                                    }}
                                  >
                                    View full report
                                    <svg width="12" height="12" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                      <path d="M7 3L12 8L7 13" stroke="#0f62fe" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                  </button>
                                </div>
                              </>
                            ) : (
                              <p style={{ fontSize: '13px', color: 'var(--shopify-text-secondary)', textAlign: 'center', padding: '20px' }}>
                                No items found in this category
                              </p>
                            )}
                          </div>
                        </Column>

                        {/* High CVR, Low CTR */}
                        <Column lg={16} md={12} sm={12}>
                          <div style={{ 
                            backgroundColor: '#f9f9f9',
                            borderRadius: '8px',
                            border: '1px solid #e0e0e0',
                            padding: '16px'
                          }}>
                            <div style={{ marginBottom: '16px' }}>
                              <h3 style={{ fontSize: '14px', fontWeight: '600', color: 'var(--shopify-text-primary)', marginBottom: '4px' }}>
                                {extraCopy.highCvrLowCtr}
                              </h3>
                              <p style={{ fontSize: '12px', color: 'var(--shopify-text-secondary)', margin: 0 }}>
                                {extraCopy.highCvrLowCtrDesc}
                              </p>
                            </div>
                            {allOptimizationItems.highCVRLowCTR.length > 0 ? (
                              <>
                                <div style={{ 
                                  backgroundColor: 'white', 
                                  borderRadius: '6px',
                                  border: '1px solid #e0e0e0',
                                  overflow: 'hidden'
                                }}>
                                  <Table>
                                        <TableHead>
                                          <TableRow>
                                            <TableHeader 
                                              style={{ cursor: 'pointer', userSelect: 'none', ...ITEM_NAME_COLUMN_STYLE }}
                                              onClick={() => highCVRLowCTRSort.handleSort('name' as any)}
                                            >
                                              {extraCopy.itemName}
                                            </TableHeader>
                                            <TableHeader 
                                              style={{ cursor: 'pointer', userSelect: 'none' }}
                                              onClick={() => highCVRLowCTRSort.handleSort('impressions' as any)}
                                            >
                                              {extraCopy.impressions}
                                            </TableHeader>
                                            <TableHeader 
                                              style={{ cursor: 'pointer', userSelect: 'none' }}
                                              onClick={() => highCVRLowCTRSort.handleSort('clicks' as any)}
                                            >
                                              <MetricTooltip metric="Clicks">
                                                Clicks
                                              </MetricTooltip>
                                            </TableHeader>
                                            <TableHeader 
                                              style={{ cursor: 'pointer', userSelect: 'none' }}
                                              onClick={() => highCVRLowCTRSort.handleSort('revenue' as any)}
                                            >
                                              <MetricTooltip metric="Revenue">
                                                Revenue
                                              </MetricTooltip>
                                            </TableHeader>
                                            <TableHeader 
                                              style={{ cursor: 'pointer', userSelect: 'none' }}
                                              onClick={() => highCVRLowCTRSort.handleSort('ctr' as any)}
                                            >
                                              <MetricTooltip metric="CTR">
                                                CTR
                                              </MetricTooltip>
                                            </TableHeader>
                                            <TableHeader 
                                              style={{ cursor: 'pointer', userSelect: 'none' }}
                                              onClick={() => highCVRLowCTRSort.handleSort('cvr' as any)}
                                            >
                                              <MetricTooltip metric="CVR">
                                                CVR
                                              </MetricTooltip>
                                            </TableHeader>
                                          </TableRow>
                                        </TableHead>
                                        <TableBody>
                                          {highCVRLowCTRSort.sortedData.map((item, index) => (
                                        <TableRow 
                                          key={index}
                                          style={{ 
                                            backgroundColor: index % 2 === 0 ? 'white' : '#f9f9f9',
                                            minHeight: '48px',
                                            height: '48px'
                                          }}
                                        >
                                          <TableCell style={{ verticalAlign: 'middle', ...ITEM_NAME_COLUMN_STYLE }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                              {/* Show image for Product items */}
                                              {item.itemType === 'Product' && (item as any).imageUrl && (
                                                <img 
                                                  src={(item as any).imageUrl} 
                                                  alt={item.name}
                                                  style={{ 
                                                    width: '32px', 
                                                    height: '32px', 
                                                    objectFit: 'cover',
                                                    borderRadius: '4px',
                                                    border: '1px solid #e0e0e0',
                                                    flexShrink: 0
                                                  }}
                                                  onError={(e) => {
                                                    (e.target as unknown as { style: Record<string, string> }).style.display = 'none';
                                                  }}
                                                />
                                              )}
                                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: 0 }}>
                                                {/* Make Product names clickable */}
                                                {item.itemType === 'Product' && (item as any).productUrl ? (
                                                  <a 
                                                    href={(item as any).productUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    style={{ 
                                                      color: '#0f62fe',
                                                      textDecoration: 'none',
                                                      fontWeight: '500',
                                                      overflow: 'hidden',
                                                      textOverflow: 'ellipsis',
                                                      whiteSpace: 'nowrap'
                                                    }}
                                                    onMouseEnter={(e) => {
                                                      (e.currentTarget as unknown as { style: Record<string, string> }).style.textDecoration = 'underline';
                                                    }}
                                                    onMouseLeave={(e) => {
                                                      (e.currentTarget as unknown as { style: Record<string, string> }).style.textDecoration = 'none';
                                                    }}
                                                  >
                                                    {item.name}
                                                  </a>
                                                ) : (
                                                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</span>
                                                )}
                                              </div>
                                            </div>
                                          </TableCell>
                                          <TableCell style={{ verticalAlign: 'middle' }}>{item.impressions.toLocaleString()}</TableCell>
                                          <TableCell style={{ verticalAlign: 'middle' }}>{item.clicks.toLocaleString()}</TableCell>
                                          <TableCell style={{ fontWeight: '600', verticalAlign: 'middle' }}>{formatCurrency(item.revenue)}</TableCell>
                                          <TableCell style={{ verticalAlign: 'middle' }}>
                                            <span style={{ fontWeight: '600', color: '#dc2626' }}>
                                              {item.ctr.toFixed(2)}%
                                            </span>
                                          </TableCell>
                                          <TableCell style={{ verticalAlign: 'middle' }}>
                                            <span style={{ fontWeight: '600', color: '#16a34a' }}>
                                              {item.cvr}%
                                            </span>
                                          </TableCell>
                                        </TableRow>
                                          ))}
                                        </TableBody>
                                      </Table>
                                </div>
                                <div style={{ marginTop: '12px', textAlign: 'center' }}>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setActiveSection('shop-detail-reports');
                                      setDetailReportTab('high-cvr-low-ctr');
                                    }}
                                    style={{ 
                                      fontSize: '12px',
                                      color: '#0f62fe',
                                      textDecoration: 'none',
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      gap: '4px',
                                      background: 'none',
                                      border: 'none',
                                      cursor: 'pointer',
                                      padding: 0
                                    }}
                                    onMouseEnter={(e) => {
                                      (e.currentTarget as unknown as { style: Record<string, string> }).style.textDecoration = 'underline';
                                    }}
                                    onMouseLeave={(e) => {
                                      (e.currentTarget as unknown as { style: Record<string, string> }).style.textDecoration = 'none';
                                    }}
                                  >
                                    View full report
                                    <svg width="12" height="12" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                      <path d="M7 3L12 8L7 13" stroke="#0f62fe" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                  </button>
                                </div>
                              </>
                            ) : (
                              <p style={{ fontSize: '13px', color: 'var(--shopify-text-secondary)', textAlign: 'center', padding: '20px' }}>
                                No items found in this category
                              </p>
                            )}
                          </div>
                        </Column>
                      </Grid>
                    </div>
                  );
                })()}
              </div>

              {/* 6. Partner Benchmarking */}
              <div style={{ 
                marginTop: '24px',
                marginLeft: '24px',
                marginRight: '24px',
                backgroundColor: 'white',
                borderRadius: '8px',
                border: '1px solid var(--shopify-border)',
                padding: '16px'
              }}>
                <div style={{ marginBottom: '0px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: '600', color: 'var(--shopify-text-primary)', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <ChartLineSmooth size={20} style={{ color: '#8a3ffc' }} />
                    {settingsCopy.salesPerformanceVsPeersTitle}
                  </h3>
                  <p style={{ fontSize: '12px', color: 'var(--shopify-text-secondary)', marginBottom: '20px' }}>
                    {settingsCopy.salesPerformanceVsPeersDescription}
                  </p>
                </div>

                {/* Comparison Charts - 4 separate charts */}
                <Grid narrow style={{ marginBottom: '0px' }}>
                  {/* CVR Chart */}
                  <Column lg={4} md={6} sm={12}>
                    <div style={{ marginBottom: '0px' }}>
                      <div style={{ fontSize: '12px', fontWeight: '400', color: 'var(--shopify-text-primary)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <MetricTooltip metric="CVR">
                          CVR (%)
                        </MetricTooltip>
                      </div>
                      <div style={{ 
                        width: '100%', 
                        height: '180px',
                        padding: '0 12px 0 12px'
                      }}>
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart 
                            data={[
                              { 
                                name: extraCopy.you,
                                value: partnerBenchmarking.metrics.cvr.partner,
                                percentile: partnerBenchmarking.metrics.cvr.percentile
                              },
                              { 
                                name: extraCopy.average,
                                value: partnerBenchmarking.metrics.cvr.categoryAvg
                              },
                              { 
                                name: extraCopy.top5,
                                value: partnerBenchmarking.metrics.cvr.top5Percent
                              }
                            ]}
                            margin={{ top: 5, right: 10, left: 3, bottom: 25 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" stroke="#e1e3e5" vertical={false} />
                            <XAxis 
                              dataKey="name"
                              stroke="#6d7175" 
                              tick={{ fontSize: 12, fill: '#6d7175' }}
                              tickLine={{ stroke: '#6d7175' }}
                            />
                            <YAxis 
                              stroke="#6d7175" 
                              tick={{ fontSize: 12, fill: '#6d7175' }}
                              tickLine={{ stroke: '#6d7175' }}
                              width={40}
                              tickFormatter={(value: number) => `${value.toFixed(1)}%`}
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
                            formatter={(value: number, name: string, props: any) => {
                              const formattedValue = `${value.toFixed(2)}%`;
                              if (props.payload.name === extraCopy.you && props.payload.percentile) {
                                return [`${formattedValue} (${props.payload.percentile}th percentile)`, 'CVR'];
                              }
                              return [formattedValue, 'CVR'];
                            }}
                          />
                          <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                            {[
                              { name: extraCopy.you, fill: '#7256F6' },
                              { name: extraCopy.average, fill: '#8d8d8d' },
                              { name: extraCopy.top5, fill: '#f1c21b' }
                            ].map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.fill} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                      </div>
                    </div>
                  </Column>

                  {/* AOV Chart */}
                  <Column lg={4} md={6} sm={12}>
                    <div style={{ marginBottom: '0px' }}>
                      <div style={{ fontSize: '12px', fontWeight: '400', color: 'var(--shopify-text-primary)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <MetricTooltip metric="AOV">
                          AOV ($)
                        </MetricTooltip>
                      </div>
                      <div style={{ 
                        width: '100%', 
                        height: '180px',
                        padding: '0 12px 0 12px'
                      }}>
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart 
                            data={[
                              { 
                                name: extraCopy.you,
                                value: partnerBenchmarking.metrics.aov.partner,
                                percentile: partnerBenchmarking.metrics.aov.percentile
                              },
                              { 
                                name: extraCopy.average,
                                value: partnerBenchmarking.metrics.aov.categoryAvg
                              },
                              { 
                                name: extraCopy.top5,
                                value: partnerBenchmarking.metrics.aov.top5Percent
                              }
                            ]}
                            margin={{ top: 5, right: 10, left: 0, bottom: 25 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" stroke="#e1e3e5" vertical={false} />
                            <XAxis 
                              dataKey="name"
                              stroke="#6d7175" 
                              tick={{ fontSize: 12, fill: '#6d7175' }}
                              tickLine={{ stroke: '#6d7175' }}
                            />
                            <YAxis 
                              stroke="#6d7175" 
                              tick={{ fontSize: 12, fill: '#6d7175' }}
                              tickLine={{ stroke: '#6d7175' }}
                              width={40}
                              tickFormatter={(value: number) => `$${value.toFixed(0)}`}
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
                            formatter={(value: number, name: string, props: any) => {
                              const formattedValue = `$${value.toFixed(2)}`;
                              if (props.payload.name === extraCopy.you && props.payload.percentile) {
                                return [`${formattedValue} (${props.payload.percentile}th percentile)`, 'AOV'];
                              }
                              return [formattedValue, 'AOV'];
                            }}
                          />
                          <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                            {[
                              { name: extraCopy.you, fill: '#7256F6' },
                              { name: extraCopy.average, fill: '#8d8d8d' },
                              { name: extraCopy.top5, fill: '#f1c21b' }
                            ].map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.fill} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                      </div>
                    </div>
                  </Column>

                  {/* Revenue Per Click Chart */}
                  <Column lg={4} md={6} sm={12}>
                    <div style={{ marginBottom: '0px'}}>
                      <div style={{ fontSize: '12px', fontWeight: '400', color: 'var(--shopify-text-primary)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <MetricTooltip metric="RPC">
                          Revenue Per Click ($)
                        </MetricTooltip>
                      </div>
                      <div style={{ 
                        width: '100%', 
                        height: '180px',
                        padding: '0 12px 0 12px'
                      }}>
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart 
                            data={[
                              { 
                                name: extraCopy.you,
                                value: partnerBenchmarking.metrics.rpc.partner,
                                percentile: partnerBenchmarking.metrics.rpc.percentile
                              },
                              { 
                                name: extraCopy.average,
                                value: partnerBenchmarking.metrics.rpc.categoryAvg
                              },
                              { 
                                name: extraCopy.top5,
                                value: partnerBenchmarking.metrics.rpc.top5Percent
                              }
                            ]}
                            margin={{ top: 5, right: 10, left: 0, bottom: 25 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" stroke="#e1e3e5" vertical={false} />
                            <XAxis 
                              dataKey="name"
                              stroke="#6d7175" 
                              tick={{ fontSize: 12, fill: '#6d7175' }}
                              tickLine={{ stroke: '#6d7175' }}
                            />
                            <YAxis 
                              stroke="#6d7175" 
                              tick={{ fontSize: 12, fill: '#6d7175' }}
                              tickLine={{ stroke: '#6d7175' }}
                              width={40}
                              tickFormatter={(value: number) => `$${value.toFixed(2)}`}
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
                            formatter={(value: number, name: string, props: any) => {
                              const formattedValue = `$${value.toFixed(2)}`;
                              if (props.payload.name === extraCopy.you && props.payload.percentile) {
                                return [`${formattedValue} (${props.payload.percentile}th percentile)`, 'Revenue Per Click'];
                              }
                              return [formattedValue, 'Revenue Per Click'];
                            }}
                          />
                          <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                            {[
                              { name: extraCopy.you, fill: '#7256F6' },
                              { name: extraCopy.average, fill: '#8d8d8d' },
                              { name: extraCopy.top5, fill: '#f1c21b' }
                            ].map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.fill} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                      </div>
                    </div>
                  </Column>

                  {/* Return Rate Chart */}
                  <Column lg={4} md={6} sm={12}>
                    <div style={{ marginBottom: '0px' }}>
                      <div style={{ fontSize: '12px', fontWeight: '400', color: 'var(--shopify-text-primary)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <MetricTooltip metric="Return Rate">
                          Return Rate (%)
                        </MetricTooltip>
                      </div>
                      <div style={{ 
                        width: '100%', 
                        height: '180px',
                        padding: '0 12px 0 12px'
                      }}>
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart 
                            data={[
                              { 
                                name: extraCopy.you,
                                value: partnerBenchmarking.metrics.returnRate.partner,
                                percentile: partnerBenchmarking.metrics.returnRate.percentile
                              },
                              { 
                                name: extraCopy.average,
                                value: partnerBenchmarking.metrics.returnRate.categoryAvg
                              },
                              { 
                                name: extraCopy.top5,
                                value: partnerBenchmarking.metrics.returnRate.top5Percent
                              }
                            ]}
                            margin={{ top: 5, right: 10, left: 0, bottom: 25 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" stroke="#e1e3e5" vertical={false} />
                            <XAxis 
                              dataKey="name"
                              stroke="#6d7175" 
                              tick={{ fontSize: 12, fill: '#6d7175' }}
                              tickLine={{ stroke: '#6d7175' }}
                            />
                            <YAxis 
                              stroke="#6d7175" 
                              tick={{ fontSize: 12, fill: '#6d7175' }}
                              tickLine={{ stroke: '#6d7175' }}
                              width={40}
                              tickFormatter={(value: number) => `${value.toFixed(1)}%`}
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
                            formatter={(value: number, name: string, props: any) => {
                              const formattedValue = `${value.toFixed(2)}%`;
                              if (props.payload.name === extraCopy.you && props.payload.percentile) {
                                return [`${formattedValue} (${props.payload.percentile}th percentile)`, 'Return Rate'];
                              }
                              return [formattedValue, 'Return Rate'];
                            }}
                          />
                          <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                            {[
                              { name: extraCopy.you, fill: '#7256F6' },
                              { name: extraCopy.average, fill: '#8d8d8d' },
                              { name: extraCopy.top5, fill: '#f1c21b' }
                            ].map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.fill} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                      </div>
                    </div>
                  </Column>
                </Grid>

                {/* Recommendations */}
                <div style={{ 
                  padding: '16px', 
                  backgroundColor: '#f0edff', 
                  borderRadius: '8px', 
                  border: '1px solid #e0d9ff'
                }}>
                  <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--shopify-text-primary)', marginBottom: '12px' }}>
                    {extraCopy.recommendations}
                  </div>
                  <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '14px', color: 'var(--shopify-text-primary)', listStyleType: 'disc' }}>
                    {localizedRecommendations.map((rec, index) => (
                      <li key={index} style={{ marginBottom: '8px' }}>{rec}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* 7. Learn from Top Performers & 8. Recommended Actions - Side by Side */}
              <div style={{ 
                marginTop: '24px',
                marginLeft: '24px',
                marginRight: '24px',
                marginBottom: '16px'
              }}>
                <Grid narrow style={{ marginLeft: 0, marginRight: 0, paddingLeft: 0, paddingRight: 0 }}>
                  {/* Learn from Top Performers */}
                  <Column lg={8} md={4} sm={4}>
                    <div style={{ 
                      backgroundColor: '#f6f6f7',
                      borderRadius: '8px',
                      border: '1px solid var(--shopify-border)',
                      padding: '16px',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      opacity: 0.8
                    }}>
                      <div style={{ marginBottom: '12px' }}>
                        <h3 style={{ fontSize: '16px', fontWeight: '600', color: 'var(--shopify-text-primary)', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <Trophy size={20} style={{ color: '#8a3ffc' }} />
                          {extraCopy.learnFromTopPerformers}
                        </h3>
                        <p style={{ fontSize: '12px', color: 'var(--shopify-text-secondary)', margin: 0 }}>
                          {extraCopy.learnFromTopPerformersDesc}
                        </p>
                      </div>
                      
                      <div style={{ 
                        textAlign: 'center',
                        padding: '12px',
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        minHeight: '60px'
                      }}>
                        <Time size={20} style={{ color: 'var(--shopify-text-secondary)', marginBottom: '6px', opacity: 0.6 }} />
                        <div style={{ fontSize: '12px', fontWeight: '500', color: 'var(--shopify-text-primary)', marginBottom: '4px' }}>
                          {extraCopy.comingSoon}
                        </div>

                      </div>
                    </div>
                  </Column>

                  {/* Recommended Actions */}
                  <Column lg={8} md={4} sm={4}>
                    <div style={{ 
                      backgroundColor: '#f6f6f7',
                      borderRadius: '8px',
                      border: '1px solid var(--shopify-border)',
                      padding: '16px',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      opacity: 0.8
                    }}>
                      <div style={{ marginBottom: '12px' }}>
                        <h3 style={{ fontSize: '16px', fontWeight: '600', color: 'var(--shopify-text-primary)', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <Idea size={20} style={{ color: '#f1c21b' }} />
                          {extraCopy.recommendedActions}
                        </h3>
                        <p style={{ fontSize: '12px', color: 'var(--shopify-text-secondary)', margin: 0 }}>
                          {extraCopy.recommendedActionsDesc}
                        </p>
                      </div>
                      
                      <div style={{ 
                        textAlign: 'center',
                        padding: '12px',
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        minHeight: '60px'
                      }}>
                        <Time size={20} style={{ color: 'var(--shopify-text-secondary)', marginBottom: '6px', opacity: 0.6 }} />
                        <div style={{ fontSize: '12px', fontWeight: '500', color: 'var(--shopify-text-primary)', marginBottom: '4px' }}>
                          {extraCopy.comingSoon}
                        </div>
                      </div>
                    </div>
                  </Column>
                </Grid>
              </div>
              </React.Fragment>
          )}
          {showCreatorDashboard && (
            <div
              style={{
                marginTop: '16px',
                marginLeft: '24px',
                marginRight: '24px',
                marginBottom: '24px',
              }}
            >
              <CreatorDashboardView
                variant="embedded"
                currency={currency}
                locale={displayLanguage}
                excludeCancelled={creatorExcludeCancelled}
                onExcludeCancelledChange={setCreatorExcludeCancelled}
              />
            </div>
          )}
          </>
          )}
        </div>
          )}
        </div>
      </main>

      <Modal
        open={settingsModal !== null}
        onRequestClose={() => {
          setSettingsModal(null);
          setInviteMemberEmail('');
          resetContactSupportForm();
        }}
        modalHeading={
          settingsModal === 'invite'
            ? settingsCopy.inviteMemberLabel
            : settingsModal === 'contact'
              ? settingsCopy.contactSupportLabel
              : ''
        }
        primaryButtonText={
          settingsModal === 'invite'
            ? 'Confirm'
            : settingsModal === 'contact'
              ? 'Send Inquiry'
              : 'Confirm'
        }
        secondaryButtonText="Cancel"
        onRequestSubmit={() => {
          if (settingsModal === 'invite') {
            setSettingsModal(null);
            setInviteMemberEmail('');
            return;
          }
          const didSend = handleSendInquiry();
          if (didSend) {
            setSettingsModal(null);
            resetContactSupportForm();
          }
        }}
        size="sm"
        id={settingsModal === 'invite' ? 'invite-member-modal' : 'contact-support-modal'}
        selectorPrimaryFocus={
          settingsModal === 'invite'
            ? '#invite-member-email'
            : '#support-inquiry-subject'
        }
      >
        {settingsModal === 'invite' ? (
          <>
            <p
              id="invite-member-modal-desc"
              style={{
                fontSize: '14px',
                color: 'var(--shopify-text-secondary)',
                margin: '0 0 1rem',
                lineHeight: 1.5,
              }}
            >
              Enter the email of an existing user to add them to your organization.
            </p>
            <TextInput
              id="invite-member-email"
              labelText={settingsCopy.memberEmailLabel}
              type="email"
              autoComplete="email"
              placeholder="Enter email"
              value={inviteMemberEmail}
              onChange={(e) => setInviteMemberEmail(e.target.value)}
            />
          </>
        ) : settingsModal === 'contact' ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <Dropdown<SupportInquiryCategory>
              id="support-inquiry-category"
              titleText="Inquiry category"
              label="Select category"
              items={[...SUPPORT_INQUIRY_CATEGORIES]}
              itemToString={(item) => (item ? item.label : '')}
              selectedItem={selectedSupportInquiryCategoryItem ?? undefined}
              onChange={({ selectedItem }) => {
                if (selectedItem) setInquiryCategory(selectedItem.value);
              }}
              size="md"
            />

            <TextInput
              id="support-inquiry-subject"
              labelText={settingsCopy.subjectLabel}
              placeholder="Enter subject"
              value={contactSubject}
              onChange={(e) => setContactSubject((e.target as HTMLInputElement).value)}
              size="md"
              style={{ borderRadius: '0px' }}
            />

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div
                style={{
                  fontSize: '12px',
                  color: '#6d7175',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  fontWeight: 600,
                }}
              >
                Message
              </div>
              <textarea
                value={contactMessage}
                placeholder="Enter detailed message"
                onChange={(e) => setContactMessage((e.target as HTMLTextAreaElement).value)}
                style={{
                  width: '100%',
                  borderRadius: '6px',
                  border: '1px solid var(--shopify-border)',
                  backgroundColor: 'var(--cds-layer-01)',
                  padding: '12px 12px',
                  fontSize: '14px',
                  color: 'var(--shopify-text-primary)',
                  outline: 'none',
                  minHeight: '140px',
                  resize: 'vertical',
                }}
              />
            </div>

            {contactFormStatus && (
              <div
                style={{
                  fontSize: '13px',
                  color: contactFormStatus.type === 'success' ? '#16a34a' : '#be185d',
                  fontWeight: 600,
                }}
              >
                {contactFormStatus.message}
              </div>
            )}
          </div>
        ) : null}
      </Modal>
    </div>
  );
};

export default PartnerPerformanceDashboard;
