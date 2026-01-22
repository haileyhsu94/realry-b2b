'use client';

import React from 'react';

export interface RankedListItem {
  id: string;
  label: string;
  value: number;
  change?: string;
  trend?: 'up' | 'down';
  subLabel?: string;
}

export interface RankedListProps {
  /** Title of the list */
  title: string;
  /** Array of items to display */
  items: RankedListItem[];
  /** Total value for calculating percentages */
  total: number;
  /** Maximum height of the scrollable list (default: '400px') */
  maxHeight?: string;
  /** Format for the value display */
  valueFormat?: 'number' | 'currency' | 'percentage';
  /** Show progress bars */
  showProgressBars?: boolean;
  /** Show trend indicators */
  showTrends?: boolean;
  /** Callback when an item is clicked */
  onItemClick?: (item: RankedListItem) => void;
  /** Footer summary text */
  footerSummary?: string;
}

/**
 * Ranked List Component
 * 
 * Displays a scrollable ranked list with optional progress bars,
 * trend indicators, and click handlers. Commonly used for top
 * performers, countries, cities, products, etc.
 */
export const RankedList: React.FC<RankedListProps> = ({
  title,
  items,
  total,
  maxHeight = '400px',
  valueFormat = 'number',
  showProgressBars = true,
  showTrends = false,
  onItemClick,
  footerSummary,
}) => {
  const formatValue = (value: number): string => {
    switch (valueFormat) {
      case 'currency':
        return `$${value.toLocaleString()}`;
      case 'percentage':
        return `${value.toFixed(1)}%`;
      case 'number':
      default:
        return value.toLocaleString();
    }
  };

  const getPercentage = (value: number): number => {
    return total > 0 ? (value / total) * 100 : 0;
  };

  return (
    <div style={{ 
      backgroundColor: 'white',
      borderRadius: '8px',
      border: '1px solid #e0e0e0',
      overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{ 
        padding: '16px 20px',
        borderBottom: '1px solid #e0e0e0',
        backgroundColor: '#f9f9f9',
      }}>
        <h3 style={{ 
          fontSize: '16px',
          fontWeight: '600',
          color: '#202124',
          margin: 0,
        }}>
          {title}
        </h3>
      </div>

      {/* List */}
      <div 
        className="subtle-scrollbar"
        style={{ 
          maxHeight,
          overflowY: 'auto',
          padding: '12px 20px',
        }}
      >
        {items.map((item, index) => {
          const percentage = getPercentage(item.value);
          const isClickable = !!onItemClick;

          return (
            <div
              key={item.id}
              onClick={() => isClickable && onItemClick(item)}
              style={{
                marginBottom: index < items.length - 1 ? '16px' : '0',
                cursor: isClickable ? 'pointer' : 'default',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                if (isClickable) {
                  e.currentTarget.style.backgroundColor = '#f5f5f5';
                  e.currentTarget.style.borderRadius = '6px';
                  e.currentTarget.style.padding = '8px';
                  e.currentTarget.style.margin = '0 -8px 8px -8px';
                }
              }}
              onMouseLeave={(e) => {
                if (isClickable) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.padding = '0';
                  e.currentTarget.style.margin = index < items.length - 1 ? '0 0 16px 0' : '0';
                }
              }}
            >
              {/* Item header */}
              <div style={{ 
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: showProgressBars ? '8px' : '0',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  {/* Rank number */}
                  <span style={{
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#9aa0a6',
                    minWidth: '20px',
                  }}>
                    {index + 1}
                  </span>
                  
                  {/* Label */}
                  <div>
                    <div style={{
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#202124',
                    }}>
                      {item.label}
                    </div>
                    {item.subLabel && (
                      <div style={{
                        fontSize: '12px',
                        color: '#5f6368',
                        marginTop: '2px',
                      }}>
                        {item.subLabel}
                      </div>
                    )}
                  </div>
                </div>

                {/* Value and trend */}
                <div style={{ 
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  textAlign: 'right',
                }}>
                  <span style={{
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#202124',
                  }}>
                    {formatValue(item.value)}
                  </span>
                  
                  {showTrends && item.change && (
                    <span style={{
                      fontSize: '12px',
                      fontWeight: '500',
                      color: item.trend === 'up' ? '#16a34a' : '#dc2626',
                    }}>
                      {item.trend === 'up' ? '↑' : '↓'} {item.change}
                    </span>
                  )}
                </div>
              </div>

              {/* Progress bar */}
              {showProgressBars && (
                <div style={{
                  height: '6px',
                  backgroundColor: '#e0e0e0',
                  borderRadius: '3px',
                  overflow: 'hidden',
                  marginLeft: '32px',
                  width: 'calc(100% - 32px)',
                }}>
                  <div style={{
                    width: `${percentage}%`,
                    height: '100%',
                    backgroundColor: '#7256F6',
                    borderRadius: '3px',
                    transition: 'width 0.3s ease',
                  }} />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer summary */}
      {footerSummary && (
        <div style={{
          padding: '12px 20px',
          borderTop: '1px solid #e0e0e0',
          backgroundColor: '#f9f9f9',
          fontSize: '13px',
          color: '#5f6368',
          textAlign: 'center',
        }}>
          {footerSummary}
        </div>
      )}
    </div>
  );
};

export default RankedList;
