export function allowIndexing(
  url: string,
  environment: string | undefined = process.env.NEXT_PUBLIC_SITE_ENV,
) {
  try {
    const host = new URL(url).hostname;
    return (
      environment === 'production' &&
      !host.endsWith('.vercel.app') &&
      host !== 'localhost' &&
      host !== '127.0.0.1'
    );
  } catch {
    return false;
  }
}
