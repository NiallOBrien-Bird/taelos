export function safeRedirectPath(value: string | null | undefined) {
  if (!value?.startsWith('/') || value.startsWith('//')) return '/';

  try {
    const parsed = new URL(value, 'https://taelos.local');
    return parsed.origin === 'https://taelos.local'
      ? `${parsed.pathname}${parsed.search}${parsed.hash}`
      : '/';
  } catch {
    return '/';
  }
}
