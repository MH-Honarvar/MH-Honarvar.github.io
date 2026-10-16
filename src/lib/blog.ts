import { getCollection, type CollectionEntry } from 'astro:content';
import readingTime from 'reading-time';
import type { Lang } from '../i18n/ui';

export type Post = CollectionEntry<'blog'>;

export const postLang = (p: Post) => p.id.split('/')[0] as Lang;
export const postSlug = (p: Post) => p.id.split('/').slice(1).join('/');
export const postUrl = (p: Post) => `/${postLang(p)}/blog/${postSlug(p)}/`;
export const minutes = (p: Post) => Math.max(1, Math.round(readingTime(p.body ?? '').minutes));

export async function getPosts(lang: Lang) {
  const all = await getCollection('blog', (p) => postLang(p) === lang && (import.meta.env.DEV || !p.data.draft));
  return all.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf() || postSlug(a).localeCompare(postSlug(b)));
}
