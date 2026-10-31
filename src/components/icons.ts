import type { IconName } from '@/types'

/**
 * SVG icon paths used by the Icon component.
 * Each key maps to a single `d` attribute for a 24×24 viewBox.
 */
export const iconPaths: Record<IconName, string> = {
  grid: 'M3 3h7v7H3z M14 3h7v7h-7z M14 14h7v7h-7z M3 14h7v7H3z',
  building: 'M3 21h18 M5 21V5l7-3 7 3v16 M9 9h1 M14 9h1 M9 13h1 M14 13h1 M10 21v-4h4v4',
  spark: 'm12 3 1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3z M19 15l1 2.5 2.5 1-2.5 1-1 2.5-1-2.5-2.5-1 2.5-1 1-2.5z',
  megaphone: 'm3 11 18-5v12L3 13v-2z M5 14l2 7h4l-2-6 M21 9v6',
  phone: 'M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.4 19.4 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7l.5 3.2a2 2 0 0 1-.6 1.7L7.1 10.5a16 16 0 0 0 6.4 6.4l1.9-1.9a2 2 0 0 1 1.7-.6l3.2.5a2 2 0 0 1 1.7 2z',
  handoff: 'M7 7h10l-3-3 M17 7l-3 3 M17 17H7l3 3 M7 17l3-3 M4 12h16',
  clock: 'M12 8v4l3 2 M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0z',
  users: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2 M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M22 21v-2a4 4 0 0 0-3-3.9 M16 3.1a4 4 0 0 1 0 7.8',
  chart: 'M3 3v18h18 M18 17V9 M13 17V5 M8 17v-3',
  settings: 'M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-1.8 3.1-.2-.1a1.7 1.7 0 0 0-1.8.2l-.2.1h-3.6l-.1-.2a1.7 1.7 0 0 0-1.6-1l-.2.1-3.1-1.8.1-.2a1.7 1.7 0 0 0-.2-1.8L7 15v-3.6l.2-.1a1.7 1.7 0 0 0 1-1.6L8 9.5l1.8-3.1.2.1a1.7 1.7 0 0 0 1.8-.2L12 6h3.6l.1.2a1.7 1.7 0 0 0 1.6 1l.2-.1 3.1 1.8-.1.2a1.7 1.7 0 0 0 .2 1.8l.1.2v3.6z',
  search: 'm21 21-4.3-4.3 M19 10.5a8.5 8.5 0 1 1-17 0 8.5 8.5 0 0 1 17 0z',
  bell: 'M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9 M10 21h4',
  arrow: 'M7 17 17 7 M7 7h10v10',
  trend: 'm3 17 6-6 4 4 8-8 M15 7h6v6',
  check: 'm5 12 4 4L19 6',
  more: 'M12 5h.01 M12 12h.01 M12 19h.01',
  play: 'm8 5 12 7-12 7z',
  pause: 'M8 5h3v14H8z M15 5h3v14h-3z',
  calendar: 'M8 2v4 M16 2v4 M3 10h18 M5 4h14a2 2 0 0 1 2 2v14H3V6a2 2 0 0 1 2-2z',
  mail: 'M3 5h18v14H3z M3 6l9 7 9-7',
  close: 'm18 6-12 12 M6 6l12 12',
  filter: 'M4 6h16 M7 12h10 M10 18h4',
  plus: 'M12 5v14 M5 12h14',
  chevron: 'm9 18 6-6-6-6',
}

