/** A deployed app must not inherit the localhost URL from the example environment. */
export function resolveSiteUrl(configured?: string, deploymentHost?: string) {
  if (configured) {
    try {
      const parsed = new URL(configured);
      const local = ['localhost', '127.0.0.1', '[::1]'].includes(parsed.hostname);
      if (['http:', 'https:'].includes(parsed.protocol) && !(local && deploymentHost))
        return parsed.origin;
    } catch {
      /* Fall back to the platform-provided hostname below. */
    }
  }
  return deploymentHost ? new URL(`https://${deploymentHost}`).origin : 'http://localhost:3000';
}
