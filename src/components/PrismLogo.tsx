'use client';

import React from 'react';

interface PrismLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'full' | 'icon' | 'text';
  className?: string;
}

export default function PrismLogo({ size = 'md', variant = 'full', className = '' }: PrismLogoProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24'
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-4xl',
    xl: 'text-6xl'
  };

  const PrismIcon = () => (
    <div className={`${sizeClasses[size]} ${className}`}>
      <svg viewBox="0 0 100 100" className="w-full h-full">
        {/* Prisme triangulaire */}
        <defs>
          <linearGradient id="prismGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#D4AF37" />
            <stop offset="50%" stopColor="#B8860B" />
            <stop offset="100%" stopColor="#FFD700" />
          </linearGradient>
          <linearGradient id="rayGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#F5F5DC" />
            <stop offset="20%" stopColor="#D4AF37" />
            <stop offset="40%" stopColor="#B8860B" />
            <stop offset="60%" stopColor="#FFD700" />
            <stop offset="80%" stopColor="#CD853F" />
            <stop offset="100%" stopColor="#8B4513" />
          </linearGradient>
          <filter id="conspiracyGlow">
            <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {/* Rayon entrant (blanc) avec animation */}
        <line x1="10" y1="50" x2="35" y2="50" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round">
          <animate attributeName="opacity" values="0.3;1;0.3" dur="3s" repeatCount="indefinite" />
        </line>
        
        {/* Prisme triangulaire conspirationniste */}
        <polygon 
          points="35,30 35,70 65,50" 
          fill="url(#prismGradient)" 
          stroke="#D4AF37" 
          strokeWidth="2"
          filter="url(#conspiracyGlow)"
        />
        
        {/* Rayons sortants (spectre) avec animation */}
        <line x1="65" y1="40" x2="90" y2="35" stroke="url(#rayGradient)" strokeWidth="2" strokeLinecap="round">
          <animate attributeName="opacity" values="0.2;0.8;0.2" dur="3s" repeatCount="indefinite" begin="0.5s" />
        </line>
        <line x1="65" y1="50" x2="90" y2="50" stroke="url(#rayGradient)" strokeWidth="2" strokeLinecap="round">
          <animate attributeName="opacity" values="0.2;0.8;0.2" dur="3s" repeatCount="indefinite" begin="1s" />
        </line>
        <line x1="65" y1="60" x2="90" y2="65" stroke="url(#rayGradient)" strokeWidth="2" strokeLinecap="round">
          <animate attributeName="opacity" values="0.2;0.8;0.2" dur="3s" repeatCount="indefinite" begin="1.5s" />
        </line>
        
        {/* Œil conspirationniste */}
        <circle cx="50" cy="50" r="8" fill="none" stroke="#D4AF37" strokeWidth="1" opacity="0.8" filter="url(#conspiracyGlow)" />
        <circle cx="50" cy="50" r="3" fill="#D4AF37" opacity="0.9" />
        <circle cx="50" cy="50" r="1" fill="#F5F5DC" opacity="1" />
      </svg>
    </div>
  );

  if (variant === 'icon') {
    return <PrismIcon />;
  }

  if (variant === 'text') {
    return (
                <div 
                  className={`${textSizes[size]} font-quintessential font-bold text-text-primary ${className}`}
                  style={{
                    background: 'linear-gradient(45deg, #8B4513, #A0522D, #D4AF37, #B8860B)',
                    backgroundSize: '200% 200%',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    animation: 'text-shimmer 3s ease-in-out infinite',
                    textShadow: '0 0 20px rgba(139, 69, 19, 0.3)'
                  }}
                >
                  Prism
                </div>
    );
  }

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <PrismIcon />
      <div className="flex flex-col">
                <div 
                  className={`${textSizes[size]} font-quintessential font-bold text-text-primary leading-none`}
                  style={{
                    background: 'linear-gradient(45deg, #8B4513, #A0522D, #D4AF37, #B8860B)',
                    backgroundSize: '200% 200%',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    animation: 'text-shimmer 3s ease-in-out infinite',
                    textShadow: '0 0 20px rgba(139, 69, 19, 0.3)'
                  }}
                >
                  Prism
                </div>
        <div className={`${size === 'sm' ? 'text-xs' : size === 'md' ? 'text-sm' : 'text-base'} text-accent-pyramid font-medium tracking-wide`}>
          See the persuasion beneath words
        </div>
      </div>
    </div>
  );
}
