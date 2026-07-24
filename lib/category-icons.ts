const ICONS: Record<string, string> = {
  career: '💼',
  marriage: '💍',
  love: '❤️',
  business: '📈',
  health: '🩺',
  education: '🎓',
  property: '🏠',
  'foreign-settlement': '✈️',
  'kundli-matching': '🤝',
  'child-birth': '👶',
  finance: '💰',
  'family-problems': '👨‍👩‍👧',
};

export function categoryIcon(slug: string): string {
  return ICONS[slug] ?? '✨';
}
