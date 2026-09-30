export type Attribution = Record<
  | 'landing_page'
  | 'referrer'
  | 'utm_source'
  | 'utm_medium'
  | 'utm_campaign'
  | 'utm_content'
  | 'utm_term',
  string
>;
const key = 'qhs-commerce-attribution';
function safePath(value: string) {
  try {
    const url = new URL(value);
    return `${url.origin}${url.pathname}`.slice(0, 1000);
  } catch {
    return '';
  }
}
export function captureAttribution(): Attribution {
  const url = new URL(window.location.href);
  const current: Attribution = {
    landing_page: url.pathname,
    referrer: safePath(document.referrer),
    utm_source: '',
    utm_medium: '',
    utm_campaign: '',
    utm_content: '',
    utm_term: '',
  };
  for (const field of [
    'utm_source',
    'utm_medium',
    'utm_campaign',
    'utm_content',
    'utm_term',
  ] as const)
    current[field] = (url.searchParams.get(field) || '').slice(0, 200);
  try {
    const stored = sessionStorage.getItem(key);
    if (stored && !current.utm_source) {
      const parsed = JSON.parse(stored) as Record<string, unknown>;
      for (const field of Object.keys(current) as (keyof Attribution)[])
        if (typeof parsed[field] === 'string')
          current[field] = parsed[field].slice(0, field.startsWith('utm_') ? 200 : 1000);
    }
    sessionStorage.setItem(key, JSON.stringify(current));
  } catch {
    /* Attribution is optional when browser storage is disabled. */
  }
  return current;
}
