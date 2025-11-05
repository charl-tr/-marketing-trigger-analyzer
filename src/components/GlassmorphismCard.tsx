'use client';

import React from 'react';

interface GlassmorphismCardProps {
  children: React.ReactNode;
  className?: string;
  intensity?: 'light' | 'medium' | 'strong';
  glow?: boolean;
  onClick?: () => void;
}

export default function GlassmorphismCard({ 
  children, 
  className = '', 
  intensity = 'medium',
  glow = false,
  onClick 
}: GlassmorphismCardProps) {
  const intensityStyles = {
    light: {
      background: 'rgba(255, 255, 255, 0.15)',
      backdrop: 'blur(8px)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
    },
    medium: {
      background: 'rgba(255, 255, 255, 0.25)',
      backdrop: 'blur(12px)',
      border: '1px solid rgba(255, 255, 255, 0.18)',
    },
    strong: {
      background: 'rgba(255, 255, 255, 0.35)',
      backdrop: 'blur(16px)',
      border: '1px solid rgba(255, 255, 255, 0.25)',
    }
  };

  const style = intensityStyles[intensity];

  return (
    <div
      className={`
        rounded-2xl transition-all duration-300 hover:scale-105
        ${glow ? 'animate-glow-pulse' : ''}
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
      style={{
        background: style.background,
        backdropFilter: style.backdrop,
        border: style.border,
        boxShadow: glow ? '0 0 30px rgba(0, 87, 167, 0.4)' : '0 8px 32px rgba(0, 0, 0, 0.1)',
      }}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
