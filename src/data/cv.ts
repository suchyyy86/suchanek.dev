// Obsah životopisu – doslova podle PDF (Mariusz_Suchanek_CV.pdf).
// Texty nepřepisuj ani nedoplňuj vlastními slovy. Jediná odchylka od PDF je kontakt:
// místo Ostrava (bez Českého Těšína), e-mail na doméně, LinkedIn jako odkaz a bez telefonu.

export const name = 'Mariusz Suchanek';

export const headline = ['Vývojář webových aplikací', 'Juniorní projektový manažer'];

export const profile =
  'Vývojář s praxí na komplexní 3D aplikaci, WordPress webech a vedení menších projektů. Propojuji technický vývoj, AI nástroje a komunikaci s klienty. Studuji ekonomii na VŠB–TUO.';

// Popis pro vyhledávače: první dvě věty profilu (Google popisy delší než ~155 znaků ořízne).
export const metaDescription =
  'Vývojář s praxí na komplexní 3D aplikaci, WordPress webech a vedení menších projektů. Propojuji technický vývoj, AI nástroje a komunikaci s klienty.';

export const experience = [
  {
    company: 'Railsformers',
    role: 'Vývojář aplikací / juniorní projektový manažer',
    period: '07/2025 – současnost',
    points: [
      'Frontendový vývoj 3D aplikace digitálního dvojčete budovy.',
      'Vizualizace provozních dat a údajů ze senzorů.',
      'Vývoj webů ve WordPressu s využitím AI nástrojů a MCP.',
      'Vedení menších projektů, koordinace vývoje a komunikace s klienty.',
    ],
  },
  {
    company: 'K2 atmitec',
    role: 'Maturitní projekt',
    period: '09/2024 – 03/2025',
    points: ['Vývoj JavaScript knihovny pro vyhledávání a úpravu překladů v XML souborech.'],
  },
  {
    company: 'Třinecké železárny',
    role: 'Odborná praxe v IT oddělení',
    period: '05/2024',
    points: ['Spolupráce na frontendové a backendové části nového informačního systému.'],
  },
];

export const education = [
  {
    school: 'VŠB – Technická univerzita Ostrava',
    detail: 'Ekonomická fakulta · Ekonomie · 2025 – současnost',
  },
  {
    school: 'Střední průmyslová škola Karviná',
    detail: 'Informační technologie · 2021 – 2025 · maturita s vyznamenáním',
  },
];

export const contact = {
  location: 'Ostrava',
  linkedinLabel: 'LinkedIn',
};

export const skills = [
  'JavaScript, HTML, CSS',
  'Vývoj webových aplikací',
  'WordPress',
  'Frontend a 3D aplikace',
  'AI-driven vývoj (MCP)',
  'Vedení menších projektů',
  'Komunikace s klienty',
];

export const languages = ['Čeština · rodilý mluvčí', 'Polština · rodilý mluvčí', 'Angličtina · C1 (CAE)'];

export const certificates = ['Cambridge English: Advanced (CAE)', 'Řidičský průkaz skupiny B'];
