export const THEMES = ['neon', 'cyber', 'light'] as const;

export function setTheme(name: string) {
  if (!THEMES.includes(name as (typeof THEMES)[number])) return false;
  document.documentElement.dataset.theme = name;
  localStorage.setItem('theme', name);
  window.dispatchEvent(new CustomEvent('themechange'));
  return true;
}

document.getElementById('theme-btn')?.addEventListener('click', () => {
  const cur = document.documentElement.dataset.theme ?? 'neon';
  setTheme(THEMES[(THEMES.indexOf(cur as (typeof THEMES)[number]) + 1) % THEMES.length]);
});
