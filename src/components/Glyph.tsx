// Icônes-glyphes, façon gravure : un trait fin, aucun remplissage. Une par type de la lentille Structure ;
// les déclencheurs partagent un losange gravé teinté de leur couleur.
const PATHS: Record<string, React.ReactNode> = {
  big_idea: (<><circle cx="12" cy="12" r="3.6" /><path d="M12 3v2.6M12 18.4V21M3 12h2.6M18.4 12H21M5.6 5.6l1.9 1.9M16.5 16.5l1.9 1.9M5.6 18.4l1.9-1.9M16.5 7.5l1.9-1.9" /></>),
  hook: (<><path d="M9 3.5v9.5a4 4 0 0 0 8 0v-1.6" /><path d="M17 11.4l-2.2 2" /><circle cx="9" cy="3.5" r="1" /></>),
  pain: (<path d="M13.2 3 7 13.2h4.6L10.6 21l6.4-11h-4.6z" />),
  mechanism: (<><circle cx="9" cy="12" r="4.2" /><circle cx="15" cy="12" r="4.2" /><path d="M12 8.4v7.2" /></>),
  proof: (<><circle cx="12" cy="11" r="6.2" /><path d="M9.2 11.2l2 2 3.8-4" /><path d="M8.6 16.4 7.4 21l4.6-2 4.6 2-1.2-4.6" /></>),
  offer: (<><path d="M4 11h16l-1.8 8.2H5.8z" /><path d="M8.6 11V8.6a3.4 3.4 0 0 1 6.8 0V11" /></>),
  cta: (<><path d="M5 6.5 10.5 12 5 17.5" /><path d="M12 6.5 17.5 12 12 17.5" /></>),
  transition: (<><path d="M3 17.5h18" /><path d="M5 17.5c0-6.2 14-6.2 14 0" /><path d="M9 17.5v-3.6M15 17.5v-3.6M12 17.5v-4.6" /></>),
};
const TRIGGER = (<><path d="M12 3.5 19 12l-7 8.5L5 12z" /><path d="M12 8.5 15 12l-3 3.5L9 12z" /></>);

export function Glyph({ type, size = 18, title }: { type: string; size?: number; title?: string }) {
  return (
    <svg className="glyph" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}
      strokeLinecap="round" strokeLinejoin="round" role={title ? "img" : undefined} aria-label={title} aria-hidden={title ? undefined : true}>
      {PATHS[type] ?? TRIGGER}
    </svg>
  );
}

/** Le sceau du produit : la Big Idea gravée dans un cartouche. */
export function Seal({ size = 30 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth={1.4} aria-hidden>
      <rect x="2.5" y="2.5" width="27" height="27" rx="7" />
      <rect x="5.5" y="5.5" width="21" height="21" rx="5" strokeOpacity=".45" />
      <circle cx="16" cy="16" r="3.4" />
      <path d="M16 8.6v2.4M16 21v2.4M8.6 16H11M21 16h2.4M10.8 10.8l1.7 1.7M19.5 19.5l1.7 1.7M10.8 21.2l1.7-1.7M19.5 12.5l1.7-1.7" strokeLinecap="round" />
    </svg>
  );
}
