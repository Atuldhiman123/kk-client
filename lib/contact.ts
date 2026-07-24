export function waLink(phone: string, message?: string): string {
  const digits = phone.replace(/[^\d]/g, '');
  const query = message ? `?text=${encodeURIComponent(message)}` : '';
  return `https://wa.me/${digits}${query}`;
}

export function telLink(phone: string): string {
  return `tel:${phone.replace(/\s/g, '')}`;
}
