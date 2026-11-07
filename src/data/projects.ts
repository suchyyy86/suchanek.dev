// Všechny projekty na jednom místě: pracovní, školní i osobní.
// featured: true = ukáže se na úvodní stránce.
// draft: true = projekt se nezobrazí (např. dokud nemáš souhlas firmy nebo klienta).

export type Kind = 'Práce' | 'Osobní' | 'Škola';

export interface Project {
  title: string;
  description: string;
  kind: Kind;
  year: string;
  href?: string;
  featured?: boolean;
  draft?: boolean;
}

export const projects: Project[] = [
  {
    title: 'Digitální dvojče budovy',
    description:
      'Frontend 3D aplikace v Railsformers, která vizualizuje provozní data a údaje ze senzorů v budově.',
    kind: 'Práce',
    year: '2025 – dnes',
    featured: true,
  },
  {
    title: 'Mapa cest',
    description: 'Mapa světa, kde si odškrtávám místa, kde jsem byl. Vykreslená při buildu do čistého SVG.',
    kind: 'Osobní',
    year: '2026',
    href: '/projekty/mapa',
    featured: true,
  },
  {
    title: 'suchanek.dev',
    description: 'Tenhle web. Portfolio a CV postavené AI-first v Astru, s otevřeným kódem na GitHubu.',
    kind: 'Osobní',
    year: '2026',
    href: 'https://github.com/suchyyy86/suchanek.dev',
    featured: true,
  },
  {
    title: 'Překlady v XML',
    description:
      'JavaScript knihovna pro vyhledávání a úpravu překladů v XML souborech. Maturitní projekt pro K2 atmitec.',
    kind: 'Škola',
    year: '2024 – 2025',
  },
  {
    title: 'Web Railsformers',
    description: 'Firemní web ve WordPressu a Bricks, postavený 1:1 podle Figmy s pomocí AI přes Bricks MCP.',
    kind: 'Práce',
    year: '2026',
    href: 'https://railsformers.com',
    draft: true, // ověř, že to firma chce mít v portfoliu
  },
];

export const publishedProjects = projects.filter((p) => !p.draft);
export const featuredProjects = publishedProjects.filter((p) => p.featured);
