'use client';

import React, { useEffect, useState } from 'react';

interface Pyramid {
  id: number;
  x: number;
  y: number;
  size: number;
  rotation: number;
  opacity: number;
  color: string;
}

export default function ConspiracyAmbiance() {
  const [pyramids, setPyramids] = useState<Pyramid[]>([]);

  useEffect(() => {
    // Créer des pyramides conspirationnistes
    const newPyramids: Pyramid[] = [];
    const colors = ['#D4AF37', '#B8860B', '#FFD700', '#CD853F', '#8B4513'];
    
    for (let i = 0; i < 20; i++) {
      newPyramids.push({
        id: i,
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        size: Math.random() * 100 + 50,
        rotation: Math.random() * 360,
        opacity: Math.random() * 0.3 + 0.1,
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }
    
    setPyramids(newPyramids);

    // Animation des pyramides
    const animatePyramids = () => {
      setPyramids(prev => prev.map(pyramid => ({
        ...pyramid,
        rotation: pyramid.rotation + 0.5,
        opacity: 0.1 + Math.sin(pyramid.rotation * 0.01) * 0.2
      })));
    };

    const interval = setInterval(animatePyramids, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Fond conspirationniste avec dégradés */}
      <div 
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(circle at 20% 30%, rgba(212, 175, 55, 0.15) 0%, transparent 50%),
            radial-gradient(circle at 80% 70%, rgba(184, 134, 11, 0.12) 0%, transparent 50%),
            radial-gradient(circle at 50% 50%, rgba(255, 215, 0, 0.08) 0%, transparent 60%),
            linear-gradient(135deg, rgba(15, 15, 15, 0.8) 0%, rgba(26, 26, 26, 0.9) 100%)
          `
        }}
      />
      
      {/* Pyramides conspirationnistes */}
      {pyramids.map(pyramid => (
        <div
          key={pyramid.id}
          className="absolute"
          style={{
            left: pyramid.x,
            top: pyramid.y,
            width: pyramid.size,
            height: pyramid.size,
            opacity: pyramid.opacity,
            transform: `rotate(${pyramid.rotation}deg)`,
            filter: `drop-shadow(0 0 10px ${pyramid.color})`
          }}
        >
          {/* Pyramide CSS */}
          <div
            className="w-0 h-0 border-l-[50px] border-r-[50px] border-b-[80px] border-l-transparent border-r-transparent"
            style={{
              borderBottomColor: pyramid.color,
              filter: `drop-shadow(0 0 20px ${pyramid.color})`
            }}
          />
        </div>
      ))}
      
      {/* Ombres conspirationnistes */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-radial from-accent-pyramid/20 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-radial from-accent-pharaoh/15 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-radial from-accent-conspiracy/10 to-transparent rounded-full blur-2xl"></div>
      </div>
      
      {/* Rayons conspirationnistes */}
      <div className="absolute inset-0 opacity-15">
        <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-accent-pyramid/30 to-transparent"></div>
        <div className="absolute top-0 right-1/3 w-px h-full bg-gradient-to-b from-transparent via-accent-pharaoh/20 to-transparent"></div>
        <div className="absolute top-0 left-2/3 w-px h-full bg-gradient-to-b from-transparent via-accent-conspiracy/25 to-transparent"></div>
      </div>
      
      {/* Motifs conspirationnistes */}
      <div className="absolute inset-0 opacity-10">
        {/* Pyramides géantes */}
        <div className="absolute top-20 left-10 w-0 h-0 border-l-[60px] border-r-[60px] border-b-[100px] border-l-transparent border-r-transparent border-b-accent-pyramid/30"></div>
        <div className="absolute top-32 right-16 w-0 h-0 border-l-[50px] border-r-[50px] border-b-[80px] border-l-transparent border-r-transparent border-b-accent-pharaoh/25"></div>
        <div className="absolute bottom-32 left-20 w-0 h-0 border-l-[70px] border-r-[70px] border-b-[110px] border-l-transparent border-r-transparent border-b-accent-conspiracy/20"></div>
        
        {/* Cercles conspirationnistes */}
        <div className="absolute top-1/4 left-1/4 w-32 h-32 border border-accent-pyramid/20 rounded-full animate-mystical-glow"></div>
        <div className="absolute top-3/4 right-1/4 w-24 h-24 border border-accent-pharaoh/15 rounded-full animate-mystical-glow" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/6 w-16 h-16 border border-accent-conspiracy/25 rounded-full animate-mystical-glow" style={{ animationDelay: '2s' }}></div>
      </div>
    </div>
  );
}
