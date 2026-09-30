export type AnalyticsEvent =
  | 'view_item'
  | 'search'
  | 'select_item'
  | 'add_to_cart'
  | 'begin_checkout'
  | 'purchase'
  | 'generate_lead'
  | 'request_quote';
/** Adapter boundary. Never send name, email, phone or message content to analytics. */
export interface AnalyticsAdapter {
  track(event: AnalyticsEvent, properties: Record<string, string | number | boolean>): void;
}
