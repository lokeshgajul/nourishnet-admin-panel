import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const statusStyles = {
  PENDING: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  APPROVED: 'bg-green-100 text-green-800 border-green-200',
  REJECTED: 'bg-red-100 text-red-800 border-red-200',
};

export default function StatusBadge({ status }) {
  return (
    <span className={twMerge(
      'px-2.5 py-0.5 rounded-full text-xs font-medium border capitalize',
      statusStyles[status.toUpperCase()] || 'bg-gray-100 text-gray-800 border-gray-200'
    )}>
      {status}
    </span>
  );
}
