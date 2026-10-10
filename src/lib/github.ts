import { SITE } from '../config';

export interface Repo {
  name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  topics?: string[];
  fork: boolean;
  pushed_at: string;
  created_at: string;
  private: boolean;
}

export interface Day {
  date: string;
  count: number;
  level: number;
}

const headers: Record<string, string> = { Accept: 'application/vnd.github+json' };
const token = process.env.GH_PAT || process.env.GITHUB_TOKEN;
if (token) headers.Authorization = `Bearer ${token}`;

function scrub(repo: Repo): Repo {
  if (!repo.private) return { ...repo, private: false };
  return {
    name: repo.name,
    description: null,
    html_url: '',
    homepage: null,
    language: repo.language,
    stargazers_count: 0,
    forks_count: 0,
    fork: false,
    pushed_at: '',
    created_at: '',
    private: true,
  };
}

/** Per-repo commit activity over the past year. Only counts and month-level dates, never messages or files. */
export interface Activity {
  count: number;
  first: string;
  last: string;
  recent: boolean;
  weeks: number[];
}

interface Contributions {
  days: Day[];
  total: number;
  privateTotal: number;
  byRepo: Map<string, Activity>;
}

let reposCache: Promise<(Repo & { activity?: Activity })[]> | undefined;
let contribCache: Promise<Contributions> | undefined;

const LEVELS: Record<string, number> = { NONE: 0, FIRST_QUARTILE: 1, SECOND_QUARTILE: 2, THIRD_QUARTILE: 3, FOURTH_QUARTILE: 4 };

const QUERY = `{ viewer { contributionsCollection {
  restrictedContributionsCount
  contributionCalendar { totalContributions weeks { contributionDays { date contributionCount contributionLevel } } }
  commitContributionsByRepository(maxRepositories: 100) {
    repository { name isPrivate }
    contributions(first: 100) { nodes { occurredAt commitCount } }
  }
} } }`;

interface GqlRepo {
  repository: { name: string; isPrivate: boolean };
  contributions: { nodes: { occurredAt: string; commitCount: number }[] };
}

function activityOf(nodes: { occurredAt: string; commitCount: number }[]): Activity | undefined {
  if (!nodes.length) return undefined;
  const dates = nodes.map((n) => n.occurredAt.slice(0, 10)).sort();
  const now = Date.now();
  const weeks = Array<number>(12).fill(0);
  let count = 0;
  for (const n of nodes) {
    count += n.commitCount;
    const ago = Math.floor((now - new Date(n.occurredAt).getTime()) / (7 * 86400000));
    if (ago >= 0 && ago < 12) weeks[11 - ago] += n.commitCount;
  }
  const last = dates[dates.length - 1];
  return { count, first: dates[0].slice(0, 7), last: last.slice(0, 7), recent: now - new Date(last).getTime() < 30 * 86400000, weeks };
}

async function fromGraphQL(): Promise<Contributions | undefined> {
  if (!process.env.GH_PAT) return undefined;
  const res = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: { Authorization: `Bearer ${process.env.GH_PAT}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: QUERY }),
  });
  if (!res.ok) return undefined;
  const c = (await res.json())?.data?.viewer?.contributionsCollection;
  if (!c) return undefined;
  const days: Day[] = c.contributionCalendar.weeks.flatMap((w: { contributionDays: { date: string; contributionCount: number; contributionLevel: string }[] }) =>
    w.contributionDays.map((d) => ({ date: d.date, count: d.contributionCount, level: LEVELS[d.contributionLevel] ?? 0 })),
  );
  const byRepo = new Map<string, Activity>();
  let privateTotal = c.restrictedContributionsCount ?? 0;
  for (const r of c.commitContributionsByRepository as GqlRepo[]) {
    const a = activityOf(r.contributions.nodes);
    if (!a) continue;
    byRepo.set(r.repository.name, a);
    if (r.repository.isPrivate) privateTotal += a.count;
  }
  return { days, total: c.contributionCalendar.totalContributions, privateTotal, byRepo };
}

async function fromPublicApi(): Promise<Contributions> {
  const r = await fetch(`https://github-contributions-api.jogruber.de/v4/${SITE.githubUser}?y=last`);
  const d: { contributions?: Day[]; total?: { lastYear?: number } } = r.ok ? await r.json() : {};
  const days = d.contributions ?? [];
  return { days, total: d.total?.lastYear ?? days.reduce((s, x) => s + x.count, 0), privateTotal: 0, byRepo: new Map() };
}

export function getContributions() {
  contribCache ??= fromGraphQL()
    .catch(() => undefined)
    .then((g) => g ?? fromPublicApi())
    .catch(() => ({ days: [], total: 0, privateTotal: 0, byRepo: new Map() }));
  return contribCache;
}

export function getRepos() {
  const url = process.env.GH_PAT
    ? 'https://api.github.com/user/repos?per_page=100&sort=pushed&affiliation=owner'
    : `https://api.github.com/users/${SITE.githubUser}/repos?per_page=100&sort=pushed`;
  reposCache ??= Promise.all([
    fetch(url, { headers })
      .then((r) => (r.ok ? r.json() : []))
      .catch(() => []),
    getContributions(),
  ]).then(([list, { byRepo }]: [Repo[], Contributions]) =>
    list
      .filter((r) => !r.fork)
      .map((r) => ({ ...scrub(r), activity: byRepo.get(r.name) }))
      .sort((a, b) => (b.activity?.last ?? b.pushed_at.slice(0, 7)).localeCompare(a.activity?.last ?? a.pushed_at.slice(0, 7))),
  );
  return reposCache;
}

const LANG_COLORS: Record<string, string> = {
  TypeScript: '#3178c6',
  JavaScript: '#f1e05a',
  Python: '#3572A5',
  HTML: '#e34c26',
  CSS: '#663399',
  SCSS: '#c6538c',
  Astro: '#ff5a03',
  Vue: '#41b883',
  Svelte: '#ff3e00',
  Go: '#00ADD8',
  Rust: '#dea584',
  Java: '#b07219',
  Kotlin: '#A97BFF',
  Swift: '#F05138',
  Dart: '#00B4AB',
  PHP: '#4F5D95',
  Ruby: '#701516',
  C: '#555555',
  'C++': '#f34b7d',
  'C#': '#178600',
  Shell: '#89e051',
  Dockerfile: '#384d54',
  'Jupyter Notebook': '#DA5B0B',
  MDX: '#fcb32c',
  GLSL: '#5686a5',
};

export function langColor(name: string | null) {
  if (!name) return 'var(--accent)';
  if (LANG_COLORS[name]) return LANG_COLORS[name];
  let h = 0;
  for (const ch of name) h = (h * 31 + ch.charCodeAt(0)) % 360;
  return `hsl(${h} 70% 60%)`;
}

export function languageStats(repos: Repo[]) {
  const counts = new Map<string, number>();
  for (const r of repos) if (r.language) counts.set(r.language, (counts.get(r.language) ?? 0) + 1);
  const total = [...counts.values()].reduce((a, b) => a + b, 0) || 1;
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([name, n]) => ({ name, pct: Math.round((n / total) * 100) }));
}
