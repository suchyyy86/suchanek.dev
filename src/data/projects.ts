// Seznam projektů pro /projekty a úvodní stránku.
// draft: true = projekt se nezobrazí (např. dokud nemáš souhlas klienta/firmy ho ukazovat).

export interface Project {
  title: string;
  description: string;
  href?: string;
  tags: string[];
  year: string;
  kind: 'práce' | 'klient' | 'lab';
  draft?: boolean;
}

export const projects: Project[] = [
  {
    title: 'Mapa cest',
    description: 'Interaktivní mapa světa, kde si odškrtávám místa, kde jsem byl. První vibecoded projekt tohohle webu.',
    href: '/lab/mapa',
    tags: ['Astro', 'd3-geo', 'SVG'],
    year: '2026',
    kind: 'lab',
  },
  {
    title: 'suchanek.dev',
    description: 'Tenhle web. Portfolio, CV a odkladiště pro projekty, postavené AI-first v Astru.',
    href: 'https://github.com/suchyyy86/suchanek.dev',
    tags: ['Astro', 'Vercel', 'Claude Code'],
    year: '2026',
    kind: 'lab',
  },
  {
    title: 'Web Railsformers',
    description: 'Firemní web ve WordPressu a Bricks, postavený 1:1 podle Figmy s pomocí AI přes Bricks MCP.',
    href: 'https://railsformers.com',
    tags: ['WordPress', 'Bricks', 'MCP', 'AI'],
    year: '2026',
    kind: 'práce',
    draft: true, // ověř, že to firma chce mít v portfoliu
  },
];

export const publishedProjects = projects.filter((p) => !p.draft);
