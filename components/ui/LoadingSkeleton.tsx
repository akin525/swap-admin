"use client";

import React from 'react';

interface LoadingSkeletonProps {
  type?: 'page' | 'table' | 'cards' | 'detail';
}

export default function LoadingSkeleton({ type = 'page' }: LoadingSkeletonProps) {
  if (type === 'cards') {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 md:gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-[#13131F] p-5 animate-pulse">
            <div className="flex justify-between mb-4">
              <div className="h-12 w-12 rounded-xl bg-gray-100 dark:bg-gray-800" />
              <div className="h-6 w-16 rounded-full bg-gray-100 dark:bg-gray-800" />
            </div>
            <div className="h-3 w-20 bg-gray-100 dark:bg-gray-800 rounded mb-2" />
            <div className="h-7 w-28 bg-gray-200 dark:bg-gray-700 rounded" />
          </div>
        ))}
      </div>
    );
  }

  if (type === 'table') {
    return (
      <div className="bg-white dark:bg-[#13131F] rounded-2xl border border-gray-100 dark:border-gray-800 p-6 animate-pulse space-y-4">
        <div className="h-4 w-48 bg-gray-200 dark:bg-gray-800 rounded" />
        {[...Array(6)].map((_, i) => (
          <div key={i} className="flex gap-4">
            <div className="h-4 w-16 bg-gray-100 dark:bg-gray-800/50 rounded" />
            <div className="h-4 flex-1 bg-gray-100 dark:bg-gray-800/50 rounded" />
            <div className="h-4 w-24 bg-gray-100 dark:bg-gray-800/50 rounded" />
            <div className="h-4 w-20 bg-gray-100 dark:bg-gray-800/50 rounded" />
            <div className="h-4 w-16 bg-gray-100 dark:bg-gray-800/50 rounded" />
          </div>
        ))}
      </div>
    );
  }

  if (type === 'detail') {
    return (
      <div className="animate-pulse space-y-6">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-2xl bg-gray-200 dark:bg-gray-800" />
          <div className="space-y-2">
            <div className="h-5 w-40 bg-gray-200 dark:bg-gray-800 rounded" />
            <div className="h-3 w-56 bg-gray-100 dark:bg-gray-800/50 rounded" />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-32 rounded-2xl bg-gray-100 dark:bg-gray-800" />
          ))}
        </div>
        <div className="h-64 rounded-2xl bg-gray-100 dark:bg-gray-800" />
      </div>
    );
  }

  // Default page skeleton
  return (
    <div className="animate-pulse space-y-8">
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <div className="h-8 w-48 bg-gray-200 dark:bg-gray-800 rounded" />
          <div className="h-4 w-64 bg-gray-100 dark:bg-gray-800/50 rounded" />
        </div>
        <div className="h-11 w-28 bg-gray-200 dark:bg-gray-800 rounded-xl" />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 md:gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-32 rounded-2xl bg-gray-100 dark:bg-gray-800" />
        ))}
      </div>
      <div className="h-96 rounded-2xl bg-gray-100 dark:bg-gray-800" />
    </div>
  );
}