import { setTheme, THEMES } from './theme';
import { toggleParty } from './konami';

interface Item {
  title: string;
  url: string;
  kind: string;
  lang: string;
}

const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!);

export function initPalette() {
  const items: Item[] = JSON.parse(document.getElementById('site-index')!.textContent!);
  const cmd = document.getElementById('cmd') as HTMLDialogElement;
  const lang = cmd.dataset.lang!;
  const input = document.getElementById('cmd-input') as HTMLInputElement;
  const list = document.getElementById('cmd-list')!;
  let sel = 0;
  let shown: Item[] = [];

  const render = () => {
    const q = input.value.trim().toLowerCase();
    shown = items
      .filter((i) => !q || i.title.toLowerCase().includes(q) || i.url.includes(q))
      .sort((a, b) => Number(b.lang === lang) - Number(a.lang === lang))
      .slice(0, 12);
    sel = Math.min(sel, Math.max(shown.length - 1, 0));
    list.innerHTML = shown
      .map((i, n) => `<li><a href="${i.url}" class="${n === sel ? 'sel' : ''}" dir="auto"><span>${esc(i.title)}</span><small>${i.kind} · ${i.lang}</small></a></li>`)
      .join('');
  };

  const open = () => {
    input.value = '';
    sel = 0;
    render();
    cmd.showModal();
    input.focus();
  };

  input.addEventListener('input', () => {
    sel = 0;
    render();
  });
  input.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown') sel = Math.min(sel + 1, shown.length - 1);
    else if (e.key === 'ArrowUp') sel = Math.max(sel - 1, 0);
    else if (e.key === 'Enter' && shown[sel]) location.href = shown[sel].url;
    else return;
    e.preventDefault();
    render();
  });
  cmd.addEventListener('click', (e) => e.target === cmd && cmd.close());
  document.getElementById('cmd-open')?.addEventListener('click', open);

  const term = document.getElementById('term') as HTMLDialogElement;
  const out = document.getElementById('term-out')!;
  const tin = document.getElementById('term-input') as HTMLInputElement;
  const history: string[] = [];
  let hpos = 0;
  const print = (html: string) => {
    out.insertAdjacentHTML('beforeend', html + '\n');
    out.scrollTop = out.scrollHeight;
  };
  const posts = () => items.filter((i) => i.kind === 'post' && i.lang === lang);

  const commands: Record<string, (args: string[]) => void> = {
    help: () =>
      print(
        esc([
          'help              list commands',
          'ls [posts|pages]  list content',
          'open <n|page>     open post #n or a page (blog, projects, about)',
          'cat about         who is this?',
          'whoami            you',
          `theme <name>      ${THEMES.join(' | ')}`,
          'lang              switch language',
          'party             ???',
          'clear | exit',
        ].join('\n')),
      ),
    ls: ([what = 'posts']) => {
      const list = what === 'pages' ? items.filter((i) => i.kind === 'page' && i.lang === lang) : posts();
      print(list.map((p, n) => `[${n + 1}] <a href="${p.url}" dir="auto">${esc(p.title)}</a>`).join('\n') || '(empty)');
    },
    open: ([target]) => {
      const n = Number(target);
      const post = posts()[n - 1];
      if (post) location.href = post.url;
      else if (['blog', 'projects', 'about'].includes(target)) location.href = `/${lang}/${target}/`;
      else print(`open: ${esc(target ?? '')}: not found`);
    },
    cat: ([f]) =>
      f === 'about'
        ? print('Mohammad Honarvar — builds landing pages and interfaces that feel considered.\nGitHub: <a href="https://github.com/MH-Honarvar">MH-Honarvar</a>  Telegram: <a href="https://t.me/MH759">@MH759</a>')
        : print(`cat: ${esc(f ?? '')}: no such file`),
    whoami: () => print(`guest · ${navigator.language} · ${innerWidth}x${innerHeight}`),
    theme: ([name]) => print(setTheme(name) ? `theme → ${name}` : `usage: theme ${THEMES.join('|')}`),
    lang: () => (location.href = document.querySelector<HTMLAnchorElement>('a.lang')!.href),
    party: () => {
      toggleParty();
      print('🎉');
    },
    sudo: () => print('nice try.'),
    clear: () => (out.innerHTML = ''),
    exit: () => term.close(),
  };

  const openTerm = () => {
    if (!out.innerHTML) print('Welcome. Type <span class="cmd">help</span> to begin.');
    term.showModal();
    tin.focus();
  };

  document.getElementById('term-form')!.addEventListener('submit', (e) => {
    e.preventDefault();
    const line = tin.value.trim();
    tin.value = '';
    if (!line) return;
    history.push(line);
    hpos = history.length;
    print(`<span class="cmd">$ ${esc(line)}</span>`);
    const [name, ...args] = line.split(/\s+/);
    (commands[name.toLowerCase()] ?? (() => print(`command not found: ${esc(name)}`)))(args);
  });
  tin.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp') hpos = Math.max(hpos - 1, 0);
    else if (e.key === 'ArrowDown') hpos = Math.min(hpos + 1, history.length);
    else return;
    e.preventDefault();
    tin.value = history[hpos] ?? '';
  });
  term.addEventListener('click', (e) => e.target === term && term.close());

  addEventListener('keydown', (e) => {
    const typing = (e.target as HTMLElement).closest('input, textarea, [contenteditable]');
    if ((e.ctrlKey || e.metaKey) && e.code === 'KeyK') {
      e.preventDefault();
      cmd.open ? cmd.close() : open();
    } else if ((e.key === '`' || e.code === 'Backquote') && !typing) {
      e.preventDefault();
      term.open ? term.close() : openTerm();
    }
  });
}
