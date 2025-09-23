'use client';

import { ReactNode } from 'react';
import { componentStyles } from '@/utils/theme';

type BadgeVariant = 'success' | 'warning' | 'error' | 'info' | 'default';

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

export function Badge({ 
  children, 
  variant = 'default', 
  className = '' 
}: BadgeProps) {
  return (
    <span className={`${componentStyles.badge[variant]} ${className}`}>
      {children}
    </span>
  );
}