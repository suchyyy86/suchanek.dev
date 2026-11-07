// Všechny projekty na jednom místě: pracovní, školní i osobní.
// Popis drž na jeden krátký řádek.
// featured: true = ukáže se na úvodní stránce.
// draft: true = projekt se nezobrazí (např. dokud nemáš souhlas firmy nebo klienta).

export interface Project {
  title: string;
  description: string;
  year: string;
  href?: string;
  featured?: boolean;
  draft?: boolean;
}

export const projects: Project[] = [
  {
    title: 'Digitální dvojče budovy',
    description: '3D aplikace pro vizualizaci dat ze senzorů budovy.',
    year: '2025',
    featured: true,
  },
  {
    title: 'Mapa cest',
    description: 'Interaktivní mapa míst, kde jsem byl.',
    year: '2026',
    href: '/projekty/mapa',
    featured: true,
  },
  {
    title: 'suchanek.dev',
    description: 'Tenhle web – Astro, kód na GitHubu.',
    year: '2026',
    href: 'https://github.com/suchyyy86/suchanek.dev',
    featured: true,
  },
  {
    title: 'Překlady v XML',
    description: 'JS knihovna pro správu překladů, maturitní projekt.',
    year: '2025',
  },
  {
    title: 'Web Railsformers',
    description: 'Firemní web ve WordPressu a Bricks, stavěný s AI.',
    year: '2026',
    href: 'https://railsformers.com',
    draft: true, // ověř, že to firma chce mít v portfoliu
  },
];

export const publishedProjects = projects.filter((p) => !p.draft);
export const featuredProjects = publishedProjects.filter((p) => p.featured);
