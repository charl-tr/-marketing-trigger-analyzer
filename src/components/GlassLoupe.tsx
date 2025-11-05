'use client';

import React, { useState, useRef, useEffect } from 'react';

interface GlassLoupeProps {
  children: React.ReactNode;
  className?: string;
}

export default function GlassLoupe({ children, className = '' }: GlassLoupeProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setMousePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  };

  return (
    <div
      ref={containerRef}
      className={`relative ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
    >
      {children}
      
      {/* Glass loupe effect */}
      {isHovered && (
        <div
          className="absolute pointer-events-none z-50"
          style={{
            left: mousePosition.x - 100,
            top: mousePosition.y - 100,
            width: 200,
            height: 200,
            borderRadius: '50%',
            background: `
              radial-gradient(circle at center, 
                rgba(255, 255, 255, 0.15) 0%, 
                rgba(255, 255, 255, 0.05) 40%, 
                transparent 70%
              )
            `,
            backdropFilter: 'blur(10px)',
            border: '2px solid rgba(0, 87, 167, 0.2)',
            boxShadow: `
              0 0 30px rgba(0, 87, 167, 0.1),
              inset 0 0 20px rgba(255, 255, 255, 0.1)
            `,
            transform: 'scale(1.05)',
            transition: 'all 0.2s ease-out',
          }}
        >
          {/* Inner glow */}
          <div
            className="absolute inset-2 rounded-full"
            style={{
              background: 'radial-gradient(circle at center, rgba(0, 87, 167, 0.1) 0%, transparent 70%)',
              border: '1px solid rgba(0, 87, 167, 0.15)',
            }}
          />
          
          {/* Refraction lines */}
          <div className="absolute inset-0 rounded-full overflow-hidden">
            <div
              className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-accent-pharaoh/30 to-transparent"
              style={{ transform: 'rotate(45deg) translateY(-50%)' }}
            />
            <div
              className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-accent-pharaoh/30 to-transparent"
              style={{ transform: 'rotate(-45deg) translateY(-50%)' }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
