'use client';

import React, { useState, useEffect } from 'react';
import { getTriggerColor } from '@/lib/theme';

interface TriggerData {
  name: string;
  count: number;
  percentage: number;
  color: string;
}

interface CircularDashboardProps {
  triggers: TriggerData[];
  totalScore: number;
  className?: string;
}

export default function CircularDashboard({ triggers, totalScore, className = '' }: CircularDashboardProps) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const [animatedPercentages, setAnimatedPercentages] = useState<Record<string, number>>({});

  // Animation du score global
  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const increment = totalScore / steps;
    let current = 0;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= totalScore) {
        setAnimatedScore(totalScore);
        clearInterval(timer);
      } else {
        setAnimatedScore(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [totalScore]);

  // Animation des pourcentages
  useEffect(() => {
    const duration = 1500;
    const steps = 30;
    
    triggers.forEach(trigger => {
      const increment = trigger.percentage / steps;
      let current = 0;
      
      const timer = setInterval(() => {
        current += increment;
        if (current >= trigger.percentage) {
          setAnimatedPercentages(prev => ({ ...prev, [trigger.name]: trigger.percentage }));
          clearInterval(timer);
        } else {
          setAnimatedPercentages(prev => ({ ...prev, [trigger.name]: Math.floor(current) }));
        }
      }, duration / steps);
    });
  }, [triggers]);

  const radius = 80;
  const strokeWidth = 12;
  const normalizedRadius = radius - strokeWidth * 2;
  const circumference = normalizedRadius * 2 * Math.PI;

  const createArcPath = (startAngle: number, endAngle: number) => {
    const start = polarToCartesian(radius, radius, endAngle);
    const end = polarToCartesian(radius, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
    
    return `M ${start.x} ${start.y} A ${normalizedRadius} ${normalizedRadius} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`;
  };

  const polarToCartesian = (centerX: number, centerY: number, angleInDegrees: number) => {
    const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
    return {
      x: centerX + (normalizedRadius * Math.cos(angleInRadians)),
      y: centerY + (normalizedRadius * Math.sin(angleInRadians))
    };
  };

  let currentAngle = 0;
  const totalPercentage = triggers.reduce((sum, trigger) => sum + trigger.percentage, 0);

  return (
    <div className={`space-y-8 ${className}`}>
      {/* Score global circulaire */}
      <div className="flex justify-center">
        <div className="relative w-48 h-48">
          <svg className="w-full h-full transform -rotate-90">
            {/* Cercle de fond */}
            <circle
              cx={radius}
              cy={radius}
              r={normalizedRadius}
              fill="none"
              stroke="#F8F5F0"
              strokeWidth={strokeWidth}
            />
            
            {/* Cercle de progression */}
            <circle
              cx={radius}
              cy={radius}
              r={normalizedRadius}
              fill="none"
              stroke="url(#scoreGradient)"
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={circumference - (animatedScore / 100) * circumference}
              className="transition-all duration-1000 ease-out"
            />
            
            <defs>
              <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#DFAE6A" />
                <stop offset="50%" stopColor="#C6A664" />
                <stop offset="100%" stopColor="#0057A7" />
              </linearGradient>
            </defs>
          </svg>
          
          {/* Score au centre */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-4xl font-bold text-text-primary font-quintessential">
              {animatedScore}
            </div>
            <div className="text-sm text-text-muted font-quintessential">
              Persuasion Score
            </div>
          </div>
        </div>
      </div>

      {/* Répartition des triggers */}
      <div className="space-y-4">
        <h3 className="text-xl font-quintessential font-bold text-text-primary text-center">
          Trigger Distribution
        </h3>
        
        <div className="space-y-3">
          {triggers.map((trigger, index) => {
            const animatedPercentage = animatedPercentages[trigger.name] || 0;
            const angle = (trigger.percentage / totalPercentage) * 360;
            const startAngle = currentAngle;
            const endAngle = currentAngle + angle;
            currentAngle += angle;

            return (
              <div key={trigger.name} className="flex items-center gap-4 p-3 rounded-xl bg-background/30 hover:bg-background/50 transition-all duration-300">
                {/* Barre de progression */}
                <div className="flex-1 h-3 bg-background/50 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-1000 ease-out"
                    style={{
                      backgroundColor: trigger.color,
                      width: `${animatedPercentage}%`,
                      boxShadow: `0 0 10px ${trigger.color}40`
                    }}
                  />
                </div>
                
                {/* Informations du trigger */}
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className="w-4 h-4 rounded-full flex-shrink-0"
                    style={{ backgroundColor: trigger.color }}
                  />
                  <span className="font-bold text-text-primary text-sm truncate font-quintessential">
                    {trigger.name}
                  </span>
                  <span className="text-accent-mystic font-bold text-sm">
                    {animatedPercentage}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Insights */}
      <div className="bg-gradient-to-r from-accent-mystic/5 to-accent-warm/5 rounded-2xl p-6 border border-accent-mystic/10">
        <h4 className="text-lg font-quintessential font-bold text-text-primary mb-4">
          Insights
        </h4>
        
        <div className="space-y-3 text-sm">
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-accent-warm rounded-full mt-2 flex-shrink-0" />
            <div>
              <span className="font-bold text-text-primary font-quintessential">Dominant triggers: </span>
              <span className="text-text-secondary">
                {triggers.slice(0, 2).map(t => `${t.name} (${t.percentage}%)`).join(', ')}
              </span>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-accent-mystic rounded-full mt-2 flex-shrink-0" />
            <div>
              <span className="font-bold text-text-primary font-quintessential">Missing opportunities: </span>
              <span className="text-text-secondary">
                Social Proof, Authority, Storytelling
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
