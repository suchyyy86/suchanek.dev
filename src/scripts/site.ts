// Kopírování kontaktu funguje na celé ploše tlačítka i přes klávesnici.
const copyTimers = new WeakMap<HTMLButtonElement, number>();

document.addEventListener('click', async (event) => {
  const button = (event.target as Element | null)?.closest<HTMLButtonElement>('[data-copy]');
  if (!button) return;

  const value = button.dataset.copy ?? '';
  const feedback = button.querySelector<HTMLElement>('[data-copy-toast]');
  const label = button.querySelector<HTMLElement>('[data-copy-value]');
  window.clearTimeout(copyTimers.get(button));
  button.classList.remove('copied', 'copy-failed');

  try {
    await copyText(value, button);
    if (feedback) feedback.textContent = 'Zkopírováno';
    button.classList.add('copied');
  } catch {
    // Při zamítnutí schránky nabídneme skutečný e-mail k ručnímu zkopírování.
    if (label) window.getSelection()?.selectAllChildren(label);
    if (feedback) feedback.textContent = 'Označeno pro ruční zkopírování';
    button.classList.add('copy-failed');
  }

  copyTimers.set(button, window.setTimeout(() => {
    button.classList.remove('copied', 'copy-failed');
    if (feedback) feedback.textContent = '';
  }, 2200));
});

// Některé prohlížeče nechají žádost o schránku čekat na oprávnění bez výsledku.
async function copyText(value: string, button: HTMLButtonElement) {
  let timeout: number | undefined;
  try {
    await Promise.race([
      navigator.clipboard.writeText(value),
      new Promise<never>((_, reject) => {
        timeout = window.setTimeout(() => reject(new Error('Clipboard permission pending')), 800);
      }),
    ]);
  } catch {
    const field = document.createElement('textarea');
    field.value = value;
    field.readOnly = true;
    field.setAttribute('aria-hidden', 'true');
    field.style.cssText = 'position:fixed;left:-9999px;top:0;opacity:0;font-size:16px';
    document.body.append(field);
    try {
      field.select();
      field.setSelectionRange(0, value.length);
      if (!document.execCommand('copy')) throw new Error('Clipboard unavailable');
    } finally {
      field.remove();
      button.focus({ preventScroll: true });
    }
  } finally {
    window.clearTimeout(timeout);
  }
}
