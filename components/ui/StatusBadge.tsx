"use client";

import React from 'react';
import { getStatusStyle, capitalize } from '@/lib/utils';

interface StatusBadgeProps {
  status: string;
  size?: 'sm' | 'md';
}

export default function StatusBadge({ status, size = 'sm' }: StatusBadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center rounded-lg font-bold uppercase tracking-tight
        ${size === 'sm' ? 'px-2.5 py-1 text-[10px]' : 'px-3 py-1.5 text-xs'}
        ${getStatusStyle(status)}
      `}
    >
      {capitalize(status)}
    </span>
  );
}