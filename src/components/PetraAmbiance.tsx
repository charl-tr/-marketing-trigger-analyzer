'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface PetraElement {
  id: number;
  x: number;
  y: number;
  size: number;
  rotation: number;
  delay: number;
  duration: number;
  type: 'column' | 'arch' | 'hieroglyph' | 'sand';
}

const initialElements: PetraElement[] = Array.from({ length: 15 }).map((_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 40 + 20,
  rotation: Math.random() * 360,
  delay: Math.random() * 5,
  duration: Math.random() * 15 + 10,
  type: ['column', 'arch', 'hieroglyph', 'sand'][Math.floor(Math.random() * 4)] as 'column' | 'arch' | 'hieroglyph' | 'sand',
}));

export default function PetraAmbiance() {
  const [elements, setElements] = useState<PetraElement[]>(initialElements);

  useEffect(() => {
    const animateElements = () => {
      setElements(prevElements =>
        prevElements.map(el => ({
          ...el,
          x: (el.x + (Math.random() - 0.5) * 0.2 + 100) % 100,
          y: (el.y + (Math.random() - 0.5) * 0.2 + 100) % 100,
          rotation: (el.rotation + 0.05) % 360,
        }))
      );
    };

    const interval = setInterval(animateElements, 100);
    return () => clearInterval(interval);
  }, []);

  const renderElement = (element: PetraElement) => {
    const baseStyle = {
      position: 'absolute' as const,
      left: `${element.x}vw`,
      top: `${element.y}vh`,
      opacity: 0.03 + Math.random() * 0.05,
      transform: `rotate(${element.rotation}deg)`,
      transition: 'all 0.1s linear',
    };

    switch (element.type) {
      case 'column':
        return (
          <div
            key={element.id}
            className="absolute"
            style={{
              ...baseStyle,
              width: `${element.size / 3}px`,
              height: `${element.size}px`,
              background: 'linear-gradient(45deg, #8B4513, #A0522D, #CD853F)',
              borderRadius: '4px',
              boxShadow: '0 0 20px rgba(139, 69, 19, 0.3)',
            }}
          />
        );
      
      case 'arch':
        return (
          <div
            key={element.id}
            className="absolute"
            style={{
              ...baseStyle,
              width: `${element.size}px`,
              height: `${element.size / 2}px`,
              border: '3px solid #8B4513',
              borderBottom: 'none',
              borderRadius: `${element.size}px ${element.size}px 0 0`,
              background: 'transparent',
            }}
          />
        );
      
      case 'hieroglyph':
        return (
          <div
            key={element.id}
            className="absolute text-6xl"
            style={{
              ...baseStyle,
              fontSize: `${element.size}px`,
              color: '#8B4513',
              fontFamily: 'Cinzel Decorative, serif',
              textShadow: '2px 2px 4px rgba(139, 69, 19, 0.3)',
            }}
          >
            {['𓂀', '𓂁', '𓂂', '𓂃', '𓂄', '𓂅'][Math.floor(Math.random() * 6)]}
          </div>
        );
      
      case 'sand':
        return (
          <div
            key={element.id}
            className="absolute rounded-full"
            style={{
              ...baseStyle,
              width: `${element.size}px`,
              height: `${element.size}px`,
              background: 'radial-gradient(circle, #F5F1E8, #E8E0D1, #D2B48C)',
              filter: 'blur(1px)',
            }}
          />
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Fond Petra avec dégradé sable */}
      <div 
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(circle at 20% 30%, rgba(139, 69, 19, 0.08) 0%, transparent 50%),
            radial-gradient(circle at 80% 70%, rgba(160, 82, 45, 0.06) 0%, transparent 50%),
            radial-gradient(circle at 50% 50%, rgba(205, 133, 63, 0.04) 0%, transparent 60%),
            linear-gradient(135deg, #F5F1E8 0%, #E8E0D1 50%, #F0EAD6 100%)
          `
        }}
      />
      
      {/* Éléments architecturaux Petra */}
      {elements.map(renderElement)}

      {/* Lueurs dorées subtiles */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-accent-pyramid rounded-full mix-blend-screen filter blur-3xl opacity-5 animate-glow-pulse"></div>
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-accent-pharaoh rounded-full mix-blend-screen filter blur-3xl opacity-4 animate-glow-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent-ancient rounded-full mix-blend-screen filter blur-3xl opacity-3 animate-glow-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Motifs géométriques Petra en filigrane */}
      <div className="absolute inset-0 opacity-[0.02]">
        {/* Colonnes géantes */}
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-0 h-0 border-l-[100px] border-r-[100px] border-b-[200px] border-l-transparent border-r-transparent border-b-accent-ancient/10"></div>
        <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-0 h-0 border-l-[80px] border-r-[80px] border-b-[160px] border-l-transparent border-r-transparent border-b-accent-pyramid/10"></div>

        {/* Arches */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-48 h-24 border-4 border-accent-pharaoh/10 border-b-0 rounded-t-full"></div>
        <div className="absolute bottom-1/3 right-1/3 w-32 h-16 border-3 border-accent-ancient/10 border-b-0 rounded-t-full"></div>

        {/* Hiéroglyphes géants */}
        <div className="absolute top-1/4 right-1/4 text-8xl text-accent-pyramid/5 font-hieroglyph">𓂀</div>
        <div className="absolute bottom-1/4 left-1/4 text-6xl text-accent-pharaoh/5 font-hieroglyph">𓂁</div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-7xl text-accent-ancient/5 font-hieroglyph">𓂂</div>
      </div>
    </div>
  );
}
