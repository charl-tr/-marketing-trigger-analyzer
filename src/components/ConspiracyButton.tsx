'use client';

import React from 'react';

interface ConspiracyButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'text' | 'mystical';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  disabled?: boolean;
  className?: string;
  icon?: React.ReactNode;
}

export default function ConspiracyButton({ 
  children, 
  onClick, 
  variant = 'primary', 
  size = 'md',
  disabled = false,
  className = '',
  icon
}: ConspiracyButtonProps) {
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
    xl: 'px-12 py-6 text-xl'
  };

  const variantClasses = {
    primary: `
      bg-gradient-to-r from-accent-pyramid via-accent-pharaoh to-accent-conspiracy
      text-white font-quintessential font-bold
      border-2 border-accent-pyramid/50
      shadow-lg shadow-accent-pyramid/30
      hover:shadow-xl hover:shadow-accent-pyramid/50
      hover:scale-105
      before:absolute before:inset-0 before:bg-gradient-to-r before:from-accent-pyramid/20 before:to-accent-conspiracy/20 before:opacity-0 hover:before:opacity-100
      before:transition-opacity before:duration-300
    `,
    secondary: `
      bg-surface/80 backdrop-blur-sm
      text-accent-pyramid font-quintessential font-bold
      border-2 border-accent-pyramid/30
      hover:border-accent-pyramid/60
      hover:bg-surface/90
      hover:shadow-lg hover:shadow-accent-pyramid/20
    `,
    danger: `
      bg-gradient-to-r from-red-600 via-red-700 to-red-800
      text-white font-quintessential font-bold
      border-2 border-red-500/50
      shadow-lg shadow-red-500/30
      hover:shadow-xl hover:shadow-red-500/50
      hover:scale-105
    `,
    mystical: `
      bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600
      text-white font-quintessential font-bold
      border-2 border-purple-400/50
      shadow-lg shadow-purple-400/30
      hover:shadow-xl hover:shadow-purple-400/50
      hover:scale-105
      animate-mystical-glow
    `,
    text: `
      bg-transparent
      text-text-muted font-quintessential
      hover:text-accent-pyramid
      hover:bg-surface/20
      border-none
      shadow-none
      hover:shadow-none
    `
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        relative overflow-hidden rounded-2xl
        transition-all duration-300 ease-out
        transform hover:scale-105 active:scale-95
        disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${className}
      `}
      style={{
        background: variant === 'primary' 
          ? 'linear-gradient(135deg, #D4AF37 0%, #B8860B 50%, #FFD700 100%)'
          : undefined,
        boxShadow: variant === 'primary' 
          ? '0 10px 30px rgba(212, 175, 55, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
          : undefined,
        textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
      }}
    >
      {/* Effet de brillance */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
      
      {/* Contenu du bouton */}
      <div className="relative flex items-center justify-center gap-2">
        {icon && <span className="text-current">{icon}</span>}
        <span className="relative z-10">{children}</span>
      </div>
      
      {/* Bordure animée */}
      <div className="absolute inset-0 rounded-2xl border-2 border-transparent bg-gradient-to-r from-accent-pyramid via-accent-pharaoh to-accent-conspiracy bg-clip-border opacity-0 hover:opacity-100 transition-opacity duration-300" />
    </button>
  );
}
