export interface SendNotificationOutboundModel {
    url: string,
    callbackId: string,
    token: string,
    timestamp: Date,
    body: object,
    merchantId: string
}
