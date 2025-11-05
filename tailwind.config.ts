import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
              colors: {
                // Palette Hermès x iOS - Premium & Mystérieux
                background: "#F8F5F0", // Soft sand
                surface: "#F5F2ED", // Sand light
                surfaceLight: "#FAF7F2", // Sand ultra-light
                glass: "rgba(255, 255, 255, 0.25)",
                glassBorder: "rgba(0, 87, 167, 0.15)",
                accent: {
                  pharaoh: "#0057A7", // Pharaoh blue - primary
                  gold: "#C6A664", // Matte gold - secondary
                  pyramid: "#D4AF37", // Gold accent
                  ancient: "#8B4513", // Deep brown
                  mystery: "#2C3E50", // Dark blue-gray
                  secret: "#34495E", // Muted blue-gray
                },
                text: {
                  primary: "#2C3E50", // Dark blue-gray
                  secondary: "#5D6D7E", // Medium blue-gray
                  muted: "#85929E", // Light blue-gray
                  accent: "#0057A7", // Pharaoh blue
                  gold: "#C6A664", // Matte gold
                },
        glow: {
          pyramid: "#D4AF37",
          pharaoh: "#B8860B",
          conspiracy: "#FFD700",
        },
        // Couleurs des triggers conspirationnistes
        trigger: {
          urgency: "#D4AF37", // Or pyramide
          scarcity: "#B8860B", // Or pharaonique
          social_proof: "#FFD700", // Or conspirationniste
          authority: "#CD853F", // Bronze ancien
          reciprocity: "#8B4513", // Brun mystérieux
          commitment: "#D4AF37", // Or pyramide
          liking: "#B8860B", // Or pharaonique
          fear: "#DC143C", // Rouge conspirationniste
          greed: "#FFD700", // Or conspirationniste
          mystery: "#2F4F4F", // Gris secret
          curiosity: "#CD853F", // Bronze ancien
          exclusivity: "#D4AF37", // Or pyramide
          storytelling: "#B8860B", // Or pharaonique
          contrast: "#D2B48C", // Tan
          call_to_action: "#FFD700", // Or conspirationniste
        }
      },
              fontFamily: {
                serif: ['var(--font-quintessential)', 'serif'],
                sans: ['var(--font-quintessential)', 'system-ui', 'sans-serif'],
                display: ['var(--font-quintessential)', 'serif'],
                body: ['var(--font-quintessential)', 'serif'],
                ui: ['var(--font-quintessential)', 'system-ui', 'sans-serif'],
                elegant: ['var(--font-quintessential)', 'serif'],
                refined: ['var(--font-quintessential)', 'serif'],
                sophisticated: ['var(--font-quintessential)', 'serif'],
                egyptian: ['var(--font-quintessential)', 'serif'],
                conspiracy: ['var(--font-quintessential)', 'serif'],
                ancient: ['var(--font-quintessential)', 'serif'],
                mystical: ['var(--font-quintessential)', 'serif'],
                branded: ['var(--font-quintessential)', 'serif'],
                pyramid: ['var(--font-quintessential)', 'serif'],
                hieroglyph: ['var(--font-quintessential)', 'serif'],
                petra: ['var(--font-quintessential)', 'serif'],
                classical: ['var(--font-quintessential)', 'serif'],
              },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'laser-scan': 'laser-scan 2s ease-in-out',
        'fade-in': 'fade-in 0.5s ease-out',
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'mystical-glow': 'mystical-glow 3s ease-in-out infinite',
        'particle-float': 'particle-float 4s ease-in-out infinite',
        'text-shimmer': 'text-shimmer 2s ease-in-out infinite',
        'mystery-reveal': 'mystery-reveal 1.5s ease-out',
      },
      keyframes: {
        'laser-scan': {
          '0%': { transform: 'translateX(-100%)', opacity: '0' },
          '50%': { opacity: '1' },
          '100%': { transform: 'translateX(100%)', opacity: '0' },
        },
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'glow-pulse': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(0, 87, 167, 0.3)' },
          '50%': { boxShadow: '0 0 30px rgba(0, 87, 167, 0.6)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'mystical-glow': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(139, 92, 246, 0.3), 0 0 40px rgba(139, 92, 246, 0.1)' },
          '50%': { boxShadow: '0 0 30px rgba(139, 92, 246, 0.5), 0 0 60px rgba(139, 92, 246, 0.2)' },
        },
        'particle-float': {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)', opacity: '0.3' },
          '50%': { transform: 'translateY(-20px) rotate(180deg)', opacity: '0.8' },
        },
        'text-shimmer': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'mystery-reveal': {
          '0%': { opacity: '0', transform: 'scale(0.8) translateY(20px)' },
          '100%': { opacity: '1', transform: 'scale(1) translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
export default config;
