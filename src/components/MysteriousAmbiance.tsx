'use client';

import React, { useEffect, useState } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  speed: number;
  opacity: number;
  color: string;
}

export default function MysteriousAmbiance() {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    // Créer des particules mystérieuses
    const newParticles: Particle[] = [];
    const colors = ['#8B5CF6', '#F59E0B', '#10B981', '#3B82F6', '#EC4899'];
    
    for (let i = 0; i < 50; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        size: Math.random() * 3 + 1,
        speed: Math.random() * 0.5 + 0.1,
        opacity: Math.random() * 0.5 + 0.1,
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }
    
    setParticles(newParticles);

    // Animation des particules
    const animateParticles = () => {
      setParticles(prev => prev.map(particle => ({
        ...particle,
        y: particle.y + particle.speed,
        x: particle.x + Math.sin(particle.y * 0.01) * 0.5,
        opacity: 0.1 + Math.sin(particle.y * 0.02) * 0.4
      })).filter(particle => particle.y < window.innerHeight + 50));
    };

    const interval = setInterval(animateParticles, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {/* Fond mystérieux avec dégradés */}
      <div 
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(circle at 20% 30%, rgba(139, 92, 246, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 70%, rgba(245, 158, 11, 0.08) 0%, transparent 50%),
            radial-gradient(circle at 50% 50%, rgba(16, 185, 129, 0.05) 0%, transparent 60%),
            linear-gradient(135deg, rgba(10, 10, 10, 0.9) 0%, rgba(26, 26, 26, 0.95) 100%)
          `
        }}
      />
      
      {/* Particules mystérieuses */}
      {particles.map(particle => (
        <div
          key={particle.id}
          className="absolute rounded-full animate-particle-float"
          style={{
            left: particle.x,
            top: particle.y,
            width: particle.size,
            height: particle.size,
            backgroundColor: particle.color,
            opacity: particle.opacity,
            boxShadow: `0 0 ${particle.size * 2}px ${particle.color}`,
            animationDelay: `${particle.id * 0.1}s`
          }}
        />
      ))}
      
      {/* Ombres mystérieuses */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-radial from-accent-mystic/20 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-radial from-accent-gold/15 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-radial from-accent-emerald/10 to-transparent rounded-full blur-2xl"></div>
      </div>
      
      {/* Rayons mystérieux */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-accent-mystic/30 to-transparent"></div>
        <div className="absolute top-0 right-1/3 w-px h-full bg-gradient-to-b from-transparent via-accent-gold/20 to-transparent"></div>
        <div className="absolute top-0 left-2/3 w-px h-full bg-gradient-to-b from-transparent via-accent-emerald/25 to-transparent"></div>
      </div>
      
      {/* Motifs géométriques mystérieux */}
      <div className="absolute inset-0 opacity-5">
        {/* Pyramides mystérieuses */}
        <div className="absolute top-20 left-10 w-0 h-0 border-l-[40px] border-r-[40px] border-b-[60px] border-l-transparent border-r-transparent border-b-accent-mystic/30"></div>
        <div className="absolute top-32 right-16 w-0 h-0 border-l-[30px] border-r-[30px] border-b-[50px] border-l-transparent border-r-transparent border-b-accent-gold/25"></div>
        <div className="absolute bottom-32 left-20 w-0 h-0 border-l-[35px] border-r-[35px] border-b-[55px] border-l-transparent border-r-transparent border-b-accent-emerald/20"></div>
        
        {/* Cercles mystérieux */}
        <div className="absolute top-1/4 left-1/4 w-32 h-32 border border-accent-mystic/20 rounded-full animate-mystical-glow"></div>
        <div className="absolute top-3/4 right-1/4 w-24 h-24 border border-accent-gold/15 rounded-full animate-mystical-glow" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/6 w-16 h-16 border border-accent-emerald/25 rounded-full animate-mystical-glow" style={{ animationDelay: '2s' }}></div>
      </div>
    </div>
  );
}
