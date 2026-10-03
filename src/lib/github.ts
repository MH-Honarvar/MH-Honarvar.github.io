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
    private: true,
  };
}

let reposCache: Promise<Repo[]> | undefined;
let daysCache: Promise<{ days: Day[]; total: number }> | undefined;

export function getRepos() {
  const url = process.env.GH_PAT
    ? 'https://api.github.com/user/repos?per_page=100&sort=pushed&affiliation=owner'
    : `https://api.github.com/users/${SITE.githubUser}/repos?per_page=100&sort=pushed`;
  reposCache ??= fetch(url, { headers })
    .then((r) => (r.ok ? r.json() : []))
    .then((list: Repo[]) => list.filter((r) => !r.fork).map(scrub))
    .catch(() => []);
  return reposCache;
}

export function getContributions() {
  daysCache ??= fetch(`https://github-contributions-api.jogruber.de/v4/${SITE.githubUser}?y=last`)
    .then((r) => (r.ok ? r.json() : { contributions: [] }))
    .then((d: { contributions: Day[]; total?: { lastYear?: number } }) => ({
      days: d.contributions ?? [],
      total: d.total?.lastYear ?? (d.contributions ?? []).reduce((s, x) => s + x.count, 0),
    }))
    .catch(() => ({ days: [], total: 0 }));
  return daysCache;
}

export function languageStats(repos: Repo[]) {
  const counts = new Map<string, number>();
  for (const r of repos) if (r.language) counts.set(r.language, (counts.get(r.language) ?? 0) + 1);
  const total = [...counts.values()].reduce((a, b) => a + b, 0) || 1;
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([name, n]) => ({ name, pct: Math.round((n / total) * 100) }));
}
