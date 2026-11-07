# suchanek.dev

Osobní web Mariusze Suchanka: portfolio, projekty a CV. Postavené v [Astru](https://astro.build), hostované na Vercelu.

## Spuštění

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # statický výstup do dist/
```

## Kde co upravit

| Co | Soubor |
|---|---|
| Kontakty | `src/data/site.ts` |
| CV (doslova podle PDF) | `src/data/cv.ts` |
| Projekty – zatím skryté, stránky v `src/pages/_projekty/` | `src/data/projects.ts` |
| Mapa cest – navštívené země a místa (zatím skrytá) | `src/data/travels.json` |

### Mapa cest

```json
{
  "countries": [{ "code": "CZ", "note": "Doma" }],
  "places": [{ "name": "Ostrava", "lat": 49.8209, "lon": 18.2625, "note": "VŠB" }]
}
```

- `countries[].code` je dvoupísmenný ISO kód země (`CZ`, `SK`, `PL`, `DE`, `AT`, `HR`…). Český název se doplní sám.
- `places[]` jsou konkrétní místa. Název a poznámka se ukážou v tooltipu.
- Mapa se generuje při buildu do čistého SVG, v prohlížeči neběží žádná mapová knihovna.

Pro AI agenty jsou konvence projektu v [AGENTS.md](AGENTS.md).
