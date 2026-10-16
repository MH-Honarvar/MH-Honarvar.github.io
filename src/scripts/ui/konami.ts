const code = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA'];
let pos = 0;

export function toggleParty() {
  document.body.classList.toggle('konami');
  window.dispatchEvent(new CustomEvent('party'));
}

window.addEventListener('keydown', (e) => {
  const el = e.target as HTMLElement | null;
  if (el?.closest('input, textarea, [contenteditable], dialog')) {
    pos = 0;
    return;
  }
  pos = e.code === code[pos] ? pos + 1 : e.code === code[0] ? 1 : 0;
  if (pos === code.length) {
    pos = 0;
    toggleParty();
  }
});
