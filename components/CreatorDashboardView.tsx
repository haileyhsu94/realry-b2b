'use client';

/**
 * Creator dashboard layout inspired by partner.stylmatch.com/creator-dashboard.
 * Embedded (Dashboard → Creators): exclude-cancelled is in the main toolbar Filter dropdown (Shopify-style button).
 * Full (sidebar Creator Performance): same title row as main Dashboard (period select + exclude toggle).
 * Both: Performance Overview, Influencer Ranking, Top-Tier Shop Performance (benchmark cards + comparison table).
 */

import React, { useEffect, useId, useMemo, useRef, useState } from 'react';
import {
  Column,
  Grid,
  Layer,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Tag,
} from '@carbon/react';
import {
  Analytics,
  ChartLineSmooth,
  Currency,
  Filter,
  Lightning,
  ShoppingCart,
  Trophy,
  UserMultiple,
} from '@carbon/icons-react';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import {
  mockCreatorDashboardOverview,
  mockTopTierShopPerformance,
  mockWebsitePerformance,
} from '@/lib/mockData';

const TIMEFRAMES = [7, 30, 60, 90] as const;

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

export type CreatorDashboardViewProps = {
  variant?: 'full' | 'embedded';
  currency?: string;
  /**
   * Embedded: parent (dashboard header) owns exclude-cancelled; pass both for controlled mode.
   * Full: pass from parent so it matches Dashboard → Creators Filter (shared state in PartnerPerformanceDashboard).
   */
  excludeCancelled?: boolean;
  onExcludeCancelledChange?: (value: boolean) => void;
};

function formatMoney(value: number, currency: string) {
  try {
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency,
      minimumFractionDigits: currency === 'KRW' ? 0 : 2,
      maximumFractionDigits: currency === 'KRW' ? 0 : 2,
    }).format(value);
  } catch {
    return `$${value.toLocaleString()}`;
  }
}

const KPI_ACCENTS: Array<{
  key: keyof typeof mockCreatorDashboardOverview.summary;
  label: string;
  sublabel: string;
  borderHover: string;
  iconBg: string;
  iconColor: string;
  Icon: typeof Currency;
  format: 'money' | 'int' | 'percent';
}> = [
  {
    key: 'revenue',
    label: 'Revenue',
    sublabel: 'Net Sales',
    borderHover: '#10b981',
    iconBg: 'rgba(16, 185, 129, 0.1)',
    iconColor: '#059669',
    Icon: Currency,
    format: 'money',
  },
  {
    key: 'rpc',
    label: 'RPC',
    sublabel: 'Revenue Producing Creators',
    borderHover: '#f43f5e',
    iconBg: 'rgba(244, 63, 94, 0.1)',
    iconColor: '#e11d48',
    Icon: UserMultiple,
    format: 'int',
  },
  {
    key: 'clicks',
    label: 'Clicks',
    sublabel: 'Traffic Intensity',
    borderHover: 'var(--brand-primary)',
    iconBg: 'var(--brand-primary-light)',
    iconColor: 'var(--brand-primary)',
    Icon: Analytics,
    format: 'int',
  },
  {
    key: 'purchases',
    label: 'Purchases',
    sublabel: 'Conversion',
    borderHover: '#a855f7',
    iconBg: 'rgba(168, 85, 247, 0.12)',
    iconColor: '#9333ea',
    Icon: ShoppingCart,
    format: 'int',
  },
  {
    key: 'conversionRate',
    label: 'Conversion',
    sublabel: 'Efficiency',
    borderHover: '#d97706',
    iconBg: 'rgba(245, 158, 11, 0.15)',
    iconColor: '#d97706',
    Icon: ChartLineSmooth,
    format: 'percent',
  },
  {
    key: 'epc',
    label: 'Click Value',
    sublabel: 'Value per Click',
    borderHover: '#2563eb',
    iconBg: 'rgba(37, 99, 235, 0.1)',
    iconColor: '#2563eb',
    Icon: Lightning,
    format: 'money',
  },
];

export function CreatorDashboardView({
  variant = 'full',
  currency = 'USD',
  excludeCancelled: excludeCancelledProp,
  onExcludeCancelledChange,
}: CreatorDashboardViewProps) {
  const data = mockCreatorDashboardOverview;
  const chartGradientId = useId().replace(/:/g, '');
  const [internalExclude, setInternalExclude] = useState(false);
  const controlled = onExcludeCancelledChange !== undefined;
  const excludeCancelled = controlled ? !!excludeCancelledProp : internalExclude;
  const setExcludeCancelled = controlled ? onExcludeCancelledChange! : setInternalExclude;

  const [days, setDays] = useState<(typeof TIMEFRAMES)[number]>(7);

  const fullFilterMenuRef = useRef<HTMLDivElement>(null);
  const [fullFilterMenuOpen, setFullFilterMenuOpen] = useState(false);
  const fullFilterSelectedCount = excludeCancelled ? 1 : 0;

  useEffect(() => {
    if (variant !== 'full' || !fullFilterMenuOpen) return;
    const handleMouseDown = (event: MouseEvent) => {
      const el = fullFilterMenuRef.current;
      if (el && !(el as unknown as { contains(n: EventTarget | null): boolean }).contains(event.target)) {
        setFullFilterMenuOpen(false);
      }
    };
    const doc = (globalThis as unknown as { document?: { addEventListener(t: string, l: (e: MouseEvent) => void): void; removeEventListener(t: string, l: (e: MouseEvent) => void): void } }).document;
    doc?.addEventListener('mousedown', handleMouseDown);
    return () => doc?.removeEventListener('mousedown', handleMouseDown);
  }, [variant, fullFilterMenuOpen]);

  const summaryDisplay = useMemo(() => {
    const s = data.summary;
    const scale = excludeCancelled ? 0.92 : 1;
    return {
      revenue: s.revenue * scale,
      rpc: Math.max(1, Math.round(s.rpc * scale)),
      clicks: Math.round(s.clicks * scale),
      purchases: Math.round(s.purchases * scale),
      conversionRate: s.conversionRate,
      epc: s.epc * scale,
    };
  }, [data.summary, excludeCancelled]);

  const formatVal = (key: keyof typeof summaryDisplay, format: 'money' | 'int' | 'percent') => {
    const v = summaryDisplay[key];
    if (format === 'money') return formatMoney(v as number, currency);
    if (format === 'percent') return `${Number(v).toFixed(2)}%`;
    return Math.round(v as number).toLocaleString();
  };

  const inner = (
    <div
      style={{
        backgroundColor: variant === 'embedded' ? 'transparent' : '#f6f6f7',
        minHeight: variant === 'full' ? '100%' : undefined,
        padding: variant === 'embedded' ? '0' : 0,
        maxWidth: '100%',
      }}
    >
      {variant === 'full' && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '12px 24px',
            borderBottom: '1px solid var(--shopify-border)',
            background: 'unset',
            backgroundColor: 'var(--cds-layer-01)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <h2
              style={{
                fontSize: '24px',
                fontWeight: '600',
                color: 'var(--shopify-text-primary)',
                margin: 0,
                letterSpacing: '-0.02em',
              }}
            >
              Creator Performance
            </h2>
          </div>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
            <select
              value={days}
              onChange={(e) => setDays(Number((e.target as HTMLSelectElement).value) as (typeof TIMEFRAMES)[number])}
              style={DASHBOARD_PERIOD_SELECT_STYLE}
              {...dashboardPeriodSelectInteractionProps}
              aria-label="Time range"
            >
              {TIMEFRAMES.map((d) => (
                <option key={d} value={d}>
                  Last {d} days
                </option>
              ))}
            </select>
            <div ref={fullFilterMenuRef} style={{ position: 'relative' }}>
              <button
                type="button"
                className="shopify-time-button"
                style={{
                  padding: '8px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '14px',
                  ...(fullFilterMenuOpen
                    ? {
                        borderColor: 'var(--brand-primary)',
                        boxShadow: '0 0 0 1px rgba(114, 86, 246, 0.35)',
                      }
                    : {}),
                }}
                aria-expanded={fullFilterMenuOpen}
                aria-haspopup="true"
                aria-controls="creator-performance-full-filter-menu"
                id="creator-performance-full-filter-trigger"
                aria-label={
                  fullFilterSelectedCount > 0
                    ? `Filter, ${fullFilterSelectedCount} active`
                    : 'Filter'
                }
                onClick={() => setFullFilterMenuOpen((o) => !o)}
              >
                <Filter size={16} />
                <span>Filter</span>
                {fullFilterSelectedCount > 0 && (
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
                    {fullFilterSelectedCount}
                  </span>
                )}
              </button>
              {fullFilterMenuOpen && (
                <div
                  id="creator-performance-full-filter-menu"
                  role="menu"
                  aria-labelledby="creator-performance-full-filter-trigger"
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
                    aria-checked={excludeCancelled}
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
                      checked={excludeCancelled}
                      onChange={(e) => setExcludeCancelled(e.target.checked)}
                      style={{
                        width: 16,
                        height: 16,
                        cursor: 'pointer',
                        accentColor: 'var(--brand-primary)',
                        flexShrink: 0,
                      }}
                    />
                    <span>Exclude cancelled orders</span>
                  </label>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div
        style={{
          maxWidth: '96rem',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          gap: variant === 'full' ? '2.5rem' : '1rem',
          backgroundColor: 'transparent',
          padding: variant === 'embedded' ? '0' : variant === 'full' ? '24px 24px 0' : '24px 24px 40px',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
          }}
        >
        {/* Performance Overview — same shell as Sales dashboard PartnerPerformanceDashboard */}
        <div
          style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            border: '1px solid var(--shopify-border)',
            padding: '16px',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '12px',
              flexWrap: 'wrap',
              gap: '12px',
            }}
          >
            <div>
              <h3
                style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  color: 'var(--shopify-text-primary)',
                  marginBottom: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <Currency size={20} style={{ color: '#7256F6' }} />
                Performance Overview
              </h3>
              <p style={{ fontSize: '12px', color: 'var(--shopify-text-secondary)', margin: 0 }}>
                Monitor your key financial metrics and efficiency
              </p>
            </div>
            <Tag type="green">+12.5% vs last period</Tag>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
              gap: '12px',
            }}
          >
            {KPI_ACCENTS.map((kpi, idx) => (
              <div
                key={kpi.key}
                style={{
                  padding: '12px',
                  borderRadius: '8px',
                  height: '100%',
                  minHeight: '100px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  ...(idx === 0
                    ? { backgroundColor: '#f0edff', border: '1px solid #e0d9ff' }
                    : { backgroundColor: '#f6f6f7', border: '1px solid #e0e0e0' }),
                }}
              >
                <div style={{ fontSize: '12px', color: 'var(--shopify-text-secondary)', marginBottom: '4px' }}>
                  {kpi.label}
                </div>
                <div
                  style={{
                    fontSize: '22px',
                    fontWeight: '600',
                    color: idx === 0 ? '#7256F6' : 'var(--shopify-text-primary)',
                  }}
                >
                  {formatVal(kpi.key, kpi.format)}
                </div>
                <div style={{ fontSize: '12px', color: '#6d7175', marginTop: '4px' }}>{kpi.sublabel}</div>
              </div>
            ))}
          </div>

          {/* Revenue trend — same block as Sales Performance Overview */}
          <div style={{ marginTop: '2rem' }}>
            <div
              style={{
                fontSize: '13px',
                fontWeight: '400',
                color: 'var(--shopify-text-primary)',
                marginBottom: '12px',
              }}
            >
              Revenue Trend
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={data.revenueByDay} margin={{ top: 5, right: 10, left: 0, bottom: 25 }}>
                <defs>
                  <linearGradient id={chartGradientId} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7256F6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#7256F6" stopOpacity={0} />
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
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  }}
                  formatter={(value: number) => [formatMoney(value, currency), 'Revenue']}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#7256F6"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill={`url(#${chartGradientId})`}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Influencer ranking — same shell as Performance Overview */}
        <div
          style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            border: '1px solid var(--shopify-border)',
            padding: '16px',
          }}
        >
          <div style={{ marginBottom: '12px' }}>
            <h3
              style={{
                fontSize: '16px',
                fontWeight: '600',
                color: 'var(--shopify-text-primary)',
                marginBottom: '4px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <Trophy size={20} style={{ color: '#7256F6' }} />
              Influencer Ranking
            </h3>
            <p style={{ fontSize: '12px', color: 'var(--shopify-text-secondary)', margin: 0 }}>
              Top creators by attributed revenue
            </p>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableHeader
                    style={{
                      fontSize: '12px',
                      color: 'var(--shopify-text-secondary)',
                      fontWeight: 500,
                    }}
                  >
                    Rank
                  </TableHeader>
                  <TableHeader
                    style={{
                      fontSize: '12px',
                      color: 'var(--shopify-text-secondary)',
                      fontWeight: 500,
                    }}
                  >
                    Influencer
                  </TableHeader>
                  <TableHeader
                    style={{
                      fontSize: '12px',
                      color: 'var(--shopify-text-secondary)',
                      fontWeight: 500,
                    }}
                  >
                    Revenue
                  </TableHeader>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.influencerRanking.map((row, idx) => (
                  <TableRow key={row.id}>
                    <TableCell style={{ fontWeight: 700, color: '#94a3b8' }}>#{idx + 1}</TableCell>
                    <TableCell>
                      <Stack orientation="horizontal" gap={3} style={{ alignItems: 'center' }}>
                        <div
                          style={{
                            width: 32,
                            height: 32,
                            borderRadius: '50%',
                            background: 'rgba(248, 250, 252, 0)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            overflow: 'hidden',
                          }}
                        >
                          <UserMultiple size={16} style={{ color: '#94a3b8' }} />
                        </div>
                        <span style={{ fontWeight: 600, color: 'var(--shopify-text-primary)' }}>{row.name}</span>
                      </Stack>
                    </TableCell>
                    <TableCell style={{ fontWeight: 700, color: 'var(--brand-primary)' }}>
                      {formatMoney(row.revenue, currency)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Top-Tier Shop Performance — same block as Creator Performance overview / dashboard */}
        <div className="shopify-chart-container" style={{ marginBottom: 0 }}>
          <div style={{ marginBottom: '24px' }}>
            <h3
              style={{
                fontSize: '18px',
                fontWeight: '600',
                marginBottom: '8px',
                color: 'var(--shopify-text-primary)',
                letterSpacing: '-0.01em',
              }}
            >
              Top-Tier Shop Performance
            </h3>
            <p
              style={{
                fontSize: '14px',
                color: 'var(--shopify-text-secondary)',
                margin: 0,
                lineHeight: '1.5',
              }}
            >
              Benchmark against top performers in your category
            </p>
          </div>
          <div style={{ marginBottom: '20px' }}>
            {mockTopTierShopPerformance.map((shop, index) => (
              <div key={index} className="shopify-card" style={{ marginBottom: '24px' }}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '12px',
                  }}
                >
                  <h4 style={{ fontSize: '14px', fontWeight: '600', color: 'var(--shopify-text-primary)', margin: 0 }}>
                    {shop.shopName}
                  </h4>
                  <Tag type="green" size="sm">
                    Top Performer
                  </Tag>
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

          <div style={{ marginTop: '24px' }}>
            <h4
              style={{
                fontSize: '14px',
                fontWeight: '600',
                marginBottom: '24px',
                color: 'var(--shopify-text-primary)',
              }}
            >
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
                  <TableCell>
                    $
                    {Math.round(
                      (mockTopTierShopPerformance[0].metrics.revenue + mockTopTierShopPerformance[1].metrics.revenue) / 2
                    ).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    $
                    {(
                      Math.round(
                        (mockTopTierShopPerformance[0].metrics.revenue + mockTopTierShopPerformance[1].metrics.revenue) / 2
                      ) - mockWebsitePerformance.revenue
                    ).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    {(
                      (mockWebsitePerformance.revenue /
                        Math.round(
                          (mockTopTierShopPerformance[0].metrics.revenue + mockTopTierShopPerformance[1].metrics.revenue) / 2
                        )) *
                      100
                    ).toFixed(0)}
                    %
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>ROAS</TableCell>
                  <TableCell>{mockWebsitePerformance.roas.toFixed(1)}x</TableCell>
                  <TableCell>
                    {((mockTopTierShopPerformance[0].metrics.roas + mockTopTierShopPerformance[1].metrics.roas) / 2).toFixed(1)}x
                  </TableCell>
                  <TableCell>
                    {(
                      (mockTopTierShopPerformance[0].metrics.roas + mockTopTierShopPerformance[1].metrics.roas) / 2 -
                      mockWebsitePerformance.roas
                    ).toFixed(1)}
                    x
                  </TableCell>
                  <TableCell>
                    {(
                      (mockWebsitePerformance.roas /
                        ((mockTopTierShopPerformance[0].metrics.roas + mockTopTierShopPerformance[1].metrics.roas) / 2)) *
                      100
                    ).toFixed(0)}
                    %
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>CVR</TableCell>
                  <TableCell>{mockWebsitePerformance.funnel.cvr.toFixed(1)}%</TableCell>
                  <TableCell>
                    {((mockTopTierShopPerformance[0].metrics.funnel.cvr + mockTopTierShopPerformance[1].metrics.funnel.cvr) / 2).toFixed(1)}%
                  </TableCell>
                  <TableCell>
                    {(
                      (mockTopTierShopPerformance[0].metrics.funnel.cvr + mockTopTierShopPerformance[1].metrics.funnel.cvr) / 2 -
                      mockWebsitePerformance.funnel.cvr
                    ).toFixed(1)}
                    %
                  </TableCell>
                  <TableCell>
                    {(
                      (mockWebsitePerformance.funnel.cvr /
                        ((mockTopTierShopPerformance[0].metrics.funnel.cvr + mockTopTierShopPerformance[1].metrics.funnel.cvr) / 2)) *
                      100
                    ).toFixed(0)}
                    %
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>AOV</TableCell>
                  <TableCell>${mockWebsitePerformance.aov.toFixed(2)}</TableCell>
                  <TableCell>
                    ${((mockTopTierShopPerformance[0].metrics.aov + mockTopTierShopPerformance[1].metrics.aov) / 2).toFixed(2)}
                  </TableCell>
                  <TableCell>
                    $
                    {(
                      (mockTopTierShopPerformance[0].metrics.aov + mockTopTierShopPerformance[1].metrics.aov) / 2 -
                      mockWebsitePerformance.aov
                    ).toFixed(2)}
                  </TableCell>
                  <TableCell>
                    {(
                      (mockWebsitePerformance.aov /
                        ((mockTopTierShopPerformance[0].metrics.aov + mockTopTierShopPerformance[1].metrics.aov) / 2)) *
                      100
                    ).toFixed(0)}
                    %
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>
        </div>
      </div>
    </div>
  );

  if (variant === 'full') {
    return (
      <Layer
        level={1}
        style={{
          background: 'unset',
          backgroundColor: 'var(--cds-layer-01)',
        }}
      >
        {inner}
      </Layer>
    );
  }
  return inner;
}
