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
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import {
  mockCreatorDashboardOverview,
  mockTopTierShopPerformance,
  mockWebsitePerformance,
} from '@/lib/mockData';
import { SETTINGS_I18N, type SupportedLocale } from '@/lib/i18n/settings';

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
  locale?: SupportedLocale;
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
  locale = 'en',
  excludeCancelled: excludeCancelledProp,
  onExcludeCancelledChange,
}: CreatorDashboardViewProps) {
  const data = mockCreatorDashboardOverview;
  const copy = SETTINGS_I18N[locale];
  const creatorKpiLabelByKey: Partial<Record<keyof typeof mockCreatorDashboardOverview.summary, string>> = {
    revenue: copy.metricTotalRevenue,
    rpc: 'RPC',
    clicks: copy.metricClicks,
    purchases: copy.creatorKpiPurchasesLabel,
    conversionRate: copy.creatorKpiConversionLabel,
    epc: copy.creatorKpiClickValueLabel,
  };
  const creatorKpiSubLabelByKey: Partial<Record<keyof typeof mockCreatorDashboardOverview.summary, string>> = {
    revenue: copy.creatorKpiRevenueSublabel,
    rpc: copy.creatorKpiRpcSublabel,
    clicks: copy.creatorKpiClicksSublabel,
    purchases: copy.creatorKpiPurchasesSublabel,
    conversionRate: copy.creatorKpiConversionSublabel,
    epc: copy.creatorKpiClickValueSublabel,
  };
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
              {copy.creatorPerformanceTitle}
            </h2>
          </div>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
            <select
              value={days}
              onChange={(e) => setDays(Number((e.target as HTMLSelectElement).value) as (typeof TIMEFRAMES)[number])}
              style={DASHBOARD_PERIOD_SELECT_STYLE}
              {...dashboardPeriodSelectInteractionProps}
              aria-label={copy.timeRangeLabel}
            >
              {TIMEFRAMES.map((d) => (
                <option key={d} value={d}>
                  {copy.creatorLastDaysTemplate.replace('{days}', String(d))}
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
                    ? `${copy.filter}, ${fullFilterSelectedCount} active`
                    : copy.filter
                }
                onClick={() => setFullFilterMenuOpen((o) => !o)}
              >
                <Filter size={16} />
                <span>{copy.filter}</span>
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
                    <span>{copy.excludeCancelledOrders}</span>
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
                {copy.performanceOverviewTitle}
              </h3>
              <p style={{ fontSize: '12px', color: 'var(--shopify-text-secondary)', margin: 0 }}>
                {copy.performanceOverviewDescription}
              </p>
            </div>
            <Tag type="green">+12.5% {copy.versusLastPeriod}</Tag>
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
                  {creatorKpiLabelByKey[kpi.key] ?? kpi.label}
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
                <div style={{ fontSize: '12px', color: '#6d7175', marginTop: '4px' }}>
                  {creatorKpiSubLabelByKey[kpi.key] ?? kpi.sublabel}
                </div>
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
              {copy.revenueTrendLabel}
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
                  formatter={(value: number) => [formatMoney(value, currency), copy.metricTotalRevenue]}
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
              {copy.influencerRankingTitle}
            </h3>
            <p style={{ fontSize: '12px', color: 'var(--shopify-text-secondary)', margin: 0 }}>
              {copy.topCreatorsByRevenue}
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
                    {copy.rankLabel}
                  </TableHeader>
                  <TableHeader
                    style={{
                      fontSize: '12px',
                      color: 'var(--shopify-text-secondary)',
                      fontWeight: 500,
                    }}
                  >
                    {copy.influencerLabel}
                  </TableHeader>
                  <TableHeader
                    style={{
                      fontSize: '12px',
                      color: 'var(--shopify-text-secondary)',
                      fontWeight: 500,
                    }}
                  >
                    {copy.metricTotalRevenue}
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
              <ChartLineSmooth size={20} style={{ color: '#8a3ffc' }} />
              {copy.topTierShopPerformanceTitle}
            </h3>
            <p style={{ fontSize: '12px', color: 'var(--shopify-text-secondary)', margin: 0 }}>
              {copy.benchmarkTopPerformers}
            </p>
          </div>
          <div>
            <Grid narrow style={{ marginBottom: 0 }}>
              {[
                {
                  label: 'CVR (%)',
                  values: [
                    { name: 'You', value: mockWebsitePerformance.funnel.cvr },
                    {
                      name: 'Average',
                      value:
                        (mockTopTierShopPerformance[0].metrics.funnel.cvr + mockTopTierShopPerformance[1].metrics.funnel.cvr) / 2,
                    },
                    {
                      name: 'Top 5%',
                      value: Math.max(
                        mockTopTierShopPerformance[0].metrics.funnel.cvr,
                        mockTopTierShopPerformance[1].metrics.funnel.cvr
                      ),
                    },
                  ],
                  format: (v: number) => `${v.toFixed(1)}%`,
                },
                {
                  label: 'AOV ($)',
                  values: [
                    { name: 'You', value: mockWebsitePerformance.aov },
                    {
                      name: 'Average',
                      value: (mockTopTierShopPerformance[0].metrics.aov + mockTopTierShopPerformance[1].metrics.aov) / 2,
                    },
                    {
                      name: 'Top 5%',
                      value: Math.max(mockTopTierShopPerformance[0].metrics.aov, mockTopTierShopPerformance[1].metrics.aov),
                    },
                  ],
                  format: (v: number) => `$${v.toFixed(0)}`,
                },
                {
                  label: 'Revenue Per Click ($)',
                  values: [
                    { name: 'You', value: mockWebsitePerformance.revenue / Math.max(1, mockWebsitePerformance.clicks) },
                    {
                      name: 'Average',
                      value:
                        ((mockTopTierShopPerformance[0].metrics.revenue / Math.max(1, mockTopTierShopPerformance[0].metrics.clicks)) +
                          (mockTopTierShopPerformance[1].metrics.revenue / Math.max(1, mockTopTierShopPerformance[1].metrics.clicks))) /
                        2,
                    },
                    {
                      name: 'Top 5%',
                      value: Math.max(
                        mockTopTierShopPerformance[0].metrics.revenue / Math.max(1, mockTopTierShopPerformance[0].metrics.clicks),
                        mockTopTierShopPerformance[1].metrics.revenue / Math.max(1, mockTopTierShopPerformance[1].metrics.clicks)
                      ),
                    },
                  ],
                  format: (v: number) => `$${v.toFixed(2)}`,
                },
                {
                  label: 'ROAS',
                  values: [
                    { name: 'You', value: mockWebsitePerformance.roas },
                    {
                      name: 'Average',
                      value: (mockTopTierShopPerformance[0].metrics.roas + mockTopTierShopPerformance[1].metrics.roas) / 2,
                    },
                    {
                      name: 'Top 5%',
                      value: Math.max(mockTopTierShopPerformance[0].metrics.roas, mockTopTierShopPerformance[1].metrics.roas),
                    },
                  ],
                  format: (v: number) => `${v.toFixed(1)}x`,
                },
              ].map((metric) => (
                <Column key={metric.label} lg={4} md={4} sm={12}>
                  <div style={{ marginBottom: 0 }}>
                    <div style={{ fontSize: '12px', fontWeight: '400', color: 'var(--shopify-text-primary)', marginBottom: '8px' }}>
                      {metric.label}
                    </div>
                    <div style={{ width: '100%', height: '180px', padding: '0 12px' }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={metric.values} margin={{ top: 5, right: 10, left: 3, bottom: 25 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e1e3e5" vertical={false} />
                          <XAxis dataKey="name" stroke="#6d7175" tick={{ fontSize: 12, fill: '#6d7175' }} />
                          <YAxis stroke="#6d7175" tick={{ fontSize: 12, fill: '#6d7175' }} width={40} />
                          <Tooltip formatter={(value: number) => [metric.format(value), metric.label]} />
                          <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                            {['#7256F6', '#8d8d8d', '#f1c21b'].map((fill, idx) => (
                              <Cell key={`${metric.label}-cell-${idx}`} fill={fill} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </Column>
              ))}
            </Grid>

            {/* Recommendations */}
            <div style={{ 
              padding: '16px', 
              backgroundColor: '#f0edff', 
              borderRadius: '8px', 
              border: '1px solid #e0d9ff',
              marginTop: '16px'
            }}>
              <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--shopify-text-primary)', marginBottom: '12px' }}>
                {copy.recommendationsTitle}
              </div>
              <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '14px', color: 'var(--shopify-text-primary)', listStyleType: 'disc' }}>
                <li style={{ marginBottom: '8px' }}>{copy.recommendationAov}</li>
                <li style={{ marginBottom: '8px' }}>{copy.recommendationCvr}</li>
                <li style={{ marginBottom: '8px' }}>{copy.recommendationReturnRate}</li>
              </ul>
            </div>
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
