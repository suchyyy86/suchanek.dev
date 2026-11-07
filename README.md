# suchanek.dev

Osobní web Mariusze Suchanka: portfolio, CV a lab s projekty. Postavené v [Astru](https://astro.build), hostované na Vercelu.

## Spuštění

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # statický výstup do dist/
```

## Kde co upravit

| Co | Soubor |
|---|---|
| Projekty (portfolio, lab) | `src/data/projects.ts` — `draft: true` projekt skryje |
| CV | `src/pages/cv.astro` |
| Úvodní text | `src/pages/index.astro` |
| Mapa cest – navštívené země a místa | `src/data/travels.json` |

### Mapa cest

- `countries[].id` je číselný kód ISO 3166-1 (Česko `203`, Slovensko `703`, Polsko `616`, Německo `276`, Rakousko `040`…).
- `places[]` jsou konkrétní místa: `lat`/`lon`, rok a poznámka se zobrazí v tooltipu.
- Mapa se generuje při buildu do čistého SVG (d3-geo + world-atlas 110m), v prohlížeči neběží žádný JS.
