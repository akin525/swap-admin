"use client";

import React from 'react';
import { ChevronLeft, ChevronRight, Inbox } from 'lucide-react';

interface Column<T> {
  key: string;
  label: string;
  render?: (item: T, index: number) => React.ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  currentPage?: number;
  totalPages?: number;
  total?: number;
  onPageChange?: (page: number) => void;
  onRowClick?: (item: T) => void;
  isLoading?: boolean;
  emptyMessage?: string;
  emptyDescription?: string;
}

export default function DataTable<T extends Record<string, any>>({
  columns,
  data,
  currentPage = 1,
  totalPages = 1,
  total,
  onPageChange,
  onRowClick,
  isLoading = false,
  emptyMessage = 'No records found.',
  emptyDescription = 'Data will appear here when available.',
}: DataTableProps<T>) {

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-[#13131F] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
        <div className="animate-pulse p-6 space-y-4">
          <div className="h-4 w-48 bg-gray-200 dark:bg-gray-800 rounded" />
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex gap-4">
              {columns.map((_, j) => (
                <div key={j} className="h-4 flex-1 bg-gray-100 dark:bg-gray-800/50 rounded" />
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-[#13131F] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left min-w-[700px] border-separate border-spacing-0">
          <thead className="bg-gray-50/50 dark:bg-white/5 text-gray-400 dark:text-gray-500 text-[10px] uppercase font-bold tracking-widest">
            <tr>
              {columns.map((col) => (
                <th key={col.key} className={`px-6 py-4 border-b border-gray-50 dark:border-gray-800 ${col.className || ''}`}>
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 dark:divide-gray-800/50">
            {data.length > 0 ? (
              data.map((item, index) => (
                <tr
                  key={index}
                  onClick={() => onRowClick?.(item)}
                  className={`group hover:bg-gray-50/80 dark:hover:bg-white/[0.02] transition-colors ${onRowClick ? 'cursor-pointer' : ''}`}
                >
                  {columns.map((col) => (
                    <td key={col.key} className={`px-6 py-4 ${col.className || ''}`}>
                      {col.render
                        ? col.render(item, index)
                        : <span className="text-sm text-gray-700 dark:text-gray-300">{item[col.key] ?? '—'}</span>
                      }
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="px-6 py-16 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 dark:bg-gray-800">
                      <Inbox size={24} className="text-gray-400 dark:text-gray-600" />
                    </div>
                    <p className="text-sm font-medium text-gray-400">{emptyMessage}</p>
                    <p className="text-xs text-gray-300 dark:text-gray-600">{emptyDescription}</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-50 dark:border-gray-800 bg-gray-50/30 dark:bg-white/5">
          <p className="text-xs text-gray-400">
            Page {currentPage} of {totalPages}
            {total !== undefined && <span className="ml-1">({total.toLocaleString()} total)</span>}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onPageChange?.(currentPage - 1)}
              disabled={currentPage <= 1}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft size={14} />
              Prev
            </button>
            <button
              onClick={() => onPageChange?.(currentPage + 1)}
              disabled={currentPage >= totalPages}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              Next
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}