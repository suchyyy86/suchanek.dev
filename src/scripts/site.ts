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
    await navigator.clipboard.writeText(value);
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
