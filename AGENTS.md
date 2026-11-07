# suchanek.dev – poznámky pro AI agenty

Osobní web Mariusze Suchanka (portfolio, CV, projekty). Astro 7, statický výstup, hosting Vercel.
Obsah je česky. Jméno se píše **Suchanek** (bez diakritiky).

## Vývoj

```bash
npm run dev      # http://localhost:4321
npm run build    # musí projít bez chyb
npx astro check  # typová kontrola
```

Při spouštění dev serveru agentem použij `astro dev --background` (správa: `astro dev stop|status|logs`).

## Kde co je

| Co | Soubor |
|---|---|
| Kontakty, jméno, role | `src/data/site.ts` |
| Projekty (`featured` = úvod, `draft` = skryté) | `src/data/projects.ts` |
| Životopis (CV i Zkušenosti na úvodu) | `src/data/cv.ts` |
| Mapa cest | `src/data/travels.json` (země jako ISO kód `CZ`, místa jako `lat`/`lon`) |
| Barvy, typografie, animace | `src/styles/global.css` |
| Layout, menu, patička | `src/layouts/Base.astro` |

## Konvence

- **Minimalismus.** Jedna akcentová barva (`--accent`), hodně vzduchu, žádné dekorace navíc.
- **Barvy jen přes tokeny** v `:root` (světlý i tmavý režim podle systému).
- **Animace:**
  - `.enter` + `style="--i: N"` – nástup při načtení, N určuje pořadí.
  - `.scroll-in` – nástup při scrollu (čisté CSS, scroll-driven animations).
  - Vstupní animace mají `fill-mode: backwards`, ať po doběhnutí fungují hover styly.
  - Vše respektuje `prefers-reduced-motion`.
- **Přechody stránek** řeší Astro `ClientRouter`. Skripty, které mají běžet na každé stránce,
  pověs na `document.addEventListener('astro:page-load', …)`.
- **Česká typografie:** texty z dat prožeň přes `cz()` z `src/utils/cz.ts` (pevné mezery za předložkami),
  v šablonách piš `a&nbsp;`, `v&nbsp;`…
- **Pozor na mezery v šablonách:** Astro zahodí mezeru na začátku řádku hned za uzavíracím tagem
  (`</a>` + nový řádek + text → slepené slovo). Použij `{' '}` nebo text na stejném řádku.
- Mapa se generuje při buildu (`src/lib/world.ts`, d3-geo + world-atlas 50m zjednodušená). Do prohlížeče
  nejde žádná mapová knihovna.

## Dokumentace

https://docs.astro.build – routing, komponenty, view transitions (`astro:transitions`).
