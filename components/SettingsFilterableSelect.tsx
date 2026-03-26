'use client';

import React, { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import { TextInput } from '@carbon/react';
import { ChevronDown, Checkmark } from '@carbon/icons-react';
import { cn } from '@/lib/utils';

export type SettingsFilterableSelectItem = { readonly value: string; readonly label: string };

type Props = {
  id: string;
  titleText: string;
  placeholder: string;
  items: readonly SettingsFilterableSelectItem[];
  selectedItem: SettingsFilterableSelectItem | null | undefined;
  onSelect: (item: SettingsFilterableSelectItem) => void;
  itemToString?: (item: SettingsFilterableSelectItem) => string;
  itemToElement?: (item: SettingsFilterableSelectItem) => React.ReactNode;
  /** Return true if `item` should be shown for the current search query (lowercase). */
  filterItem?: (item: SettingsFilterableSelectItem, queryLower: string) => boolean;
  size?: 'sm' | 'md' | 'lg';
};

export function SettingsFilterableSelect({
  id,
  titleText,
  placeholder,
  items,
  selectedItem,
  onSelect,
  itemToString = (i) => i.label,
  itemToElement,
  filterItem,
  size = 'md',
}: Props) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const labelId = useId();

  const filteredItems = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [...items];
    return items.filter((item) =>
      filterItem ? filterItem(item, q) : itemToString(item).toLowerCase().includes(q)
    );
  }, [items, query, filterItem, itemToString]);

  const close = useCallback(() => {
    setOpen(false);
    setQuery('');
  }, []);

  useEffect(() => {
    if (!open) return;
    const onDocMouseDown = (e: MouseEvent) => {
      if (containerRef.current?.contains(e.target as Node)) return;
      close();
    };
    document.addEventListener('mousedown', onDocMouseDown);
    return () => document.removeEventListener('mousedown', onDocMouseDown);
  }, [open, close]);

  useEffect(() => {
    if (!open) return;
    const t = window.setTimeout(() => {
      document.getElementById(`${id}-search`)?.focus();
    }, 0);
    return () => window.clearTimeout(t);
  }, [open, id]);

  const displayLabel = selectedItem ? itemToString(selectedItem) : placeholder;

  return (
    <div
      ref={containerRef}
      className={cn('cds--dropdown__wrapper', 'cds--list-box__wrapper')}
      style={{ position: 'relative', width: '100%' }}
    >
      <label id={labelId} htmlFor={`${id}-trigger`} className="cds--label">
        {titleText}
      </label>
      <div
        className={cn(
          'cds--dropdown',
          'cds--list-box',
          `cds--dropdown--${size}`,
          `cds--list-box--${size}`,
          open && 'cds--dropdown--open',
          open && 'cds--list-box--expanded'
        )}
      >
        <button
          type="button"
          id={`${id}-trigger`}
          className="cds--list-box__field"
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-labelledby={labelId}
          onClick={() => {
            setOpen((o) => !o);
            if (open) setQuery('');
          }}
          onKeyDown={(e) => {
            if (e.key === 'Escape' && open) {
              e.preventDefault();
              close();
            }
          }}
        >
          <span
            className="cds--list-box__label"
            style={!selectedItem ? { color: 'var(--cds-text-placeholder, #6f6f6f)' } : undefined}
          >
            {displayLabel}
          </span>
          <div
            className={cn('cds--list-box__menu-icon', open && 'cds--list-box__menu-icon--open')}
          >
            <ChevronDown aria-label={open ? 'Close menu' : 'Open menu'}>
              <title>{open ? 'Close menu' : 'Open menu'}</title>
            </ChevronDown>
          </div>
        </button>

        {open && (
          <div
            className="cds--layer-two"
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: '100%',
              marginTop: 2,
              zIndex: 9100,
              boxShadow: '0 4px 8px rgba(0,0,0,0.12)',
              border: '1px solid var(--cds-border-subtle)',
              backgroundColor: 'var(--cds-layer)',
              maxHeight: 320,
              display: 'flex',
              flexDirection: 'column',
            }}
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                e.stopPropagation();
                close();
              }
            }}
          >
            <div
              className="settings-filterable-select__search"
              style={{
                borderBottom: '1px solid var(--cds-border-subtle)',
                flexShrink: 0,
              }}
              onMouseDown={(e) => e.stopPropagation()}
            >
              <TextInput
                id={`${id}-search`}
                labelText="Search"
                hideLabel
                placeholder="Search…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                size={size}
              />
            </div>
            <ul
              className="cds--list-box__menu"
              role="listbox"
              aria-label={titleText}
              style={{
                position: 'relative',
                maxHeight: 240,
                overflowY: 'auto',
                flex: 1,
                margin: 0,
                padding: 0,
              }}
            >
              {filteredItems.length === 0 ? (
                <li className="cds--list-box__menu-item" role="presentation">
                  <div className="cds--list-box__menu-item__option" style={{ color: 'var(--cds-text-secondary)' }}>
                    No results
                  </div>
                </li>
              ) : (
                filteredItems.map((item) => {
                  const active = selectedItem?.value === item.value;
                  return (
                    <li
                      key={item.value}
                      role="option"
                      aria-selected={active}
                      className={cn(
                        'cds--list-box__menu-item',
                        active && 'cds--list-box__menu-item--active'
                      )}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        onSelect(item);
                        close();
                      }}
                    >
                      <div
                        className="cds--list-box__menu-item__option"
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '8px',
                        }}
                      >
                        <span style={{ flex: 1, minWidth: 0 }}>
                          {itemToElement ? itemToElement(item) : itemToString(item)}
                        </span>
                        {active && (
                          <Checkmark className="cds--list-box__menu-item__selected-icon" aria-hidden />
                        )}
                      </div>
                    </li>
                  );
                })
              )}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
