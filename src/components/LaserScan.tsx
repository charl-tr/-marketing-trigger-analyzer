'use client';

import React, { useEffect, useState } from 'react';

interface LaserScanProps {
  isActive: boolean;
  onComplete?: () => void;
  className?: string;
}

export default function LaserScan({ isActive, onComplete, className = '' }: LaserScanProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isActive) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        onComplete?.();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isActive, onComplete]);

  if (!isVisible) return null;

  return (
    <div className={`absolute inset-0 pointer-events-none ${className}`}>
      {/* Laser beam */}
      <div
        className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-accent-pharaoh to-transparent opacity-80"
        style={{
          animation: 'laser-scan 2s ease-in-out',
          boxShadow: '0 0 20px #0057A7, 0 0 40px #0057A7',
        }}
      />
      
      {/* Scanning light effect */}
      <div
        className="absolute top-0 left-0 w-32 h-full bg-gradient-to-r from-transparent via-accent-pharaoh/20 to-transparent"
        style={{
          animation: 'laser-scan 2s ease-in-out',
        }}
      />
      
      {/* Glow particles */}
      <div className="absolute inset-0">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-accent-pharaoh rounded-full opacity-60"
            style={{
              top: '50%',
              left: `${i * 20}%`,
              transform: 'translateY(-50%)',
              animation: `laser-scan 2s ease-in-out ${i * 0.1}s`,
              boxShadow: '0 0 10px #0057A7',
            }}
          />
        ))}
      </div>
    </div>
  );
}