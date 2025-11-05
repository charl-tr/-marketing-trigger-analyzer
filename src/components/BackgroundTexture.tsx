'use client';

import React from 'react';

export default function BackgroundTexture() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {/* Texture sable/papyrus authentique */}
      <div 
        className="absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage: `
            /* Texture papyrus de base */
            radial-gradient(circle at 15% 25%, rgba(223, 174, 106, 0.15) 0%, transparent 40%),
            radial-gradient(circle at 85% 75%, rgba(198, 166, 100, 0.12) 0%, transparent 45%),
            radial-gradient(circle at 45% 15%, rgba(223, 174, 106, 0.08) 0%, transparent 35%),
            radial-gradient(circle at 75% 45%, rgba(198, 166, 100, 0.1) 0%, transparent 40%),
            radial-gradient(circle at 25% 85%, rgba(223, 174, 106, 0.06) 0%, transparent 30%),
            
            /* Fibres de papyrus */
            linear-gradient(90deg, transparent 48%, rgba(223, 174, 106, 0.03) 49%, rgba(223, 174, 106, 0.03) 51%, transparent 52%),
            linear-gradient(0deg, transparent 48%, rgba(198, 166, 100, 0.02) 49%, rgba(198, 166, 100, 0.02) 51%, transparent 52%),
            linear-gradient(45deg, transparent 48%, rgba(223, 174, 106, 0.02) 49%, rgba(223, 174, 106, 0.02) 51%, transparent 52%),
            linear-gradient(-45deg, transparent 48%, rgba(198, 166, 100, 0.02) 49%, rgba(198, 166, 100, 0.02) 51%, transparent 52%),
            
            /* Taches d'âge et d'usure */
            radial-gradient(ellipse at 20% 30%, rgba(198, 166, 100, 0.08) 0%, transparent 60%),
            radial-gradient(ellipse at 80% 70%, rgba(223, 174, 106, 0.06) 0%, transparent 50%),
            radial-gradient(ellipse at 60% 20%, rgba(198, 166, 100, 0.04) 0%, transparent 40%),
            
            /* Texture de grain */
            repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(223, 174, 106, 0.01) 2px, rgba(223, 174, 106, 0.01) 4px),
            repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(198, 166, 100, 0.01) 2px, rgba(198, 166, 100, 0.01) 4px)
          `,
          backgroundSize: '400px 400px, 500px 500px, 300px 300px, 350px 350px, 250px 250px, 100px 100px, 120px 120px, 80px 80px, 60px 60px, 200px 200px, 180px 180px, 150px 150px, 3px 3px, 3px 3px',
          backgroundPosition: '0 0, 100px 100px, 200px 50px, 50px 200px, 300px 300px, 0 0, 50px 50px, 25px 25px, 75px 75px, 150px 150px, 250px 250px, 100px 300px, 0 0, 0 0'
        }}
      />
      
      {/* Pyramides géométriques en filigrane */}
      <div className="absolute inset-0 opacity-[0.06]">
        {/* Pyramide 1 - haut gauche */}
        <div className="absolute top-20 left-10 w-0 h-0 border-l-[30px] border-r-[30px] border-b-[50px] border-l-transparent border-r-transparent border-b-accent-mystic/20"></div>
        
        {/* Pyramide 2 - haut droite */}
        <div className="absolute top-32 right-16 w-0 h-0 border-l-[25px] border-r-[25px] border-b-[40px] border-l-transparent border-r-transparent border-b-accent-warm/20"></div>
        
        {/* Pyramide 3 - bas gauche */}
        <div className="absolute bottom-32 left-20 w-0 h-0 border-l-[35px] border-r-[35px] border-b-[60px] border-l-transparent border-r-transparent border-b-accent-gold/20"></div>
        
        {/* Pyramide 4 - bas droite */}
        <div className="absolute bottom-20 right-10 w-0 h-0 border-l-[20px] border-r-[20px] border-b-[35px] border-l-transparent border-r-transparent border-b-accent-mystic/20"></div>
        
        {/* Prismes géométriques */}
        <div className="absolute top-1/4 left-1/4 w-16 h-16 border border-accent-warm/10 rotate-45"></div>
        <div className="absolute top-3/4 right-1/4 w-12 h-12 border border-accent-gold/10 rotate-12"></div>
        <div className="absolute top-1/2 left-1/6 w-8 h-8 border border-accent-mystic/10 rotate-45"></div>
        <div className="absolute bottom-1/4 right-1/6 w-10 h-10 border border-accent-warm/10 rotate-12"></div>
      </div>
      
      {/* Rayons lumineux subtils */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-accent-mystic/20 to-transparent"></div>
        <div className="absolute top-0 right-1/3 w-px h-full bg-gradient-to-b from-transparent via-accent-warm/20 to-transparent"></div>
        <div className="absolute top-0 left-2/3 w-px h-full bg-gradient-to-b from-transparent via-accent-gold/20 to-transparent"></div>
      </div>
    </div>
  );
}
