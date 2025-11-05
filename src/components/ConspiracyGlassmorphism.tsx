'use client';

import React, { useState, useRef, useEffect } from 'react';

interface ConspiracyGlassmorphismProps {
  children: React.ReactNode;
  className?: string;
  intensity?: 'light' | 'medium' | 'strong';
  conspiracy?: boolean;
  onClick?: () => void;
}

export default function ConspiracyGlassmorphism({ 
  children, 
  className = '', 
  intensity = 'medium',
  conspiracy = false,
  onClick 
}: ConspiracyGlassmorphismProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const intensityStyles = {
    light: {
      background: 'rgba(255, 255, 255, 0.05)',
      backdrop: 'blur(8px)',
      border: '1px solid rgba(212, 175, 55, 0.1)',
    },
    medium: {
      background: 'rgba(255, 255, 255, 0.08)',
      backdrop: 'blur(12px)',
      border: '1px solid rgba(212, 175, 55, 0.2)',
    },
    strong: {
      background: 'rgba(255, 255, 255, 0.12)',
      backdrop: 'blur(16px)',
      border: '1px solid rgba(212, 175, 55, 0.3)',
    }
  };

  const style = intensityStyles[intensity];

  const handleMouseMove = (e: React.MouseEvent) => {
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      setMousePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    }
  };

  return (
    <div
      ref={cardRef}
      className={`
        relative rounded-2xl transition-all duration-300 hover:scale-105 cursor-pointer
        ${conspiracy ? 'animate-mystical-glow' : ''}
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
      style={{
        background: style.background,
        backdropFilter: style.backdrop,
        border: style.border,
        boxShadow: conspiracy 
          ? '0 0 30px rgba(212, 175, 55, 0.3), 0 8px 32px rgba(0, 0, 0, 0.3)' 
          : '0 8px 32px rgba(0, 0, 0, 0.2)',
      }}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
      
      {/* Effet loupe conspirationniste */}
      {isHovered && (
        <div
          className="absolute pointer-events-none z-50 rounded-full border-2 border-accent-pyramid/50"
          style={{
            left: mousePosition.x - 50,
            top: mousePosition.y - 50,
            width: 100,
            height: 100,
            background: 'radial-gradient(circle, rgba(212, 175, 55, 0.1) 0%, transparent 70%)',
            backdropFilter: 'blur(2px)',
            boxShadow: '0 0 20px rgba(212, 175, 55, 0.5)',
            animation: 'mystical-glow 2s ease-in-out infinite'
          }}
        />
      )}
      
      {/* Effet de lueur conspirationniste */}
      {conspiracy && (
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-accent-pyramid/5 via-accent-pharaoh/5 to-accent-conspiracy/5 animate-mystical-glow" />
      )}
    </div>
  );
}
