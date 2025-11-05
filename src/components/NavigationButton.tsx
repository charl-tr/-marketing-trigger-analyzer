'use client';

import React from 'react';
import { LucideIcon } from 'lucide-react';

interface NavigationButtonProps {
  onClick: () => void;
  icon: LucideIcon;
  label: string;
  shortLabel: string;
  variant: 'pharaoh' | 'gold';
  className?: string;
}

export default function NavigationButton({ 
  onClick, 
  icon: Icon, 
  label, 
  shortLabel, 
  variant, 
  className = '' 
}: NavigationButtonProps) {
  const colors = {
    pharaoh: {
      border: 'rgba(0, 87, 167, 0.2)',
      shadow: 'rgba(0, 87, 167, 0.1)',
      iconBg: 'bg-accent-pharaoh/10',
      iconHover: 'group-hover:bg-accent-pharaoh/20',
      iconColor: 'text-accent-pharaoh',
    },
    gold: {
      border: 'rgba(198, 166, 100, 0.2)',
      shadow: 'rgba(198, 166, 100, 0.1)',
      iconBg: 'bg-accent-gold/10',
      iconHover: 'group-hover:bg-accent-gold/20',
      iconColor: 'text-accent-gold',
    }
  };

  const currentColors = colors[variant];

  return (
    <div 
      className={`group relative ${className}`}
      style={{
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(20px)',
        borderRadius: '16px',
        border: `1px solid ${currentColors.border}`,
        boxShadow: `0 8px 32px ${currentColors.shadow}`,
      }}
    >
      <button
        onClick={onClick}
        className="glass-button flex items-center gap-3 px-6 py-3 text-text-primary font-quintessential font-medium"
      >
        <div className={`w-8 h-8 ${currentColors.iconBg} rounded-full flex items-center justify-center ${currentColors.iconHover} transition-colors duration-300`}>
          <Icon className={`h-4 w-4 ${currentColors.iconColor} group-hover:scale-110 transition-transform duration-300`} />
        </div>
        <span className="hidden sm:inline">{label}</span>
        <span className="sm:hidden">{shortLabel}</span>
      </button>
    </div>
  );
}
