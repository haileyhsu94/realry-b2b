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
import {
  mockPartnerPlans,
  mockWebsitePerformance,
  mockCreatorPerformance,
  mockTopTierShopPerformance,
  mockRevenueData,
  mockPreviousPeriodData,
  type PartnerPlans,
} from '@/lib/mockData';

const PartnerPerformanceDashboard = () => {
  const [timeRange, setTimeRange] = useState('7d');
  const [activeSection, setActiveSection] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [plans, setPlans] = useState<PartnerPlans>(mockPartnerPlans);
  
  // Custom date range states
  const [showCustomDatePicker, setShowCustomDatePicker] = useState(false);
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [isCustomRange, setIsCustomRange] = useState(false);
  
  // Filter states for detail tabs
  const [chartMetric, setChartMetric] = useState('revenue'); // revenue, clicks, conversions, roas
  const [campaignFilter, setCampaignFilter] = useState('all'); // all, active, completed

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
      title: 'Total Clicks',
      value: '8,920',
      change: '+23.1%',
      trend: 'up',
      description: 'Last 7 days',
      trendData: clicksTrend,
      color: '#8a3ffc'
    },
    {
      title: 'Conversions',
      value: '1,243',
      change: '+15.2%',
      trend: 'up',
      description: 'Last 7 days',
      trendData: conversionsTrend,
      color: '#0072c3'
    },
    {
      title: 'Conversion Rate',
      value: '13.9%',
      change: '-0.3%',
      trend: 'down',
      description: 'Average',
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
      index
    }));

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
        
        {/* Trend Chart - Prominent and visible with axes */}
        <div style={{ 
          width: '100%', 
          height: '120px',
          padding: '0 0 24px 0'
        }}>
          <ResponsiveContainer width="100%" height="100%">
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
                interval={0}
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
                dot={false}
                isAnimationActive={false}
                activeDot={{ r: 4, fill: metric.color }}
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
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
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

              {/* KPI Cards */}
              <div style={{ padding: '0 0 24px 0' }}>
                <Grid narrow style={{ marginLeft: 0, marginRight: 0 }}>
                  {metrics.map((metric, index) => (
                    <Column key={index} lg={4} md={4} sm={2}>
                      <StatCard metric={metric} />
                    </Column>
                  ))}
                </Grid>
              </div>

              {/* Tabs */}
              <Tabs>
                <TabList aria-label="Dashboard tabs" contained style={{ paddingLeft: '24px', paddingRight: '24px' }}>
                  <Tab>Revenue Overview</Tab>
                  <Tab>Partner Performance</Tab>
                  <Tab>Campaign Analytics</Tab>
                  <Tab>Top-Tier Benchmarks</Tab>
                </TabList>
                <TabPanels>
                  <TabPanel>
                    <div style={{ padding: '0' }}>
                      {/* Filters */}
                      <div style={{ 
                        display: 'flex', 
                        gap: '12px', 
                        marginBottom: '24px',
                        flexWrap: 'wrap',
                        alignItems: 'center',
                        paddingLeft: '24px'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <label style={{ fontSize: '13px', color: 'var(--shopify-text-secondary)', fontWeight: '500' }}>
                            Metric:
                          </label>
                          <div style={{ display: 'flex', gap: '4px' }}>
                            {['revenue', 'clicks', 'conversions', 'roas'].map((metric) => (
                              <button
                                key={metric}
                                className={`shopify-time-button ${chartMetric === metric ? 'active' : ''}`}
                                onClick={() => setChartMetric(metric)}
                                style={{ textTransform: 'capitalize', fontSize: '12px', padding: '4px 10px' }}
                              >
                                {metric}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      <Grid narrow style={{ marginBottom: '24px' }}>
                        <Column lg={5} md={4} sm={2}>
                          <div className="shopify-chart-container" style={{ height: '100%' }}>
                            <div style={{ marginBottom: '24px' }}>
                              <h3 style={{ 
                                fontSize: '18px', 
                                fontWeight: '600', 
                                marginBottom: '8px',
                                color: 'var(--shopify-text-primary)',
                                letterSpacing: '-0.01em'
                              }}>
                                Revenue & Engagement Trends
                              </h3>
                              <p style={{ 
                                fontSize: '14px', 
                                color: 'var(--shopify-text-secondary)',
                                margin: 0,
                                lineHeight: '1.5'
                              }}>
                                Track revenue, clicks, and conversions over time
                              </p>
                            </div>
                            <ResponsiveContainer width="100%" height={300}>
                              <AreaChart data={revenueData}>
                                <defs>
                                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#0f62fe" stopOpacity={0.8}/> {/* Carbon blue-60 */}
                                    <stop offset="95%" stopColor="#0f62fe" stopOpacity={0.1}/>
                                  </linearGradient>
                                  <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#8a3ffc" stopOpacity={0.8}/> {/* Carbon purple-60 */}
                                    <stop offset="95%" stopColor="#8a3ffc" stopOpacity={0.1}/>
                                  </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e1e3e5" />
                                <XAxis dataKey="date" stroke="#6d7175" />
                                <YAxis stroke="#6d7175" />
                                <Tooltip 
                                  contentStyle={{ 
                                    backgroundColor: 'white', 
                                    border: '1px solid #e1e3e5',
                                    borderRadius: '6px',
                                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                                  }} 
                                />
                                <Legend />
                                <Area 
                                  type="monotone" 
                                  dataKey="revenue" 
                                  stroke="#0f62fe" 
                                  fillOpacity={1} 
                                  fill="url(#colorRevenue)"
                                  strokeWidth={2}
                                />
                                <Area 
                                  type="monotone" 
                                  dataKey="clicks" 
                                  stroke="#8a3ffc" 
                                  fillOpacity={1} 
                                  fill="url(#colorClicks)"
                                  strokeWidth={2}
                                />
                              </AreaChart>
                            </ResponsiveContainer>
                          </div>
                        </Column>
                        <Column lg={5} md={4} sm={2}>
                          <div className="shopify-chart-container">
                            <div style={{ marginBottom: '24px' }}>
                              <h3 style={{ 
                                fontSize: '18px', 
                                fontWeight: '600', 
                                marginBottom: '8px',
                                color: 'var(--shopify-text-primary)',
                                letterSpacing: '-0.01em'
                              }}>
                                ROAS Trend
                              </h3>
                              <p style={{ 
                                fontSize: '14px', 
                                color: 'var(--shopify-text-secondary)',
                                margin: 0,
                                lineHeight: '1.5'
                              }}>
                                Return on Ad Spend over time
                              </p>
                            </div>
                            <ResponsiveContainer width="100%" height={300}>
                              <LineChart data={revenueData.map(row => ({
                                ...row,
                                roas: row.spend > 0 ? row.revenue / row.spend : 0
                              }))}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e1e3e5" />
                                <XAxis dataKey="date" stroke="#6d7175" />
                                <YAxis 
                                  stroke="#6d7175" 
                                  width={40}
                                  tickFormatter={(value: number) => `${value.toFixed(1)}x`}
                                />
                                <Tooltip 
                                  contentStyle={{ 
                                    backgroundColor: 'white', 
                                    border: '1px solid #e1e3e5',
                                    borderRadius: '6px'
                                  }}
                                  formatter={(value: number) => `${value.toFixed(2)}x`}
                                />
                              <Line 
                                type="monotone" 
                                dataKey="roas" 
                                stroke="#00539a" 
                                strokeWidth={3}
                                dot={{ fill: '#00539a', r: 4 }}
                                activeDot={{ r: 6 }}
                              />
                              </LineChart>
                            </ResponsiveContainer>
                          </div>
                        </Column>
                        <Column lg={5} md={4} sm={2}>
                          <div className="shopify-chart-container">
                            <div style={{ marginBottom: '24px' }}>
                              <h3 style={{ 
                                fontSize: '18px', 
                                fontWeight: '600', 
                                marginBottom: '8px',
                                color: 'var(--shopify-text-primary)',
                                letterSpacing: '-0.01em'
                              }}>
                                Campaign Distribution
                              </h3>
                              <p style={{ 
                                fontSize: '14px', 
                                color: 'var(--shopify-text-secondary)',
                                margin: 0,
                                lineHeight: '1.5'
                              }}>
                                Revenue by campaign type
                              </p>
                            </div>
                            <ResponsiveContainer width="100%" height={300}>
                              <PieChart>
                                <Pie
                                  data={campaignTypes}
                                  cx="50%"
                                  cy="50%"
                                  labelLine={false}
                                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                  outerRadius={100}
                                  fill="#8884d8"
                                  dataKey="value"
                                >
                                  {campaignTypes.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                  ))}
                                </Pie>
                                <Tooltip 
                                  contentStyle={{ 
                                    backgroundColor: 'white', 
                                    border: '1px solid #e1e3e5',
                                    borderRadius: '6px'
                                  }} 
                                />
                              </PieChart>
                            </ResponsiveContainer>
                          </div>
                        </Column>
                      </Grid>

                      {/* Revenue Data Table */}
                      <div className="shopify-chart-container" style={{ marginTop: '24px' }}>
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
                            {revenueData.map((row, index) => (
                              <TableRow key={index}>
                                <TableCell>{row.date}</TableCell>
                                <TableCell>${row.revenue.toLocaleString()}</TableCell>
                                <TableCell>{row.clicks.toLocaleString()}</TableCell>
                                <TableCell>{row.conversions.toLocaleString()}</TableCell>
                                <TableCell>{row.roas ? row.roas.toFixed(1) + 'x' : 'N/A'}</TableCell>
                                <TableCell>{((row.conversions / row.clicks) * 100).toFixed(1)}%</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </div>
                  </TabPanel>
                  <TabPanel>
                    <div style={{ padding: '0' }}>
                      {/* Filters */}
                      <div style={{ 
                        display: 'flex', 
                        gap: '12px', 
                        marginBottom: '24px',
                        flexWrap: 'wrap',
                        alignItems: 'center',
                        paddingLeft: '24px'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <label style={{ fontSize: '13px', color: 'var(--shopify-text-secondary)', fontWeight: '500' }}>
                            Sort by:
                          </label>
                          <div style={{ display: 'flex', gap: '4px' }}>
                            {['revenue', 'growth'].map((sort) => (
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

                      <div className="shopify-chart-container">
                        <div style={{ marginBottom: '24px' }}>
                          <h3 style={{ 
                            fontSize: '18px', 
                            fontWeight: '600', 
                            marginBottom: '8px',
                            color: 'var(--shopify-text-primary)',
                            letterSpacing: '-0.01em'
                          }}>
                            Top Partner Performance
                          </h3>
                          <p style={{ 
                            fontSize: '14px', 
                            color: 'var(--shopify-text-secondary)',
                            margin: 0,
                            lineHeight: '1.5'
                          }}>
                            Revenue and growth by partner
                          </p>
                        </div>
                        <ResponsiveContainer width="100%" height={400}>
                          <BarChart data={partnerPerformance} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e1e3e5" vertical={false} />
                            <XAxis 
                              dataKey="name" 
                              stroke="#6d7175" 
                              tick={{ fontSize: 13, fill: '#6d7175' }}
                              tickLine={false}
                              axisLine={{ stroke: '#e1e3e5' }}
                            />
                            <YAxis 
                              stroke="#6d7175" 
                              tick={{ fontSize: 13, fill: '#6d7175' }}
                              tickLine={false}
                              axisLine={{ stroke: '#e1e3e5' }}
                              width={60}
                              tickFormatter={(value: number) => `$${(value / 1000).toFixed(0)}k`}
                            />
                            <Tooltip 
                              contentStyle={{ 
                                backgroundColor: 'white', 
                                border: '1px solid #e1e3e5',
                                borderRadius: '6px',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
                                padding: '12px',
                                fontSize: '13px'
                              }}
                              formatter={(value: number) => `$${value.toLocaleString()}`}
                              labelStyle={{ 
                                marginBottom: '8px',
                                fontWeight: '600',
                                color: 'var(--shopify-text-primary)'
                              }}
                            />
                            <Bar 
                              dataKey="revenue" 
                              fill="#7256F6" 
                              radius={[4, 4, 0, 0]}
                              stroke="#7256F6"
                              strokeWidth={0}
                            />
                          </BarChart>
                        </ResponsiveContainer>

                        {/* Partner Performance Table - Source of Truth */}
                        <div style={{ marginTop: '24px' }}>
                          <h4 style={{ 
                            fontSize: '16px', 
                            fontWeight: '600', 
                            marginBottom: '12px',
                            color: 'var(--shopify-text-primary)',
                            letterSpacing: '-0.01em'
                          }}>
                            Partner Performance Data
                          </h4>
                          <p style={{ 
                            fontSize: '14px', 
                            color: 'var(--shopify-text-secondary)',
                            marginBottom: '24px',
                            marginTop: 0,
                            lineHeight: '1.5'
                          }}>
                            Source of truth: Detailed performance metrics for all partners
                          </p>
                          <Table>
                            <TableHead>
                              <TableRow>
                                <TableHeader>Partner Name</TableHeader>
                                <TableHeader>Revenue</TableHeader>
                                <TableHeader>Growth %</TableHeader>
                                <TableHeader>Status</TableHeader>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {partnerPerformance.map((partner, index) => (
                                <TableRow key={index}>
                                  <TableCell>
                                    <div style={{ fontWeight: '500', color: 'var(--shopify-text-primary)' }}>
                                      {partner.name}
                                    </div>
                                  </TableCell>
                                  <TableCell>
                                    <span style={{ fontWeight: '500', color: 'var(--shopify-text-primary)' }}>
                                      ${partner.revenue.toLocaleString()}
                                    </span>
                                  </TableCell>
                                  <TableCell>
                                    <div style={{ 
                                      display: 'flex', 
                                      alignItems: 'center', 
                                      gap: '4px',
                                      color: partner.growth > 0 ? '#008060' : '#d72c0d',
                                      fontWeight: '500'
                                    }}>
                                      {partner.growth > 0 ? (
                                        <ArrowUp size={14} />
                                      ) : (
                                        <ArrowDown size={14} />
                                      )}
                                      {Math.abs(partner.growth)}%
                                    </div>
                                  </TableCell>
                                  <TableCell>
                                    <Tag type="green" size="sm">{partner.status}</Tag>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      </div>
                    </div>
                  </TabPanel>
                  <TabPanel>
                    <div style={{ padding: '0' }}>
                      {/* Filters */}
                      <div style={{ 
                        display: 'flex', 
                        gap: '12px', 
                        marginBottom: '24px',
                        flexWrap: 'wrap',
                        alignItems: 'center',
                        paddingLeft: '24px'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <label style={{ fontSize: '13px', color: 'var(--shopify-text-secondary)', fontWeight: '500' }}>
                            Campaign Status:
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
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <label style={{ fontSize: '13px', color: 'var(--shopify-text-secondary)', fontWeight: '500' }}>
                            Metric:
                          </label>
                          <div style={{ display: 'flex', gap: '4px' }}>
                            {['clicks', 'conversions'].map((metric) => (
                              <button
                                key={metric}
                                className={`shopify-time-button ${chartMetric === metric ? 'active' : ''}`}
                                onClick={() => setChartMetric(metric)}
                                style={{ textTransform: 'capitalize', fontSize: '12px', padding: '4px 10px' }}
                              >
                                {metric}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="shopify-chart-container">
                        <h3 style={{ 
                          fontSize: '16px', 
                          fontWeight: '600', 
                          marginBottom: '8px',
                          color: 'var(--shopify-text-primary)'
                        }}>
                          Campaign Performance Metrics
                        </h3>
                        <p style={{ 
                          fontSize: '13px', 
                          color: 'var(--shopify-text-secondary)',
                          marginBottom: '24px'
                        }}>
                          Detailed analytics across all campaign types
                        </p>
                        <ResponsiveContainer width="100%" height={400}>
                          <BarChart data={revenueData}>
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
                            <Bar dataKey="clicks" fill="#8a3ffc" radius={[6, 6, 0, 0]} />
                            <Bar dataKey="conversions" fill="#0f62fe" radius={[6, 6, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>

                        {/* Campaign Analytics Table */}
                        <div style={{ marginTop: '24px' }}>
                          <h4 style={{ 
                            fontSize: '16px', 
                            fontWeight: '600', 
                            marginBottom: '12px',
                            color: 'var(--shopify-text-primary)',
                            letterSpacing: '-0.01em'
                          }}>
                            Campaign Performance Data
                          </h4>
                          <p style={{ 
                            fontSize: '14px', 
                            color: 'var(--shopify-text-secondary)',
                            marginBottom: '24px',
                            marginTop: 0,
                            lineHeight: '1.5'
                          }}>
                            Source of truth: Detailed performance metrics by date
                          </p>
                          <Table>
                            <TableHead>
                              <TableRow>
                                <TableHeader>Date</TableHeader>
                                <TableHeader>Clicks</TableHeader>
                                <TableHeader>Conversions</TableHeader>
                                <TableHeader>Conversion Rate</TableHeader>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {revenueData.map((row, index) => (
                                <TableRow key={index}>
                                  <TableCell>{row.date}</TableCell>
                                  <TableCell>{row.clicks.toLocaleString()}</TableCell>
                                  <TableCell>{row.conversions.toLocaleString()}</TableCell>
                                  <TableCell>{((row.conversions / row.clicks) * 100).toFixed(1)}%</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      </div>
                    </div>
                  </TabPanel>
                  <TabPanel>
                    <div style={{ marginTop: '0' }}>
                      <Grid narrow>
                        <Column lg={6} md={4} sm={2}>
                          <div className="shopify-card">
                            <h3 style={{ 
                              fontSize: '16px', 
                              fontWeight: '600', 
                              marginBottom: '8px',
                              color: 'var(--shopify-text-primary)'
                            }}>
                              Performance vs Top-Tier Partners
                            </h3>
                            <p style={{ 
                              fontSize: '13px', 
                              color: 'var(--shopify-text-secondary)',
                              marginBottom: '24px'
                            }}>
                              See where you stand and identify growth opportunities
                            </p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                              {topTierBenchmarks.map((benchmark, index) => {
                                const percentage = (benchmark.yourValue / benchmark.topTier) * 100;
                                const gap = benchmark.topTier - benchmark.yourValue;
                                
                                return (
                                  <div key={index} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <div style={{ 
                                      display: 'flex', 
                                      justifyContent: 'space-between', 
                                      alignItems: 'center'
                                    }}>
                                      <span style={{ 
                                        fontSize: '13px', 
                                        fontWeight: '500', 
                                        color: 'var(--shopify-text-primary)'
                                      }}>
                                        {benchmark.metric}
                                      </span>
                                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                        <span style={{ fontSize: '13px', color: 'var(--shopify-text-secondary)' }}>
                                          You: <span style={{ fontWeight: '600', color: 'var(--shopify-text-primary)' }}>
                                            {benchmark.yourValue}{benchmark.unit}
                                          </span>
                                        </span>
                                        <span style={{ fontSize: '13px', color: 'var(--shopify-text-secondary)' }}>
                                          Top: <span style={{ fontWeight: '600', color: '#7256F6' }}>
                                            {benchmark.topTier}{benchmark.unit}
                                          </span>
                                        </span>
                                      </div>
                                    </div>
                                    <div style={{ 
                                      position: 'relative', 
                                      height: '12px', 
                                      backgroundColor: '#f6f6f7', 
                                      borderRadius: '6px', 
                                      overflow: 'hidden'
                                    }}>
                                      <div 
                                        style={{ 
                                          position: 'absolute',
                                          height: '100%',
                                          background: 'linear-gradient(to right, #9ca3af, #6b7280)',
                                          borderRadius: '6px',
                                          transition: 'width 0.5s',
                                          width: `${percentage}%`
                                        }}
                                      />
                                      <div 
                                        style={{ 
                                          position: 'absolute',
                                          height: '100%',
                                          background: 'linear-gradient(to right, #0f62fe, #00539a)',
                                          borderRadius: '6px',
                                          opacity: 0.3,
                                          width: '100%'
                                        }}
                                      />
                                    </div>
                                    <div style={{ 
                                      display: 'flex', 
                                      justifyContent: 'space-between', 
                                      alignItems: 'center'
                                    }}>
                                      <span style={{ 
                                        fontSize: '12px', 
                                        color: 'var(--shopify-text-secondary)'
                                      }}>
                                        {percentage.toFixed(0)}% of top-tier performance
                                      </span>
                                      <span style={{ 
                                        fontSize: '12px', 
                                        fontWeight: '500', 
                                        color: '#f49342'
                                      }}>
                                        Gap: {gap.toFixed(1)}{benchmark.unit}
                                      </span>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </Column>
                        <Column lg={6} md={4} sm={2}>
                          <div className="shopify-card">
                            <h3 style={{ 
                              fontSize: '16px', 
                              fontWeight: '600', 
                              marginBottom: '8px',
                              color: 'var(--shopify-text-primary)'
                            }}>
                              Actionable Improvement Tips
                            </h3>
                            <p style={{ 
                              fontSize: '13px', 
                              color: 'var(--shopify-text-secondary)',
                              marginBottom: '24px'
                            }}>
                              Learn from top-tier partners and boost your performance
                            </p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                              {improvementTips.map((tip, index) => (
                                <div 
                                  key={index} 
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
                                      {tip.title}
                                    </h4>
                                    <Tag
                                      type={tip.impact === 'High' ? 'red' : 'warm-gray'}
                                      size="sm"
                                    >
                                      {tip.impact} Impact
                                    </Tag>
                                  </div>
                                  <p style={{ 
                                    fontSize: '13px', 
                                    color: 'var(--shopify-text-secondary)',
                                    marginBottom: '8px',
                                    margin: 0
                                  }}>
                                    {tip.description}
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
                                      {tip.potentialGain}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </Column>
                      </Grid>

                      <div 
                        className="shopify-card"
                        style={{ 
                          marginTop: '24px',
                          background: 'linear-gradient(135deg, #1f2937 0%, #374151 100%)',
                          color: 'white',
                          border: 'none'
                        }}
                      >
                        <div style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '8px',
                          marginBottom: '8px'
                        }}>
                          <Analytics size={20} />
                          <h3 style={{ 
                            fontSize: '16px', 
                            fontWeight: '600',
                            margin: 0
                          }}>
                            Unlock Premium Insights
                          </h3>
                        </div>
                        <p style={{ 
                          fontSize: '13px', 
                          color: 'rgba(255,255,255,0.7)',
                          marginBottom: '24px'
                        }}>
                          Get personalized recommendations and advanced analytics
                        </p>
                        <Grid narrow style={{ marginBottom: '24px' }}>
                          <Column lg={4} md={2} sm={1}>
                            <div style={{ 
                              backgroundColor: 'rgba(255,255,255,0.1)', 
                              backdropFilter: 'blur(10px)',
                              padding: '24px',
                              borderRadius: '6px'
                            }}>
                              <div style={{ fontSize: '20px', fontWeight: '600', marginBottom: '4px' }}>
                                AI-Powered
                              </div>
                              <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)' }}>
                                Campaign optimization suggestions
                              </div>
                            </div>
                          </Column>
                          <Column lg={4} md={2} sm={1}>
                            <div style={{ 
                              backgroundColor: 'rgba(255,255,255,0.1)', 
                              backdropFilter: 'blur(10px)',
                              padding: '24px',
                              borderRadius: '6px'
                            }}>
                              <div style={{ fontSize: '20px', fontWeight: '600', marginBottom: '4px' }}>
                                Real-Time
                              </div>
                              <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)' }}>
                                Competitor benchmarking
                              </div>
                            </div>
                          </Column>
                          <Column lg={4} md={2} sm={1}>
                            <div style={{ 
                              backgroundColor: 'rgba(255,255,255,0.1)', 
                              backdropFilter: 'blur(10px)',
                              padding: '24px',
                              borderRadius: '6px'
                            }}>
                              <div style={{ fontSize: '20px', fontWeight: '600', marginBottom: '4px' }}>
                                Advanced
                              </div>
                              <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)' }}>
                                Predictive analytics & insights
                              </div>
                            </div>
                          </Column>
                        </Grid>
                        <Button
                          kind="primary"
                          size="lg"
                          style={{
                            width: '100%',
                            backgroundColor: 'white',
                            color: '#1f2937',
                            fontWeight: '600'
                          }}
                        >
                          Upgrade to Premium
                        </Button>
                      </div>
                    </div>
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default PartnerPerformanceDashboard;
