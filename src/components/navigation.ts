import type { NavigationItem, PageId } from '../lib/types';

export const navigation: readonly NavigationItem[] = [
  { id: 'home', label: 'HOME', href: '/#home' },
  { id: 'team', label: 'TEAM', href: '/team.html' },
  { id: 'events', label: 'EVENTS', href: '/events.html' },
  { id: 'gallery', label: 'GALLERY', href: '/gallery.html' },
  { id: 'contact', label: 'CONTACT', href: '/#contact' },
];

export function pageFromPath(path: string): PageId {
  if (path.endsWith('/team.html')) return 'team';
  if (path.endsWith('/events.html')) return 'events';
  if (path.endsWith('/gallery.html')) return 'gallery';
  return 'home';
}
