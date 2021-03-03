export interface WebhookRequest {
  merchantId: string,
  url: string,
  eventName: string,
  enabled: boolean
}