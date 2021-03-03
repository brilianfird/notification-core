import {VerificationTokenRequest} from "../model/inbound/verification_token_request";
import VerificationTokenModel, {VerificationToken} from "../model/entity/verification_token_entity";
import BusinessException from "../model/BusinessException";
import {VerificationTokenResponse} from "../model/outbound/verification_token_response";
import {WebhookRequest} from "../model/inbound/webhook_request";
import WebhookModel, {Webhook} from "../model/entity/webhook_entity";
import {WebhookResponse} from "../model/outbound/webhook_response";

export async function saveWebhookEntity(request: WebhookRequest) {
  return new Promise<Webhook>(resolve => {
    const webhook: Webhook = {
      merchantId: request.merchantId,
      enabled: request.enabled,
      eventName: request.eventName,
      url: request.url
    }
    resolve(webhook);
  })
  .then(webhook => WebhookModel.create(webhook))
  .then(webhook => webhook.toObject());

}

export async function updateWebhookEntity(id: string, request: WebhookRequest) {
  return new Promise<Webhook>((resolve, reject) => {
    WebhookModel.findOne({"_id": id}, null, null, (err, doc) => {
      if (doc != null) {
        doc.merchantId = request.merchantId;
        doc.enabled = request.enabled;
        doc.eventName = request.eventName;
        doc.url = request.url;
        doc.save().then(res => resolve(res));
      } else {
        reject(new BusinessException("Document doesn't exist", 400));
      }
    })
  })
}

export async function getWebhookEntitiesByMerchantId(merchantId: string) {
  return new Promise<Array<WebhookResponse>>((resolve, reject) => {
    WebhookModel.find({"merchantId": merchantId}, null, null, (err, doc) => {
      if (err != null) {
        reject(err)
      }
      if (doc == null || doc.length == 0) {
        resolve(new Array());
      }
      let webhookResponses: Array<WebhookResponse> = new Array();
      doc.forEach(value => {
        webhookResponses.push({
          enabled: value.enabled,
          eventName: value.eventName,
          id: value._id,
          merchantId: value.merchantId,
          url: value.url
        })
      })
      resolve(webhookResponses)
    })
  });
}

export async function getWebhookEntityByEventNameAndMerchantId(eventName: string, merchantId: string) {
  return new Promise<WebhookResponse|null>((resolve, reject) => {
    WebhookModel.findOne({"merchantId": merchantId, "eventName": eventName}, null, null, (err, doc) => {
      if (err != null) {
        reject(err)
      }
      if (doc == null) {
        resolve(null);
      } else {
        resolve({
          enabled: doc.enabled,
          eventName: doc.eventName,
          id: doc._id,
          merchantId: doc.merchantId,
          url: doc.url
        })
      }
    })
  });
}