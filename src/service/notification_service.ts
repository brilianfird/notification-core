import {NotificationRequestInboundModel} from "../model/inbound/notification_request";
import BusinessException from "../model/BusinessException";
import {getEventByName} from "./event_service";
import {getVerificationTokenByMerchantId} from "./verification_token_service";
import {SendNotificationOutboundModel} from "../model/outbound/send_notification_outbound_model";
import {v4 as uuidv4} from 'uuid'
import {publishToSendNotificationQueue} from "../outbound/SendNotificationSender";
import {
  getNotificationEntitiesByMerchantId,
  getNotificationEntityByCallbackId,
  saveNotificationEntity
} from "../repository/notification_repository";
import {getWebhookByMerchantIdAndEventName} from "./webhook_service";

export async function processNotify(request: NotificationRequestInboundModel) {
  return getEventByName(request.eventName)
  .then(event => {
    if (event == null || !event.enabled) {
      throw new BusinessException("Invalid event", 400)
    }
    return true;
  }).then(() => {
       return getWebhookByMerchantIdAndEventName(request.eventName, request.merchantId)
      }
  )
  .then(webhook => {
    if (webhook == null || !webhook.enabled) {
      throw new BusinessException("Invalid webhook", 400);
    }

    return getVerificationTokenByMerchantId(request.merchantId)
    .then(verificationToken => {
      if (verificationToken == null) {
        throw new BusinessException("Invalid token", 400)
      }

      const sendNotificationOutboundModel: SendNotificationOutboundModel = {
        body: request.body,
        callbackId: uuidv4(),
        token: verificationToken.token,
        timestamp: new Date(),
        url: webhook.url,
        merchantId: request.merchantId
      }

      return sendNotificationOutboundModel;
    });
  }).then(sendNotificationOutboundModel => {
    return publishToSendNotificationQueue(sendNotificationOutboundModel)
        .then(() => saveNotificationEntity({
          body: sendNotificationOutboundModel.body,
          callbackId: sendNotificationOutboundModel.callbackId,
          timestamp: sendNotificationOutboundModel.timestamp,
          token: sendNotificationOutboundModel.token,
          url: sendNotificationOutboundModel.url,
          merchantId: sendNotificationOutboundModel.merchantId
        }))
        .then(() => true);
  });
}

export async function resendNotificationByCallbackId(callbackId: string) {
  return getNotificationEntityByCallbackId(callbackId)
    .then(notification => {
      if (notification == null) {
        throw new BusinessException("invalid callback id", 400);
      }

      const sendNotificationOutboundModel: SendNotificationOutboundModel = {
        body: notification.body,
        callbackId: notification.callbackId,
        token: notification.token,
        timestamp: notification.timestamp,
        url: notification.url,
        merchantId: notification.merchantId
      }

      return publishToSendNotificationQueue(sendNotificationOutboundModel);
    })
}

export async function getNotificationByMerchantId(merchantId: string) {
  return getNotificationEntitiesByMerchantId(merchantId)
    .then(notifications => {
        if (notifications.length == 0) {
          throw new BusinessException("invalid merchant id", 400);
        }

        return notifications;
    })
}