'use client';

import React from 'react';

interface AnimatedPrismLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizeClasses = {
  sm: 'w-16 h-16',
  md: 'w-24 h-24',
  lg: 'w-32 h-32',
  xl: 'w-40 h-40',
};

const AnimatedPrismLogo: React.FC<AnimatedPrismLogoProps> = ({ size = 'md', className = '' }) => {
  return (
    <div className={`${sizeClasses[size]} ${className}`}>
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <defs>
          {/* Gradients */}
          <linearGradient id="prismGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#C6A664" />
            <stop offset="50%" stopColor="#0057A7" />
            <stop offset="100%" stopColor="#C6A664" />
          </linearGradient>
          
          <linearGradient id="rayGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="20%" stopColor="#C6A664" />
            <stop offset="40%" stopColor="#0057A7" />
            <stop offset="60%" stopColor="#C6A664" />
            <stop offset="80%" stopColor="#0057A7" />
            <stop offset="100%" stopColor="#C6A664" />
          </linearGradient>
          
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {/* Incoming white ray */}
        <line 
          x1="10" y1="50" x2="35" y2="50" 
          stroke="#FFFFFF" 
          strokeWidth="2" 
          strokeLinecap="round"
          filter="url(#glow)"
        >
          <animate 
            attributeName="opacity" 
            values="0.3;1;0.3" 
            dur="3s" 
            repeatCount="indefinite" 
          />
        </line>
        
        {/* Triangular prism */}
        <polygon 
          points="35,25 35,75 65,50" 
          fill="url(#prismGradient)" 
          stroke="#0057A7" 
          strokeWidth="1"
          filter="url(#glow)"
        />
        
        {/* Refracted spectrum rays */}
        <line 
          x1="65" y1="40" x2="90" y2="35" 
          stroke="url(#rayGradient)" 
          strokeWidth="2" 
          strokeLinecap="round"
          filter="url(#glow)"
        >
          <animate 
            attributeName="opacity" 
            values="0.2;0.8;0.2" 
            dur="3s" 
            repeatCount="indefinite" 
            begin="0.5s" 
          />
        </line>
        
        <line 
          x1="65" y1="50" x2="90" y2="50" 
          stroke="url(#rayGradient)" 
          strokeWidth="2" 
          strokeLinecap="round"
          filter="url(#glow)"
        >
          <animate 
            attributeName="opacity" 
            values="0.2;0.8;0.2" 
            dur="3s" 
            repeatCount="indefinite" 
            begin="1s" 
          />
        </line>
        
        <line 
          x1="65" y1="60" x2="90" y2="65" 
          stroke="url(#rayGradient)" 
          strokeWidth="2" 
          strokeLinecap="round"
          filter="url(#glow)"
        >
          <animate 
            attributeName="opacity" 
            values="0.2;0.8;0.2" 
            dur="3s" 
            repeatCount="indefinite" 
            begin="1.5s" 
          />
        </line>
        
        {/* Subtle inner glow */}
        <circle 
          cx="50" cy="50" r="15" 
          fill="none" 
          stroke="#0057A7" 
          strokeWidth="0.5" 
          opacity="0.3"
          filter="url(#glow)"
        >
          <animate 
            attributeName="r" 
            values="15;18;15" 
            dur="4s" 
            repeatCount="indefinite" 
          />
        </circle>
      </svg>
    </div>
  );
};

export default AnimatedPrismLogo;
