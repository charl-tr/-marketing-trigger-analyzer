'use client';

import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', type = 'text', ...props }, ref) => {
    return (
      <input
        type={type}
        className={`
          flex h-10 w-full rounded-md border border-accent-pyramid/30 bg-background/50 px-3 py-2 text-sm
          text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 
          focus:ring-accent-pyramid focus:border-accent-pyramid disabled:cursor-not-allowed 
          disabled:opacity-50 transition-colors
          ${className}
        `}
        ref={ref}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';