'use client';

import React, { useEffect, useState } from 'react';

interface GeometricElement {
  id: number;
  x: number;
  y: number;
  size: number;
  rotation: number;
  delay: number;
  duration: number;
  type: 'pyramid' | 'ray' | 'prism';
  opacity: number;
}

export default function PremiumAmbiance() {
  const [elements, setElements] = useState<GeometricElement[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    // Initialize elements only on client side to avoid hydration mismatch
    if (!isHydrated) {
      const initialElements: GeometricElement[] = Array.from({ length: 15 }).map((_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 30 + 20,
        rotation: Math.random() * 360,
        delay: Math.random() * 8,
        duration: Math.random() * 15 + 10,
        type: ['pyramid', 'ray', 'prism'][Math.floor(Math.random() * 3)] as 'pyramid' | 'ray' | 'prism',
        opacity: Math.random() * 0.03 + 0.01, // Ultra-subtle
      }));
      setElements(initialElements);
      setIsHydrated(true);
    }

    const animateElements = () => {
      setElements(prevElements =>
        prevElements.map(p => ({
          ...p,
          x: (p.x + (Math.random() - 0.5) * 0.2 + 100) % 100,
          y: (p.y + (Math.random() - 0.5) * 0.2 + 100) % 100,
          rotation: (p.rotation + 0.02) % 360,
        }))
      );
    };

    const interval = setInterval(animateElements, 200);
    return () => clearInterval(interval);
  }, [isHydrated]);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Soft sand background with subtle gradients */}
      <div 
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(circle at 25% 25%, rgba(0, 87, 167, 0.02) 0%, transparent 50%),
            radial-gradient(circle at 75% 75%, rgba(198, 166, 100, 0.015) 0%, transparent 50%),
            radial-gradient(circle at 50% 50%, rgba(0, 87, 167, 0.01) 0%, transparent 60%),
            linear-gradient(135deg, #F8F5F0 0%, #F5F2ED 100%)
          `
        }}
      />
      
      {/* Ultra-subtle geometric patterns */}
      {isHydrated && elements.map(el => (
        <div
          key={el.id}
          className="absolute"
          style={{
            left: `${el.x}vw`,
            top: `${el.y}vh`,
            opacity: el.opacity,
            filter: `blur(${el.size / 20}px)`,
            transform: `rotate(${el.rotation}deg)`,
            transition: 'all 0.3s linear',
          }}
        >
          {el.type === 'pyramid' && (
            <div
              className="w-0 h-0"
              style={{
                width: `${el.size}px`,
                height: `${el.size}px`,
                borderLeft: `${el.size / 3}px solid transparent`,
                borderRight: `${el.size / 3}px solid transparent`,
                borderBottom: `${el.size}px solid #0057A7`,
                transform: 'rotate(45deg)',
              }}
            />
          )}
          {el.type === 'ray' && (
            <div
              className="w-0 h-0"
              style={{
                width: `${el.size}px`,
                height: `${el.size / 8}px`,
                background: `linear-gradient(90deg, transparent 0%, #C6A664 50%, transparent 100%)`,
                transform: `rotate(${el.rotation}deg)`,
              }}
            />
          )}
          {el.type === 'prism' && (
            <div
              className="w-0 h-0"
              style={{
                width: `${el.size}px`,
                height: `${el.size}px`,
                background: `linear-gradient(45deg, #0057A7 0%, #C6A664 50%, #0057A7 100%)`,
                clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
              }}
            />
          )}
        </div>
      ))}

      {/* Subtle glow effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent-pharaoh rounded-full mix-blend-multiply filter blur-3xl opacity-5 animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-accent-gold rounded-full mix-blend-multiply filter blur-3xl opacity-5 animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-accent-pharaoh rounded-full mix-blend-multiply filter blur-3xl opacity-3 animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>
    </div>
  );
}
