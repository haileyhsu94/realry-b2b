'use client';

import React from 'react';
import { Information, ArrowUp, ArrowDown } from '@carbon/icons-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

export interface TrendDataPoint {
  date: string;
  value: number;
  revenueNew?: number;
  revenueReturning?: number;
}

export interface KPICardProps {
  /** Title of the metric */
  title: string;
  /** Main value to display */
  value: string;
  /** Change percentage or value */
  change: string;
  /** Trend direction */
  trend: 'up' | 'down';
  /** Description or time period */
  description: string;
  /** Color for the chart line */
  color?: string;
  /** Trend data for the chart */
  trendData: TrendDataPoint[];
  /** Show stacked bar chart for revenue breakdown */
  showRevenueBreakdown?: boolean;
  /** Callback when info icon is clicked */
  onInfoClick?: () => void;
}

/**
 * KPI Card Component
 * 
 * Displays a key performance indicator with a title, value, trend indicator,
 * and a chart showing historical data.
 * 
 * Can show either:
 * - Line chart for standard metrics
 * - Stacked bar chart with revenue breakdown (new vs returning users)
 */
export const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  change,
  trend,
  description,
  color = '#0f62fe',
  trendData,
  showRevenueBreakdown = false,
  onInfoClick,
}) => {
  return (
    <div className="shopify-metric-card">
      {/* Header with title, info icon, and value */}
      <div style={{ padding: '24px 24px 0 24px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
          <div className="shopify-metric-label">{title}</div>
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
            onClick={onInfoClick || (() => alert(`Information about ${title}`))}
          />
        </div>
        <div className="shopify-metric-value" style={{ marginBottom: '8px' }}>{value}</div>
        <div className={`shopify-metric-change ${trend === 'up' ? 'positive' : 'negative'}`}>
          {trend === 'up' ? (
            <ArrowUp size={16} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} />
          ) : (
            <ArrowDown size={16} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} />
          )}
          {change}
          <span style={{ marginLeft: '8px', color: 'var(--shopify-text-secondary)', fontWeight: 'normal' }}>
            {description}
          </span>
        </div>
      </div>
      
      {/* Chart - Stacked Bar Chart for Revenue, Line Chart for others */}
      <div style={{ 
        width: '100%', 
        height: '180px',
        padding: '0 12px 0 12px'
      }}>
        <ResponsiveContainer width="100%" height="100%">
          {showRevenueBreakdown ? (
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
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    const total = (data.revenueNew || 0) + (data.revenueReturning || 0);
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
                  if (title.includes('Revenue')) {
                    if (value >= 1000) return `$${(value / 1000).toFixed(0)}k`;
                    return `$${value}`;
                  }
                  if (title.includes('Rate')) return `${value.toFixed(0)}%`;
                  if (value >= 1000) return `${(value / 1000).toFixed(0)}k`;
                  return value.toString();
                }}
              />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke={color} 
                strokeWidth={2.5}
                dot={{ r: 3, fill: color, strokeWidth: 0 }}
                isAnimationActive={false}
                activeDot={{ r: 5, fill: color }}
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
                  if (title.includes('Revenue')) return `$${value.toLocaleString()}`;
                  if (title.includes('Rate')) return `${value.toFixed(1)}%`;
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

export default KPICard;
