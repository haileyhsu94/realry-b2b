import type { Meta, StoryObj } from '@storybook/react';
import { RankedList } from '../components/RankedList';

// Mock data
const topCountries = [
  { id: '1', label: 'United States', value: 1820, change: '5%', trend: 'up' as const },
  { id: '2', label: 'United Kingdom', value: 730, change: '3%', trend: 'down' as const },
  { id: '3', label: 'Canada', value: 485, change: '9%', trend: 'up' as const },
  { id: '4', label: 'Germany', value: 412, change: '12%', trend: 'up' as const },
  { id: '5', label: 'Australia', value: 356, change: '2%', trend: 'up' as const },
  { id: '6', label: 'France', value: 298, change: '1%', trend: 'down' as const },
  { id: '7', label: 'Japan', value: 287, change: '8%', trend: 'up' as const },
];

const topProducts = [
  { id: '1', label: 'Premium Wireless Headphones', value: 12450, subLabel: 'Electronics', change: '15%', trend: 'up' as const },
  { id: '2', label: 'Smart Fitness Watch', value: 9800, subLabel: 'Wearables', change: '8%', trend: 'up' as const },
  { id: '3', label: 'Portable Bluetooth Speaker', value: 7850, subLabel: 'Audio', change: '3%', trend: 'down' as const },
  { id: '4', label: 'Gaming Mouse', value: 5420, subLabel: 'Accessories', change: '22%', trend: 'up' as const },
  { id: '5', label: 'USB-C Cable Set', value: 3290, subLabel: 'Accessories', change: '5%', trend: 'up' as const },
];

const topCities = [
  { id: '1', label: 'New York', value: 645 },
  { id: '2', label: 'Los Angeles', value: 523 },
  { id: '3', label: 'London', value: 412 },
  { id: '4', label: 'Toronto', value: 298 },
  { id: '5', label: 'Sydney', value: 287 },
  { id: '6', label: 'Berlin', value: 245 },
];

const conversionRates = [
  { id: '1', label: 'Email Campaign', value: 18.5, change: '2.3%', trend: 'up' as const },
  { id: '2', label: 'Social Media Ads', value: 14.2, change: '0.8%', trend: 'up' as const },
  { id: '3', label: 'Search Ads', value: 12.7, change: '1.2%', trend: 'down' as const },
  { id: '4', label: 'Display Ads', value: 8.3, change: '0.5%', trend: 'down' as const },
  { id: '5', label: 'Referral', value: 6.9, change: '3.1%', trend: 'up' as const },
];

const meta = {
  title: 'Components/Ranked List',
  component: RankedList,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A scrollable ranked list component with progress bars, trend indicators, and click handlers. Perfect for displaying top performers, countries, products, or any ranked data.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    title: {
      control: 'text',
      description: 'Title displayed at the top of the list',
    },
    items: {
      control: 'object',
      description: 'Array of items to display in the ranked list',
    },
    total: {
      control: 'number',
      description: 'Total value used for calculating progress bar percentages',
    },
    maxHeight: {
      control: 'text',
      description: 'Maximum height before scrolling kicks in',
    },
    valueFormat: {
      control: 'select',
      options: ['number', 'currency', 'percentage'],
      description: 'Format for displaying values',
    },
    showProgressBars: {
      control: 'boolean',
      description: 'Show horizontal progress bars below each item',
    },
    showTrends: {
      control: 'boolean',
      description: 'Show trend indicators (up/down arrows with percentage)',
    },
    footerSummary: {
      control: 'text',
      description: 'Optional summary text displayed in the footer',
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: '400px' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof RankedList>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default ranked list showing top countries with orders.
 * Includes progress bars and trend indicators.
 */
export const Default: Story = {
  args: {
    title: 'Top Countries',
    items: topCountries,
    total: 5000,
    valueFormat: 'number',
    showProgressBars: true,
    showTrends: true,
    footerSummary: '4,388 / 5,000 (87.8%)',
  },
};

/**
 * Revenue-focused list with currency formatting.
 */
export const TopProductsByRevenue: Story = {
  args: {
    title: 'Top Products by Revenue',
    items: topProducts,
    total: 50000,
    valueFormat: 'currency',
    showProgressBars: true,
    showTrends: true,
    maxHeight: '450px',
    footerSummary: '$38,810 / $50,000 (77.6%)',
  },
};

/**
 * Simple list without trends, just showing values.
 */
export const TopCities: Story = {
  args: {
    title: 'Top Cities',
    items: topCities,
    total: 3000,
    valueFormat: 'number',
    showProgressBars: true,
    showTrends: false,
    maxHeight: '350px',
  },
};

/**
 * Conversion rates with percentage formatting.
 */
export const ConversionRates: Story = {
  args: {
    title: 'Conversion Rates by Channel',
    items: conversionRates,
    total: 100,
    valueFormat: 'percentage',
    showProgressBars: true,
    showTrends: true,
    footerSummary: 'Average CVR: 12.1%',
  },
};

/**
 * Minimal list without progress bars.
 */
export const MinimalList: Story = {
  args: {
    title: 'Top Performers',
    items: topCountries.slice(0, 5),
    total: 5000,
    valueFormat: 'number',
    showProgressBars: false,
    showTrends: false,
  },
};

/**
 * Interactive list with click handlers.
 */
export const ClickableItems: Story = {
  args: {
    title: 'Top Countries (Click to View)',
    items: topCountries,
    total: 5000,
    valueFormat: 'number',
    showProgressBars: true,
    showTrends: true,
    onItemClick: (item) => alert(`Clicked: ${item.label} (${item.value})`),
    footerSummary: 'Click any country to view details',
  },
};

/**
 * Long scrollable list with many items.
 */
export const ScrollableList: Story = {
  args: {
    title: 'All Countries',
    items: [
      ...topCountries,
      { id: '8', label: 'Italy', value: 245, change: '4%', trend: 'up' as const },
      { id: '9', label: 'Spain', value: 223, change: '6%', trend: 'up' as const },
      { id: '10', label: 'Netherlands', value: 198, change: '1%', trend: 'down' as const },
      { id: '11', label: 'Switzerland', value: 187, change: '3%', trend: 'up' as const },
      { id: '12', label: 'Sweden', value: 156, change: '7%', trend: 'up' as const },
    ],
    total: 6000,
    valueFormat: 'number',
    showProgressBars: true,
    showTrends: true,
    maxHeight: '300px',
    footerSummary: '5,477 / 6,000 (91.3%)',
  },
};

/**
 * Compact list for small spaces.
 */
export const CompactList: Story = {
  args: {
    title: 'Quick Stats',
    items: topCountries.slice(0, 3),
    total: 3000,
    valueFormat: 'number',
    showProgressBars: true,
    showTrends: false,
    maxHeight: '200px',
  },
};
