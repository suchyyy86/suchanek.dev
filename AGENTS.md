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
| Životopis – **doslova podle PDF, texty nevymýšlet ani nepřepisovat** | `src/data/cv.ts` |
| Projekty – **zatím skryté** | `src/data/projects.ts`, stránky v `src/pages/_projekty/` |
| Mapa cest | `src/data/travels.json` (země jako ISO kód `CZ`, místa jako `lat`/`lon`) |
| Barvy, typografie, animace | `src/styles/global.css` |
| Layout, menu, patička | `src/layouts/Base.astro` |

Web má teď jen **Úvod** a **CV**. Projekty (včetně mapy cest a detailu Digitální dvojče budovy) jsou
hotové, ale schované: Astro nesestavuje složky začínající podtržítkem. Zveřejnění = přejmenovat
`src/pages/_projekty` zpět na `src/pages/projekty` a vrátit položku do `nav` v `src/layouts/Base.astro`.

## Konvence

- **Minimalismus a málo textu.** Jedna akcentová barva (`--accent`), hodně vzduchu, žádné dekorace
  navíc. V seznamech jednořádkové popisy; delší text patří jen na detail projektu.
- **Pracovní projekty popisuj obecně**: bez jmen klientů, interních adres a detailů zabezpečení.
- **Světlý i tmavý motiv podle systému** (`prefers-color-scheme`), žádný přepínač. Barvy výhradně
  přes tokeny v `:root`, tmavé hodnoty v media query hned pod nimi.
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
  nejde žádná mapová knihovna. U navštívených zemí se zámořská území (Francouzská Guyana, Réunion…)
  nebarví – `splitOverseas()`. Ostatní země se barví celé tak, jak jsou v datech.

## Dokumentace

https://docs.astro.build – routing, komponenty, view transitions (`astro:transitions`).
