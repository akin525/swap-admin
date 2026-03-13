"use client";

import React from 'react';
import { Search, Filter, ChevronDown, X } from 'lucide-react';

interface FilterOption {
  label: string;
  value: string;
}

interface SearchFilterProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  filters?: {
    key: string;
    label: string;
    options: FilterOption[];
    value: string;
    onChange: (value: string) => void;
  }[];
  onClear?: () => void;
}

export default function SearchFilter({
  searchValue,
  onSearchChange,
  searchPlaceholder = 'Search...',
  filters = [],
  onClear,
}: SearchFilterProps) {
  const hasActiveFilters = filters.some(f => f.value !== '') || searchValue !== '';

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
      {/* Search Input */}
      <div className="relative flex-1 max-w-md">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={searchPlaceholder}
          className="w-full h-11 pl-11 pr-4 rounded-xl border border-gray-200 bg-white dark:bg-[#13131F] dark:border-gray-800 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:border-[#7C5CFF] focus:ring-1 focus:ring-[#7C5CFF] outline-none transition-all"
        />
      </div>

      {/* Filter Dropdowns */}
      <div className="flex items-center gap-3 flex-wrap">
        {filters.map((filter) => (
          <div key={filter.key} className="relative group">
            <button className="inline-flex h-11 items-center gap-2 rounded-xl border border-gray-200 bg-white dark:bg-[#13131F] dark:border-gray-800 px-4 text-sm font-medium text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-700 transition-all">
              <Filter size={14} className="text-gray-400" />
              <span>{filter.value ? filter.options.find(o => o.value === filter.value)?.label || filter.label : filter.label}</span>
              <ChevronDown size={14} className="text-gray-400" />
            </button>
            <div className="absolute right-0 top-full z-50 mt-2 w-44 hidden group-hover:block bg-white dark:bg-[#13131F] border border-gray-100 dark:border-gray-800 rounded-xl shadow-xl overflow-hidden">
              <button
                onClick={() => filter.onChange('')}
                className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 dark:hover:bg-white/5 transition-colors ${!filter.value ? 'text-[#7C5CFF] font-bold' : 'text-gray-600 dark:text-gray-400'}`}
              >
                All {filter.label}
              </button>
              {filter.options.map((option) => (
                <button
                  key={option.value}
                  onClick={() => filter.onChange(option.value)}
                  className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 dark:hover:bg-white/5 transition-colors ${filter.value === option.value ? 'text-[#7C5CFF] font-bold' : 'text-gray-600 dark:text-gray-400'}`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        ))}

        {/* Clear Filters */}
        {hasActiveFilters && onClear && (
          <button
            onClick={onClear}
            className="inline-flex h-11 items-center gap-1.5 rounded-xl px-3 text-xs font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all"
          >
            <X size={14} />
            Clear
          </button>
        )}
      </div>
    </div>
  );
}