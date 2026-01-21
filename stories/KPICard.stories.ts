import type { Meta, StoryObj } from '@storybook/react';
import { KPICard } from '../components/KPICard';

// Mock trend data for demonstrations
const mockTrendData = [
  { date: 'Jan 8', value: 4200, revenueNew: 1680, revenueReturning: 2520 },
  { date: 'Jan 9', value: 5800, revenueNew: 2320, revenueReturning: 3480 },
  { date: 'Jan 10', value: 4900, revenueNew: 1960, revenueReturning: 2940 },
  { date: 'Jan 11', value: 7100, revenueNew: 2840, revenueReturning: 4260 },
  { date: 'Jan 12', value: 6400, revenueNew: 2560, revenueReturning: 3840 },
  { date: 'Jan 13', value: 8200, revenueNew: 3280, revenueReturning: 4920 },
  { date: 'Jan 14', value: 7800, revenueNew: 3120, revenueReturning: 4680 },
];

const cvrTrendData = [
  { date: 'Jan 8', value: 13.9 },
  { date: 'Jan 9', value: 13.75 },
  { date: 'Jan 10', value: 14.5 },
  { date: 'Jan 11', value: 13.65 },
  { date: 'Jan 12', value: 13.48 },
  { date: 'Jan 13', value: 13.39 },
  { date: 'Jan 14', value: 13.21 },
];

const meta = {
  title: 'Components/KPI Card',
  component: KPICard,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A key performance indicator card that displays metrics with trend visualization. Supports both line charts and stacked bar charts for revenue breakdown.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    title: {
      control: 'text',
      description: 'The title of the KPI metric',
    },
    value: {
      control: 'text',
      description: 'The main value to display',
    },
    change: {
      control: 'text',
      description: 'The change indicator (e.g., +12.5%)',
    },
    trend: {
      control: 'select',
      options: ['up', 'down'],
      description: 'Trend direction (affects arrow icon and color)',
    },
    description: {
      control: 'text',
      description: 'Additional description or time period',
    },
    color: {
      control: 'color',
      description: 'Color for the trend line in the chart',
    },
    showRevenueBreakdown: {
      control: 'boolean',
      description: 'Show stacked bar chart with new vs returning users breakdown',
    },
  },
} satisfies Meta<typeof KPICard>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default KPI Card with line chart showing trend over time.
 * Displays a positive trend with an upward arrow.
 */
export const Default: Story = {
  args: {
    title: 'Total Revenue',
    value: '$47,234',
    change: '+12.5%',
    trend: 'up',
    description: 'Last 7 days',
    color: '#0f62fe',
    trendData: mockTrendData,
    showRevenueBreakdown: false,
  },
};

/**
 * Revenue card with stacked bar chart showing breakdown by new vs returning users.
 * Includes detailed tooltip with percentages and a trend line overlay.
 */
export const RevenueWithBreakdown: Story = {
  args: {
    title: 'Total Revenue',
    value: '$47,234',
    change: '+12.5%',
    trend: 'up',
    description: 'Last 7 days',
    color: '#0f62fe',
    trendData: mockTrendData,
    showRevenueBreakdown: true,
  },
};

/**
 * Conversion Rate KPI with percentage values and downward trend.
 */
export const ConversionRate: Story = {
  args: {
    title: 'Conversion Rate',
    value: '13.9%',
    change: '-0.3%',
    trend: 'down',
    description: 'Average CVR',
    color: '#00539a',
    trendData: cvrTrendData,
    showRevenueBreakdown: false,
  },
};

/**
 * Click-Through Rate KPI with custom purple color.
 */
export const ClickThroughRate: Story = {
  args: {
    title: 'Click Through Rate',
    value: '4.2%',
    change: '+0.8%',
    trend: 'up',
    description: 'Average CTR',
    color: '#8a3ffc',
    trendData: cvrTrendData.map(d => ({ ...d, value: d.value / 3 })),
    showRevenueBreakdown: false,
  },
};

/**
 * ROAS (Return on Ad Spend) metric with custom teal color.
 */
export const ROAS: Story = {
  args: {
    title: 'ROAS',
    value: '3.8x',
    change: '+0.5x',
    trend: 'up',
    description: 'Return on ad spend',
    color: '#0072c3',
    trendData: mockTrendData.map(d => ({ ...d, value: (d.value / 1000) * 0.7 })),
    showRevenueBreakdown: false,
  },
};

/**
 * Card showing negative trend with downward arrow and red indicator.
 */
export const NegativeTrend: Story = {
  args: {
    title: 'Orders',
    value: '1,243',
    change: '-6.9%',
    trend: 'down',
    description: 'vs previous period',
    color: '#dc2626',
    trendData: mockTrendData.map(d => ({ ...d, value: d.value / 5 })).reverse(),
    showRevenueBreakdown: false,
  },
};

/**
 * Small value metric (not in thousands) with custom styling.
 */
export const SmallValue: Story = {
  args: {
    title: 'New Customers',
    value: '241',
    change: '+18.2%',
    trend: 'up',
    description: 'Last 7 days',
    color: '#16a34a',
    trendData: mockTrendData.map(d => ({ ...d, value: d.value / 100 })),
    showRevenueBreakdown: false,
  },
};
