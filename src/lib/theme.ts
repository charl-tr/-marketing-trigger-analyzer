// Configuration du thème Prism
export const theme = {
  colors: {
    // Palette principale
    background: '#F8F5F0', // Blanc cassé
    accent: {
      warm: '#DFAE6A', // Orange sable
      gold: '#C6A664', // Doré mat
      mystic: '#0057A7', // Bleu pharaon électrique
    },
    text: {
      primary: '#0C0C0C', // Noir profond
      secondary: '#4A4A4A',
      muted: '#8A8A8A',
    },
    // Couleurs des triggers (mises à jour)
    triggers: {
      urgency: '#DFAE6A',
      scarcity: '#C6A664',
      social_proof: '#0057A7',
      authority: '#8B5CF6',
      reciprocity: '#EC4899',
      commitment: '#10B981',
      liking: '#F59E0B',
      fear: '#DC2626',
      greed: '#7C3AED',
      mystery: '#8B5CF6',
      curiosity: '#7C3AED',
      exclusivity: '#059669',
      storytelling: '#7C2D12',
      contrast: '#1F2937',
      call_to_action: '#7C3AED',
    }
  },
  typography: {
    fontFamily: {
      serif: ['Cormorant Garamond', 'serif'],
      sans: ['Inter', 'system-ui', 'sans-serif'],
    },
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
      '5xl': '3rem',
      '6xl': '3.75rem',
    }
  },
  effects: {
    glassmorphism: {
      background: 'rgba(255, 255, 255, 0.25)',
      backdrop: 'blur(10px)',
      border: '1px solid rgba(255, 255, 255, 0.18)',
    },
    glow: {
      blue: '0 0 20px rgba(0, 87, 167, 0.3)',
      warm: '0 0 20px rgba(223, 174, 106, 0.3)',
    }
  }
};

// Fonction pour obtenir la couleur d'un trigger
export function getTriggerColor(triggerId: string): string {
  return theme.colors.triggers[triggerId as keyof typeof theme.colors.triggers] || theme.colors.accent.mystic;
}

// Fonction pour les classes CSS personnalisées
export function getPrismClasses() {
  return {
    background: 'bg-[#F8F5F0]',
    textPrimary: 'text-[#0C0C0C]',
    textSecondary: 'text-[#4A4A4A]',
    textMuted: 'text-[#8A8A8A]',
    accentWarm: 'text-[#DFAE6A]',
    accentGold: 'text-[#C6A664]',
    accentMystic: 'text-[#0057A7]',
    borderWarm: 'border-[#DFAE6A]',
    borderMystic: 'border-[#0057A7]',
    bgWarm: 'bg-[#DFAE6A]',
    bgMystic: 'bg-[#0057A7]',
    fontSerif: 'font-serif',
    fontSans: 'font-sans',
  };
}
