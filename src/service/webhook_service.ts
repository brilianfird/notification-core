import {WebhookRequest} from "../model/inbound/webhook_request";
import {
  getWebhookEntitiesByMerchantId, getWebhookEntityByEventNameAndMerchantId,
  saveWebhookEntity,
  updateWebhookEntity
} from "../repository/webhook_repository";

export async function saveWebhook(request: WebhookRequest) {
  return saveWebhookEntity(request)
  .then(obj => {
    return {
      enabled: obj.enabled,
      eventName: obj.eventName,
      id: obj._id,
      merchantId: obj.merchantId,
      url: obj.url
    }
  })
}

export async function updateWebhook(id: string, request: WebhookRequest) {
  return updateWebhookEntity(id, request)
  .then(obj => {
    return {
      id: id,
      enabled: obj.enabled,
      eventName: obj.eventName,
      merchantId: obj.merchantId,
      url: obj.url
    }
  })
}

export async function getWebhooksByMerchantId(merchantId: string) {
  return getWebhookEntitiesByMerchantId(merchantId);
}

export async function getWebhookByMerchantIdAndEventName(merchantId: string, eventName: string) {
  return getWebhookEntityByEventNameAndMerchantId(merchantId, eventName);
}