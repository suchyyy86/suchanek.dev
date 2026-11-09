// SEO: výchozí titulek, náhledový obrázek a strukturovaná data (schema.org JSON-LD).
// Údaje o osobě se berou z cv.ts a site.ts, aby web, CV a schema říkaly totéž.
import { site } from './site';
import { name, headline, education, skills, contact } from './cv';

export const SITE_URL = 'https://suchanek.dev';

// Titulky drž do ~60 znaků, popisy do ~155.
export const defaultTitle = 'Mariusz Suchanek – vývojář webových aplikací a junior PM';

// Náhled při sdílení (LinkedIn, Messenger, WhatsApp…). Generuje ho scripts/generate-assets.sh.
export const ogImage = {
  path: '/og.png',
  width: 1200,
  height: 630,
  alt: `${name} – ${headline.join(' | ')}`,
};

const PERSON_ID = `${SITE_URL}/#person`;
const WEBSITE_ID = `${SITE_URL}/#website`;

const person = {
  '@type': 'Person',
  '@id': PERSON_ID,
  name,
  givenName: 'Mariusz',
  familyName: 'Suchanek',
  url: `${SITE_URL}/`,
  email: `mailto:${site.email}`,
  jobTitle: headline,
  worksFor: { '@type': 'Organization', name: 'Railsformers', url: 'https://railsformers.com' },
  alumniOf: [
    { '@type': 'CollegeOrUniversity', name: education[0].school },
    { '@type': 'HighSchool', name: education[1].school },
  ],
  address: { '@type': 'PostalAddress', addressLocality: contact.location, addressCountry: 'CZ' },
  knowsLanguage: ['cs', 'pl', 'en'],
  knowsAbout: skills,
  sameAs: [site.linkedin, site.github],
};

const website = {
  '@type': 'WebSite',
  '@id': WEBSITE_ID,
  url: `${SITE_URL}/`,
  name: 'suchanek.dev',
  inLanguage: 'cs',
  author: { '@id': PERSON_ID },
};

export const homeSchema = {
  '@context': 'https://schema.org',
  '@graph': [website, person],
};

export const cvSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    website,
    person,
    {
      '@type': 'ProfilePage',
      '@id': `${SITE_URL}/cv#webpage`,
      url: `${SITE_URL}/cv`,
      name: `CV – ${name}`,
      inLanguage: 'cs',
      isPartOf: { '@id': WEBSITE_ID },
      mainEntity: { '@id': PERSON_ID },
    },
  ],
};
