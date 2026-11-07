// Skripty společné pro celý web. Běží jednou, s ClientRouterem přežívají navigaci.

// Místní čas v patičce
const timeFormat = new Intl.DateTimeFormat('cs-CZ', {
  timeZone: 'Europe/Prague',
  hour: '2-digit',
  minute: '2-digit',
});

function tick() {
  const now = timeFormat.format(new Date());
  document.querySelectorAll<HTMLElement>('[data-clock]').forEach((el) => {
    if (el.textContent !== now) el.textContent = now;
  });
}

setInterval(tick, 10_000);
document.addEventListener('astro:page-load', tick);

// Kopírování e-mailu
let copyTimer: number | undefined;

document.addEventListener('click', async (event) => {
  const button = (event.target as Element | null)?.closest<HTMLButtonElement>('[data-copy]');
  if (!button) return;

  const value = button.dataset.copy ?? '';
  const box = button.closest<HTMLElement>('[data-copy-box]');
  const toast = box?.querySelector<HTMLElement>('[data-copy-toast]');

  try {
    await navigator.clipboard.writeText(value);
    if (toast) toast.textContent = 'Zkopírováno';
  } catch {
    // Schránka není dostupná (oprávnění, starý prohlížeč) – aspoň adresu označíme.
    const link = box?.querySelector('a');
    if (link) window.getSelection()?.selectAllChildren(link);
    if (toast) toast.textContent = 'Označeno, zkopíruj si ji';
  }

  box?.classList.add('copied');

  window.clearTimeout(copyTimer);
  copyTimer = window.setTimeout(() => box?.classList.remove('copied'), 1800);
});
