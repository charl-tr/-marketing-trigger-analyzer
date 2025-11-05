'use client';

import React from 'react';

interface PremiumButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  disabled?: boolean;
  className?: string;
  icon?: React.ReactNode;
}

export default function PremiumButton({ 
  children, 
  onClick, 
  variant = 'primary', 
  size = 'md',
  disabled = false,
  className = '',
  icon
}: PremiumButtonProps) {
  const sizeClasses = {
    sm: 'px-6 py-3 text-sm',
    md: 'px-8 py-4 text-base',
    lg: 'px-10 py-5 text-lg',
    xl: 'px-12 py-6 text-xl'
  };

  const variantClasses = {
    primary: `
      bg-gradient-to-r from-accent-gold via-accent-pharaoh to-accent-gold
      text-white font-quintessential font-bold
      shadow-lg shadow-accent-pharaoh/30
      hover:shadow-xl hover:shadow-accent-pharaoh/50
      hover:scale-105
      before:absolute before:inset-0 before:bg-gradient-to-r before:from-white/20 before:to-transparent before:opacity-0 hover:before:opacity-100
      before:transition-opacity before:duration-500
      after:absolute after:inset-0 after:bg-gradient-to-r after:from-transparent after:via-white/10 after:to-transparent after:translate-x-[-100%] hover:after:translate-x-[100%]
      after:transition-transform after:duration-1000
    `,
    secondary: `
      bg-gradient-to-r from-accent-pharaoh to-accent-gold
      text-white font-quintessential font-bold
      shadow-lg shadow-accent-pharaoh/30
      hover:shadow-xl hover:shadow-accent-pharaoh/50
      hover:scale-105
    `,
    outline: `
      bg-glass backdrop-blur-md
      text-accent-pharaoh font-quintessential font-bold
      border-2 border-accent-pharaoh/30
      hover:border-accent-pharaoh/60
      hover:bg-glass/80
      hover:shadow-lg hover:shadow-accent-pharaoh/20
      hover:scale-105
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
          ? 'linear-gradient(135deg, #C6A664 0%, #0057A7 50%, #C6A664 100%)'
          : variant === 'secondary'
          ? 'linear-gradient(135deg, #0057A7 0%, #C6A664 100%)'
          : undefined,
        boxShadow: variant === 'primary' 
          ? '0 10px 30px rgba(0, 87, 167, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
          : variant === 'secondary'
          ? '0 10px 30px rgba(0, 87, 167, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
          : undefined,
      }}
    >
      {/* Animated sheen effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
      
      {/* Content */}
      <div className="relative flex items-center justify-center gap-3">
        {icon && <span className="text-current">{icon}</span>}
        <span className="relative z-10">{children}</span>
      </div>
    </button>
  );
}
